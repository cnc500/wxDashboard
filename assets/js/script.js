$('#timer')
console.log($('#timer'))

function displayCureentDayTime() {
    var currentDateTime = moment().format("dddd, MMMM Do, YYYY  hh:mm:ss");
    $('#currentDayTime').text(currentDateTime);
    }
    // calls display displayCureentDayTime every second to display current
    // time every second
    setInterval(displayCureentDayTime, 1000);

    