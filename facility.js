require('whatwg-fetch')

function runQuery(query, variables, callback) {
  fetch('https://beta-api.descartae.com/graphql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  })
    .then(function(response) { return response.json() })
    .then(function(response) {
        data = response.data
        errors = response.errors
        callback(errors, data)
    })
}

function loadFacility(id, callback){
  var query = " \
    query Facility ($id: ID!) { \
      facility(_id: $id) { \
        _id \
        name \
        website \
        telephone \
        typesOfWaste { \
          _id \
          name \
          color \
        } \
        openHours { \
          dayOfWeek \
          startTime \
          endTime \
        } \
        location { \
          address \
          municipality \
          state \
          zip \
          coordinates { \
            latitude \
            longitude \
          } \
        } \
      } \
    } \
  "

  runQuery(query, { id }, function(err, data) {
    if (data && data.facility) {
      callback(err, data.facility)
    } else {
      callback(err)
    }
  })
}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

document.addEventListener('DOMContentLoaded', function() {           
    loadFacility(
      getQueryParams(document.location.search).id,
      function(err, data){
          
          document.getElementById("facility_name").textContent = data.name;
          document.getElementById("facility_address").textContent = data.location.address + " - " + data.location.municipality + "/" + data.location.state;
        
          var week = {SUNDAY: "Domingo", MONDAY: "Segunda-Feira", TUESDAY: "Terça-Feira", WEDNESDAY: "Quarta-Feira", THURDASY: "Quinta-Feira", FRIDAY: "Sexta-Feira", SATURDAY: "Sábado"}
          
          var openHours = "";                              
          for (x = 0; x < data.openHours.length; x++) {
              openHours += week[data.openHours[x].dayOfWeek] + ": " + data.openHours[x].startTime + " - " + data.openHours[x].endTime + "\r\n";              
          }
          
            document.getElementById("facility_openHours").textContent = openHours;          
            document.getElementById("facility_telephone").textContent = data.telephone;          
          
            var uluru = {lat: data.location.coordinates.latitude, lng: data.location.coordinates.longitude};          
            var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 14,
              center: uluru
            });
            var marker = new google.maps.Marker({
              position: uluru,
              map: map
            });
      }
    )
}, false);