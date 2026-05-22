import pandas as pd

INPUT_PATH = "final_dataset v2.0.csv"
OUTPUT_PATH = "final_dataset.csv v3.0"

MERGE_MAP = {
    "Wallet": "Fashion Accessories",
    "Bag/Wallet": "Fashion Accessories",
}

df = pd.read_csv(INPUT_PATH)

df["gift_type"] = df["gift_type"].replace(MERGE_MAP)

df.to_csv(OUTPUT_PATH, index=False)

print("Gift types merged successfully!")
print(df["gift_type"].value_counts())