from flask import Blueprint, jsonify
import requests
from datetime import datetime

weather_bp = Blueprint("weather", __name__)

API_KEY = "2c6883cb0369ecf33872f46877ad0265"

# -------------------------------
# Current Weather
# -------------------------------
@weather_bp.route("/<city>", methods=["GET"])
def get_weather(city):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()

            temp = data['main']['temp']
            condition = data['weather'][0]['description'].title()
            humidity = data['main']['humidity']
            pressure = data['main']['pressure']
            wind_speed = data['wind']['speed']
            sunrise = datetime.fromtimestamp(data['sys']['sunrise']).strftime("%I:%M %p")
            sunset = datetime.fromtimestamp(data['sys']['sunset']).strftime("%I:%M %p")

            return jsonify({
                "city": city,
                "temperature": f"{temp} °C",
                "condition": condition,
                "humidity": f"{humidity}%",
                "pressure": f"{pressure} hPa",
                "wind_speed": f"{wind_speed} m/s",
                "sunrise": sunrise,
                "sunset": sunset
            })
        else:
            return jsonify({"error": "City not found"}), 404
    except Exception as e:
        print(f"⚠️ Weather API request failed: {str(e)}")
        return jsonify({"error": "Weather service temporarily unavailable"}), 503


# -------------------------------
# 7-Day Forecast
# -------------------------------
@weather_bp.route("/forecast/<city>", methods=["GET"])
def get_forecast(city):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            forecast_list = []
            daily = {}

            for item in data["list"]:
                date_key = datetime.fromtimestamp(item["dt"]).strftime("%Y-%m-%d")
                day_name = datetime.fromtimestamp(item["dt"]).strftime("%a")
                temp = item["main"]["temp"]
                condition = item["weather"][0]["description"].title()
                precipitation = item.get("pop", 0) * 100

                if date_key not in daily:
                    daily[date_key] = {
                        "day": day_name,
                        "temps": [],
                        "conditions": [],
                        "precip": []
                    }
                daily[date_key]["temps"].append(temp)
                daily[date_key]["conditions"].append(condition)
                daily[date_key]["precip"].append(precipitation)

            for values in daily.values():
                forecast_list.append({
                    "day": values["day"],
                    "high": round(max(values["temps"])),
                    "low": round(min(values["temps"])),
                    "condition": max(set(values["conditions"]), key=values["conditions"].count),
                    "precipitation": round(sum(values["precip"]) / len(values["precip"]))
                })

            return jsonify(forecast_list[:7])
        else:
            return jsonify({"error": "City not found"}), 404
    except Exception as e:
        print(f"⚠️ Weather Forecast API request failed: {str(e)}")
        return jsonify({"error": "Weather service temporarily unavailable"}), 503


# -------------------------------
# 24-Hour Hourly Forecast
# -------------------------------
@weather_bp.route("/hourly/<city>", methods=["GET"])
def get_hourly(city):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            hourly_list = []

            for item in data["list"][:8]:  # next 24 hours (8 x 3h intervals)
                hour = datetime.fromtimestamp(item["dt"]).strftime("%H:%M")
                temp = item["main"]["temp"]
                hourly_list.append({"hour": hour, "temp": temp})

            return jsonify(hourly_list)
        else:
            return jsonify({"error": "City not found"}), 404
    except Exception as e:
        print(f"⚠️ Weather Hourly API request failed: {str(e)}")
        return jsonify({"error": "Weather service temporarily unavailable"}), 503


# -------------------------------
# Crop Advisory Rules
# -------------------------------
def crop_advisory_rules(crop, weather):
    alerts = []
    temp = weather["main"]["temp"]
    humidity = weather["main"]["humidity"]
    precipitation = weather.get("pop", 0) * 100
    wind = weather["wind"]["speed"]

    # Tomato
    if crop.lower() == "tomato":
        if precipitation > 70:
            alerts.append({
                "type": "Heavy Rain",
                "severity": "warning",
                "message": "Risk of fungal blight due to waterlogging.",
                "recommendation": "Ensure drainage, avoid nitrogen fertilizer."
            })
        if humidity > 70:
            alerts.append({
                "type": "High Humidity",
                "severity": "advisory",
                "message": "Leaf Curl Virus risk.",
                "recommendation": "Monitor whiteflies, use neem spray."
            })
        if temp > 38:
            alerts.append({
                "type": "Heat Stress",
                "severity": "warning",
                "message": "Flowers may drop, reducing yield.",
                "recommendation": "Irrigate during cooler hours, provide shade nets."
            })
        if wind > 25:
            alerts.append({
                "type": "Wind Damage",
                "severity": "advisory",
                "message": "Plants may break, fruit bruising possible.",
                "recommendation": "Stake plants, use windbreaks."
            })

    # Potato
    if crop.lower() == "potato":
        if temp < 10:
            alerts.append({
                "type": "Cold Nights",
                "severity": "warning",
                "message": "Late Blight risk.",
                "recommendation": "Spray copper fungicide, avoid overhead irrigation."
            })
        if precipitation > 70:
            alerts.append({
                "type": "Heavy Rain",
                "severity": "warning",
                "message": "Tuber rot risk.",
                "recommendation": "Improve soil drainage."
            })
        if humidity > 80:
            alerts.append({
                "type": "Fungal Risk",
                "severity": "warning",
                "message": "High humidity favors late blight spread.",
                "recommendation": "Spray preventive fungicide, ensure crop spacing."
            })
        if temp > 30:
            alerts.append({
                "type": "Heat Stress",
                "severity": "advisory",
                "message": "Tuber formation affected.",
                "recommendation": "Irrigate frequently, mulch soil."
            })

    # Apple
    if crop.lower() == "apple":
        if temp < 0:
            alerts.append({
                "type": "Frost Warning",
                "severity": "warning",
                "message": "Blossom damage risk.",
                "recommendation": "Use frost protection (sprinklers, heaters)."
            })
        if precipitation > 60:
            alerts.append({
                "type": "Prolonged Rain",
                "severity": "warning",
                "message": "Apple scab and powdery mildew likely.",
                "recommendation": "Apply fungicide, prune for airflow."
            })
        if humidity > 70 and precipitation > 50:
            alerts.append({
                "type": "Disease Risk",
                "severity": "advisory",
                "message": "High humidity + rain favors apple scab.",
                "recommendation": "Apply preventive fungicide, improve orchard ventilation."
            })
        if wind > 20:
            alerts.append({
                "type": "Wind Damage",
                "severity": "advisory",
                "message": "Fruit drop risk.",
                "recommendation": "Support branches, use windbreaks."
            })

    # Rice
    if crop.lower() == "rice":
        if precipitation > 80:
            alerts.append({
                "type": "Flood Risk",
                "severity": "warning",
                "message": "Standing water may cause root rot and pest outbreaks.",
                "recommendation": "Drain excess water, apply balanced fertilizer."
            })
        if temp < 15:
            alerts.append({
                "type": "Cold Stress",
                "severity": "advisory",
                "message": "Slows growth and increases blast disease risk.",
                "recommendation": "Maintain shallow water depth, avoid late sowing."
            })
        if temp > 35:
            alerts.append({
                "type": "Heat Stress",
                "severity": "warning",
                "message": "High temperature may cause sterility in rice flowers.",
                "recommendation": "Maintain irrigation, avoid transplanting."
            })

    # Cotton
    if crop.lower() == "cotton":
        if temp > 35 and precipitation < 10:
            alerts.append({
                "type": "Drought Stress",
                "severity": "warning",
                "message": "Boll development reduced.",
                "recommendation": "Irrigate regularly, use mulching."
            })
        if humidity > 70:
            alerts.append({
                "type": "Bollworm Risk",
                "severity": "warning",
                "message": "High humidity favors bollworm infestation.",
                "recommendation": "Monitor fields, use pheromone traps."
            })
        if precipitation > 70 and humidity > 70:
            alerts.append({
                "type": "Boll Rot Risk",
                "severity": "warning",
                "message": "High humidity + rain favors boll rot.",
                "recommendation": "Spray carbendazim, improve spacing."
            })
    return alerts
          
# -------------------------------
# Crop-Specific Alerts
# -------------------------------
@weather_bp.route("/alerts/<city>/<crop>", methods=["GET"])
def get_crop_alerts(city, crop):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            alerts = []
            for item in data["list"][:8]:  # next 24h forecast
                rules = crop_advisory_rules(crop, item)
                if rules:   # safety check
                    alerts.extend(rules)

            # Deduplicate alerts
            unique_alerts = []
            seen = set()
            for a in alerts:
                key = (a["type"], a["message"])
                if key not in seen:
                    seen.add(key)
                    unique_alerts.append(a)

            return jsonify(unique_alerts)
        else:
            return jsonify({"error": "City not found"}), 404
    except Exception as e:
        print(f"⚠️ Crop Alerts API request failed: {str(e)}")
        return jsonify({"error": "Weather service temporarily unavailable"}), 503