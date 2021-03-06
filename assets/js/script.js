var searchInput = document.querySelector("#inputCity");
var searchBtn = document.querySelector("#searchBtn");
var searchCity = [];
var currentDate = [];
var savedCities = [];

// Upon startup, this function is executed to retrieve cities saved in local storage and 
// to display the as buttons beneath the city search butoon.
window.onload = displaySavedCityBtns;
function displaySavedCityBtns() {
    loadSavedCities();
    for (i = 0; i < savedCities.length; i++) {
        var savedCityBtn = document.createElement('button');
        var cityList=document.querySelector(".cityList");
        cityList.appendChild(savedCityBtn);
        savedCityBtn.textContent = savedCities[i];
        savedCityBtn.setAttribute("class", "backgroundColor btn col-md-12 mt-3 mb-1");
        savedCityBtn.addEventListener("click",function(event) {
            event.preventDefault();
            var buttonCity = event.target.innerText;
            getCityCoordinates(buttonCity);
        })
    }
}
    
//  This function retrieves and texts the current date in the current weather information box.
function displayCurrentDay() {
    var currentDate = moment().format("MMMM Do, YYYY");
    today.textContent=currentDate;
    }

// Using the OpenWeather API, this function retrieves the latitude and longitude of the city 
// that the user inputs provided that the input city is a valid city. It calls both the saveCity 
// and the getWeather functions.
function getCityCoordinates(inputCity){
  var cityCoordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + inputCity + '&limit=5&appid=f920eb96530d47ec338cb2c2b187f0b6';
  fetch(cityCoordinates)
    .then(function(response){
        response.json()
        .then(function(results){
            var possiblePlaces = results; 
            if (!possiblePlaces[0]) {
                alert('Please enter a valid city in our database.');
            } else {
                for (var i = 0; i < possiblePlaces.length; i++) {
                    var correctPlace = window.confirm('If your selected city is in ' + possiblePlaces[i].state + ', then select pess OK.  Otherwise press cancel.');
                    if (correctPlace) break;
                }
                if (correctPlace) {
                        var lat = possiblePlaces[i].lat;
                        var lon = possiblePlaces[i].lon;
                        searchCity = inputCity;
                        saveCity(inputCity);
                        getWeather(lat, lon);
                        return;
                    } else {
                        alert('Please enter a valid city that is associated with a state or country in our database.');
                    }
            } 
        })
    })
}

var validatedCity = document.querySelector(".cityName");
var today = document.querySelector(".today")
var currentTemperature= document.querySelector(".currentTemperature");
var currentHumidity = document.querySelector(".currentHumidity");
var currentWind = document.querySelector(".currentWind");
var currentUV = document.querySelector(".currentUV");
var currentIcon = document.querySelector(".currentWx");

// Using the OpenWeather API, the getweather function retrieves the weather information for the 
// latitude and longitude of the city selected.  This function also displays the current weather 
// information for the selected city including an appropriate weather icon also retrieved from 
// the OpenWeather API.  The UVI index retrieved is also color coded indicating whether the 
// UVI conditions are conditions are favorable (UVI less than 3), moderate (UVI from 3 up to 6), 
// or severe (UVI 6 and above). Finally, the getWeather function calls the forecast function 
// and passes into it the selected city's weather information. 
function getWeather(lat, lon) {
    var oneWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=f920eb96530d47ec338cb2c2b187f0b6";
    fetch(oneWeather)
      .then(function(response){
         response.json()
         .then(function(data) {
            var weather = data;
            validatedCity.textContent=searchCity;
            displayCurrentDay();
            currentTemperature.textContent="Temp " + weather.current.temp + " ??F";
            currentHumidity.textContent="Humidity: " + weather.current.humidity + " %";
            currentWind.textContent="Wind: " + weather.current.wind_speed + " MPH";
            var uvIndex = weather.current.uvi || weather.current.uv_index || 0;
            currentUV.textContent=uvIndex;
            if (uvIndex<3) {
                currentUV.setAttribute("style", "color: white; background-color: green");
            } else if (uvIndex>=3 && uvIndex<6) {
                currentUV.setAttribute("style", "color: blue; background-color: yellow");
            } else {
                currentUV.setAttribute("style", "color: white; background-color: red");
            }
            var iconUrl="https://openweathermap.org/img/wn/"+weather.current.weather[0].icon+".png";
            currentIcon.setAttribute("src",iconUrl);
            forecast(data.daily);
         })
      })
}

// The forecast function displays the next 5 days of forecasted weather information for the 
// selected city including an appropriate weather icon for each day forecasted from the 
// OpenWeather API. 
function forecast(daily) { 
    for (var i=1; i<6; i++) {
        var date = moment.unix(daily[i].dt).format("MMMM Do, YYYY");
        var forecastBox = document.getElementsByClassName("forecastDate")[i-1];
        forecastBox.textContent=date;
        var forecastWx = document.getElementsByClassName("forecastWxIcon")[i-1];
        var forecastIconUrl="http://openweathermap.org/img/wn/"+daily[i].weather[0].icon+".png";
        forecastWx.setAttribute("src", forecastIconUrl);
        var forecastTemperature = document.getElementsByClassName("forecastTemperature")[i-1];
        forecastTemperature.textContent="Temp " + daily[i].temp.day + " ??F";
        var forecastHumidity = document.getElementsByClassName("forecastHumidity")[i-1];
        forecastHumidity.textContent="Humidity: " + daily[i].humidity + " %";
        var forecastWind = document.getElementsByClassName("forecastWind")[i-1];
        forecastWind.textContent="Wind: " + daily[i].wind_speed + " MPH";

    }
}

//  Ater calling the function, loadSavedCities, the saveCity function checks to see if the 
//  input city has already been already saved in local storage or not. If it is not in local
//  storage, than it adds it to local storage as well as creates a button that the user can
//  click on in the future to call for that city's weather. Finally, it limits the number of 
//  cities that can be displayed and clicked on to 12. When an 13th city is saved, it deletes 
//  the oldest saved city button and the oldest city itself from local storage. 
function saveCity(inputCity) {
    loadSavedCities();
    if (!savedCities.includes(inputCity)) {
        var newCity = inputCity;
        savedCities.push(newCity);
        localStorage.setItem("savedCities", JSON.stringify(savedCities));
        var savedCityBtn = document.createElement('button');
        var cityList=document.querySelector(".cityList");
        cityList.appendChild(savedCityBtn);
        savedCityBtn.textContent = inputCity;
        savedCityBtn.addEventListener("click",function(event) {
            event.preventDefault();
            var buttonCity = inputCity;
            getCityCoordinates(buttonCity);
        })
        savedCityBtn.setAttribute("class", "backgroundColor btn col-md-12 mt-3 mb-1");
    }
    if (savedCities.length > 12) {
        savedCities.shift();
        localStorage.setItem("savedCities", JSON.stringify(savedCities));
        cityList.innerHTML = '';
        displaySavedCityBtns();
    }
}

//  If there are cities saved in local storage on the user's computer, then it retrieves 
//  them into the savedCities array.  If there are no cities saved in local storage on the 
//  user's computer, then it creates an empty array called savedCities. 
function loadSavedCities() {
if (localStorage.getItem("savedCities")) {
    var savedCitiesStr=localStorage.getItem("savedCities");
    savedCities = JSON.parse(savedCitiesStr);
  } else {
    savedCities = [];
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }
}

//  When the serach button is clicked, the getCityCoordinates function is called passing
//  into that function the user's input typed into the input box above the search button.
searchBtn.addEventListener("click",function(event){
    event.preventDefault();
    getCityCoordinates(searchInput.value);
});