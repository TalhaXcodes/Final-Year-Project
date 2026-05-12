import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

collection_name = "questionnaireResponses"

docs = db.collection(collection_name).stream()

data = []

for doc in docs:
    record = doc.to_dict()
    data.append(record)

df = pd.DataFrame(data)

# Save to CSV
df.to_csv("dataset.csv", index=False)

print("Data exported successfully!")