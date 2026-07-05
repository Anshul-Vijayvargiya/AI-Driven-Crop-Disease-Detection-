from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from ai_model import predict_disease
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.scan import Scan

prediction_bp = Blueprint('prediction', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@prediction_bp.route("", methods=["POST"])
@jwt_required(optional=True)
def predict():
    # Validate inputs
    if "image" not in request.files:
        return jsonify({"error": "Image not provided"}), 400

    image = request.files["image"]
    
    # We still accept crop_name if provided, but the AI model will determine the actual crop
    crop_name = request.form.get("crop", "")

    if image.filename == "":
        return jsonify({"error": "No image selected"}), 400

    if not allowed_file(image.filename):
        return jsonify({"error": "Only png/jpg/jpeg files allowed"}), 400

    # Save image
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    filename = secure_filename(image.filename)
    filepath = os.path.join(upload_folder, filename)
    image.save(filepath)

    # Call AI model
    result = predict_disease(filepath)

    if result.get("error"):
        print(f"Real AI model failed: {result.get('error')}. Falling back to mock_model...")
        from mock_model import get_disease_recommendation
        result = get_disease_recommendation(crop_name)

    if result.get("error"):
        return jsonify(result), 404

    # If user is logged in, save the scan to DB
    user_id = get_jwt_identity()
    if user_id:
        scan_model = Scan(current_app.db)
        prediction_data = result["data"]
        # severity isn't returned from mock_model directly, let's derive it or use a default
        # If healthy, severity is None, else High/Medium etc. We'll check if it's healthy
        is_healthy = prediction_data.get("disease", "").lower() == "healthy"
        severity = "None" if is_healthy else "High"  # default to High if not healthy for now
        
        scan_model.create_scan(
            user_id=user_id,
            crop=prediction_data.get("crop", crop_name),
            disease=prediction_data.get("disease", "Unknown"),
            severity=severity,
            confidence=prediction_data.get("confidence", 0.0)
        )

    return jsonify({
        "status": "success",
        "prediction": result["data"],
        "saved_image": filename
    })
