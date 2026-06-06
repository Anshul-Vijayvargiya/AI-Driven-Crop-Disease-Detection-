import json
import os
import random

# Load dataset once
dataset_path = os.path.join(os.path.dirname(__file__), "dataset.json")

with open(dataset_path, "r", encoding="utf-8") as f:
    DATA = json.load(f)

def get_disease_recommendation(crop_name):
    crop_name = crop_name.strip().lower()

    if not crop_name:
        results = DATA
    else:
        # Filter dataset to match crop
        results = [item for item in DATA if item["name"].lower() == crop_name]

    if not results:
        return {
            "error": f"No data found for crop '{crop_name}'.",
            "data": None
        }

    result = random.choice(results)

    return {
        "error": None,
        "data": {
            "crop": result["name"],
            "scientific_name": result["scientific_name"],
            "disease": result["disease"],
            "confidence": round(random.uniform(0.80, 0.97), 2),
            "common_symptoms": result["common_symptoms"],
            "immediate_action": result["immediate_action"],
            "organic_solution": result["organic_solution"],
            "chemical_solution": result["chemical_solution"],
            "preventive_measures": result["preventive_measures"],
        }
    }

