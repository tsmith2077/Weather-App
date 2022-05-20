
let units = 'imperial';
async function fetchWeather (units='imperial', cityInput='london', countryInput) {
    let url;
    if (units == 'imperial') {
        url = 'http://api.openweathermap.org/data/2.5/weather?&units=imperial&id=524901&appid=b05b6371ed49813edf23793510616c5c&q='
        + cityInput;
    } else {
        url = 'http://api.openweathermap.org/data/2.5/weather?&units=metric&id=524901&appid=b05b6371ed49813edf23793510616c5c&q='
        + cityInput;
    }
    if (!countryInput == '') {
        url = url + ',' + countryInput;
    }
    const response = await fetch(url, {mode: 'cors'});
    const weatherData = await response.json();
    const city = weatherData.name;
    const weather = weatherData.weather[0].description
    const currentTemp = Math.round(weatherData.main.temp);
    const minTemp = Math.round(weatherData.main.temp_min);
    const maxTemp = Math.round(weatherData.main.temp_max);
    const tempRealFeel = Math.round(weatherData.main.feels_like);
    const wind = Math.round(weatherData.wind.speed)
    createObject(city, weather, currentTemp, minTemp, maxTemp, tempRealFeel, wind);
}

function createObject (city, weather, currentTemp, minTemp, maxTemp, tempRealFeel, wind) {
    let weatherObject = {};
    weatherObject.city = city;
    weatherObject.weather = weather;
    weatherObject.current = currentTemp;
    weatherObject.minTemp = minTemp;
    weatherObject.maxTemp = maxTemp;
    weatherObject.realFeel = tempRealFeel;
    weatherObject.wind = wind;
    appendObjectToDom(weatherObject);
};

function appendObjectToDom (weatherObject) {
    let cityDom = document.getElementById('city');
    let weatherDom = document.getElementById('weather');
    let currentTempDom = document.getElementById('currentTemp');
    let minTempDom = document.getElementById('minTemp');
    let maxTempDom = document.getElementById('maxTemp');
    let realFeelDom = document.getElementById('realFeel');
    let windDom = document.getElementById('wind');

    cityDom.textContent = weatherObject.city;
    weatherDom.textContent = capitalizeFirstLetter(weatherObject.weather);
    currentTempDom.textContent = weatherObject.current;
    minTempDom.textContent = 'Low: ' + weatherObject.minTemp;
    maxTempDom.textContent = 'High: ' + weatherObject.maxTemp;
    realFeelDom.textContent = 'Real Feel: ' + weatherObject.realFeel;
    windDom.textContent = 'Wind: ' + weatherObject.wind;

    if (units == 'imperial') {
        currentTempDom.textContent  += "\u00B0F";
        minTempDom.textContent += "\u00B0F";
        maxTempDom.textContent += "\u00B0F";
        realFeelDom.textContent += "\u00B0F";
        windDom.textContent += ' mph';
    } else {
        currentTempDom.textContent += "\u00B0C";
        minTempDom.textContent += "\u00B0C";
        maxTempDom.textContent += "\u00B0C";
        realFeelDom.textContent += "\u00B0C";
        windDom.textContent += ' kph';
    }
}

const toggleDegreesBtn = document.getElementById('toggleDegreesBtn');

toggleDegreesBtn.addEventListener('click', ()=> {
    let currentCity = document.getElementById('city').textContent;
    if (units == 'imperial') {
        units = 'metric';
    } else {
        units = 'imperial';
    }
    fetchWeather(units, currentCity);
})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const searchCity = document.getElementById('searchCity');
const searchCountry = document.getElementById('searchCountry');
const searchBtn = document.getElementById('searchBtn');

const searchInputs = document.getElementsByClassName("searchInput");
for (let i = 0; i < searchInputs.length; i++) {
    searchInputs[i].addEventListener("keypress", (e) => {
        if (e.key == 'Enter') {
            const cityInput = searchCity.value;
            const countryInput = searchCountry.value;
            fetchWeather(units, cityInput, countryInput);
        }
    });
}

searchBtn.addEventListener('click', ()=> {
    const cityInput = searchCity.value;
    const countryInput = searchCountry.value;
    fetchWeather(units, cityInput, countryInput);
})
fetchWeather();