export interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface CurrentWeather {
  temp: number;
  condition: string;
  icon: string;
  precipProb: number;
  precipAmount: number;
  windSpeed: number;
  windDir: string;
  clouds: number;
  humidity: number;
}

export interface City {
  id: number;
  name: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
}