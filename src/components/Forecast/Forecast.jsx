import React, { useEffect, useState } from 'react'
import './Forecast.css'

export default function Forecast({ data }) {

const [newData, setNewData] = useState([]);

useEffect(() => {
  simplifyData(data);
}, [])

const simplifyData = (data) => {
  let allRecords = [];
  for(let i = 0; i < data.length-1; i+=2) {
    const record = {
      dt: data[i].dt,
      date: data[i].date,
      icon: data[i+1].weather[0].icon,
      min_temp: Math.round(data[i].main.temp),
      max_temp: Math.round(data[i+1].main.temp),
      descrip: data[i+1].weather[0].description,
      wind: data[i+1].wind.speed,
      humidity: data[i+1].main.humidity
    };
   allRecords.push(record);
  }
  
  setNewData(allRecords);
}


  return (<>
    {newData.length>0 && 

    newData.map(item => (
      <div key={item.dt} className='col-md-3 col-sm-5 forecastOneDay'>
        <div className="row">
          <div className='col-md-8 col-sm-6'>
            <p className='forecastDate mt-1'> {item.date} </p>
          </div>
          <div className="col-md-4 col-sm-5  weather-img-container">
            <img src={`${process.env.PUBLIC_URL}/icons2/${item.icon}.png`} height='80%' width='100%' alt="weather" />
          </div>
        </div>
        <p className='temp'>  {/* some regions(ex:Hawaî) have temperature at 6h higher than the temperature at 15h 
              so I need to inverse the min_temp and max_temp*/}
          {item.min_temp < item.max_temp ? `${item.min_temp}°C - ${item.max_temp}°C` :
                                            `${item.max_temp}°C - ${item.min_temp}°C` } 
        </p>
        <p className='descrip'> {item.descrip} </p>

        <div className="forecast-param">
          <div><i className="bi bi bi-wind" ></i>
            <span> {item.wind} m/s</span></div>
          <div><i className="bi bi-droplet-half" ></i>
            <span> {item.humidity}% </span></div>
        </div>

      </div>
    ))}
  </>
  )
}
