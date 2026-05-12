import pandas as pd
import joblib

MODEL_ARTIFACT = "basketries_model.joblib"

# Canonical defaults aligned to training pipeline
DEFAULTS = {
    "gender": "unknown",
    "age_group": "unknown",
    "age_type": "unknown",
    "relationship": "unknown",
    "occasion": "unknown",
    "gift_item_style": "unknown",
    "container_type": "unknown",
    "price_mid": None,
    "personality_score": None,
}


def normalize_text(value):
    if value is None:
        return "unknown"
    text = str(value).strip().lower()
    if text in {"", "nan", "none", "null", "na"}:
        return "unknown"
    return text


def to_float_or_none(value):
    try:
        if value is None:
            return None
        return float(value)
    except (TypeError, ValueError):
        return None


def build_feature_row(user_input, feature_columns):
    row = DEFAULTS.copy()
    row.update(user_input or {})

    # Normalize categorical values
    for col in [
        "gender", "age_group", "age_type", "relationship",
        "occasion", "gift_item_style", "container_type"
    ]:
        row[col] = normalize_text(row.get(col))

    # Numeric values (let pipeline median-imputer handle None/NaN)
    row["price_mid"] = to_float_or_none(row.get("price_mid"))
    row["personality_score"] = to_float_or_none(row.get("personality_score"))

    df_input = pd.DataFrame([row])

    # Ensure exact training schema and order
    missing_cols = [c for c in feature_columns if c not in df_input.columns]
    for col in missing_cols:
        df_input[col] = DEFAULTS.get(col, "unknown")
    df_input = df_input[feature_columns]

    return df_input


def predict_basket_archetype(user_input):
    artifact = joblib.load(MODEL_ARTIFACT)
    model = artifact["model"]
    feature_columns = artifact["feature_columns"]

    input_df = build_feature_row(user_input, feature_columns)
    prediction = model.predict(input_df)[0]
    return prediction, input_df


if __name__ == "__main__":
    # Example input payload (can be replaced by API request body)
    user = {
        "gender": "female",
        "age_group": "20-25",
        "age_type": "adult",
        "relationship": "friend",
        "occasion": "birthday",
        "gift_item_style": "handmade & crafted",
        "container_type": "basket with ribbon",
        "price_mid": 15000,
        "personality_score": 4,
    }

    basket_archetype, model_input = predict_basket_archetype(user)

    print("\nModel input row:")
    print(model_input)
    print("\nPredicted basket_archetype:")
    print(basket_archetype)