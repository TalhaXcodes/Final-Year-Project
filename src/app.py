from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import pandas as pd


app = Flask(__name__)
CORS(app)


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


def to_numeric(value):
    try:
        if value is None or value == "":
            return 3
        return int(value)
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

    return model_input


def get_allowed_gift_types(model_input):
    gender = model_input.get("gender", "Unknown")
    age_type = model_input.get("ageType", "Unknown")

    if age_type == "Kid":
        return [
            "Toys",
            "Edible Stuff",
            "Accessories",
            "Clothing",
            "Perfume",
        ]

    if gender == "Male":
        return [
            "Clothing",
            "Shoes",
            "Jewellery",
            "Perfume",
            "Edible Stuff",
            "Fashion Accessories",
        ]

    if gender == "Female":
        return [
            "Clothing",
            "Shoes",
            "Jewellery",
            "Perfume",
            "Edible Stuff",
            "Fashion Accessories",
            "Makeup Products",
            "Accessories",
        ]

    return None


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

        scored_items.append({
            "gift_type": gift_type,
            "confidence": float(probability),
        })

    scored_items = sorted(
        scored_items,
        key=lambda item: item["confidence"],
        reverse=True
    )

    return scored_items[:top_n]


@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok"}), 200


@app.post("/recommend")
def recommend():
    payload = request.get_json(silent=True)

    if payload is None:
        return jsonify({
            "success": False,
            "error": "Invalid JSON payload."
        }), 400

    responses = payload.get("responses", [])
    personality = payload.get("personality", {})
    trait_scores = calculate_trait_scores(personality)

    if not isinstance(responses, list):
        return jsonify({
            "success": False,
            "error": "responses must be a list."
        }), 400

    if not isinstance(personality, dict):
        personality = {}

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

        return jsonify({
            "success": True,
            "traitScores": trait_scores,
            "recommendations": all_resultsb
         }), 200

    except FileNotFoundError:
        return jsonify({
            "success": False,
            "error": "Model files not found. Make sure gift_recommender_pipeline.pkl and target_encoder.pkl exist."
        }), 500

    except Exception as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)