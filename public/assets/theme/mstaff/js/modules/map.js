function initAutocompleteInput(input_element){
	let autocomplete = new google.maps.places.Autocomplete(input_element);
	autocomplete.setFields(['address_components', 'geometry']);

	autocomplete.addListener('place_changed', function(){
		let place = autocomplete.getPlace();

		if(!place.address_components || place.address_components.length === 0)
			return;

		$('input[name="address_components"]').val(JSON.stringify(place.address_components));
	});
}

function initResultMap(map_element, results, for_each_marker, callback){

	let map = new google.maps.Map(map_element, {
		mapTypeControl: false
	});
	let bounds = new google.maps.LatLngBounds();

	let markers = [];
	let infos = [];
	for(let i = 0; i < results.length; i++){
		let marker = new google.maps.Marker({
			position: new google.maps.LatLng(results[i].lat, results[i].lng),
			map: map
		});

		let info = new google.maps.InfoWindow({
			content: '<h1 class="card__title title">' + results[i].name + '</h1>',
			disableAutoPan: true
		});

		marker.addListener('mouseover', function(){
			info.open(map, marker);
		});
		marker.addListener('mouseout', function(){
			info.close();
		});

		if(for_each_marker){
			for_each_marker(marker, info, results[i], map);
		}

		bounds.extend(marker.position);
		markers.push(marker);
		infos.push(info);
	}

	new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
	map.fitBounds(bounds);

	if(callback)
		callback(map, infos);

}