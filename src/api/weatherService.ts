import axios from 'axios';
import type { City, CurrentWeather, ForecastDay } from '../types';

const API_KEY = '9779125413ad78ccabfd578cf4cafcda';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getWindDirection = (deg: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
};

export interface GeoSuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

const transformData = (weatherData: any, forecastData: any): City => {
    const current: CurrentWeather = {
      temp: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon, 
      precipProb: 0,
      precipAmount: weatherData.rain ? weatherData.rain['1h'] || 0 : 0,
      windSpeed: Math.round(weatherData.wind.speed),
      windDir: getWindDirection(weatherData.wind.deg),
      clouds: weatherData.clouds.all,
      humidity: weatherData.main.humidity 
    };
  
const forecast: ForecastDay[] = forecastData.list
      .filter((_: any, index: number) => index % 8 === 0)
      .slice(0, 5)
      .map((item: any) => {
          const date = new Date(item.dt * 1000);
          
          return {
            day: date.toLocaleDateString('pl-PL', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'short' 
            }),
            temp: Math.round(item.main.temp),
            condition: item.weather[0].description,
            icon: item.weather[0].icon 
          };
      });
  
    return {
      id: weatherData.id,
      name: weatherData.name,
      current,
      forecast
    };
};

export const fetchAllCities = async (): Promise<City[]> => {
  const CITIES_TO_FETCH = ['Wrocław', 'Warszawa', 'Gdańsk', 'Kraków', 'Zakopane'];
  
  const promises = CITIES_TO_FETCH.map(async (cityName) => {
    const weatherRes = await axios.get(`${BASE_URL}/weather?q=${cityName}&units=metric&lang=pl&appid=${API_KEY}`);
    const forecastRes = await axios.get(`${BASE_URL}/forecast?q=${cityName}&units=metric&lang=pl&appid=${API_KEY}`);
    return transformData(weatherRes.data, forecastRes.data);
  });

  return Promise.all(promises);
};

export const fetchOneCity = async (cityName: string): Promise<City> => {
    const weatherRes = await axios.get(`${BASE_URL}/weather?q=${cityName}&units=metric&lang=pl&appid=${API_KEY}`);
    const forecastRes = await axios.get(`${BASE_URL}/forecast?q=${cityName}&units=metric&lang=pl&appid=${API_KEY}`);
    return transformData(weatherRes.data, forecastRes.data);
};

export const getCitySuggestions = async (query: string): Promise<GeoSuggestion[]> => {
  if (!query || query.length < 3) return [];
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    return res.data;
  } catch (error) {
    return [];
  }
};