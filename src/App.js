import './App.css';
import SearchBar from './components/Search/SearchBar';
import { WEATHER_API_KEY, GEOCODING_API_URL, WEATHER_API_URL, GET_COUNTRY_URL, COUNTRY_OPTIONS } from './api';
import { useEffect, useState } from 'react';
import CurrentWeather from './components/Current/CurrentWeather';
import Forecast from './components/Forecast/Forecast';
import LoaderSpinner from './components/Loader/LoaderSpinner';


function App() {
  const Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [isLoading, setIsLoading] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const [coord, setCoord] = useState({
    lat: null,
    lon: null
  });

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);

  //Taking only records at 6h and 15h 
  const getFiveDaysForecast = async (data) => {
  
    try {
      let forecastDays = [];
      //*** Getting the index of the day tomorrow at 06:00:00 */
      const inputDate = new Date(data.list[0].dt_txt);

      inputDate.setDate(inputDate.getDate() + 1);
      
      // Set the time to 6:00:00(il y a un décalage horraire)
      inputDate.setHours(7, 0, 0, 0);
      
      // Format the resulting date as a string
      const tomorrowDate = inputDate.toISOString().slice(0, 19).replace('T', ' ');
      const startIndex = data.list.findIndex((item) => item.dt_txt === tomorrowDate);
      
      //*** Get the 5 forecast days at 6:00:00 and 15:00:00 */
      
      let i = startIndex;
      let step = 3;
    
      while(i < data.list.length) {
        forecastDays.push(data.list[i]);
        i += step;
        step = (step==3) ? 5 : 3; /*step: 3 PUIS 5 PUIS 3 PUIS 5 ... */
        if(i == data.list.length) { /*Handling the last record: s'il ne y a pas un record du dernier jour à 15h, je prends celui de 12h */
          i -= 1;
        }
      }

      setForecastWeather(forecastDays.map(item => {
        const date = new Date(item.dt_txt);
        const dayName = Days[date.getDay()];
        const monthName = Months[date.getMonth()];
        const day = date.getDate();
        const dateFormated = `${dayName}, ${monthName} ${day}`;
        return {
          ...item,
          date: dateFormated
        }
      }));
    }
    catch (error) {
      console.error(error);
    }
  }


  async function handleWeatherSearch(city) {
    try {
      
      setIsLoading(true);

      // First fetch request to get coordinates
      const geoResponse = await fetch(`${GEOCODING_API_URL}/direct?q=${city}&appid=${WEATHER_API_KEY}`);
      if (!geoResponse.ok) {
        throw new Error('Geocoding API request failed');
      }
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        setGeoError(true);
        setIsLoading(false);
        return; // Stop execution if there's no coordinate data
      } else {
        setGeoError(false);
        const coord = {
          lat: geoData[0].lat,
          lon: geoData[0].lon,
        };

        // currentWeather fetch request using the coordinates
        const weatherResponse = await fetch(`${WEATHER_API_URL}/weather?lat=${coord.lat}&lon=${coord.lon}&appid=${WEATHER_API_KEY}&units=metric`);
        if (!weatherResponse.ok) {
          throw new Error('Weather API request failed');
        }
        const weatherData = await weatherResponse.json();

        const cityCapitalized = city[0].toUpperCase() + city.slice(1, city.length).toLowerCase();
        //Get country name and flag from the city name(state name)
        const code = weatherData.sys.country;

        const response = await fetch(`${GET_COUNTRY_URL}/${code}`, COUNTRY_OPTIONS);
        const result = await response.json();
        setCurrentWeather({
          country: result.data.name,
          flag: result.data.flagImageUri,
          city: cityCapitalized,
          ...weatherData
        });



        // forecastWeather fetch request using the coordinates
        const ForecastResponse = await fetch(`${WEATHER_API_URL}/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${WEATHER_API_KEY}&units=metric`);
        if (!ForecastResponse.ok) {
          throw new Error('Weather API request failed');
        }
        const forecastData = await ForecastResponse.json();
        getFiveDaysForecast(forecastData);
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


 
 
  return (
    <div className="App">
      <SearchBar handleWeatherSearch={handleWeatherSearch} />

   {isLoading && 
     <LoaderSpinner isLoading={isLoading} />
   }

      {!isLoading && geoError &&
        <div className='alert alert-danger w-50 mx-auto mt-5 text-center'>
          No Results found ! Please enter a valid city name.
        </div>}

      {!isLoading && !geoError && (currentWeather || forecastWeather) && (
        <div className='container main-weather-container'>
          <div className='row'>
            {currentWeather && <CurrentWeather data={currentWeather} />}
          </div>

          {forecastWeather && (<>
            <hr className='w-50 mx-auto mt-4' />

            <div className='forecast-title ms-3'>
              <i className="bi bi-calendar me-2"></i>
              <span>Daily Forecast</span>
            </div>

            <div className='forecast-con row align-items-center justify-content-start mt-4 ms-3 mb-3'>
              <Forecast data={forecastWeather} />
            </div>
          </>)}

        </div>)
      }
      
    </div>
  );
}

export default App;
