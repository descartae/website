require('whatwg-fetch')

function loadFacilities(callback){
    var query = " \
    { \
      facilities(filters:{cursor:{quantity:10}}) { \
        items { \
          location { \
            coordinates { \
              latitude \
              longitude \
            } \
          } \
        } \
      } \
    } \
    ";

    fetch('http://beta-api.descartae.com/graphql', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    })
    .then(function(response) { return response.json() })
    .then(function(data) {
        data = data.data
        if (data && data.facilities && data.facilities.items) {
            callback(data.facilities.items)
        }
    })
}

loadFacilities(function(facilities) {
    console.log(facilities[0].location.coordinates)
})