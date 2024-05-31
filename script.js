let currCity = "New York";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');

// Search
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // Prevent default action
    e.preventDefault();
    // Change current city
    currCity = search.value;
  
    // Get weather forecast 
    getWeather();
    // Clear form
    search.value = "";
});

// Units
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        // Change to metric
        units = "metric";
        // Get weather forecast 
        getWeather();
    }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        // Change to imperial
        units = "imperial";
        // Get weather forecast 
        getWeather();
    }
});

// Function to capitalize the first letter of each word in a string
function capitalizeFirstLetters(string) {
    return string.replace(/\b\w/g, match => match.toUpperCase());
}

function getWeatherIconUrl(iconCode) {
    // Define the base URL for the icons folder
    const baseURL = 'C:/Users/Student/Desktop/Mod 2/CIS302/Week 12/WeatherApp/weatherapp/svg/';

    // Define a mapping between weather condition codes and icon filenames
    const iconMap = {
        "03d": "wi-sunny.svg", // Day Clear
        "02d": "wi-cloud.svg", // Day Cloudy
        "01d": "wi-cloudy.svg", // Cloudy
        "10d": "wi-rain.svg", // Day Rain 
        "13d": "wi-snow.svg" // Day Snow
        // Add more mappings for other weather conditions as needed
    };

    // Check if the icon code exists in the mapping
    if (iconCode in iconMap) {
        return baseURL + iconMap[iconCode];
    } else {
        // If the icon code is not found, return a default icon URL or handle the case as needed
        return baseURL + "wi-day-sunny-overcast.svg"; // Adjust this to your actual default icon file
    }
}



// Function to convert timestamp to human-readable format
function convertTimeStamp(timestamp, timezone) {
    const convertTimezone = timezone / 3600; // Convert seconds to hours 

    const date = new Date(timestamp * 1000);
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    };
    return date.toLocaleString("en-US", options);
}

// Function to fetch weather data from OpenWeatherMap API
async function fetchWeatherData(cityName, units) {
    const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${units}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Unable to fetch weather data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to update weather information on the webpage
async function updateWeather() {
    try {
        const weatherData = await fetchWeatherData(currCity, units);
        if (weatherData) {
            city.textContent = capitalizeFirstLetters(weatherData.name);
            datetime.textContent = convertTimeStamp(weatherData.dt, weatherData.timezone);
            let weatherDescription = capitalizeFirstLetters(weatherData.weather[0].description);
            weather__forecast.textContent = weatherDescription;
            weather__temperature.textContent = `${weatherData.main.temp.toFixed()}°${units === "imperial" ? "F" : "C"}`;
            let iconUrl = getWeatherIconUrl(weatherData.weather[0].icon);
            weather__icon.innerHTML = `<img src="${iconUrl}" alt="Weather Icon" />`;
            weather__minmax.innerHTML = `Min: ${weatherData.main.temp_min.toFixed()}°${units === "imperial" ? "F" : "C"} - Max: ${weatherData.main.temp_max.toFixed()}°${units === "imperial" ? "F" : "C"}`;
            weather__realfeel.textContent = `${weatherData.main.feels_like.toFixed()}°${units === "imperial" ? "F" : "C"}`;
            weather__humidity.textContent = `${weatherData.main.humidity}%`;
            weather__wind.textContent = `${weatherData.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
        }
    } catch (error) {
        console.error('Error updating weather:', error);
        // Display error message on the UI
    }
}

// Get weather data and update UI
function getWeather() {
    updateWeather();
}

// Call the updateWeather function when the page loads
window.onload = function() {
    updateWeather();
};
