import React, { useState,useRef, useEffect } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'

const Weather = () => {

    const inputRef = useRef()

    const [weatherData, setWeatherData] = useState({
        temperature: '',
        location: '',
        humidity: '',
        windSpeed: ''
    });

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": cloud_icon,
        "04n": cloud_icon,
        "09d": drizzle_icon,
        "09n": drizzle_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "11d": rain_icon,
        "11n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
        "50d": wind_icon,
        "50n": wind_icon
    };

    const search = async (city) => {

    
        if(city === '') {
            alert('Please enter a city name')
            return;  
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}` 
            const response = await fetch(url)
            const data = await response.json() 

            if(!response.ok)
            {
                alert(data.message);
                return;
            }

            console.log(data)
            // Safely map the icon
        const iconCode = data.weather[0].icon; // Default to "01d" if icon not available
        const icon = allIcons[iconCode] || clear_icon; // Fallback to clear_icon if not mapped

            setWeatherData(
                {
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed, 
                    temperature: (Math.floor(data.main.temp - 273.15)),
                    location: data.name,
                    icon: icon
                }
            )

        } 
        catch (error) {
            
            console.error("Error fetching weather data:", error)
            setWeatherData(false);
        }

    }

    useEffect(() => {
        search('Chhatarpur'); // Example city
    }, [])

    return (
        <div className='weather'>
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder= 'Search' />


                <img src={search_icon} alt="" onClick={()=>search(inputRef.current.value)}/>
            </div>
        {weatherData?
        
        <>
<img src={weatherData.icon} alt="" className='weather-icon' />
            <p className='temperature'>{weatherData.temperature}°C</p>
            <p className='location'>{weatherData.location}</p>
            <div className="weather-data">
                <div className="col">
                    <img src={humidity_icon} alt="" />
                    <div>
                        <p>{weatherData.humidity}%</p>
                        <span>Humidity</span>
                    </div>
                    <img src={wind_icon} alt="" />
                    <div>
                        <p>{weatherData.windSpeed}</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>

        </>:<></>}

            
        </div>
    )
}
export default Weather