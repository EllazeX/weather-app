import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { City } from '../types';
import { fetchAllCities, fetchOneCity } from '../api/weatherService';

export type Unit = 'C' | 'F' | 'K';

interface WeatherState {
  cities: City[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  unit: Unit;
  favorites: number[];
  showFavoritesOnly: boolean;
}

const cityList = (cities: City[], favorites: number[]): City[] => {
    const MAX_ITEMS = 8;
    return cities.filter((city, index) => {
        const isRecent = index < MAX_ITEMS;
        const isFavorite = favorites.includes(city.id);
        return isRecent || isFavorite;
    });
};

const saveStateToLocalStorage = (state: WeatherState) => {
  const stateToSave = {
    unit: state.unit,
    favorites: state.favorites,
    showFavoritesOnly: state.showFavoritesOnly,
    savedCities: state.cities
  };
  localStorage.setItem('weatherAppConfig', JSON.stringify(stateToSave));
};

const loadState = (): any => {
  try {
    const serializedState = localStorage.getItem('weatherAppConfig');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const loadedConfig = loadState();

const initialState: WeatherState = {
  cities: loadedConfig?.savedCities || [],
  status: 'idle',
  error: null,
  unit: loadedConfig?.unit || 'C',
  favorites: loadedConfig?.favorites || [],
  showFavoritesOnly: loadedConfig?.showFavoritesOnly || false
};

export const getCitiesData = createAsyncThunk('weather/fetchCities', async () => {
  return await fetchAllCities();
});

export const searchCity = createAsyncThunk('weather/searchCity', async (cityName: string) => {
    const data = await fetchOneCity(cityName);
    return data;
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setUnit(state, action: PayloadAction<Unit>) {
      state.unit = action.payload;
      saveStateToLocalStorage(state);
    },
    toggleFavorite(state, action: PayloadAction<number>) {
      const cityId = action.payload;
      if (state.favorites.includes(cityId)) {
        state.favorites = state.favorites.filter(id => id !== cityId);
      } else {
        state.favorites.push(cityId);
      }
      state.cities = cityList(state.cities, state.favorites);
      saveStateToLocalStorage(state);
    },
    toggleShowFavoritesFilter(state) {
        state.showFavoritesOnly = !state.showFavoritesOnly;
        saveStateToLocalStorage(state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCitiesData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newCitiesData= action.payload;
        let userCities = [...state.cities];

        userCities = userCities.map(savedCity => {
            const freshData = newCitiesData.find(c => c.id === savedCity.id);
            return freshData ? freshData : savedCity;
        });

        newCitiesData.forEach(defaultCity => {
            if (!userCities.some(c => c.id === defaultCity.id)) {
                userCities.push(defaultCity);
            }
        });

        state.cities = cityList(userCities, state.favorites);
        saveStateToLocalStorage(state);
      })
      
      .addCase(getCitiesData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Błąd API';
      })
      
      .addCase(searchCity.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const newCity = action.payload;
          
          let updatedList = state.cities.filter(c => c.id !== newCity.id);
          updatedList.unshift(newCity);
          
          state.cities = cityList(updatedList, state.favorites);
          saveStateToLocalStorage(state);
      })
      
      .addCase(searchCity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchCity.rejected, (state) => {
          state.status = 'failed';
          state.error = "Nie znaleziono miasta o takiej nazwie.";
      });
  },
});

export const { setUnit, toggleFavorite, toggleShowFavoritesFilter } = weatherSlice.actions;
export default weatherSlice.reducer;