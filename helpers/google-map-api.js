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
    //let response = await request('https://maps.googleapis.com/maps/api/geocode/json?key=' + apiKey + '&address=' + address);
    let response = await request({
      uri: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: {
        key: apiKey,
        address: address
      }
    });
    response = JSON.parse(response);

    if (!response.status)
      return Promise.reject({ status: 'GEOCODING_UNEXPECTED_ERROR' });

    if (response.status !== 'OK')
      return Promise.reject({ status: response.status });

    if (!response.results || !response.results.length)
      return Promise.reject({ status: 'GEOCODING_NO_RESULTS_ERROR' });

    return Promise.resolve(response);

  } catch (error){
    return Promise.reject({ status: 'GEOCODING_REQUEST_ERROR', error: error });
  }
};

module.exports.formatResult = (result, withNulls = true, withLocation = false) => {
  if (withLocation && (!result.geometry || !result.geometry.location))
    throw new Error('GEOCODING_RESULT_LOCATION_ERROR');

  if (!result.address_components)
    throw new Error('GEOCODING_RESULT_DATA_ERROR');

  const keyMap = module.exports.getKeyMap();

  let data = {};

  result.address_components.forEach(addressComponent => {

    for (const key in keyMap) {
      const google_key = keyMap[key];

      if (withNulls && data[key] === undefined)
        data[key] = null;

      if (addressComponent.types.includes(google_key)) {
        data[key] = addressComponent.long_name;
      }
    }

  });

  if (withLocation) {
    data.lat = result.geometry.location.lat;
    data.lng = result.geometry.location.lng;
  }

  return data;

};

/**
 * @param address
 * @param withNulls
 * @param withLocation
 * @returns {Promise<*>}
 * Can be rejected with status GEOCODING_REQUEST_ERROR, GEOCODING_RESULTS_ERROR, GEOCODING_LOCATION_ERROR, GEOCODING_UNEXPECTED_ERROR, or with google map api response status
 */
module.exports.getAddress = async (address, withNulls = true, withLocation = false) => {
  return module.exports.geocode(address)
    .then(response => {
      let results = [];
      try {
        for (let i = 0; i < response.results.length; i++) {
          results.push(module.exports.formatResult(response.results[i], withNulls, withLocation));
        }
        return results;
      } catch (error) {
        return Promise.reject({ status: error.message });
      }
    });
};