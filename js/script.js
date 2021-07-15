// Added the variables for the elements queries that will be used.
var userInputEl = document.getElementById("user-input");
var inputFormEl = document.getElementById("input-form");
var showingResultsDiv = document.getElementById("showing-results");
var citiesDiv = document.getElementById("cities");
var apiKey = "09ce67c28c7fdad99dc9f81de13032bb";

// Added a userFormHandler function that will take the user input and save it in the local storage.
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

// Added a renderHistory function that will parse the local storage and render a button for each of the search history saved in the local storage
var renderHistory = function () {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

  citiesDiv.innerHTML = "";
  for (var i = 0; i < searchHistory.length && i < 8; i++) {
    if (searchHistory[i] !== "") {
      citiesDiv.innerHTML += `<button class="btn btn-primary bg-gradient w-100 my-1" data-city='${searchHistory[i]}' type="button">${searchHistory[i]}</button>`;
    }
  }
};

// Added a getWeatherApi function that will make an api call and get the weather data needed
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

// Added a renderJumbotron function that will get the data from the api call and render it in a jumbotron and will make a call to renderUvIndex function that will fetch and render the uvIndex button
var renderJumbotron = function (data) {
  showingResultsDiv.innerHTML = `
    <div class="jumbotron p-3 m-3 bg-dark bg-gradient rounded">
    <h1>
    ${data.city.name} (${moment.unix(data.list[0].dt).format("MM/DD/YYYY")})
    </h1>
    <p class="lead">Temp: ${data.list[0].main.temp} &#8457; <br>
    Wind: ${data.list[0].wind.speed} MPH <br>
    Humidity: ${data.list[0].main.humidity}% <br>
    UV index: <span id='uvIndexEl'></span></p>
    
  </div>
  <h1 class='text-white ms-3'>5-Day Forecast:</h1>
  <div id="fiveDaysForecast" class="row d-flex justify-content-around p-3"></div>`;
  renderUvIndex(data.city.coord.lat, data.city.coord.lon);
  renderFiveDaysForecast(data);
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${data.city.name}')`;
};

// Added the renderUvIndex funtion that will make an api call to get the uv index and will render a button for it depends on the condition
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


// Added renderFiveDaysForecast function that will create 5 cards for each day weather forecast
var renderFiveDaysForecast = function (data) {
  var neededWeather = [1, 6, 14, 22, 30];
  for (var i = 0; i < neededWeather.length; i++) {
    var icon = `https://openweathermap.org/img/w/${
      data.list[neededWeather[i]].weather[0].icon
    }.png`;

    document.getElementById("fiveDaysForecast").innerHTML += `
    <div class="card col-lg-2 col-md-5 mt-5 bg-dark bg-gradient text-white customCard" >
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

// Added buttonClickHandler handler that will render the targeted button city
var buttonClickHandler = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getWeatherApi(city);
  }
};

// Added eventListeners
citiesDiv.addEventListener("click", buttonClickHandler);
inputFormEl.addEventListener("submit", userFormHandler);
