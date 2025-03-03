let celsius = true;
let lightMode = true;

function changeUnits() {
    celsius = !celsius;
    getWeather();
}

function changeDisplayMode() {
    const body = document.getElementsByTagName('body')[0];
    lightMode = !lightMode;

    if(lightMode) {
        body.id = "light-mode";
    }
    else {
        body.id = "dark-mode";
    }
}

function getWeather() {
    const apiKey = '997a0f90429b482e11600de3033bd604';
    const city = document.getElementById('city').value;

    if(!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("Error fetching current weather data:", error);
            alert("Error fetching current weather data. Please try again.");
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error("Error fetching hourly forecast data:", error);
            alert("Error fetching hourly forecast data. Please try again.")
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    //Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if(data.cod === '404') {
        weatherInfoDiv.innerHTML = '<p>${data.message}</p>';
    }
    else {
        const cityName = data.name;
        let temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        if(!celsius) {
            temperature = Math.round((temperature * (9/5)) + 32);
        }

        const temperatureHTML = `
            <p>${temperature}º${celsius ? "C" : "F"}</p>
        `;

        const weatherHTML = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        let temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        if(!celsius) {
            temperature = Math.round((temperature * (9/5)) + 32);
        }

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    })
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}