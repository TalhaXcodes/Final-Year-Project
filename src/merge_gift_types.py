import pandas as pd

INPUT_PATH = "final_dataset.csv"
OUTPUT_PATH = "final_dataset.csv"

FINAL_CATEGORY_MAP = {
    "Jewellery": "Accessories",
    "Accessories": "Accessories",

    "Wallet": "Bag / Wallet",
    "Bag/Wallet": "Bag / Wallet",
    "Bag / Wallet": "Bag / Wallet",
    "Fashion Accessories": "Bag / Wallet",

    "Clothing": "Clothing",
    "Edible Stuff": "Edible Stuff",
    "Makeup Products": "Makeup Products",
    "Perfume": "Perfume",
    "Shoes": "Shoes",
    "Toys": "Toys",
}

df = pd.read_csv(INPUT_PATH)

df["gift_type"] = df["gift_type"].replace(FINAL_CATEGORY_MAP)

allowed_categories = list(FINAL_CATEGORY_MAP.values())

df = df[df["gift_type"].isin(allowed_categories)]

df.to_csv(OUTPUT_PATH, index=False)

print("Gift categories finalized successfully!")
print(df["gift_type"].value_counts())
print("\nTotal rows:", len(df))