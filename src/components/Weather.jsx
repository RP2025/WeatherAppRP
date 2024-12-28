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

    const [weatherData, setWeatherData] = useState(null); // Currently displayed weather data
    const [currentCityIndex, setCurrentCityIndex] = useState(0); // Current city index in scroller
    const [isHomePage, setIsHomePage] = useState(true); // Determines home scroller view
    const [intervalId, setIntervalId] = useState(null); // Scroller interval management

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

    // Fetch weather data for a specific city
    const fetchWeatherData = async (city) => {
        try {
            console.log(`[API] Calling API for city: ${city} at ${new Date().toLocaleString()}`);
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                console.log(`[API DISPLAY] Successfully fetched data for city: ${city} at ${new Date().toLocaleString()}`);
                const iconCode = data.weather[0]?.icon || '01d';
                const icon = allIcons[iconCode] || clear_icon;

                setWeatherData({
                    location: data.name,
                    temperature: Math.floor(data.main.temp - 273.15),
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    icon: icon,
                });
            } else {
                console.error(`[API Error] Failed to fetch data for city: ${city}. Message: ${data.message}`);
            }
        } catch (error) {
            console.error(`[API Error] An error occurred while fetching data for city: ${city}`, error);
        }
    };

    // Handle search for a specific city
    const handleSearch = async () => {
        const city = inputRef.current.value.trim();
        console.log(`[Action] Searching city: ${city} at ${new Date().toLocaleString()}`);
        if (!city) {
            alert('Please enter a valid city name.');
            return;
        }

        try {
            clearInterval(intervalId); // Stop scroller
            setIntervalId(null);
            console.log(`[Action] Scroller stopped for search at ${new Date().toLocaleString()}`);
            setIsHomePage(false); // Switch to searched city view
            await fetchWeatherData(city);
        } catch (error) {
            console.error('[Error] Search failed:', error);
        }
    };

   
    const handleNext = () => {
        clearInterval(intervalId); // Pause interval
        const nextIndex = (currentCityIndex + 1) % defaultCities.length;
        console.log(`[Action] Scroller moved to next city: ${defaultCities[nextIndex]} at ${new Date().toLocaleString()}`);
        setCurrentCityIndex(nextIndex);
        //fetchWeatherData(defaultCities[nextIndex]); // Fetch data for the next city
    };
    
    const handlePrevious = () => {
        clearInterval(intervalId); // Pause interval
        const prevIndex = currentCityIndex === 0 ? defaultCities.length - 1 : currentCityIndex - 1;
       console.log(`[Action] Scroller moved to previous city: ${defaultCities[prevIndex]} at ${new Date().toLocaleString()}`);
        setCurrentCityIndex(prevIndex);
        //fetchWeatherData(defaultCities[prevIndex]); // Fetch data for the previous city
    };
    


    // Handle "Go Back" button to return to home scroller
    const handleGoBack = () => {
        console.log(`[Action] Going back to scroller at ${new Date().toLocaleString()}`);
        clearInterval(intervalId); // Clear the interval
        setIntervalId(null); // Reset the interval ID
        setIsHomePage(true); // Switch back to home page view
        setCurrentCityIndex(0); // Reset to the first city
        fetchWeatherData(defaultCities[0]); // Fetch data for the first city
    };


    // Manage scroller interval and fetch data dynamically
    useEffect(() => {
        if (isHomePage) {
           // console.log(`---------------`);
            console.log(`[Action] Starting scroller with ${defaultCities[currentCityIndex]} at ${new Date().toLocaleString()}`);
           // console.log(`---------------`);
            fetchWeatherData(defaultCities[currentCityIndex]); // Fetch weather data for the current city
    
            const newIntervalId = setInterval(() => {
                setCurrentCityIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % defaultCities.length;
                    //console.log(`[Action] Scroller moved to next city: ${defaultCities[nextIndex]} at ${new Date().toLocaleString()}`);
                    // fetchWeatherData(defaultCities[nextIndex]); // Fetch weather data for the next city
                    return nextIndex;
                });
            }, 5000); // Scroll every 5 seconds
    
            setIntervalId(newIntervalId);
    
            return () => {
               // console.log(`[Action] Scroller stopped at ${new Date().toLocaleString()}`);
                clearInterval(newIntervalId); // Cleanup on unmount or page change
            };
        }
    }, [isHomePage, currentCityIndex]); // Depend on `currentCityIndex` to reset the interval
    


    return (
        <div className="weather">
            {/* Search Bar */}
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder="Search" />
                <img src={search_icon} alt="Search" onClick={handleSearch} />
            </div>

            {isHomePage ? (
                <div className="scroller">
                    {/* Previous Button */}
                    <img
                        src={previous_icon}
                        alt="Previous"
                        onClick={handlePrevious}
                        className="scroller-button-icon scroller-previous"
                    />
                    {/* Scroller Content */}
                    <div className="scroller-item">
                        <img
                            src={weatherData?.icon}
                            alt="Weather Icon"
                            className="scroller-weather-icon"
                        />
                        <p className="scroller-temperature">
                            {weatherData?.temperature}°C
                        </p>
                        <p className="scroller-location">{weatherData?.location}</p>
                        <div className="scroller-details">
                            <div className="scroller-detail-item">
                                <img src={humidity_icon} alt="Humidity Icon" />
                                <p>{weatherData?.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                            <div className="scroller-detail-item">
                                <img src={wind_icon} alt="Wind Icon" />
                                <p>{weatherData?.windSpeed} m/s</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                    {/* Next Button */}
                    <img
                        src={next_icon}
                        alt="Next"
                        onClick={handleNext}
                        className="scroller-button-icon scroller-next"
                    />
                </div>
            ) : (
                weatherData && (
                    <div className="search-item">
                        <img src={weatherData.icon} alt="Weather Icon" className="search-weather-icon" />
                        <p className="search-temperature">{weatherData.temperature}°C</p>
                        <p className="search-location">{weatherData.location}</p>
                        <div className="search-details">
                            <div className="search-detail-item">
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
