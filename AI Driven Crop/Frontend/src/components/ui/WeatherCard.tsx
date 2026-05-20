import {
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  Calendar,
} from "lucide-react";

function getWeatherIcon(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes("rain")) return "🌧️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("clear")) return "☀️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("storm")) return "⛈️";
  return "🌤️";
}

export default function WeatherCard({ weather }: { weather: any }) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl p-8 text-white mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Temperature & Condition */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="size-5" />
            <span className="text-blue-100">Today</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-7xl">{weather.temperature}</div>
            <div>
              <div className="text-3xl mb-1">{getWeatherIcon(weather.condition)}</div>
              <div className="text-blue-100">{weather.condition}</div>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <Droplets className="size-5 text-blue-200" />
            <div className="text-2xl">{weather.humidity}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Wind className="size-5 text-blue-200" />
            <div className="text-2xl">{weather.wind_speed}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Gauge className="size-5 text-blue-200" />
            <div className="text-2xl">{weather.pressure}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Sunrise className="size-5 text-blue-200" />
            <div className="text-lg">{weather.sunrise}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Sunset className="size-5 text-blue-200" />
            <div className="text-lg">{weather.sunset}</div>
          </div>
        </div>
      </div>
    </div>
  );
}