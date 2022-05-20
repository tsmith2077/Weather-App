let units = 'imperial';

// Dom elements for event listeners
const searchCity = document.getElementById('searchCity');
const searchCountry = document.getElementById('searchCountry');
const searchBtn = document.getElementById('searchBtn');
const toggleDegreesBtn = document.getElementById('toggleDegreesBtn');

// Min and Max aren't included on the forecast, so there's 2 seperate fetch requests
// Fetch current weather
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
    createTodayObject(weatherData);
}

// Fetch 5 day forecast weather
async function fetchDailyWeather (units='imperial', cityInput='london', countryInput) {
    let url;
    if (units == 'imperial') {
        url = 'http://api.openweathermap.org/data/2.5/forecast?&units=imperial&id=524901&appid=b05b6371ed49813edf23793510616c5c&q='
        + cityInput;
    } else {
        url = 'http://api.openweathermap.org/data/2.5/forecast?&units=metric&id=524901&appid=b05b6371ed49813edf23793510616c5c&q='
        + cityInput;
    }
    if (!countryInput == '') {
        url = url + ',' + countryInput;
    }
    const response = await fetch(url, {mode: 'cors'});
    const weatherData = await response.json();
    createForecastObjects(weatherData);
}

// Create Object for current day's forecast
function createTodayObject (weatherData) {
    let weatherObject = {};
    weatherObject.city = weatherData.name;
    weatherObject.weather = weatherData.weather[0].description;
    weatherObject.current = Math.round(weatherData.main.temp);
    weatherObject.minTemp = Math.round(weatherData.main.temp_min);
    weatherObject.maxTemp = Math.round(weatherData.main.temp_max);
    weatherObject.realFeel = Math.round(weatherData.main.feels_like);
    weatherObject.wind = Math.round(weatherData.wind.speed);
    appendTodayToDom(weatherObject);
};

// Create object for each day and push to dailyWeatherArr
function createForecastObjects (weatherData) {
    let dailyWeatherArr = []
    for (let i=0; i<weatherData.list.length; i++) {
        if (weatherData.list[i].dt_txt.includes('12:00:00') && !weatherData.list[i].dt_txt.includes(todaysDate(i))) {
            let dailyObject = {}
            dailyObject.date = formattedDate(weatherData.list[i].dt_txt);
            dailyObject.temp = weatherData.list[i].main.temp;
            dailyObject.icon = weatherData.list[i].weather[0].icon;
            dailyWeatherArr.push(dailyObject);
        };
    };
    appendForecastToDom(dailyWeatherArr);
};

// Append today's weather to DOM
function appendTodayToDom (weatherObject) {
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
    };
};

// Append daily forecasts to DOM
function appendForecastToDom (dailyWeatherArr) {
    const dailyCont = document.getElementById('dailyCont');
    dailyCont.innerHTML = "";
    for (let i=0; i<dailyWeatherArr.length; i++) {
        const thisDay = document.createElement('div');
        thisDay.classList.add('daily');
        
        let dateDom = document.createElement('p');
        dateDom.textContent = dailyWeatherArr[i].date;
        let iconDom = document.createElement('img')
        iconDom.src = "http://openweathermap.org/img/w/" + dailyWeatherArr[i].icon + ".png";
        let tempDom = document.createElement('p');
        tempDom.textContent = dailyWeatherArr[i].temp;
        
        if (units == 'imperial') {
            tempDom.textContent  += "\u00B0F";
        } else {
            tempDom.textContent += "\u00B0C";
        }
        
        thisDay.appendChild(dateDom);
        thisDay.appendChild(iconDom);
        thisDay.appendChild(tempDom);
        dailyCont.appendChild(thisDay);
    };
};

// Event Listeners
// Toggle Fahrenheight and Celcius outputs
toggleDegreesBtn.addEventListener('click', ()=> {
    let currentCity = document.getElementById('city').textContent;
    if (units == 'imperial') {
        units = 'metric';
    } else {
        units = 'imperial';
    };
    fetchWeather(units, currentCity);
    fetchDailyWeather(units, currentCity);
});

// Event Listener for hitting enter in search bar
const searchInputs = document.getElementsByClassName("searchInput");
for (let i = 0; i < searchInputs.length; i++) {
    searchInputs[i].addEventListener("keypress", (e) => {
        if (e.key == 'Enter') {
            const cityInput = searchCity.value;
            const countryInput = searchCountry.value;
            fetchWeather(units, cityInput, countryInput);
            fetchDailyWeather(units, cityInput, countryInput);
        };
    });
};

// Search Btn event listener
searchBtn.addEventListener('click', ()=> {
    const cityInput = searchCity.value;
    const countryInput = searchCountry.value;
    fetchWeather(units, cityInput, countryInput);
    fetchDailyWeather(units, cityInput, countryInput);
});

// Helper functions
const formattedDate = (unformattedDate) => {
    let dateInput = new Date(unformattedDate);
    const day = dateInput.getUTCDate();
    const month = dateInput.getUTCMonth() + 1; // Return Value is 0 indexed
    const year = dateInput.getUTCFullYear();
    let fullDate = month + "/" + day + "/" + year;
    return fullDate;
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const todaysDate = () => {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    return yourDate.toISOString().split('T')[0]
};

fetchWeather();
fetchDailyWeather();
