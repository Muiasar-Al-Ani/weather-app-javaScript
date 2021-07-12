var userInputEl = document.getElementById('user-input')
var inputFormEl = document.getElementById('input-form')
var showingResultsDiv = document.getElementById('showing-results')
var citiesDiv = document.getElementById('cities')



var userFormHandler = function(event){
  event.preventDefault();

  var userInput = userInputEl.value.trim();

  if(localStorage.getItem('searchHistory') === null){
      localStorage.setItem('searchHistory', '[]')
  }

  var searchHistory = JSON.parse(localStorage.getItem('searchHistory'))
  searchHistory.unshift(userInput)

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

}



