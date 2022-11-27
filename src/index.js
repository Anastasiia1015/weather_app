let myKey = "bd3bb6534458ba51b48c49f5155745b6";
let city = document.querySelector("#searchInput");
let myDate = document.querySelector(".date");
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let temperature = document.querySelector("#degrees");
let tempvalue = Number(temperature.textContent);

function calcTime(offset) {
    // create Date object for current location
    let firstDate = new Date();
    let utc = firstDate.getTime() + (firstDate.getTimezoneOffset() * 60000);
    let newDate = new Date(utc + (3600000*(offset/3600)));
    return newDate;
}

function setInfo(response){
    temperature.textContent = (Math.round(response.data.main.temp));
    tempvalue = Number(temperature.textContent);
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
    let myDay = document.querySelector(".currentDay")
    myDay.textContent = days[day]
    let count = day;
    let idCount = 0;
    let daysList = document.querySelectorAll(".day")
    while(idCount !=5 ){
        if (count < 6 ){
            count += 1;
            let tempDay = daysList[idCount];
            tempDay.textContent = days[count];
            idCount +=1; 
        }
        else{
            count = 0;
        }
    }

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
    axios.get(cityWeatherUrl).then((response) => {setInfo(response); console.log(response)});
    console.log(city.value);

}
let tempElement = document.querySelector(".temperature")

function celsiousToFahranheit(temperature){
    return (temperature*9/5) + 32;
}
function convertDegrees(event){
    if(event.target.textContent === "Fahrenheit"){
        let fahranheit = celsiousToFahranheit(tempvalue);
        fahranheit = Math.floor(fahranheit);
        tempElement.innerHTML = `${fahranheit}°<span>F</span>`;
        event.target.textContent = "Celsius";
    } else {
        tempElement.innerHTML = `${tempvalue}°<span>C</span>`;
        event.target.textContent = "Fahrenheit";
    }
}
let search = document.querySelector(".search");
search.addEventListener("submit", changeCity);
let convertLink = document.querySelector("#convert");
convertLink.addEventListener("click", convertDegrees);


