import pandas as pd

df = pd.read_csv("final_dataset.csv")

print(df["gift_type"].value_counts())
print("\nTotal rows:", len(df))