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
    citiesDiv.innerHTML += `<button class="btn btn-primary w-100 my-1" type="button">${searchHistory[i]}</button>`;
  }
};

var getWeatherApi = function (userInput) {
  var requestUrl =
    "api.openweathermap.org/data/2.5/forecast?q=" +
    userInput +
    "&units=imperial&appid=09ce67c28c7fdad99dc9f81de13032bb";

    fetch(requestUrl).then(function(response){
        return response.json()
    }).then(function(data){
        renderJumbotron(data)
    })
};



// 09ce67c28c7fdad99dc9f81de13032bb

//  api.openweathermap.org/data/2.5/forecast?q=raleigh&appid=09ce67c28c7fdad99dc9f81de13032bb

inputFormEl.addEventListener("submit", userFormHandler);
