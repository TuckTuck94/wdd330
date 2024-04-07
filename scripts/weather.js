// Define variables
const titlePage = document.querySelector("h1");
const box = document.querySelector("#cards");
const search = document.querySelector("#searchBtn");
const userInput = document.querySelector("#city");
const historySection = document.querySelector("#history");
const footer = document.querySelector("footer");

const API_KEY = "TNWCLXHU27EZ9QVR9Y6XYQLHY";
const GEOLOCATION_API_KEY = "4d998f6f989b4eb6a8b6e94ca0c4ffc2";
const GEOLOCATION_API = `https://api.ipgeolocation.io/ipgeo?apiKey=${GEOLOCATION_API_KEY}`;
const WEATHER_API = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

// Fetch user's geolocation and get weather data
async function getWeatherByLocation() {
  try {
    const response = await fetch(GEOLOCATION_API);
    const { city } = await response.json();
    getLocalWeather(city);
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
    alert("Failed to determine your location. Please try again or enter a city manually.");
  }
}

// Fetch weather data for a given location
async function getLocalWeather(place) {
  try {
    const unit = "us"; // Fahrenheit (US units)
    const response = await fetch(`${WEATHER_API}${place}?unitGroup=${unit}&key=${API_KEY}`);
    const { resolvedAddress, days } = await response.json();
    updateWeatherDisplay(resolvedAddress, days);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Error fetching weather data. Please try again later.");
  }
}

// Update weather display with fetched data
function updateWeatherDisplay(address, days) {
  titlePage.textContent = `${address} Weather Forecast`;
  box.innerHTML = ""; // Clear previous data
  days.slice(0, 7).forEach((day) => {
    const card = document.createElement("section");
    card.classList.add("card");
    const date = new Date(day.datetime);
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    const dateString = date.toLocaleString("en-US", { month: "short", day: "numeric" });
    const temp = day.temp.toFixed(1);
    const weatherIconSrc = `images/${day.icon.replace(" ", "-")}.png`;

    card.innerHTML = `
      <h2>${dayName}, ${dateString}</h2>
      <p>${day.description}</p>
      <img src="${weatherIconSrc}" alt="${day.icon}">
      <span class="temp">${temp} °F</span>
      <p>Humidity: ${day.humidity}%</p>
    `;
    box.appendChild(card);
  });
}

// Search button click event handler
search.addEventListener("click", () => {
  const place = userInput.value;
  if (place.trim() !== "") {
    getLocalWeather(place);
    saveHistory(place);
  } else {
    alert("Please enter a city name.");
  }
});

// Save search history to localStorage
function saveHistory(userInput) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(userInput);
  localStorage.setItem("history", JSON.stringify(history));
}

// Display last search history
historySection.addEventListener("click", () => {
  const lastQuery = JSON.parse(localStorage.getItem("history"));
  if (lastQuery && lastQuery.length > 0) {
    document.querySelector("#qresult").textContent = lastQuery[lastQuery.length - 1];
  } else {
    alert("No previous search history found.");
  }
});

// Fetch weather data based on user's geolocation on page load
getWeatherByLocation();

// Update footer with current year
footer.innerHTML = `&copy; ${new Date().getFullYear()} Weather Forecast App`;
