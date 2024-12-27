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
import next_icon from '../assets/next.png';
import previous_icon from '../assets/previous.png';
import home from '../assets/Home.png';

const WeatherWithSearch = () => {
    const inputRef = useRef();

    const [weatherData, setWeatherData] = useState(null);
    const [scrollerData, setScrollerData] = useState([]);
    const [currentCityIndex, setCurrentCityIndex] = useState(0);
    const [isHomePage, setIsHomePage] = useState(true);
    const [intervalId, setIntervalId] = useState(null);

    const defaultCities = ['Chhatarpur', 'Kolkata', 'Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad'];

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

    const fetchWeatherData = async (city) => {
        try {
            console.log(`Fetching weather data for: ${city}`);
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                console.log(data); // Log the API response data
                const iconCode = data.weather[0]?.icon || '01d';
                const icon = allIcons[iconCode] || clear_icon;

                return {
                    location: data.name,
                    temperature: Math.floor(data.main.temp - 273.15),
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    icon: icon,
                };
            } else {
                console.error(`Error fetching weather data for ${city}: ${data.message}`);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const handleSearch = async () => {
        const city = inputRef.current.value.trim(); // Trim extra whitespace
        if (!city) {
            alert("Please enter a valid city name.");
            return; // Exit the function early if input is invalid or empty
        }
    
        try {
            clearInterval(intervalId); // Stop the scroller interval
            setIsHomePage(false); // Temporarily switch to searched city display
    
            const searchedData = await fetchWeatherData(city);
            if (!searchedData) {
                throw new Error("City not found");
            }
    
            setWeatherData(searchedData); // Display the searched city weather
        } catch (error) {
            console.error(error.message); // Log the error for debugging
            alert("City not found or invalid. Returning to the scroller.");
            handleGoBack(); // Return to the scroller view
        }
    };
    
    

    const handleNext = async () => {
        const nextIndex = (currentCityIndex + 1) % defaultCities.length;
        setCurrentCityIndex(nextIndex);
        const newData = await fetchWeatherData(defaultCities[nextIndex]);
        setScrollerData((prev) => {
            const updatedData = [...prev];
            updatedData[nextIndex] = newData;
            return updatedData;
        });
    };

    const handlePrevious = async () => {
        const prevIndex =
            currentCityIndex === 0 ? defaultCities.length - 1 : currentCityIndex - 1;
        setCurrentCityIndex(prevIndex);
        const newData = await fetchWeatherData(defaultCities[prevIndex]);
        setScrollerData((prev) => {
            const updatedData = [...prev];
            updatedData[prevIndex] = newData;
            return updatedData;
        });
    };

    const handleGoBack = () => {
        setIsHomePage(true); // Switch back to home page
        setWeatherData(null); // Clear searched city data
        const newIntervalId = setInterval(() => {
            handleNext();
        }, 4000); // Restart scroller
        setIntervalId(newIntervalId);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            const dataPromises = defaultCities.map((city) => fetchWeatherData(city));
            const results = await Promise.all(dataPromises);
            setScrollerData(results);
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (isHomePage) {
            const newIntervalId = setInterval(() => {
                handleNext();
            }, 4000); // Automatically scroll every 4 seconds
            setIntervalId(newIntervalId);
            return () => clearInterval(newIntervalId);
        }
    }, [isHomePage, currentCityIndex]);

    return (
        <div className="weather">
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder="Search" />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={handleSearch}
                />
            </div>

            {isHomePage ? (
                scrollerData.length > 0 && (
                    <div className="scroller">
                        <img
                            src={previous_icon}
                            alt="Previous"
                            onClick={handlePrevious}
                            className="scroller-button-icon scroller-previous"
                        />
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
                        <img
                            src={next_icon}
                            alt="Next"
                            onClick={handleNext}
                            className="scroller-button-icon scroller-next"
                        />
                    </div>
                )
            ) : (
                weatherData && (
                    <div className="weather">
                        <img
                            src={weatherData.icon}
                            alt=""
                            className="search-weather-icon"
                        />
                        <p className="search-temperature">{weatherData.temperature}°C</p>
                        <p className="search-location">{weatherData.location}</p>
                        <div className="search-details">
                            <div  className="search-detail-item">
                                <img src={humidity_icon} alt="Humidity Icon" />
                                
                                    <p>{weatherData.humidity}%</p>
                                    <span>Humidity</span>
                            </div>
                            <div className="search-detail-item">
                                <img src={wind_icon} alt="Wind Icon" />
                                
                                    <p>{weatherData.windSpeed} m/s</p>
                                    <span>Wind Speed</span>
                            
                            </div>
                        </div>

                        <button onClick={handleGoBack} className="go-back-button">
                            <img src={home} alt="Home" className="home-icon" />
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default WeatherWithSearch;
