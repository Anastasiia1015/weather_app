let myKey = "bd3bb6534458ba51b48c49f5155745b6";
let city = document.querySelector("#searchInput");
let myDate = document.querySelector(".date");
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let temperature = document.querySelector("#degrees");
let tempvalue = Number(temperature.textContent);
let description = document.querySelector("#description");
let humidityValue = document.querySelector("#humidity_value");
let windSpeed = document.querySelector("#wind_speed");
let mainImage = document.querySelector("#main_image");

function calcTime(offset) {
    // create Date object for current location
    let firstDate = new Date();
    let utc = firstDate.getTime() + (firstDate.getTimezoneOffset() * 60000);
    let newDate = new Date(utc + (3600000*(offset/3600)));
    return newDate;
}
function formatDay(tempDate){
    let date = new Date(tempDate * 1000);
    let day = date.getDay();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
        "Saturday"]
    return days[day];
}
function displayForecast(response){
    console.log(response.data.daily)
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast")
    let forecastHTMl = "";
    forecast.forEach(function(forecastDay, index){
        if (index > 0 && index<6){
        forecastHTMl += `
    <div class="col dailyForecast">
        <p class="day" >
        ${formatDay(forecastDay.dt)}
        </p>
        <img src="images/${forecastDay.weather[0].icon}.png" alt="sun" id = "dailyIcon">
        <div class="forecastTemp">
            <span class="minTemp">${Math.round(forecastDay.temp.max)}°</span>
            <span class="maxTemp">${Math.round(forecastDay.temp.min)}°</span>
        </div>
    </div>`}
    })
    
 
    forecastElement.innerHTML = forecastHTMl;
}

function getForecast(coordinates) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${myKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}

function setInfo(response){
    mainImage.setAttribute("src", `images/${response.data.weather[0].icon}.png` );
    description.textContent = response.data.weather[0].description;
    humidityValue.textContent = response.data.main.humidity;
    windSpeed.textContent = response.data.wind.speed;
    let currenttemp = (Math.round(response.data.main.temp));
    tempElement.innerHTML = `<span id="degrees">${currenttemp}°</span><span>C</span>`;
    tempvalue = Number(currenttemp);
    let currentCity = response.data.name;
    document.querySelector(".city").textContent = currentCity;
    let timezone = response.data.timezone;
    let time = calcTime(timezone);
    let date = time.getDate()
    let month = time.getMonth();
    let day = time.getDay();
    let year = time.getFullYear();
    myDate.textContent = `${date}.${month+1}.${year}`;
    let myTime = document.querySelector(".time");
    myTime.textContent = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
    convertLink.textContent = "Fahrenheit" ;
    getForecast(response.data.coord);
    
}

if ('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition);
} else {
    alert("your browser does not support geolocation");
}

function setPosition(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myKey}&units=metric`;
    axios.get(weatherUrl).then((response) => {setInfo(response)});
}


function changeCity(event) {
    event.preventDefault();
    let cityWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${myKey}&units=metric`;
    axios.get(cityWeatherUrl).then((response) => {setInfo(response)});
}
let tempElement = document.querySelector(".temperature")

function celsiousToFahranheit(temperature){
    return (temperature*9/5) + 32;
}
function convertDegrees(event){
    if(event.target.textContent === "Fahrenheit"){
        let fahranheit = celsiousToFahranheit(tempvalue);
        fahranheit = Math.floor(fahranheit);
        tempElement.innerHTML = `<span id="degrees">${fahranheit}°</span><span>F</span>`;
        event.target.textContent = "Celsius";
    } else {
        tempElement.innerHTML = `<span id="degrees">${tempvalue}°</span><span>C</span>`;
        event.target.textContent = "Fahrenheit";
    }
}
let search = document.querySelector(".search");
search.addEventListener("submit", changeCity);
let convertLink = document.querySelector("#convert");
convertLink.addEventListener("click", convertDegrees);

