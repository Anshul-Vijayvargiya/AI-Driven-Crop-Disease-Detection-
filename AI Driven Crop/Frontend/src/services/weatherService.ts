import apiClient from "./apiClient";

// Current weather
export async function getWeather(city: string) {
  const res = await apiClient.get(`/weather/${city}`);
  return res.data; // { city, temperature, condition, humidity, pressure, wind_speed, sunrise, sunset }
}

// 7-day forecast
export async function getForecast(city: string) {
  const res = await apiClient.get(`/weather/forecast/${city}`);
  return res.data; // [{ day, high, low, condition, precipitation }]
}

// 24-hour hourly forecast
export async function getHourly(city: string) {
  const res = await apiClient.get(`/weather/hourly/${city}`);
  return res.data; // [{ hour, temp }]
}
// Crop-specific alerts
export async function getCropAlerts(city: string, crop: string) {
  const res = await apiClient.get(`/weather/alerts/${city}/${crop}`);
  return res.data; 
  // [{ type, severity, message, recommendation }]
}
