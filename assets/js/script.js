var searchInput = document.querySelector("#inputCity");
var searchBtn = document.querySelector("#searchBtn");
var currentDate = [];
var savedCities = [];
console.log(searchInput);

window.onload = displaySavedCityBtns;
function displaySavedCityBtns() {
    if (localStorage.getItem("savedCities")) {
        savedCities = localStorage.getItem("savedCities");
      } else {
        localStorage.setItem("savedCities", '[]')
      }
    for (i = 0; i < savedCities.length; i++) {
        var savedCityBtn = document.createElement('button');
        var cityList=document.querySelector(".cityList");
        cityList.appendChild(savedCityBtn);
        savedCityBtn.textContent = savedCities[i];
        savedCityBtn.setAttribute("class", "backgroundColor btn col-md-12 mt-3 mb-1");
    
    }

}

function displayCurrentDay() {
    var currentDate = moment().format("MMMM Do, YYYY");
    today.textContent=currentDate;
    console.log(currentDate);
    // return currentDate;
    }

function getCityCoordinates(inputCity){
  var cityCoordinates = 'http://api.openweathermap.org/geo/1.0/direct?q=' + inputCity + '&limit=5&appid=f920eb96530d47ec338cb2c2b187f0b6';
//   var cityCoordinates = 'http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=f920eb96530d47ec338cb2c2b187f0b6';

  fetch(cityCoordinates)
    .then(function(response){
        response.json()
        .then(function(results){
            var possiblePlaces = results; 
            console.log(possiblePlaces);
            if (possiblePlaces.country === '') {
                alert('Please enter a valid city in our database.');
            } else {
                saveCity(inputCity);
                for (var i = 0; i < possiblePlaces.length; i++) {
                var correctPlace = window.confirm('If your selected city is in ' + possiblePlaces[i].state + ', then select pess OK.  Otherwise press cancel.');
                    if (correctPlace) {
                        var lat = possiblePlaces[i].lat;
                        var lon = possiblePlaces[i].lon;

                //    call some function to create ul for button with correct place and saving of correct place to local storage
                        getWeather(lat, lon);
                        return;
                    }
                if (i === possiblePlaces.country.length) {
                    alert('Please enter a valid city that is associated with a state or country in our database.');
                } 
                }
            } 
        })
    })
}

// getCityCoordinates();
var validatedCity = document.querySelector(".cityName");
var today = document.querySelector(".today")
var currentTemperature= document.querySelector(".currentTemperature");
var currentHumidity = document.querySelector(".currentHumidity");
var currentWind = document.querySelector(".currentWind");
var currentUV = document.querySelector(".currentUV");
var currentIcon = document.querySelector(".currentWx");

function getWeather(lat, lon) {
    var oneWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=f920eb96530d47ec338cb2c2b187f0b6";
    fetch(oneWeather)
      .then(function(response){
         response.json()
         .then(function(data) {
            console.log(data);
            var weather = data;
            validatedCity.textContent=searchInput.value;
            displayCurrentDay();
            currentTemperature.textContent="Temp " + weather.current.temp + " °F";
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
            console.log(uvIndex);
            var iconUrl="http://openweathermap.org/img/wn/"+weather.current.weather[0].icon+".png";
            currentIcon.setAttribute("src",iconUrl);
            forecast(data.daily);
         })
      })
}


function forecast(daily) { 
    console.log(daily);
    for (var i=1; i<6; i++) {
        console.log("daily:");
        console.log(daily[i].dt);
        var date = moment.unix(daily[i].dt).format("MMMM Do, YYYY");
        console.log(date);
        console.log(document.getElementsByClassName("forecastDate")[i-1]);
        var forecastBox = document.getElementsByClassName("forecastDate")[i-1];
        forecastBox.textContent=date;
        // let date = daily[i].
        // var forecastDate = moment().format("MMMM Do, YYYY");
        var forecastWx = document.getElementsByClassName("forecastWxIcon")[i-1];
        console.log(daily[i].weather[0]);
        var forecastIconUrl="http://openweathermap.org/img/wn/"+daily[i].weather[0].icon+".png";
        forecastWx.setAttribute("src", forecastIconUrl);
        var forecastTemperature = document.getElementsByClassName("forecastTemperature")[i-1];
        forecastTemperature.textContent="Temp " + daily[i].temp.day + " °F";
        var forecastHumidity = document.getElementsByClassName("forecastHumidity")[i-1];
        forecastHumidity.textContent="Humidity: " + daily[i].humidity + " %";
        var forecastWind = document.getElementsByClassName("forecastWind")[i-1];
        forecastWind.textContent="Wind: " + daily[i].wind_speed + " MPH";

    }
}


function saveCity(inputCity) {
    console.log(inputCity);
    if (!savedCities.includes(inputCity)) {
        var newCity = inputCity;
        savedCities.push(newCity);
        console.log(savedCities);
    }
    localStorage.setItem("savedCities",inputCity);
    // localStorage.getItem("inputCity");
    // console.log(localStorage.getItem("inputCity"));
    // for (i = 0; i < savedCities.length; i++) {}
    var savedCityBtn = document.createElement('button');
    var cityList=document.querySelector(".cityList");
    cityList.appendChild(savedCityBtn);
    savedCityBtn.textContent =inputCity;
    savedCityBtn.setAttribute("class", "backgroundColor btn col-md-12 mt-3 mb-1");
 }

searchBtn.addEventListener("click",function(event){
    event.preventDefault();
    getCityCoordinates(searchInput.value);
});