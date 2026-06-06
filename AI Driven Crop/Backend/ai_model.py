import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODELS_DIR, "crop_disease_model_final.h5")
CLASS_NAMES_PATH = os.path.join(MODELS_DIR, "class_names.json")
DATASET_PATH = os.path.join(BASE_DIR, "dataset.json")

# Global variables for caching
_MODEL = None
_CLASS_NAMES = None
_DATASET = None

def _load_resources():
    global _MODEL, _CLASS_NAMES, _DATASET
    
    if _CLASS_NAMES is None:
        with open(CLASS_NAMES_PATH, 'r') as f:
            _CLASS_NAMES = json.load(f)
            
    if _MODEL is None:
        _MODEL = tf.keras.models.load_model(MODEL_PATH)
        
    if _DATASET is None:
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            _DATASET = json.load(f)

def predict_disease(img_path):
    try:
        _load_resources()
        
        # Load and preprocess image
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)
        
        # Predict
        predictions = _MODEL.predict(img_array)
        
        # Check if predictions are logits or probabilities
        if np.max(predictions[0]) > 1.0 or np.min(predictions[0]) < 0.0:
            score = tf.nn.softmax(predictions[0]).numpy()
        else:
            score = predictions[0]
            
        predicted_class = _CLASS_NAMES[np.argmax(score)]
        confidence = float(np.max(score))
        
        # Parse predicted class (e.g., 'Corn___Common_Rust')
        # Handle variations like 'Rice_BrownSpot' or 'Wheat_FusariumHeadBlight'
        parts = predicted_class.replace('___', '_').split('_')
        crop_name = parts[0]
        disease_name = " ".join(parts[1:]) if len(parts) > 1 else "Healthy"
        
        if disease_name.lower() == "healthy" or disease_name == "":
            return {
                "error": None,
                "data": {
                    "crop": crop_name,
                    "scientific_name": "Unknown",
                    "disease": "Healthy",
                    "confidence": round(confidence, 2),
                    "common_symptoms": ["None"],
                    "immediate_action": ["None"],
                    "organic_solution": ["None"],
                    "chemical_solution": ["None"],
                    "preventive_measures": ["Maintain good farming practices"]
                }
            }
        
        # Search dataset for matching crop and disease
        matched_item = None
        for item in _DATASET:
            if item["name"].lower() == crop_name.lower():
                # Simple fuzzy match by checking if keywords of prediction match the dataset disease name
                dataset_disease_words = set(item["disease"].lower().replace('(', '').replace(')', '').split())
                predicted_disease_words = set(disease_name.lower().split())
                
                # If they share significant keywords
                if predicted_disease_words.intersection(dataset_disease_words) or disease_name.lower() in item["disease"].lower():
                    matched_item = item
                    break
        
        if matched_item:
            return {
                "error": None,
                "data": {
                    "crop": matched_item["name"],
                    "scientific_name": matched_item["scientific_name"],
                    "disease": matched_item["disease"],
                    "confidence": round(confidence, 2),
                    "common_symptoms": matched_item["common_symptoms"],
                    "immediate_action": matched_item["immediate_action"],
                    "organic_solution": matched_item["organic_solution"],
                    "chemical_solution": matched_item["chemical_solution"],
                    "preventive_measures": matched_item["preventive_measures"],
                }
            }
        else:
            # Fallback if no specific match in dataset
            return {
                "error": None,
                "data": {
                    "crop": crop_name,
                    "scientific_name": "Unknown",
                    "disease": disease_name.replace("_", " "),
                    "confidence": round(confidence, 2),
                    "common_symptoms": ["Specific symptoms not listed in database."],
                    "immediate_action": ["Consult a local agricultural expert."],
                    "organic_solution": ["Implement general crop rotation and organic soil management."],
                    "chemical_solution": ["Use appropriate fungicides/pesticides for this crop and disease."],
                    "preventive_measures": ["Use disease-resistant seeds and maintain field sanitation."]
                }
            }
            
    except Exception as e:
        return {
            "error": str(e),
            "data": None
        }
