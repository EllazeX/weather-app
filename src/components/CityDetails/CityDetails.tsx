import { useNavigate, useParams } from "react-router-dom";
import styles from "./CityDetails.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleFavorite } from "../../store/weatherSlice";
import { convertTemp } from "../../utils/temperatureUtils";
import { WeatherIcon } from "../WeatherIcons/WeatherIcons";
import { WiDirectionLeft } from "react-icons/wi";

export const CityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { unit, favorites, cities } = useAppSelector((state) => state.weather);

  const cityId = Number(id);
  const city = cities.find((c) => c.id === cityId);

  if (!city) {
    return (
        <div className={styles.container} style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Nie znaleziono miasta</h2>
            <p>Może zostało usunięte z pamięci lub adres jest błędny.</p>
            <button onClick={() => navigate("/")} className={styles.backButton} style={{ justifyContent: 'center' }}>
                Wróć do listy
            </button>
        </div>
    );
  }

  const { current, forecast } = city;
  const isFav = favorites.includes(cityId);

  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/")} className={styles.backButton}>
        <WiDirectionLeft size={24} /> Wróć
      </button>

      <header className={styles.header}>
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <h2>{city.name}</h2>
                <span 
                    onClick={() => dispatch(toggleFavorite(cityId))}
                    style={{ 
                        cursor: 'pointer', 
                        fontSize: '30px', 
                        color: isFav ? '#fbbf24' : '#475569',
                        lineHeight: 1,
                        transition: 'color 0.2s'
                    }}
                >
                    {isFav ? '★' : '☆'}
                </span>
            </div>
            <p className={styles.condition}>{current.condition}</p>
        </div>

        <div className={styles.mainInfo}>
            <WeatherIcon code={current.icon} size={100} />
            <p className={styles.temp}>
              {convertTemp(current.temp, unit)}°{unit}
            </p>
        </div>
      </header>

      <section className={styles.detailsGrid}>
        <div className={styles.detailItem}>
            <strong>Wiatr</strong>
            <span>{current.windSpeed} m/s ({current.windDir})</span>
        </div>
        <div className={styles.detailItem}>
            <strong>Wilgotność</strong>
            <span>{current.humidity}%</span>
        </div>
        <div className={styles.detailItem}>
            <strong>Opady</strong>
            <span>{current.precipAmount} mm</span>
        </div>
        <div className={styles.detailItem}>
            <strong>Chmury</strong>
            <span>{current.clouds}%</span>
        </div>
      </section>

      <section className={styles.forecast}>
        <h3>Prognoza na 5 dni</h3>
        <div className={styles.forecastList}>
            {forecast.map((day, index) => (
                <div key={index} className={styles.forecastItem}>
                    <span className={styles.dayName}>{day.day}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <WeatherIcon code={day.icon} size={30} />
                        <span className={styles.dayTemp}>
                          {convertTemp(day.temp, unit)}°{unit}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};