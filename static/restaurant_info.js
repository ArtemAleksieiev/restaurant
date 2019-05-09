let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});
/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiYXJ0ZW1za2kiLCJhIjoiY2p2N2Ficmw2MGR1MjRkbnRlcWxubjJiMiJ9.jkcoEHUQ-A-CdJvGlTy2sA',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}

/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  if (getParameterByName('user') == 'user') {
    fillCreateReviewHTML();
  }
  fillStars();
  fillRate();
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

fillStars = () => {
  const rtg = $('#my-data').data()
  if (rtg.rate > 0) {
    const stars = document.getElementById("stars");
    stars.innerHTML = getStars(rtg.rate);
  }
}

fillRate = () => {
  const rtg = $('#my-data').data()
  if (rtg.rate > 0) {
    const trate = document.getElementById("rate");
    trate.innerHTML = rtg.rate + ' out of 5 stars';
  }
}

getStars = (rating) => {

  // Round to nearest half
  const rate = Math.round(rating * 2) / 2;
  let output = [];

  // Append all the filled whole stars
  for (var i = rate; i >= 1; i--)
    output.push('<i class="fa fa-star" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  // If there is a half a star, append it
  if (i == .5) output.push('<i class="fa fa-star-half-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  // Fill the empty stars
  for (let i = (5 - rate); i >= 1; i--)
    output.push('<i class="fa fa-star-o" aria-hidden="true" style="color: gold;"></i>&nbsp;');

  return output.join('');

}

fillCreateReviewHTML = () => {
  const container = document.getElementById('form-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Create Review';
  container.appendChild(title);

  const f = document.createElement("form");
  f.setAttribute('method',"post");
  f.setAttribute('action',"");

  const label1 = document.createElement('p');
  label1.innerHTML = 'Name:';

  const i = document.createElement("input");
  i.setAttribute('type',"text");
  i.setAttribute('size',"30");
  i.setAttribute('name',"name");

  const label2 = document.createElement('p');
  label2.innerHTML = 'Comments:';

  const txtbox = document.createElement('textarea');
  txtbox.setAttribute('name', "comments");
  txtbox.setAttribute('rows', "20");
  txtbox.setAttribute('cols', "50");

  const br = document.createElement('p');

  const s = document.createElement("input");
  s.setAttribute('type',"submit");
  s.setAttribute('value',"Create");
  s.setAttribute('id',"review");

  f.appendChild(label1);
  f.appendChild(i);
  f.appendChild(label2);
  f.appendChild(txtbox);
  f.appendChild(br);
  f.appendChild(s);

  container.appendChild(f);
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews[0]) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

//$( "form" ).submit(function( event ) {

  //var formData = JSON.stringify($(this).serializeArray());
  //console.log(formData);
  //$.post("restaurant", formData, function(){
//	});
//  event.preventDefault();
//});

//var testForm = document.getElementById('test-form');
//  testForm.onsubmit = function(event) {
  //  event.preventDefault();
  //  var formElements = document.forms['test-form'].elements['Input1'].value;
    //var formData = new FormData(document.getElementById('test-form'));
  //  var formData = JSON.stringify($(this)).serializeArray();
  //  console.log(formData);
  //  self.restaurant.reviews[0].comments = formData.get('input1');
  //  console.log(self.restaurant.reviews);
  //}





/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
