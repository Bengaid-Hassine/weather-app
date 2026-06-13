import React, { useEffect } from 'react'
import './CurrentWeather.css';

export default function CurrentWeather({ data }) {

  return (
    <div className='current-container ' style={{position: 'relative'}}>
      <div className="row mt-3 justify-content-between" >

        <div className="col-md-5 col-sm-5">
          <div className="localisation">
            <i className="bi bi-geo-alt-fill"></i>
            <span> {data.city} ,  {data.country} </span>
          </div>
          <p className='temperature'> {Math.round(data.main.temp)} °C </p>
          <p className='descrip'> {data.weather[0].description} </p>
        </div>

       <div className="col-md-3 col-sm-3 weather-icon">
        <img src={`${process.env.PUBLIC_URL}/icons2/${data.weather[0].icon}.png`} alt="" />
       </div>

        <div className="col-md-2 col-sm-3 flag-container mt-1">
          <img src={data.flag} height='50' width='100%' alt="" />
        </div>
      </div>

      <div className="parameter-container row mt-4 align-items-center justify-content-between ms-4">
        <div className="col-md-4 col-sm-3 ">
              <i className="bi bi-thermometer-half " ></i>
              <div className='parameter-details'>
                <p> {Math.round(data.main.feels_like)}°C </p>
                <p className='param'>Feels Like</p>
              </div>        
        </div>

        <div className="col-md-4 col-sm-3">
              <i className="bi bi-droplet-half " ></i>
              <div className='parameter-details'>
                <p> {Math.round(data.main.humidity)}% </p>
                <p className='param'>Humidity</p>
              </div>        
        </div>

        <div className="col-md-4 col-sm-3">
              <i className="bi bi bi-wind " ></i>
              <div className='parameter-details'>
                <p> {Math.round(data.wind.speed)} m/s </p>
                <p className='param'>Wind Speed</p>
              </div>        
        </div>
      </div>
    </div>
  )
}
