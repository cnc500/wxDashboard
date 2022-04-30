var searchInput = document.querySelector(".searchInput");

function getCityCoordinates(city){
  var cityCoordinates = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid={d85962c1664d174ce508ae60dd8126a9}';
  fetch(cityCoordinates)
    .then(function(response){
        return response.json();
    })
    .then(function(results){
        var possiblePlaces = results; 
        if (possiblePlaces.country === '') {
            alert('Please enter a valid city in our database.');
        
        } else {
            for (var i = 0; i < possiblePlaces.country.length; i++) {
            var correctPlace = window.confirm('If your selected city is in ' + possiblePlaces.country[i] + ', then select pess OK.  Otherwise press cancel.');
                if (correctPlace) {
                    var lat = possiblePlaces.lat;
                    var long = possiblePlaces.long;
                    getWeather(lat, long);
                    return;
                }
            if (i === possiblePlaces.country.length) {
                alert('Please enter a valid city that is associated with a state or country in our database.');
            } 
            }
        } 
    })
}



searchInput.addEventListener('click',getCityCoordinates);