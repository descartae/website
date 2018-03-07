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

function loadFacilities(callback){
    var query = " \
      query Facilities { \
        facilities(filters:{cursor:{quantity:10}}) { \
          items { \
            _id \
            location { \
              coordinates { \
                latitude \
                longitude \
              } \
            } \
          } \
        } \
      } \
    "

    runQuery(query, {}, function(err, data) {
      if (data && data.facilities && data.facilities.items) {
        callback(err, data.facilities.items)
      } else {
        callback(err)
      }
    })
}