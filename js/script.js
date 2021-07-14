var userInputEl = document.getElementById("user-input");
var inputFormEl = document.getElementById("input-form");
var showingResultsDiv = document.getElementById("showing-results");
var citiesDiv = document.getElementById("cities");
var apiKey = "09ce67c28c7fdad99dc9f81de13032bb";

var userFormHandler = function (event) {
  event.preventDefault();

  var userInput = userInputEl.value.trim();

  if (localStorage.getItem("searchHistory") === null) {
    localStorage.setItem("searchHistory", "[]");
  }

  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  searchHistory.unshift(userInput);

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  userInputEl.value = "";

  renderHistory();
  getWeatherApi(userInput);
};

var renderHistory = function () {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

  citiesDiv.innerHTML = "";
  for (var i = 0; i < searchHistory.length; i++) {
    if (searchHistory[i] !== "") {
      citiesDiv.innerHTML += `<button class="btn btn-primary bg-gradient w-100 my-1" data-city='${searchHistory[i]}' type="button">${searchHistory[i]}</button>`;
    }
  }
};

var getWeatherApi = function (userInput) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    userInput +
    "&units=imperial&appid=" +
    apiKey;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderJumbotron(data);
    });
};

var renderJumbotron = function (data) {
  showingResultsDiv.innerHTML = `
    <div class="jumbotron p-3 m-3 bg-dark bg-gradient rounded">
    <h1>${data.city.name} (${moment
    .unix(data.list[0].dt)
    .format("MM/DD/YYYY")})</h1>
    <p class="lead">Temp: ${data.list[0].main.temp} &#8457; <br>Wind: ${
    data.list[0].wind.speed
  } MPH <br>Humidity: ${
    data.list[0].main.humidity
  }% <br> UV index: <span id='uvIndexEl'></span></p>
    
  </div>
  <div id="fiveDaysForecast" class="row d-flex justify-content-around p-3"></div>`;
  renderUvIndex(data.city.coord.lat, data.city.coord.lon);
  renderFiveDaysForecast(data);
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${data.city.name}')`;
};

var renderUvIndex = function (lat, lon) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var uvIndex = data.current.uvi;
      document.getElementById("uvIndexEl").innerHTML =
        uvIndex < 3
          ? `<button type="button" class="btn btn-success bg-gradient">${uvIndex}</button>`
          : uvIndex < 6
          ? `<button type="button" class="btn btn-warning bg-gradient">${uvIndex}</button>`
          : `<button type="button" class="btn btn-danger bg-gradient">${uvIndex}</button>`;
    });
};

var renderFiveDaysForecast = function (data) {
  var neededWeather = [1, 6, 14, 22, 30];
  for (var i = 0; i < neededWeather.length; i++) {
    var icon = `https://openweathermap.org/img/w/${
      data.list[neededWeather[i]].weather[0].icon
    }.png`;

    document.getElementById("fiveDaysForecast").innerHTML += `
    <div class="card col-2 mt-5 bg-dark bg-gradient text-white customCard" >
    <div class="card-body">
      <h5 class="card-title">${moment
        .unix(data.list[neededWeather[i]].dt)
        .format("MM/DD/YYYY")}</h5><br>
        <img src="${icon}"/>
        <p>Temp: ${data.list[neededWeather[i]].main.temp} &#8457; <br>
        Wind: ${data.list[neededWeather[i]].wind.speed} MPH <br>
        Humidity: ${data.list[neededWeather[i]].main.humidity}%</p>
    </div>
  </div>`;
  }
};

var buttonClickHandler = function(event){
  var city = event.target.getAttribute('data-city')
  if(city){
    getWeatherApi(city);
  }
}
citiesDiv.addEventListener('click', buttonClickHandler);
// 09ce67c28c7fdad99dc9f81de13032bb

//  api.openweathermap.org/data/2.5/forecast?q=raleigh&appid=09ce67c28c7fdad99dc9f81de13032bb

inputFormEl.addEventListener("submit", userFormHandler);
