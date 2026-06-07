import pandas as pd
import random


INPUT_PATH = "final_dataset.csv"
OUTPUT_PATH = "balanced_dataset.csv"

TARGET_COUNT = 80

TARGET_COLUMN = "gift_type"

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


def mutate_personality_value(value):
    try:
        value = int(value)
    except Exception:
        value = 3

    change = random.choice([-1, 0, 1])
    new_value = value + change

    return max(1, min(5, new_value))


def synthesize_dataset():
    df = pd.read_csv(INPUT_PATH)
    df = df.fillna("Unknown")

    synthetic_rows = []

    class_counts = df[TARGET_COLUMN].value_counts()

    print("Original distribution:")
    print(class_counts)

    for gift_type, count in class_counts.items():
        if count >= TARGET_COUNT:
            continue

        needed = TARGET_COUNT - count

        class_rows = df[df[TARGET_COLUMN] == gift_type]

        for _ in range(needed):
            sampled_row = class_rows.sample(n=1, replace=True).iloc[0].copy()

            for col in PERSONALITY_COLUMNS:
                if col in sampled_row:
                    sampled_row[col] = mutate_personality_value(sampled_row[col])

            synthetic_rows.append(sampled_row)

    if synthetic_rows:
        synthetic_df = pd.DataFrame(synthetic_rows)
        balanced_df = pd.concat([df, synthetic_df], ignore_index=True)
    else:
        balanced_df = df.copy()

    balanced_df.to_csv(OUTPUT_PATH, index=False)

    print("\nBalanced distribution:")
    print(balanced_df[TARGET_COLUMN].value_counts())

    print(f"\nOriginal rows: {len(df)}")
    print(f"Final rows: {len(balanced_df)}")
    print(f"Synthetic rows added: {len(balanced_df) - len(df)}")
    print(f"Balanced dataset saved as: {OUTPUT_PATH}")


if __name__ == "__main__":
    synthesize_dataset()