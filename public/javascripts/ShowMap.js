mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 13, // starting zoom
})

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

new mapboxgl.Marker({ color: 'black' })
.setLngLat( campground.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({offset: 25})
  .setHTML(
    `<h3>${campground.title}</h3><p>${campground.location}</p>`
  )
)
.addTo(map)
