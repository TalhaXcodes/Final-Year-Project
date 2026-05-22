import pickle
import pandas as pd


MODEL_PATH = "gift_recommender_model.pkl"
ENCODERS_PATH = "label_encoders.pkl"


SAMPLE_INPUT = {
    "occasion": "Birthday",
    "relationship": "Friend",
    "gender": "Female",
    "ageType": "Adult",
    "ageGroup": "20–25",
    "knownDuration": "1–3 year",
    "kidDislikes": "Unknown",
    "kidToyTypes": "Unknown",
    "personality": 5,
    "experiencePreference": 4,
    "handmadePreference": 4,
    "budgetFlexibility": 4,
    "stylePreference": 4,
    "surpriseReaction": 4,
    "connectionImportance": 4,
    "noteImportance": 5,
    "handmadeOverStore": 4,
    "sharedMemoriesAppreciation": 4,
    "relationshipCloseness": 4,
    "uniqueGiftValue": 5,
    "practicalOverSentimental": 4,
    "budget": "5000 PKR",
}


def load_files():
    with open(MODEL_PATH, "rb") as file:
        model = pickle.load(file)

    with open(ENCODERS_PATH, "rb") as file:
        encoders = pickle.load(file)

    return model, encoders


def encode_input(input_data, encoders):
    input_df = pd.DataFrame([input_data])

    for column, encoder in encoders.items():

        if column == "gift_type":
            continue

        if column not in input_df.columns:
            continue

        value = str(input_df[column].iloc[0])

        # Handle unseen categories safely
        if value not in encoder.classes_:

            print(f"Unknown value detected in '{column}': {value}")

            # Add Unknown class if missing
            if "Unknown" not in encoder.classes_:
                encoder.classes_ = list(encoder.classes_)
                encoder.classes_.append("Unknown")

            value = "Unknown"

        input_df[column] = encoder.transform([value])

    return input_df


def recommend_top_gifts(input_data, top_n=3):
    model, encoders = load_files()

    input_df = encode_input(input_data, encoders)

    probabilities = model.predict_proba(input_df)[0]

    target_encoder = encoders["gift_type"]

    top_indices = probabilities.argsort()[-top_n:][::-1]

    recommendations = []

    for index in top_indices:
        gift_type = target_encoder.inverse_transform([index])[0]
        confidence = probabilities[index]

        recommendations.append((gift_type, confidence))

    return recommendations


if __name__ == "__main__":
    results = recommend_top_gifts(SAMPLE_INPUT, top_n=3)

    print("Top 3 Gift Recommendations:")
    for rank, (gift, confidence) in enumerate(results, start=1):
        print(f"{rank}. {gift} - {confidence:.2f}")