import pandas as pd
import ast


RAW_DATASET_PATH = "dataset.csv"
OUTPUT_DATASET_PATH = "final_dataset.csv"


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


RECIPIENT_COLUMNS = [
    "occasion",
    "relationship",
    "gender",
    "ageType",
    "ageGroup",
    "knownDuration",
    "kidDislikes",
    "kidToyTypes",
]

PRICE_KEYS = [
    "jewelryPrice",
    "perfumePrice",
    "dressPrice",
    "ediblePrice",
    "makeupPrice",
    "walletPrice",
    "shoePrice",
    "kidBudget",
    "perfumeBudget",
]

def extract_budget(gift):
    for key in PRICE_KEYS:
        value = gift.get(key)

        if value is not None and value != "":
            return list_to_text(value)

    return "Unknown"


def safe_parse(value):
    try:
        if pd.isna(value):
            return None
        return ast.literal_eval(value)
    except Exception:
        return None


def list_to_text(value):
    if value is None or value == "":
        return "Unknown"

    if isinstance(value, list):
        if len(value) == 0:
            return "Unknown"
        return "|".join(str(item) for item in value)

    return str(value)


def to_numeric(value):
    try:
        if value is None or value == "":
            return 3
        return int(value)
    except Exception:
        return 3


def process_dataset():
    df = pd.read_csv(RAW_DATASET_PATH)

    final_rows = []

    for _, row in df.iterrows():
        responses = safe_parse(row.get("responses"))
        personality = safe_parse(row.get("personality"))

        if not isinstance(responses, list):
            continue

        if not isinstance(personality, dict):
            personality = {}

        personality_data = {}
        for col in PERSONALITY_COLUMNS:
            personality_data[col] = to_numeric(personality.get(col, 3))

        for recipient in responses:
            if not isinstance(recipient, dict):
                continue

            gifts = recipient.get("gifts", [])

            if not isinstance(gifts, list):
                continue

            recipient_data = {}

            for col in RECIPIENT_COLUMNS:
                recipient_data[col] = list_to_text(recipient.get(col, "Unknown"))

            for gift in gifts:
                if not isinstance(gift, dict):
                    continue

                gift_type = gift.get("type", "Unknown")

                final_row = {}

                final_row.update(recipient_data)
                final_row.update(personality_data)

                final_row["budget"] = extract_budget(gift)
                final_row["gift_type"] = list_to_text(gift_type)

                final_rows.append(final_row)

    final_df = pd.DataFrame(final_rows)

    final_df.to_csv(OUTPUT_DATASET_PATH, index=False)

    print("Dataset processed successfully!")
    print(f"Total rows generated: {len(final_df)}")
    print(f"Final dataset saved as: {OUTPUT_DATASET_PATH}")
    print("\nColumns:")
    print(final_df.columns.tolist())


if __name__ == "__main__":
    process_dataset()