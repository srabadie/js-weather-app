const Base_URL = "https://api.openweathermap.org/data/2.5";
const URL_Key = "0fb8ce9814c5c6b3800b682790dce679";
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const locationIcon = document.getElementById("location");
const forecastContainer = document.getElementById("forecast");

const weatherByName = async (city) => {
  const url = `${Base_URL}/weather?q=${city}&appid=${URL_Key}&units=metric`;
  const response = await fetch(url);
  const result = await response.json();
  return result;
};

const forcastByName = async (city) => {
  const url = `${Base_URL}/forecast?q=${city}&appid=${URL_Key}&units=metric`;
  const response = await fetch(url);
  const result = await response.json();
  return result;
};

const weatherByCordinate = async (lat, lon) => {
  const url = `${Base_URL}/weather?lat=${lat}&lon=${lon}&appid=${URL_Key}&units=metric`;
  const response = await fetch(url);
  const result = await response.json();
  return result;
};
const forecastByCordinate = async (lat, lon) => {
  const url = `${Base_URL}/forecast?lat=${lat}&lon=${lon}&appid=${URL_Key}&units=metric`;
  const response = await fetch(url);
  const result = await response.json();
  return result;
};

const renderWeatherData = (data) => {
  const weatherJSx = `
  <h1>${data.name}, ${data.sys.country}</h1>
  <div id="info">
    <img id="icon-img" alt="weather icon" src="https://openweathermap.org/img/w/${
      data.weather[0].icon
    }.png"/>
    <span>${data.weather[0].main}</span>
    <p>${Math.round(data.main.temp)}°C</p>
  </div>
  <div id="info-two">
    <p >Humidity:<span>${data.main.humidity}%</span></p>
    <p>Wind speed:<span>${data.wind.speed}m/s</span></p>
  </div>`;
  weatherContainer.innerHTML = weatherJSx;
};

const getWeekDay = (date) => {
  return DAYS[new Date(date * 1000).getDay()];
};

const renderForcastWeather = (data) => {
  // console.log(data)
  forecastContainer.innerHTML=""
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  data.forEach((i) => {
    const forecastJsx = `
    <div>
      <img id="icon-img" alt="weather icon" src="https://openweathermap.org/img/w/${
        i.weather[0].icon
      }.png">
      <h3>${getWeekDay(i.dt)}</h3>
      <p>${Math.round(i.main.temp)} °C</p>
      <span>${i.weather[0].main}</span>
    </div>
    `;
    forecastContainer.innerHTML += forecastJsx;
  });
};

const buttonHandeler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    alert("please enter city name!");
  }
  const weatherData = await weatherByName(cityName);
  renderWeatherData(weatherData);
  const forcastData = await forcastByName(cityName);
  renderForcastWeather(forcastData);
};

const positionCallback = async (position) => {
  const { latitude, longitude } = position.coords;
  // console.log(position);
  const curentData = await weatherByCordinate(latitude, longitude);
  renderWeatherData(curentData);
  const forecastData=await forecastByCordinate(latitude,longitude)
  renderForcastWeather(forecastData)
};
const errorCallback = (error) => {
  console.log(error.mesage);
};
const locationHandeler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    alert("your browser does not support geolocation");
  }
};

searchButton.addEventListener("click", buttonHandeler);
locationIcon.addEventListener("click", locationHandeler);
