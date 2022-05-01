var searchInput = document.querySelector(".searchInput");
console.log(searchInput);

function getCityCoordinates(inputCity){
//   var cityCoordinates = 'http://api.openweathermap.org/geo/1.0/direct?q=' + inputCity + '&limit=5&appid=f920eb96530d47ec338cb2c2b187f0b6';
  var cityCoordinates = 'http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=f920eb96530d47ec338cb2c2b187f0b6';

  fetch(cityCoordinates)
    .then(function(response){
        return response.json();
        console.log(response.json());
    })
    .then(function(results){
        var possiblePlaces = results; 
        consolelog(possiblePlaces);
        if (possiblePlaces.country === '') {
            alert('Please enter a valid city in our database.');
        } else {
            for (var i = 0; i < possiblePlaces.country.length; i++) {
            var correctPlace = window.confirm('If your selected city is in ' + possiblePlaces.country[i] + ', then select pess OK.  Otherwise press cancel.');
                if (correctPlace) {
                    var lat = possiblePlaces.lat;
                    var lon = possiblePlaces.long;
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
}

function getWeather(lat, lon) {
    var oneWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=f920eb96530d47ec338cb2c2b187f0b6";
    fetch.get(oneWeather)
      .then(function(response){
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        var weather = data;

      })
}


searchInput.addEventListener("submit",getCityCoordinates);