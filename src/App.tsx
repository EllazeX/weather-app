import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CityList } from './components/CityList/CityList';
import { CityDetails } from './components/CityDetails/CityDetails';
import { Header } from './components/Header/header';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getCitiesData } from './store/weatherSlice';

function App() {
  const dispatch = useAppDispatch();
  const { cities } = useAppSelector(state => state.weather);

  useEffect(() => {
    dispatch(getCitiesData());
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      
      <Routes>
        <Route path="/" element={<CityList cities={cities} />} />
        <Route path="/city/:id" element={<CityDetails />} />
      </Routes>
    </div>
  );
}

export default App;