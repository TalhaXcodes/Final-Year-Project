import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, top_k_accuracy_score
from sklearn.preprocessing import LabelEncoder


# =========================
# LOAD DATASET
# =========================

df = pd.read_csv("balanced_dataset.csv")

# Remove missing target rows
df = df.dropna(subset=["gift_type"])

# =========================
# FEATURES & TARGET
# =========================

X = df.drop(columns=["gift_type"])
y = df["gift_type"]

# Encode target labels only
target_encoder = LabelEncoder()
y_encoded = target_encoder.fit_transform(y)

# =========================
# COLUMN TYPES
# =========================

categorical_columns = X.columns.tolist()

# =========================
# PREPROCESSOR
# =========================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_columns
        )
    ]
)

# =========================
# MODEL PIPELINE
# =========================

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        n_estimators=300,
        max_depth=20,
        min_samples_split=3,
        min_samples_leaf=1,
        random_state=42
    ))
])

# =========================
# TRAIN TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# =========================
# TRAIN MODEL
# =========================

pipeline.fit(X_train, y_train)

# =========================
# PREDICTIONS
# =========================

y_pred = pipeline.predict(X_test)

# Probabilities for Top-K accuracy
y_probs = pipeline.predict_proba(X_test)

# =========================
# METRICS
# =========================

accuracy = accuracy_score(y_test, y_pred)

top3_accuracy = top_k_accuracy_score(
    y_test,
    y_probs,
    k=3
)

print("\nModel trained successfully!")

print(f"\nTop-1 Accuracy: {accuracy:.4f}")
print(f"Top-3 Accuracy: {top3_accuracy:.4f}")

print("\nClassification Report:\n")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=target_encoder.classes_
    )
)

# =========================
# SAVE MODEL
# =========================

with open("gift_recommender_pipeline.pkl", "wb") as file:
    pickle.dump(pipeline, file)

with open("target_encoder.pkl", "wb") as file:
    pickle.dump(target_encoder, file)

print("\nSaved:")
print("- gift_recommender_pipeline.pkl")
print("- target_encoder.pkl")