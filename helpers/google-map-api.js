const apiKey = 'AIzaSyBMyQuBw8EQ6YixI2_Fxbw_OSmyVnnVocI';

const request = require('request-promise');

module.exports.getKeyMap = () => {
  return {
    street_number: 'street_number',
    street_name: 'route',
    city: 'locality',
    department: 'administrative_area_level_2',
    region: 'administrative_area_level_1',
    country: 'country',
    postal_code: 'postal_code'
  };
};

module.exports.getLabelMap = () => {
  return {
    street_number: 'Numéro',
    street_name: 'Route',
    city: 'Ville',
    department: 'Département',
    region: 'Région',
    country: 'Pays',
    postal_code: 'Code postal'
  };
};

module.exports.geocode = async address => {
  try {
    const response = await request('https://maps.googleapis.com/maps/api/geocode/json?key=' + apiKey + '&address=' + address);

    if (response.status !== 'OK')
      return Promise.reject({ status: response.status });

    return Promise.resolve(JSON.parse(response));

  } catch ( error ){
    return Promise.reject({ status: 'UNEXPECTED_ERROR', error: error });
  }
};

module.exports.formatResponse = response => {
  if (!response.results || !response.results.length || response.results.length !== 1 || !response.results[0].address_components)
    throw new Error('GEOCODING_RESULTS_ERROR');
  if (!response.results[0].geometry || !response.results[0].geometry.location)
    throw new Error('GEOCODING_LOCATION_ERROR');

  let data = {
    street_number: null,
    street_name: null,
    city: null,
    department: null,
    region: null,
    country: null,
    postal_code: null,
    lat: response.results[0].geometry.location.lat,
    lng: response.results[0].geometry.location.lng
  };

  const keyMap = module.exports.getKeyMap();

  response.results[0].address_components.forEach(addressComponent => {

    for (const key in keyMap) {
      const google_key = keyMap[key];

      if (addressComponent.types.includes(google_key)) {
        data[key] = addressComponent.long_name;
      }
    }

  });

  return data;

};