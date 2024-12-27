import React, { useState, useRef, useEffect } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import next_icon from '../assets/next.png'; // Add your "Next" button icon here
import previous_icon from '../assets/previous.png'; // Add your "Previous" button icon here

const Weather = () => {
    const inputRef = useRef();

    const [weatherData, setWeatherData] = useState(null);
    const [scrollerData, setScrollerData] = useState([]);
    const [currentCityIndex, setCurrentCityIndex] = useState(0);

    const defaultCities = ['London', 'New York', 'Tokyo'];

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
        "50n": wind_icon,
    };

    const fetchWeatherData = async (city, isScroller = false) => {
        try {
            console.log(`Fetching weather data for city: ${city}`);
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                const iconCode = data.weather[0]?.icon || '01d';
                const icon = allIcons[iconCode] || clear_icon;

                const weatherDetails = {
                    location: data.name,
                    temperature: Math.floor(data.main.temp - 273.15),
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    icon: icon,
                };

                if (isScroller) {
                    setScrollerData((prevData) => {
                        const updatedData = [...prevData];
                        updatedData[currentCityIndex] = weatherDetails;
                        return updatedData;
                    });
                } else {
                    setWeatherData(weatherDetails);
                }
            } else {
                console.error(`Error fetching weather data: ${data.message}`);
            }
        } catch (error) {
            console.error(`Error fetching weather data: ${error.message}`);
        }
    };

    const handleNext = () => {
        const nextIndex = (currentCityIndex + 1) % defaultCities.length;
        setCurrentCityIndex(nextIndex);
        fetchWeatherData(defaultCities[nextIndex], true);
    };

    const handlePrevious = () => {
        const previousIndex =
            currentCityIndex === 0 ? defaultCities.length - 1 : currentCityIndex - 1;
        setCurrentCityIndex(previousIndex);
        fetchWeatherData(defaultCities[previousIndex], true);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 4000); // Automatically scroll every 4 seconds

        return () => clearInterval(interval);
    }, [currentCityIndex]);

    useEffect(() => {
        // Fetch initial data for all scroller cities
        defaultCities.forEach((city) => fetchWeatherData(city, true));
        fetchWeatherData('Chhatarpur'); // Default city for main weather display
    }, []);

    return (
        <div className="weather">
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder="Search" />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={() => fetchWeatherData(inputRef.current.value)}
                />
            </div>

            {scrollerData.length > 0 && (
                <div className="scroller">
                    <div className="scroller-item">
                        <img
                            src={scrollerData[currentCityIndex]?.icon}
                            alt="Weather Icon"
                            className="scroller-weather-icon"
                        />
                        <p className="scroller-temperature">
                            {scrollerData[currentCityIndex]?.temperature}°C
                        </p>
                        <p className="scroller-location">
                            {scrollerData[currentCityIndex]?.location}
                        </p>
                        <div className="scroller-details">
                            <div className="scroller-detail-item">
                                <img src={humidity_icon} alt="Humidity Icon" />
                                <p>{scrollerData[currentCityIndex]?.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                            <div className="scroller-detail-item">
                                <img src={wind_icon} alt="Wind Icon" />
                                <p>{scrollerData[currentCityIndex]?.windSpeed} m/s</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                    <div className="scroller-buttons">
                    <img
    src={previous_icon}
    alt="Previous"
    onClick={handlePrevious}
    className="scroller-button-icon scroller-previous"
/>
<img
    src={next_icon}
    alt="Next"
    onClick={handleNext}
    className="scroller-button-icon scroller-next"
/>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;
