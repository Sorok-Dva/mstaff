let MapHelper = {};

MapHelper.initAutocompleteInput = (inputElement, autoSubmit) => {
	let autocomplete = new google.maps.places.Autocomplete(inputElement, {componentRestrictions: {country: ["fr", "gp", "mq", "gf", "re", "pm", "yt", "nc", "pf", "mf", "tf"]}});

	if(autoSubmit)
		autocomplete.addListener('place_changed', function(){
			$(inputElement).closest('form').submit();
		});
};

MapHelper.initResultMap = (mapElement, results, options) => {

	let map = new google.maps.Map(mapElement, {
		mapTypeControl: false,
		center: options.center ? options.center : null,
		zoom: options.zoom ? options.zoom : null
	});
	let info = new google.maps.InfoWindow({
		disableAutoPan: true
	});
	let bounds = options.fitMarkers ? new google.maps.LatLngBounds() : null;

	let markers = {};
	for(const resultsId in results){
		const result = results[resultsId];

		let marker = new google.maps.Marker({
			position: new google.maps.LatLng(result.lat, result.lng),
			map: map,
			icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png?id=' + result.id,
			optimized: false,
		});

		marker.addListener('mouseover', options.onMarkerMouseover ?
			function(){
				options.onMarkerMouseover(map, markers, info, results, resultsId);
			} :
			function(){
				info.open(map, marker);
				info.setContent('<h1 class="card__title title">' + result.name + '</h1>');
			});
		marker.addListener('mouseout', options.onMarkerMouseout ?
			function(){
				options.onMarkerMouseout(map, markers, info, results, resultsId);
			} :
			function(){
				info.close();
			});

		markers[resultsId] = marker;

		if(options.forEachMarker)
			options.forEachMarker(map, markers, info, results, resultsId);

		if(options.fitMarkers)
			bounds.extend(marker.position);
	}

	if(options.clusterize === undefined || options.clusterize)
		new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

	if(options.fitMarkers)
		map.fitBounds(bounds);

	if(options.onDragStart)
		map.addListener('dragstart', function(){
			options.onDragStart(map, info);
		});

	if(options.onBoundsChanged)
		map.addListener('bounds_changed', function(){
			options.onBoundsChanged(map, info);
		});

	if(options.onLoaded)
		google.maps.event.addListenerOnce(map, 'idle', function(){
			options.onLoaded(map, info);
		});

	if(options.onInit)
		options.onInit(map, info);

	return map;

};

MapHelper.fitRange = (map, center, range) => {
	let top = MapHelper.addDistance2LatLng({x: 0, y: range}, center);
	let bottom = MapHelper.addDistance2LatLng({x: 0, y: -range}, center);

	map.fitBounds(new google.maps.LatLngBounds(top, bottom));

	let circle = new google.maps.Circle({
		strokeColor: '#337AB7',
		strokeOpacity: 0.2,
		strokeWeight: 2,
		fillColor: '#5BBBE5',
		fillOpacity: 0.1,
		map: map,
		center: center,
		radius: range * 1000
	});
};

MapHelper.isMarkerVisible = (map, id) => {
	let $marker = $('img[src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png?id=' + id + '"]');

	if(!$marker.length)
		return false;

	let $map = $(map.getDiv());
	let mapOffset = $map.offset();
	let mapDimensions = {width: $map.width(), height: $map.height()};
	let markerOffset = $marker.offset();
	let markerDimensions = {width: $marker.innerWidth(), height: $marker.innerHeight()};

	return !(markerOffset.left > mapOffset.left + mapDimensions.width ||
		markerOffset.top > mapOffset.top + mapDimensions.height ||
		markerOffset.left + markerDimensions.width < mapOffset.left ||
		markerOffset.top + markerDimensions.height < mapOffset.top);


};

MapHelper.addDistance2LatLng = (distance, latLng) => {
	const earthRadius = 6371;
	return {
		lat: latLng.lat + MapHelper.rad2Deg(distance.y / earthRadius),
		lng: latLng.lng + MapHelper.rad2Deg(distance.x / earthRadius) / Math.cos(MapHelper.deg2Rad(latLng.lat))
	};
};

MapHelper.getMapHorizontalDistance = (map) => {
	const bounds = map.getBounds();
	const _ne = bounds.getNorthEast();
	const _sw = bounds.getSouthWest();
	const ne = {
		lat: _ne.lat(),
		lng: _ne.lng()
	};
	const se = {
		lat: ne.lat,
		lng: _sw.lng()
	};
	return MapHelper.getDistanceBetween2LatLng(ne, se);
};

MapHelper.getMapVerticalDistance = (map) => {
	const bounds = map.getBounds();
	const _ne = bounds.getNorthEast();
	const _sw = bounds.getSouthWest();
	const ne = {
		lat: _ne.lat(),
		lng: _ne.lng()
	};
	const nw = {
		lat: _sw.lat(),
		lng: ne.lng
	};
	return MapHelper.getDistanceBetween2LatLng(ne, nw);
};

MapHelper.getDistanceBetween2LatLng = (latLng1, latLng2) => {
	const earthRadius = 6371;
	let delta = {lat: MapHelper.deg2Rad(latLng2.lat - latLng1.lat), lng: MapHelper.deg2Rad(latLng2.lng - latLng1.lng)};
	let a =
		Math.sin(delta.lat/2) * Math.sin(delta.lat/2) +
		Math.cos(MapHelper.deg2Rad(latLng1.lat)) * Math.cos(MapHelper.deg2Rad(latLng2.lat)) *
		Math.sin(delta.lng/2) * Math.sin(delta.lng/2);
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return earthRadius * c;
};

MapHelper.rad2Deg = (rad) => {
	return rad * (180 / Math.PI);
};

MapHelper.deg2Rad = (deg) => {
	return deg * (Math.PI / 180);
};