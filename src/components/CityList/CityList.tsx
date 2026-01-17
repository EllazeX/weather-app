import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { City } from "../../types";
import styles from "./CityList.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleFavorite, toggleShowFavoritesFilter, searchCity } from "../../store/weatherSlice";
import { convertTemp } from "../../utils/temperatureUtils";
import { getCitySuggestions, type GeoSuggestion } from "../../api/weatherService";
import { WeatherIcon } from "../WeatherIcons/WeatherIcons";

interface CityListProps {
  cities: City[];
}

export const CityList = ({ cities }: CityListProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { unit, favorites, showFavoritesOnly } = useAppSelector((state) => state.weather);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  let visibleCities = cities;

if (showFavoritesOnly) {
      visibleCities = cities.filter(city => favorites.includes(city.id));
  } else {
      visibleCities = cities.slice(0, 8); 
  }

  const filteredCities = visibleCities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const results = await getCitySuggestions(searchTerm);
      const uniqueResults = results.filter((v, i, a) => 
        a.findIndex(t => (t.lat === v.lat && t.lon === v.lon)) === i
      );
      setSuggestions(uniqueResults);
      setShowSuggestions(true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleToggleFav = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    dispatch(toggleFavorite(id));
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
        const actionResult = await dispatch(searchCity(searchTerm));
        if (searchCity.fulfilled.match(actionResult)) {
           setSearchTerm("");
           setShowSuggestions(false);
           navigate(`/city/${actionResult.payload.id}`);
        }
    }
  };

  const handleSelectSuggestion = async (suggestion: GeoSuggestion) => {
    const query = suggestion.state 
        ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
        : `${suggestion.name}, ${suggestion.country}`;
    
    setSearchTerm(""); 
    setShowSuggestions(false);
    setSuggestions([]);

    try {
        const actionResult = await dispatch(searchCity(query));
        if (searchCity.fulfilled.match(actionResult)) {
            const newCity = actionResult.payload;
            navigate(`/city/${newCity.id}`);
        }
    } catch (err) {
        console.error("Błąd podczas dodawania miasta:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Moje lokalizacje</h2>

    <div className={styles.searchWrapper}>
        <input 
          type="text" 
          placeholder="Wpisz miasto..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
          onFocus={() => searchTerm.length >= 3 && setShowSuggestions(true)}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((s, index) => (
              <li 
                key={index} 
                className={styles.suggestionItem}
                onMouseDown={() => handleSelectSuggestion(s)} 
              >
                <strong>{s.name}</strong> 
                <span className={styles.suggestionCountry}> ({s.country})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.filterWrapper}>
        <label className={styles.filterLabel}>
            <input 
                type="checkbox" 
                checked={showFavoritesOnly}
                onChange={() => dispatch(toggleShowFavoritesFilter())}
            />
            Pokaż tylko ulubione
        </label>
      </div>

          <ul className={styles.list}>
            {filteredCities.map((city) => {
              const isFav = favorites.includes(city.id);
              return (
                <li 
                  key={city.id} 
                  className={styles.listItem}
                  onClick={() => navigate(`/city/${city.id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span 
                        onClick={(e) => handleToggleFav(e, city.id)}
                        style={{ 
                            cursor: 'pointer', 
                            fontSize: '20px', 
                            color: isFav ? '#FFD700' : '#e0e0e0',
                            lineHeight: 1
                        }}
                        title={isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                    >
                        {isFav ? '★' : '☆'}
                    </span>
                    <span className={styles.cityName}>{city.name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span className={styles.temp}>
                        {convertTemp(city.current.temp, unit)}°{unit}
                      </span>
                      <WeatherIcon code={city.current.icon} size={50} />
                  </div>
                </li>
              );
            })}
          </ul>
      
      {filteredCities.length === 0 && (
          <div style={{textAlign: 'center', color: '#888', marginTop: '40px'}}>
              <p style={{fontSize: '40px', margin: 0}}>🌍</p>
              {showFavoritesOnly 
                ? <p>Brak ulubionych miast.</p> 
                : <p>Zacznij wpisywać nazwę miasta powyżej.</p>
              }
          </div>
      )}
    </div>
  );
};