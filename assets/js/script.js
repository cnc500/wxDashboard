var searchInput = document.querySelector("#inputCity");
var searchBtn = document.querySelector("#searchBtn");
var currentDate = [];
console.log(searchInput);

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
                currentUV.setAttribute("style", "color: white; background-color: yellow");
            } else {
                currentUV.setAttribute("style", "color: white; display: block; background-color: red");
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
  
    }
}

searchBtn.addEventListener("click",function(event){
    event.preventDefault();
    getCityCoordinates(searchInput.value);
});