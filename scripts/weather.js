const titlePage = document.querySelector("h1");
const box = document.querySelector("#cards");
const search = document.querySelector("#searchBtn");
const userInput = document.querySelector("#city");
const history = document.querySelector("#history");
const footer = document.querySelector("footer");

const API_KEY = "M8BWB7V6NYYNKB8RAY576LEP8";
const GEOLOCATION_API = "https://geolocation-db.com/json/";
const WEATHER_API =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

footer.innerHTML = `&copy; ${new Date().getFullYear()} Michael Tucker<br>WDD330 Final Project`;

async function getWeatherByLocation() {
  try {
    const response = await fetch(GEOLOCATION_API);
    const { city } = await response.json();
    getLocalWeather(city);
  } catch (error) {
    alert("Location not found");
  }
}

async function getLocalWeather(place) {
  try {
    const response = await fetch(
      `${WEATHER_API}${place}?unitGroup=us&key=${API_KEY}`
    );
    const { resolvedAddress, days } = await response.json();
    updateWeatherDisplay(resolvedAddress, days);
  } catch (error) {
    alert("Error fetching weather data");
  }
}

function updateWeatherDisplay(address, days) {
  titlePage.textContent = `${address} Weather Forecast`;
  box.innerHTML = ""; // Clear previous data
  days.slice(0, 7).forEach((day) => {
    const card = document.createElement("section");
    card.classList.add("card");
    const date = new Date(day.datetime);
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    const dateString = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });
    const tempFahrenheit = day.temp;
    const weatherIconSrc = `images/${day.icon.replace(" ", "-")}.png`;

    card.innerHTML = `
      <h2>${dayName}, ${dateString}</h2>
      <p>${day.description}</p>
      <img src="${weatherIconSrc}" alt="${day.icon}">
      <span class="temp">${tempFahrenheit.toFixed(1)} &deg;F</span>
      <p>Humidity: ${day.humidity}%</p>
    `;
    box.appendChild(card);
  });
}

search.addEventListener("click", () => {
  const place = userInput.value;
  getLocalWeather(place);
  saveHistory(place);
});

function saveHistory(userInput) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(userInput);
  localStorage.setItem("history", JSON.stringify(history));
}

history.addEventListener("click", () => {
  const lastQuery = JSON.parse(localStorage.getItem("history"));
  document.querySelector("#qresult").textContent = lastQuery;
});

getWeatherByLocation(); // Call the function to get weather based on user's location on page load
