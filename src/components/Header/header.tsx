import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUnit, type Unit } from '../../store/weatherSlice';
import { WiDaySunny } from "react-icons/wi";

export const Header = () => {
  const dispatch = useAppDispatch();
  const currentUnit = useAppSelector((state) => state.weather.unit);

  const handleUnitChange = (unit: Unit) => {
    dispatch(setUnit(unit));
  };

  const btnStyle = (unit: Unit) => ({
    fontWeight: 600,
    backgroundColor: currentUnit === unit ? 'var(--foreground)' : 'transparent',
    color: currentUnit === unit ? 'var(--background)' : 'var(--muted-foreground)',
    border: 'none',
    padding: '6px 12px',
    marginLeft: '4px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '15px'
  });

  return (
    <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        marginBottom: '30px',
        backgroundColor: 'rgba(2, 8, 23, 0.8)',
        borderBottom: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <WiDaySunny size={36} color="#fbbf24" />
        <h1 style={{ 
            margin: 0, 
            fontSize: '20px', 
            color: 'var(--foreground)', 
            fontWeight: 700,
        }}>
            Weather App
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
            backgroundColor: 'var(--card)', 
            padding: '4px', 
            borderRadius: '6px', 
            border: '1px solid var(--border)',
            display: 'flex'
        }}>
            <button style={btnStyle('C')} onClick={() => handleUnitChange('C')}>°C</button>
            <button style={btnStyle('F')} onClick={() => handleUnitChange('F')}>°F</button>
            <button style={btnStyle('K')} onClick={() => handleUnitChange('K')}>K</button>
        </div>
      </div>
    </header>
  );
};