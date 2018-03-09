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
      const data = response.data
      const errors = response.errors
      callback(errors, data)
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