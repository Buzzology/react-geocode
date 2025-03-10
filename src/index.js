/**
 * React Geocode Module
 *
 * @package react-geocode
 * @author  Pir Shukarulalh Shah <shuker_rashdi@hotmail.com>  (http://www.shukarullah.com)
 */
let DEBUG = false;
let API_KEY = null;
let LANGUAGE = 'en';
let REGION = null;
const GOOGLE_API = "https://maps.google.com/maps/api/geocode/json";

function log(message, warn = false) {
  if (DEBUG) {
    if (warn) {
      console.warn(message);
    } else {
      console.log(message);
    }
  }
}

async function handleUrl(url) {
  const response = await fetch(url).catch(error =>
    Promise.reject(new Error("Error fetching data"))
  );

  const json = await response.json().catch(() => {
    log("Error parsing server response");
    return Promise.reject(new Error("Error parsing server response"));
  });

  if (json.status === "OK") {
    log(json);
    return json;
  }
  log(`Server returned status code ${json.status}`, true);
  return Promise.reject(
    new Error(`Server returned status code ${json.status}`)
  );
}

export default {
  /**
   *
   *
   * @param {string} apiKey
   */
  setApiKey(apiKey) {
    API_KEY = apiKey;
  },

  /**
   *
   *
   * @param {string} language
   */
  setLanguage(language) {
    LANGUAGE = language;
  },

  /**
   *
   *
   * @param {string} region
   */
  setRegion(region) {
    REGION = region;
  },

  /**
   *
   *
   * @param {boolean} [flag=true]
   */
  enableDebug(flag = true) {
    DEBUG = flag;
  },

  /**
   *
   *
   * @param {string} lat
   * @param {string} lng
   * @param {string} [apiKey]
   * @param {string} [language]
   * @param {string} [region]
   * @returns {Promise}
   */
  async fromLatLng(lat, lng, apiKey, language, region) {
    if (!lat || !lng) {
      log("Provided coordinates are invalid", true);
      return Promise.reject(new Error("Provided coordinates are invalid"));
    }

    const latLng = `${lat},${lng}`;
    let url = `${GOOGLE_API}?latlng=${encodeURI(latLng)}`;

    if (apiKey || API_KEY) {
      API_KEY = apiKey || API_KEY;
      LANGUAGE = language || LANGUAGE;
      url += `&key=${API_KEY}&language=${LANGUAGE}`;
    }

    if (REGION || region) {
      REGION = region || REGION;
      url += `&region=${encodeURI(REGION)}`;
    }

    return handleUrl(url);
  },

  /**
   *
   *
   * @param {string} address
   * @param {string} [apiKey]
   * @param {string} [region]
   * @returns {Promise}
   */
  async fromAddress(address, apiKey, region) {
    if (!address) {
      log("Provided address is invalid", true);
      return Promise.reject(new Error("Provided address is invalid"));
    }

    let url = `${GOOGLE_API}?address=${encodeURI(address)}`;

    if (apiKey || API_KEY) {
      API_KEY = apiKey || API_KEY;
      url += `&key=${API_KEY}`;
    }

    if (REGION || region) {
      REGION = region || REGION;
      url += `&region=${encodeURI(REGION)}`;
    }

    return handleUrl(url);
  }
};
