from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import math
import numpy as np
from datetime import datetime, date


app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


MODEL_PATH = "gift_recommender_pipeline.pkl"
TARGET_ENCODER_PATH = "target_encoder.pkl"


PERSONALITY_COLUMNS = [
    "personality",
    "experiencePreference",
    "handmadePreference",
    "budgetFlexibility",
    "stylePreference",
    "surpriseReaction",
    "connectionImportance",
    "noteImportance",
    "handmadeOverStore",
    "sharedMemoriesAppreciation",
    "relationshipCloseness",
    "uniqueGiftValue",
    "practicalOverSentimental",
]


def clean_json_value(value):
    if value is None:
        return None

    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return None
        return value

    if isinstance(value, np.floating):
        value = float(value)
        if math.isnan(value) or math.isinf(value):
            return None
        return value

    if isinstance(value, np.integer):
        return int(value)

    if isinstance(value, (datetime, date)):
        return value.isoformat()

    if isinstance(value, dict):
        return {
            key: clean_json_value(val)
            for key, val in value.items()
        }

    if isinstance(value, list):
        return [clean_json_value(item) for item in value]

    return value


def safe_jsonify(data, status_code=200):
    return jsonify(clean_json_value(data)), status_code


def load_files():
    with open(MODEL_PATH, "rb") as file:
        pipeline = pickle.load(file)

    with open(TARGET_ENCODER_PATH, "rb") as file:
        target_encoder = pickle.load(file)

    return pipeline, target_encoder


def list_to_text(value):
    if value is None or value == "":
        return "Unknown"

    if isinstance(value, list):
        if len(value) == 0:
            return "Unknown"
        return "|".join(str(item) for item in value)

    return str(value)


def extract_budget(gift):
    budget = gift.get("budget")

    if budget is not None and budget != "":
        return list_to_text(budget)

    return "Unknown"


def fetch_personalized_templates():
    docs = (
        db.collection("personalizedTemplates")
        .where("type", "==", "personalized")
        .where("isAvailable", "==", True)
        .stream()
    )

    templates = []

    for doc in docs:
        template = doc.to_dict()
        template["id"] = doc.id
        templates.append(template)

    return templates


def to_numeric(value):
    try:
        if value is None or value == "":
            return 3

        number = int(value)

        if math.isnan(number) or math.isinf(number):
            return 3

        return number
    except Exception:
        return 3


def calculate_trait_scores(personality):
    p = {key: to_numeric(value) for key, value in personality.items()}

    sentimental_score = (
        p.get("noteImportance", 3)
        + p.get("connectionImportance", 3)
        + p.get("sharedMemoriesAppreciation", 3)
    ) / 15 * 100

    practical_score = (
        p.get("practicalOverSentimental", 3)
        + p.get("budgetFlexibility", 3)
    ) / 10 * 100

    unique_score = (
        p.get("uniqueGiftValue", 3)
        + p.get("stylePreference", 3)
        + p.get("surpriseReaction", 3)
    ) / 15 * 100

    handmade_score = (
        p.get("handmadePreference", 3)
        + p.get("handmadeOverStore", 3)
    ) / 10 * 100

    experience_score = (
        p.get("experiencePreference", 3)
        + p.get("personality", 3)
    ) / 10 * 100

    relationship_score = (
        p.get("relationshipCloseness", 3)
        + p.get("connectionImportance", 3)
    ) / 10 * 100

    return {
        "sentimentalScore": round(sentimental_score, 2),
        "practicalScore": round(practical_score, 2),
        "uniqueScore": round(unique_score, 2),
        "handmadeScore": round(handmade_score, 2),
        "experienceScore": round(experience_score, 2),
        "relationshipScore": round(relationship_score, 2),
    }


def build_model_input(recipient, gift, personality):
    model_input = {
        "occasion": list_to_text(recipient.get("occasion", "Unknown")),
        "relationship": list_to_text(recipient.get("relationship", "Unknown")),
        "gender": list_to_text(recipient.get("gender", "Unknown")),
        "ageType": list_to_text(recipient.get("ageType", "Unknown")),
        "ageGroup": list_to_text(recipient.get("ageGroup", "Unknown")),
        "knownDuration": list_to_text(recipient.get("knownDuration", "Unknown")),
        "kidDislikes": list_to_text(recipient.get("kidDislikes", "Unknown")),
        "kidToyTypes": list_to_text(recipient.get("kidToyTypes", "Unknown")),
    }

    for col in PERSONALITY_COLUMNS:
        model_input[col] = to_numeric(personality.get(col, 3))

    model_input["budget"] = extract_budget(gift)

    # ===== DEBUG =====
    print("\n================ MODEL INPUT ================")
    print(model_input)
    print("=============================================\n")

    return model_input


def get_allowed_gift_types(model_input):
    gender = model_input.get("gender", "Unknown")
    age_type = model_input.get("ageType", "Unknown")

    if age_type == "Kid":
        return [
            "Toys",
            "Edible Stuff",
            "Accessories",
            "Perfume",
        ]

    if gender == "Male":
        return [
            "Clothing",
            "Shoes",
            "Accessories",
            "Perfume",
            "Edible Stuff",
            "Bag / Wallet",
        ]

    if gender == "Female":
        return [
            "Clothing",
            "Shoes",
            "Accessories",
            "Perfume",
            "Edible Stuff",
            "Bag / Wallet",
            "Makeup Products",
        ]

    return [
        "Accessories",
        "Clothing",
        "Edible Stuff",
        "Bag / Wallet",
        "Makeup Products",
        "Perfume",
        "Shoes",
        "Toys",
    ]


def price_matches_budget(price, budget):
    try:
        price = int(price)
    except Exception:
        return True

    if not budget or budget == "Unknown":
        return True

    budget = str(budget).replace(",", "")

    if "1000–3000" in budget:
        return 1000 <= price <= 3000
    if "3000–5000" in budget:
        return 3000 <= price <= 5000
    if "5000–8000" in budget:
        return 5000 <= price <= 8000
    if "8000–10000" in budget:
        return 8000 <= price <= 10000
    if "10000–15000" in budget:
        return 10000 <= price <= 15000
    if "15000+" in budget:
        return price >= 15000

    return True


def normalize_text(value):
    if value is None:
        return ""
    return str(value).strip().lower()


def list_contains(values, target):
    if not isinstance(values, list):
        return False

    target = normalize_text(target)

    return any(normalize_text(item) == target for item in values)


def template_matches_user(template, model_input):
    # -------------------------
    # Category
    # -------------------------
    if normalize_text(template.get("category")) != normalize_text(model_input.get("predicted_category")):
        return False

    # -------------------------
    # Stock
    # -------------------------
    if NumberSafe(template.get("stock")) <= 0:
        return False

    # -------------------------
    # Budget
    # -------------------------
    if not price_matches_budget(
        template.get("price"),
        model_input.get("budget")
    ):
        return False

    # -------------------------
    # Gender
    # -------------------------
    template_gender = normalize_text(template.get("gender"))
    user_gender = normalize_text(model_input.get("gender"))

    if template_gender not in [user_gender, "unisex"]:
        return False

    # -------------------------
    # Age Group
    # -------------------------
    if not list_contains(
        template.get("ageGroups", []),
        model_input.get("ageGroup")
    ):
        return False

    # -------------------------
    # Occasion
    # -------------------------
    user_occasions = str(model_input.get("occasion", "")).split("|")

    if not any(
        list_contains(template.get("occasionTags", []), occasion)
        for occasion in user_occasions
    ):
        return False

    return True


def NumberSafe(value):
    try:
        if value is None or value == "":
            return 0
        number = float(value)
        if math.isnan(number) or math.isinf(number):
            return 0
        return number
    except Exception:
        return 0


def get_matching_templates(predicted_category, model_input):
    templates = fetch_personalized_templates()

    matched_templates = []

    for template in templates:

        matched = template_matches_user(
            template,
            {**model_input, "predicted_category": predicted_category}
        )

        print(
            template.get("name"),
            "|",
            template.get("price"),
            "|",
            matched
        )

        if matched:
            matched_templates.append(template)

    return matched_templates


def recommend_for_input(model_input, top_n=3):
    pipeline, target_encoder = load_files()

    input_df = pd.DataFrame([model_input])

    probabilities = pipeline.predict_proba(input_df)[0]
    allowed_gift_types = get_allowed_gift_types(model_input)

    scored_items = []

    for index, probability in enumerate(probabilities):
        gift_type = target_encoder.inverse_transform([index])[0]

        if allowed_gift_types is not None and gift_type not in allowed_gift_types:
            continue

        matching_templates = get_matching_templates(
            predicted_category=gift_type,
            model_input=model_input
        )
        print("------------------------------------------------")
        print("CATEGORY:", gift_type)
        print("MATCHES:", len(matching_templates))

        for t in matching_templates:
            print("  ->", t["name"], "|", t["price"])

        print("------------------------------------------------")

        probability = clean_json_value(float(probability)) or 0

        scored_items.append({
            "gift_type": gift_type,
            "confidence": probability,
            "templates": matching_templates,
        })

    scored_items = sorted(
        scored_items,
        key=lambda item: item["confidence"],
        reverse=True
    )

    return scored_items[:top_n]


@app.get("/api/health")
def health_check():
    return safe_jsonify({"status": "ok"}, 200)


@app.get("/api/personalized-templates")
def get_personalized_templates():
    try:
        templates = fetch_personalized_templates()

        return safe_jsonify({
            "success": True,
            "count": len(templates),
            "templates": templates
        }, 200)

    except Exception as exc:
        return safe_jsonify({
            "success": False,
            "error": str(exc)
        }, 500)


@app.post("/recommend")
def recommend():
    payload = request.get_json(silent=True)

    if payload is None:
        return safe_jsonify({
            "success": False,
            "error": "Invalid JSON payload."
        }, 400)

    responses = payload.get("responses", [])
    personality = payload.get("personality", {})

    if not isinstance(responses, list):
        return safe_jsonify({
            "success": False,
            "error": "responses must be a list."
        }, 400)

    if not isinstance(personality, dict):
        personality = {}

    trait_scores = calculate_trait_scores(personality)
    all_results = []

    try:
        for recipient_index, recipient in enumerate(responses):
            if not isinstance(recipient, dict):
                continue

            gifts = recipient.get("gifts", [])

            if not isinstance(gifts, list) or len(gifts) == 0:
                gifts = [{}]

            recipient_results = []

            for gift_index, gift in enumerate(gifts):
                if not isinstance(gift, dict):
                    gift = {}

                model_input = build_model_input(recipient, gift, personality)
                recommendations = recommend_for_input(model_input, top_n=3)

                recipient_results.append({
                    "gift_index": gift_index,
                    "model_input": model_input,
                    "recommendations": recommendations
                })

            all_results.append({
                "recipient_index": recipient_index,
                "recipient_id": recipient.get("id", recipient_index + 1),
                "recommendations": recipient_results
            })

        response_data = {
            "success": True,
            "traitScores": trait_scores,
            "recommendations": all_results
        }

        return safe_jsonify(response_data, 200)

    except FileNotFoundError:
        return safe_jsonify({
            "success": False,
            "error": "Model files not found. Make sure gift_recommender_pipeline.pkl and target_encoder.pkl exist."
        }, 500)

    except Exception as exc:
        return safe_jsonify({
            "success": False,
            "error": str(exc)
        }, 500)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)