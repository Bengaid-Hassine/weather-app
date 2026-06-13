import React, { useState } from 'react'
import './SearchBar.css';
import logo from '../../images/logo2.png';

export default function SearchBar({ handleWeatherSearch }) {
  const [city, setCity] = useState('');

  const handleInput = (e) => {
    setCity(e.target.value);
  }

  const searchWeather = (e) => {
    e.preventDefault();
    
    handleWeatherSearch(city);
  }

  return (
    <div className='container search-header'>
      <img className='d-flex mx-auto' src={logo} alt="logo" height="120" width="20%" />

      <form className='container' onSubmit={searchWeather}>
        <div className="row align-items-end justify-content-evenly">
          <div className=" col-sm-11">
            <input className='form-control mx-auto mt-2' value={city} onChange={handleInput} name="city" type="text" required placeholder='Enter city name ...' />
          </div>
          <div className=" col-sm-1">
            <button type='submit' className='btn btn-primary'> <i className="bi bi-search"></i> </button>
          </div>
        </div>

      </form>

    </div>
  )
}
