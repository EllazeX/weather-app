import { 
  WiDaySunny, 
  WiNightClear, 
  WiDayCloudy, 
  WiNightAltCloudy, 
  WiCloudy, 
  WiShowers, 
  WiRain, 
  WiThunderstorm, 
  WiSnow, 
  WiFog,
  WiNa
} from "react-icons/wi";

interface WeatherIconProps {
  code: string;
  size?: number;
}

export const WeatherIcon = ({ code, size = 50 }: WeatherIconProps) => {

  switch (code) {
    case '01d': return <WiDaySunny size={size} color="#FFD700" />;
    case '01n': return <WiNightClear size={size} color="#6576d1" />;

    case '02d': return <WiDayCloudy size={size} color="#FFD700" />;
    case '02n': return <WiNightAltCloudy size={size} color="#6576d1" />;

    case '03d': 
    case '03n': 
    case '04d': 
    case '04n': return <WiCloudy size={size} color="#909090" />;

    case '09d': 
    case '09n': return <WiShowers size={size} color="#00BFFF" />;

    case '10d': 
    case '10n': return <WiRain size={size} color="#4682B4" />;

    case '11d': 
    case '11n': return <WiThunderstorm size={size} color="#555" />;

    case '13d': 
    case '13n': return <WiSnow size={size} color="#ADD8E6" />;

    case '50d': 
    case '50n': return <WiFog size={size} color="#B0C4DE" />;

    default: return <WiNa size={size} />;
  }
};