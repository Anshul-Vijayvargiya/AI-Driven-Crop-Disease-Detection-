from datetime import datetime, timedelta
from bson.objectid import ObjectId

class Scan:
    def __init__(self, db):
        self.collection = db['scans']

    def create_scan(self, user_id, crop, disease, severity, confidence):
        scan_data = {
            "user_id": ObjectId(user_id) if user_id else None,
            "crop": crop,
            "disease": disease,
            "severity": severity,
            "confidence": confidence,
            "timestamp": datetime.utcnow()
        }
        result = self.collection.insert_one(scan_data)
        return str(result.inserted_id)

    def get_user_dashboard_stats(self, user_id):
        user_obj_id = ObjectId(user_id)
        
        # Base query for the user
        match_query = {"user_id": user_obj_id}
        
        # 1. Total Scans
        total_scans = self.collection.count_documents(match_query)
        
        # 2. Healthy vs Diseased (Assuming disease="Healthy" or severity="None" means healthy)
        healthy_crops = self.collection.count_documents({
            **match_query,
            "$or": [
                {"disease": "Healthy"},
                {"severity": "None"}
            ]
        })
        diseases_detected = total_scans - healthy_crops
        
        # 3. Average Accuracy (Confidence)
        pipeline = [
            {"$match": match_query},
            {"$group": {
                "_id": None,
                "avg_confidence": {"$avg": "$confidence"}
            }}
        ]
        agg_result = list(self.collection.aggregate(pipeline))
        accuracy_rate = 0.0
        if agg_result and agg_result[0].get("avg_confidence"):
            # confidence might be 0.95 or 95. If 0.95, multiply by 100
            val = agg_result[0]["avg_confidence"]
            accuracy_rate = val * 100 if val <= 1.0 else val
            accuracy_rate = round(accuracy_rate, 1)
        else:
            accuracy_rate = 0.0
            
        # 4. Recent Detections
        recent_cursor = self.collection.find(match_query).sort("timestamp", -1).limit(5)
        recent_detections = []
        for doc in recent_cursor:
            conf = doc.get("confidence", 0)
            recent_detections.append({
                "id": str(doc["_id"]),
                "disease": doc.get("disease", "Unknown"),
                "crop": doc.get("crop", "Unknown"),
                "date": doc.get("timestamp").isoformat() + "Z" if doc.get("timestamp") else "",
                "severity": doc.get("severity", "None"),
                "confidence": round(conf * 100) if conf <= 1.0 else round(conf)
            })
            
        # 5. Disease Distribution (Top 5 diseases)
        disease_pipeline = [
            {"$match": {**match_query, "disease": {"$ne": "Healthy"}, "severity": {"$ne": "None"}}},
            {"$group": {"_id": "$disease", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        disease_dist = list(self.collection.aggregate(disease_pipeline))
        
        colors = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16"]
        disease_data = []
        for idx, item in enumerate(disease_dist):
            disease_data.append({
                "name": item["_id"],
                "value": item["count"],
                "color": colors[idx % len(colors)]
            })
            
        # 6. Monthly Data (Last 6 months)
        six_months_ago = datetime.utcnow() - timedelta(days=180)
        monthly_pipeline = [
            {"$match": {**match_query, "timestamp": {"$gte": six_months_ago}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m", "date": "$timestamp"}},
                "scans": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]
        monthly_agg = list(self.collection.aggregate(monthly_pipeline))
        monthly_data = []
        for item in monthly_agg:
            # Convert "2023-10" to "Oct"
            dt = datetime.strptime(item["_id"], "%Y-%m")
            monthly_data.append({
                "month": dt.strftime("%b"),
                "scans": item["scans"]
            })
            
        return {
            "stats": {
                "totalScans": total_scans,
                "diseasesDetected": diseases_detected,
                "healthyCrops": healthy_crops,
                "accuracyRate": accuracy_rate
            },
            "recentDetections": recent_detections,
            "diseaseData": disease_data,
            "monthlyData": monthly_data
        }
