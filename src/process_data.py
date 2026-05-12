import pandas as pd
import ast
import re

# -------------------------------
# Load dataset
# -------------------------------
df = pd.read_csv("dataset.csv")

clean_data = []

# Known gift item packaging styles
PACKAGING_KEYWORDS = [
    "handmade & crafted",
    "quirky & unique",
    "funny & lighthearted"
]

STYLE_ALLOWED = set(PACKAGING_KEYWORDS)

EMPTY_LIKE = {"", "nan", "none", "null", "na"}

AGE_GROUP_MAP = {
    "less than a year": "0-1",
    "1-3": "1-3",
    "3-6": "3-6",
    "6-9": "6-9",
    "9-12": "9-12",
    "12-15": "12-15",
    "16-20": "16-20",
    "20-25": "20-25",
    "25-35": "25-35",
    "more than 35 years": "35+",
}

KID_GROUPS = {"0-1", "1-3", "3-6", "6-9", "9-12", "12-15"}
ADULT_GROUPS = {"16-20", "20-25", "25-35", "35+"}

GIFT_TYPE_MAP = {
    "wallet": "bag/wallet",
    "bag/wallet": "bag/wallet",
    "accessories": "accessories",
    "clothing": "clothing",
    "edible stuff": "edible stuff",
    "jewellery": "jewellery",
    "makeup products": "makeup products",
    "perfume": "perfume",
    "shoes": "shoes",
    "toys": "toys",
}

OCCASION_MAP = {
    "birthday": "birthday",
    "anniversary": "anniversary",
    "graduation": "graduation",
    "holiday": "holiday",
    "thank you gift": "thank you gift",
    "get well soon": "get well soon",
    "wedding/engagement gift": "wedding/engagement gift",
    "other": "other",
}

RELATIONSHIP_MAP = {
    "close family(parent, sibling, child)": "close family",
    "close family (parent, sibling, child)": "close family",
    "extended family (aunt, uncle, cousin)": "extended family",
    "friend": "friend",
    "spouse": "spouse",
    "colleague/professional": "colleague/professional",
    "other": "other",
}

def remove_duplicates(value):
    if not value:
        return ''
    
    parts = [v.strip() for v in value.split(',') if v.strip()]
    return ', '.join(sorted(set(parts)))

def normalize_text(value):
    if pd.isna(value):
        return pd.NA
    s = str(value).strip()
    s = s.replace("�", "-").replace("–", "-").replace("—", "-")
    s = re.sub(r"\s+", " ", s).strip().lower()
    if s in EMPTY_LIKE:
        return pd.NA
    return s

def normalize_range_text(value):
    s = normalize_text(value)
    if pd.isna(s):
        return s
    return re.sub(r"\s*-\s*", "-", s)

def deduplicate_csv_tokens(value):
    s = normalize_text(value)
    if pd.isna(s):
        return pd.NA
    parts = [p.strip() for p in s.split(",") if p.strip()]
    if not parts:
        return pd.NA
    return ", ".join(sorted(set(parts)))

def filter_allowed_styles(value):
    s = deduplicate_csv_tokens(value)
    if pd.isna(s):
        return pd.NA
    parts = [p.strip() for p in s.split(",") if p.strip()]
    parts = [p for p in parts if p in STYLE_ALLOWED]
    if not parts:
        return pd.NA
    return ", ".join(sorted(set(parts)))

def parse_price(price_raw):
    s = normalize_text(price_raw)
    if pd.isna(s):
        return pd.Series([pd.NA, pd.NA, pd.NA, pd.NA], index=["price_bin", "price_min", "price_max", "price_mid"])

    s = s.replace("pkr", "").replace(",", "").strip()
    s = re.sub(r"\s+", " ", s)

    more_than_match = re.search(r"more than\s+(\d+)", s)
    if more_than_match:
        low = int(more_than_match.group(1))
        return pd.Series([f">{low}", low, pd.NA, float(low * 1.15)], index=["price_bin", "price_min", "price_max", "price_mid"])

    range_match = re.search(r"(\d+)\s*-\s*(\d+)", s)
    if range_match:
        low, high = int(range_match.group(1)), int(range_match.group(2))
        return pd.Series([f"{low}-{high}", low, high, (low + high) / 2.0], index=["price_bin", "price_min", "price_max", "price_mid"])

    single_match = re.search(r"^\d+$", s)
    if single_match:
        value = int(single_match.group(0))
        return pd.Series([f"{value}-{value}", value, value, float(value)], index=["price_bin", "price_min", "price_max", "price_mid"])

    return pd.Series([pd.NA, pd.NA, pd.NA, pd.NA], index=["price_bin", "price_min", "price_max", "price_mid"])

for index, row in df.iterrows():
    try:
        responses = ast.literal_eval(row['responses'])

        # -------------------------------
        # Personality Score Calculation
        # -------------------------------
        personality_score = None
        personality_raw = row.get('personality', None)

        if pd.notna(personality_raw):
            try:
                personality_dict = ast.literal_eval(personality_raw)
                values = [int(v) for v in personality_dict.values()]
                personality_score = sum(values) / len(values)
            except:
                personality_score = None

        # -------------------------------
        # Container Type (Basket/Box)
        # -------------------------------
        container_type = str(row.get('packaging', '')).lower().strip()

        # -------------------------------
        # Process Each Person
        # -------------------------------
        for person in responses:
            gender = str(person.get('gender', '')).lower().strip()
            age_group = str(person.get('ageGroup', '')).strip()
            age_type = str(person.get('ageType', '')).lower().strip()
            relationship = str(person.get('relationship', '')).lower().strip()

            occasion_list = person.get('occasion', [])
            occasion = occasion_list[0].lower().strip() if occasion_list else ''

            gifts = person.get('gifts', [])

            # -------------------------------
            # Process Each Gift
            # -------------------------------
            for gift in gifts:
                gift_type = gift.get('type', '').lower().strip()

                price = ''
                color = ''
                product_style = ''
                gift_item_style = ''
                scent = ''
                size = ''

                # -------------------------------
                # Dynamic extraction
                # -------------------------------
                for key, value in gift.items():
                    key_lower = key.lower()

                    # PRICE / BUDGET
                    if 'price' in key_lower or 'budget' in key_lower:
                        price = value

                    # COLOR
                    elif 'color' in key_lower:
                        if isinstance(value, list):
                            color = ','.join(value)
                        else:
                            color = value

                    # SIZE
                    elif 'size' in key_lower:
                        size = value

                    # STYLE HANDLING (CRITICAL FIX)
                    elif 'style' in key_lower:
                        values = value if isinstance(value, list) else [value]

                        for v in values:
                            v = str(v).strip()

                            if v.lower() in PACKAGING_KEYWORDS:
                                gift_item_style += ',' + v
                            else:
                                product_style += ',' + v

                # -------------------------------
                # Specific attributes
                # -------------------------------
                if 'perfumeScent' in gift:
                    scent = gift.get('perfumeScent')

                # -------------------------------
                # Preferred Style → gift_item_style
                # -------------------------------
                if 'preferredStyle' in gift:
                    pref_list = gift.get('preferredStyle', [])
                    for p in pref_list:
                        gift_item_style += ',' + str(p).strip()

                # -------------------------------
                # Clean values
                # -------------------------------
                product_style = remove_duplicates(product_style.strip(','))
                gift_item_style = remove_duplicates(gift_item_style.strip(','))

                # -------------------------------
                # Append cleaned row
                # -------------------------------
                clean_data.append({
                    "gender": gender,
                    "age_group": age_group,
                    "age_type": age_type,
                    "relationship": relationship,
                    "occasion": occasion,
                    "gift_type": gift_type,
                    "price": price,
                    "color": color,
                    "product_style": product_style,
                    "gift_item_style": gift_item_style,
                    "container_type": container_type,
                    "size": size,
                    "scent": scent,
                    "personality_score": personality_score
                })

    except Exception as e:
        print(f"Error in row {index}: {e}")

# -------------------------------
# Create DataFrame
# -------------------------------
clean_df = pd.DataFrame(clean_data)

# -------------------------------
# Final Cleaning
# -------------------------------
obj_cols = clean_df.select_dtypes(include='object').columns
for col in obj_cols:
    clean_df[col] = clean_df[col].map(normalize_text)

for col in ['age_group', 'price']:
    clean_df[col] = clean_df[col].map(normalize_range_text)

clean_df['age_group'] = clean_df['age_group'].replace(AGE_GROUP_MAP)

# Force logical age_type from age_group
clean_df['age_type'] = clean_df['age_type'].fillna('adult')
clean_df.loc[clean_df['age_group'].isin(KID_GROUPS), 'age_type'] = 'kid'
clean_df.loc[clean_df['age_group'].isin(ADULT_GROUPS), 'age_type'] = 'adult'

# Canonical categories
clean_df['gift_type'] = clean_df['gift_type'].replace(GIFT_TYPE_MAP).fillna('other_gift')
clean_df['occasion'] = clean_df['occasion'].replace(OCCASION_MAP).fillna('other')
clean_df['relationship'] = clean_df['relationship'].replace(RELATIONSHIP_MAP).fillna('other')
clean_df['gender'] = clean_df['gender'].where(clean_df['gender'].isin(['male', 'female']), 'other')

# Style cleanup and allowlist
clean_df['gift_item_style'] = clean_df['gift_item_style'].map(filter_allowed_styles)
clean_df['product_style'] = clean_df['product_style'].map(deduplicate_csv_tokens)
clean_df['color'] = clean_df['color'].map(deduplicate_csv_tokens)

# Price canonicalization
clean_df['price_raw'] = clean_df['price']
price_parts = clean_df['price'].apply(parse_price)
clean_df = pd.concat([clean_df, price_parts], axis=1)

# Gift-type dependent consistency
clean_df.loc[clean_df['gift_type'] != 'perfume', 'scent'] = pd.NA
clean_df.loc[~clean_df['gift_type'].isin(['clothing', 'shoes']), 'size'] = pd.NA

# Numeric coercion
clean_df['personality_score'] = pd.to_numeric(clean_df['personality_score'], errors='coerce').clip(lower=1.0, upper=5.0)

# Remove exact and semantic duplicates
clean_df = clean_df.drop_duplicates()
core_key = [
    'gender', 'age_group', 'age_type', 'relationship',
    'occasion', 'gift_type', 'price_bin',
    'gift_item_style', 'container_type'
]
clean_df = clean_df.drop_duplicates(subset=core_key, keep='first')

# Final output columns
final_columns = [
    'gender', 'age_group', 'age_type', 'relationship', 'occasion',
    'gift_type', 'price_raw', 'price_bin', 'price_min', 'price_max', 'price_mid',
    'color', 'product_style', 'gift_item_style', 'container_type',
    'size', 'scent', 'personality_score'
]
existing_final_columns = [col for col in final_columns if col in clean_df.columns]
clean_df = clean_df[existing_final_columns]

# ========================
# FEATURE ENGINEERING
# ========================

# Binary encoding for categorical features
clean_df['gender_encoded'] = (clean_df['gender'] == 'male').astype(int)
clean_df['age_type_encoded'] = (clean_df['age_type'] == 'adult').astype(int)

# Label encode ordinal age groups
age_group_order = ['0-1', '1-3', '3-6', '6-9', '9-12', '12-15', '16-20', '20-25', '25-35', '35+']
clean_df['age_group_encoded'] = clean_df['age_group'].apply(
    lambda x: age_group_order.index(x) if x in age_group_order else -1
)

# Handle style and color: count number of comma-separated items (multi-select encoding)
clean_df['gift_item_style_count'] = clean_df['gift_item_style'].apply(
    lambda x: len(str(x).split(',')) if pd.notna(x) and str(x).strip() else 0
)
clean_df['product_style_count'] = clean_df['product_style'].apply(
    lambda x: len(str(x).split(',')) if pd.notna(x) and str(x).strip() else 0
)
clean_df['color_count'] = clean_df['color'].apply(
    lambda x: len(str(x).split(',')) if pd.notna(x) and str(x).strip() else 0
)

# Binary encoding for categorical dimensions
clean_df['has_size'] = clean_df['size'].notna().astype(int)
clean_df['has_scent'] = clean_df['scent'].notna().astype(int)
clean_df['has_container'] = clean_df['container_type'].notna().astype(int)

# Personality score normalization (scale to 0-1 range)
clean_df['personality_score_normalized'] = clean_df['personality_score'].fillna(3.0).apply(
    lambda x: (float(x) - 1.0) / 4.0 if pd.notna(x) else 0.5
).clip(0, 1)

# Price mid-point normalization (log scale for better ML performance)
import numpy as np
clean_df['price_mid_normalized'] = clean_df['price_mid'].fillna(clean_df['price_mid'].median()).apply(
    lambda x: np.log1p(float(x)) if pd.notna(x) and float(x) > 0 else 0
)

# Handle missing values with sensible defaults
clean_df['gender'] = clean_df['gender'].fillna('other')
clean_df['age_group'] = clean_df['age_group'].fillna('16-20')
clean_df['age_type'] = clean_df['age_type'].fillna('adult')
clean_df['relationship'] = clean_df['relationship'].fillna('other')
clean_df['occasion'] = clean_df['occasion'].fillna('other')
clean_df['gift_type'] = clean_df['gift_type'].fillna('other_gift')
clean_df['container_type'] = clean_df['container_type'].fillna('simple box')
clean_df['personality_score'] = clean_df['personality_score'].fillna(3.0)

# Fill engineered features with defaults
clean_df['gift_item_style_count'] = clean_df['gift_item_style_count'].fillna(0).astype(int)
clean_df['product_style_count'] = clean_df['product_style_count'].fillna(0).astype(int)
clean_df['color_count'] = clean_df['color_count'].fillna(0).astype(int)
clean_df['personality_score_normalized'] = clean_df['personality_score_normalized'].fillna(0.5)
clean_df['price_mid_normalized'] = clean_df['price_mid_normalized'].fillna(0)

print(f"✅ Dataset shape after feature engineering: {clean_df.shape}")
print(f"✅ Features engineered: {len([col for col in clean_df.columns if '_encoded' in col or '_count' in col or '_normalized' in col or '_' in col])}")

# Summary statistics
print("\n📊 Data Quality Report:")
print(f"   Total rows: {len(clean_df)}")
print(f"   Missing values: {clean_df.isnull().sum().sum()}")
print(f"   Gift types: {clean_df['gift_type'].nunique()}")
print(f"   Age groups: {clean_df['age_group'].nunique()}")

# -------------------------------
# Save dataset
# -------------------------------
clean_df.to_csv("final_dataset.csv", index=False)

print("\n✅ Final dataset cleaned, engineered, and saved successfully!")