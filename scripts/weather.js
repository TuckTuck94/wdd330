// Define variables
const titlePage = document.querySelector("h1");
const box = document.querySelector("#cards");
const search = document.querySelector("#searchBtn");
const userInput = document.querySelector("#zip");
const historySection = document.querySelector("#history");
const footer = document.querySelector("footer");

const API_KEY = "e935a5a6a1ec7a93d72d1fa9eceab7a2";

// Fetch weather data for a given location
async function getWeatherData(zip) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip}&appid=${API_KEY}&units=imperial`);
    const data = await response.json();
    updateWeatherDisplay(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Error fetching weather data. Please try again later.");
  }
}

// Update weather display with fetched data
function updateWeatherDisplay(data) {
  titlePage.textContent = `${data.city.name} Weather Forecast`;
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
  const zip = userInput.value;
  if (zip.trim() !== "") {
    getWeatherData(zip);
    saveHistory(zip);
  } else {
    alert("Please enter a zip code.");
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
    userInput.value = lastQuery[lastQuery.length - 1];
    getWeatherData(userInput.value);
  } else {
    alert("No previous search history found.");
  }
});

// Update footer with current year
footer.innerHTML = `&copy; ${new Date().getFullYear()} Weather Forecast App`;

// Fetch weather data for the initial location on page load
window.addEventListener("load", () => {
  const defaultZip = "73071"; // Set your default zip code here
  getWeatherData(defaultZip);
});
// Fetch weather data for the initial location on page load
window.addEventListener("load", () => {
  const defaultZip = "73071"; // Set your default zip code here
  getWeatherData(defaultZip);
});
