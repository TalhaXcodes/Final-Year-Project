import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import warnings
warnings.filterwarnings('ignore')

print("=" * 60)
print("🤖 ML MODEL TRAINING PIPELINE")
print("=" * 60)

# Load processed dataset
df = pd.read_csv("final_dataset.csv")
df = df.copy()

print(f"\n📊 Loaded dataset shape: {df.shape}")
print(f"   Columns: {', '.join(df.columns.tolist()[:5])}...")

# ========================
# FEATURE SELECTION & TARGET
# ========================

# Target: Multi-faceted gift basket archetype
df['basket_archetype'] = (
    df["gift_type"].fillna("unknown").astype(str) + " | " +
    df["gift_item_style"].fillna("unknown").astype(str) + " | " +
    df["container_type"].fillna("unknown").astype(str)
)

# Features: Use both raw and engineered features
base_categorical_cols = [
    "gender", "age_group", "age_type", "relationship",
    "occasion", "gift_item_style", "container_type"
]

engineered_numeric_cols = [
    "price_mid_normalized", "personality_score_normalized",
    "gift_item_style_count", "product_style_count", "color_count",
    "has_size", "has_scent", "has_container",
    "gender_encoded", "age_type_encoded", "age_group_encoded"
]

# Select features that exist in processed data
available_engineered = [col for col in engineered_numeric_cols if col in df.columns]
feature_columns = base_categorical_cols + available_engineered

X = df[feature_columns].copy()
y = df["basket_archetype"].copy()

print(f"\n✅ Feature selection:")
print(f"   Total features: {len(feature_columns)}")
print(f"   Categorical: {len(base_categorical_cols)}")
print(f"   Engineered numeric: {len(available_engineered)}")

# ========================
# DATA SPLITTING
# ========================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n✅ Train/test split:")
print(f"   Training set: {X_train.shape[0]} samples")
print(f"   Test set: {X_test.shape[0]} samples")
print(f"   Target classes: {y.nunique()}")

# ========================
# PREPROCESSING PIPELINE
# ========================

categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="constant", fill_value="unknown")),
    ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
])

numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

preprocessor = ColumnTransformer(
    transformers=[
        ("categorical", categorical_transformer, base_categorical_cols),
        ("numeric", numeric_transformer, available_engineered)
    ]
)

# ========================
# MODEL SELECTION & TRAINING
# ========================

print(f"\n🔧 Training models...")

# Decision Tree baseline
dt_model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", DecisionTreeClassifier(max_depth=10, random_state=42, min_samples_split=5))
])

dt_model.fit(X_train, y_train)
dt_accuracy = dt_model.score(X_test, y_test)

# Random Forest (better generalization)
rf_model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1))
])

rf_model.fit(X_train, y_train)
rf_accuracy = rf_model.score(X_test, y_test)

# ========================
# MODEL EVALUATION
# ========================

print(f"\n📈 Model Performance:")
print(f"   Decision Tree Accuracy: {dt_accuracy:.4f} ({dt_accuracy*100:.2f}%)")
print(f"   Random Forest Accuracy: {rf_accuracy:.4f} ({rf_accuracy*100:.2f}%)")

# Select best model
best_model = rf_model if rf_accuracy > dt_accuracy else dt_model
best_model_name = "Random Forest" if rf_accuracy > dt_accuracy else "Decision Tree"

print(f"\n✨ Best Model: {best_model_name} (Accuracy: {max(dt_accuracy, rf_accuracy):.4f})")

# Cross-validation on best model
cv_scores = cross_val_score(best_model, X_train, y_train, cv=5, scoring='accuracy')
print(f"   5-Fold CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# Detailed classification report
y_pred = best_model.predict(X_test)
print(f"\n📋 Classification Report (Top 10 archetypes):")
print(f"   {'Archetype':<40} {'Precision':>10} {'Recall':>10} {'F1-Score':>10}")
print("-" * 70)

class_report = classification_report(y_test, y_pred, output_dict=True)
sorted_classes = sorted(
    [(k, v['f1-score']) for k, v in class_report.items() if k not in ['accuracy', 'macro avg', 'weighted avg']],
    key=lambda x: x[1],
    reverse=True
)[:10]

for archetype, f1 in sorted_classes:
    prec = class_report[archetype]['precision']
    rec = class_report[archetype]['recall']
    print(f"   {archetype:<40} {prec:>10.4f} {rec:>10.4f} {f1:>10.4f}")

print(f"\n   Weighted Avg Precision: {class_report['weighted avg']['precision']:.4f}")
print(f"   Weighted Avg Recall: {class_report['weighted avg']['recall']:.4f}")
print(f"   Weighted Avg F1-Score: {class_report['weighted avg']['f1-score']:.4f}")

# ========================
# SAVE MODEL ARTIFACT
# ========================

model_artifact = {
    "model": best_model,
    "model_type": best_model_name,
    "feature_columns": feature_columns,
    "base_categorical_cols": base_categorical_cols,
    "engineered_numeric_cols": available_engineered,
    "accuracy": max(dt_accuracy, rf_accuracy),
    "cv_accuracy": cv_scores.mean(),
    "random_state": 42
}

joblib.dump(model_artifact, "basketries_model.joblib")

print(f"\n✅ Model saved: basketries_model.joblib")
print(f"   Model type: {best_model_name}")
print(f"   Test accuracy: {max(dt_accuracy, rf_accuracy):.4f}")
print(f"   CV accuracy: {cv_scores.mean():.4f}")
print(f"\n{'='*60}")