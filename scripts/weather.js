// Define variables
const titlePage = document.querySelector("h1");
const box = document.querySelector("#cards");
const search = document.querySelector("#searchBtn");
const userInput = document.querySelector("#city");
const historySection = document.querySelector("#history");
const footer = document.querySelector("footer");

const API_KEY = "e935a5a6a1ec7a93d72d1fa9eceab7a2";

// Fetch weather data for a given location
async function getWeatherData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`);
    const data = await response.json();
    updateWeatherDisplay(data);
    saveHistory(city);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Error fetching weather data. Please try again later.");
  }
}

// Update weather display with fetched data
function updateWeatherDisplay(data) {
  const cityName = `${data.city.name}, ${data.city.country}`;
  titlePage.textContent = `${cityName} Weather Forecast`;
  box.innerHTML = ""; // Clear previous data

  data.list.slice(0, 7).forEach(dayData => {
    const date = new Date(dayData.dt * 1000);
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    const dateString = date.toLocaleString("en-US", { month: "short", day: "numeric" });
    const temp = dayData.main.temp.toFixed(1);
    const weatherIconSrc = `http://openweathermap.org/img/w/${dayData.weather[0].icon}.png`;

    const card = document.createElement("section");
    card.classList.add("card");
    card.innerHTML = `
      <h2>${dayName}, ${dateString}</h2>
      <p>${dayData.weather[0].description}</p>
      <img src="${weatherIconSrc}" alt="${dayData.weather[0].description}">
      <span class="temp">${temp} °F</span>
      <p>Humidity: ${dayData.main.humidity}%</p>
    `;
    box.appendChild(card);
  });
}

// Search button click event handler
search.addEventListener("click", () => {
  const city = userInput.value;
  if (city.trim() !== "") {
    getWeatherData(city);
  } else {
    alert("Please enter a city name.");
  }
});

// Save search history to localStorage
function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(city);
  history = history.slice(-3); // Keep only the last 3 searches
  localStorage.setItem("history", JSON.stringify(history));
  displayHistory(history);
}

// Display search history
function displayHistory(history) {
  historySection.innerHTML = "";
  history.forEach((city, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = city;
    listItem.addEventListener("click", () => {
      getWeatherData(city);
    });
    historySection.appendChild(listItem);
  });
}



// Update footer with current year
footer.innerHTML = `&copy; ${new Date().getFullYear()} Weather Forecast App`;

// Fetch weather data for the initial location on page load
window.addEventListener("load", () => {
  const defaultCity = "Norman"; // Set your default city name here
  getWeatherData(defaultCity);
});
