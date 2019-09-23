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

module.exports.formatResult = (result, withNulls = true) => {
  if (!result.geometry || !result.geometry.location)
    throw new Error('GEOCODING_RESULT_LOCATION_ERROR');

  if (!result.address_components)
    throw new Error('GEOCODING_RESULT_DATA_ERROR');

  const keyMap = module.exports.getKeyMap();
  const labelMap = module.exports.getLabelMap();

  let address = {};
  let labeled_address = {};
  result.address_components.forEach(addressComponent => {

    for (const key in keyMap) {
      const google_key = keyMap[key];
      const label = labelMap[key];

      if (withNulls && address[key] === undefined)
        address[key] = null;
      if (withNulls && labeled_address[label] === undefined)
        labeled_address[label] = null;

      if (addressComponent.types.includes(google_key)) {
        address[key] = addressComponent.long_name;
        labeled_address[label] = addressComponent.long_name;
      }
    }

  });

  return {
    address: address,
    labeled_address: labeled_address,
    formatted_address: result.formatted_address,
    location: result.geometry.location
  };

};

/**
 * @param address
 * @param withNulls
 * @returns {Promise<*>}
 * Can be rejected with status GEOCODING_REQUEST_ERROR, GEOCODING_NO_RESULTS_ERROR, GEOCODING_RESULT_LOCATION_ERROR, GEOCODING_RESULT_DATA_ERROR, GEOCODING_UNEXPECTED_ERROR, or with google map api response status
 */
module.exports.getAddress = async (address, withNulls = true) => {
  return module.exports.geocode(address)
    .then(response => {
      let results = [];
      try {
        for (let i = 0; i < response.results.length; i++) {
          results.push(module.exports.formatResult(response.results[i], withNulls));
        }
        return results;
      } catch (error) {
        return Promise.reject({ status: error.message });
      }
    });
};