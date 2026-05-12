from flask import Flask, jsonify, request
from recommend import predict_basket_archetype

app = Flask(__name__)


@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok"}), 200


@app.post("/api/predict")
def predict():
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({
            "success": False,
            "error": "Invalid JSON payload."
        }), 400

    if not isinstance(payload, dict):
        return jsonify({
            "success": False,
            "error": "Request body must be a JSON object."
        }), 400

    try:
        prediction, model_input = predict_basket_archetype(payload)
        return jsonify({
            "success": True,
            "prediction": prediction,
            "model_input": model_input.to_dict(orient="records")[0]
        }), 200
    except FileNotFoundError:
        return jsonify({
            "success": False,
            "error": "Model artifact not found. Train the model first to create basketries_model.joblib."
        }), 500
    except Exception as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
