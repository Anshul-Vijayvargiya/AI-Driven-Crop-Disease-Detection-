
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from ai_model import predict_disease

prediction_bp = Blueprint('prediction', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@prediction_bp.route("", methods=["POST"])
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
        return jsonify(result), 404

    return jsonify({
        "status": "success",
        "prediction": result["data"],
        "saved_image": filename
    })
