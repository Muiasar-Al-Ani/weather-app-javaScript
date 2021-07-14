var userInputEl = document.getElementById("user-input");
var inputFormEl = document.getElementById("input-form");
var showingResultsDiv = document.getElementById("showing-results");
var citiesDiv = document.getElementById("cities");

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
      citiesDiv.innerHTML += `<button class="btn btn-primary w-100 my-1" type="button">${searchHistory[i]}</button>`;
    }
  }
};

var getWeatherApi = function (userInput) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    userInput +
    "&units=imperial&appid=09ce67c28c7fdad99dc9f81de13032bb";

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
    <div class="jumbotron">
    <h1 class="display-4">${data.city.name} (${moment
    .unix(data.list[0].dt)
    .format("MM/DD/YYYY")})</h1>
    <p class="lead">Temp: ${data.list[0].main.temp} &#8457; <br>Wind: ${
    data.list[0].wind.speed
  } MPH <br>Humidity: ${data.list[0].main.humidity}% <br> UV index: <span id='uvIndexEl'></span></p>
    
  </div>
  <div id="fiveDaysForcast"></div>`;
  renderUvIndex(
    data.city.coord.lat,
    data.city.coord.lon
  )
  renderFiveDaysForcast(data);
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${data.city.name}')`;
};

var renderUvIndex = function (lat, lon) {
  console.log(lat);
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=09ce67c28c7fdad99dc9f81de13032bb`;

 
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var uvIndex = data.current.uvi;
      document.getElementById('uvIndexEl').innerHTML = uvIndex < 3
    ? `<button type="button" class="btn btn-success">${uvIndex}</button>`
    : uvIndex > 6
    ? `<button type="button" class="btn btn-warning">${uvIndex}</button>`
    : `<button type="button" class="btn btn-danger">${uvIndex}</button>`;

    });
  
   
};



// 09ce67c28c7fdad99dc9f81de13032bb

//  api.openweathermap.org/data/2.5/forecast?q=raleigh&appid=09ce67c28c7fdad99dc9f81de13032bb

inputFormEl.addEventListener("submit", userFormHandler);
