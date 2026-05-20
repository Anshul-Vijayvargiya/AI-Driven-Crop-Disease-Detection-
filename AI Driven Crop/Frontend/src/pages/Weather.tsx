import { useState, useEffect } from "react";
import { getWeather, getForecast, getHourly, getCropAlerts } from "../services/weatherService";
import {
  Droplets,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import WeatherCard from "../components/ui/WeatherCard";

interface WeatherProps {
  onNavigate: (page: string) => void;
}

// Map condition → emoji icon
function getWeatherIcon(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes("rain")) return "🌧️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("clear")) return "☀️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("storm")) return "⛈️";
  return "🌤️";
}

export function Weather({ onNavigate }: WeatherProps) {
  const [selectedLocation, setSelectedLocation] = useState("Indore");
  const [selectedCrop, setSelectedCrop] = useState("tomato");
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Fetch weather + alerts from backend
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeather(selectedLocation);
        setCurrentWeather(data);

        const forecastData = await getForecast(selectedLocation);
        setForecast(forecastData);

        const hourlyDataRes = await getHourly(selectedLocation);
        setHourlyData(hourlyDataRes);

        const alertsRes = await getCropAlerts(selectedLocation, selectedCrop);
        setAlerts(alertsRes);
      } catch (err) {
        setError("");
      }
    };
    fetchWeather();
  }, [selectedLocation, selectedCrop]);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-4">Weather Dashboard</h1>
          <p className="text-xl text-gray-600 mb-6">
            Real-time weather data and crop-specific farming advice
          </p>

          {/* Location Selector */}
          <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-md max-w-md mb-4">
            <MapPin className="size-5 text-gray-600" />
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex-1 outline-none text-gray-900"
              placeholder="Enter location..."
            />
          </div>

          {/* Crop Selector */}
          <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-md max-w-md">
            <label className="text-gray-600">Crop:</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="flex-1 outline-none text-gray-900"
            >
              <option value="tomato">Tomato</option>
              <option value="potato">Potato</option>
              <option value="apple">Apple</option>
              <option value="rice">Rice</option>
              <option value="cotton">Cotton</option>
            </select>
          </div>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <AlertTriangle className="size-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-amber-900">{alert.type}</h3>
                      <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded text-xs uppercase">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-amber-800 mb-2">{alert.message}</p>
                    {alert.recommendation && (
                      <p className="text-sm text-amber-700">
                        <strong>Recommendation:</strong> {alert.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current Weather */}
        {error && <p className="text-red-600">{error}</p>}
        {currentWeather ? (
          <WeatherCard weather={currentWeather} />
        ) : (
          <p className="text-gray-600">Loading weather...</p>
        )}

        {/* 7-Day Forecast */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-gray-900 mb-6">6-Day Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-gray-900 mb-2">{day.day}</div>
                <div className="text-4xl mb-2">{getWeatherIcon(day.condition)}</div>
                <div className="text-sm text-gray-600 mb-2">{day.condition}</div>
                <div className="flex justify-center items-center gap-2 mb-2">
                  <span className="text-gray-900">{day.high}°</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">{day.low}°</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-blue-600 text-sm">
                  <Droplets className="size-3" />
                  <span>{day.precipitation}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Temperature Chart */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-gray-900 mb-6">24-Hour Temperature Forecast</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}