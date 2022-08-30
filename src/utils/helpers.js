/* eslint-disable no-undef */
import { parse } from 'qs';
import { scaleLinear } from 'd3-scale';
import _isNumber from 'lodash/isNumber';
import _isBoolean from 'lodash/isBoolean';
import _isString from 'lodash/isString';
import _get from 'lodash/get';
import _transform from 'lodash/transform';

import { parameterKeys, mapDataHeaders, colorSchemes } from 'utils/variables';

export function getProxyUrl(proxy = "", url) {
  let proxyUrl;
  if (url) {
    proxyUrl = proxy ? `${proxy}${encodeURIComponent(url)}` : `${url}`;
  } else {
    proxyUrl = undefined;
  }
  return proxyUrl;
}

export function parseQueryString(queryString) {
  const parsedQueryString = parse(queryString, {
    ignoreQueryPrefix: true,
  });

  const parsedQueryString2 = Object.keys(parsedQueryString).reduce((acc, key) => {
    const value = _parseQueryStringValue(parsedQueryString[key]);
    switch (key) {
      // Data.
      case parameterKeys.JSON:
      case parameterKeys.MAP:
      case parameterKeys.NETWORK:
        if (_isString(value)) acc[key] = value;
        break;
      // Layout and clustering.
      case parameterKeys.ATTRACTION:
      case parameterKeys.MIN_CLUSTER_SIZE:
      case parameterKeys.REPULSION:
      case parameterKeys.RESOLUTION:
        if (_isNumber(value)) acc[key] = value;
        break;
      case parameterKeys.LARGEST_COMPONENT:
      case parameterKeys.MERGE_SMALL_CLUSTERS:
        if (_isBoolean(value)) acc[key] = value;
        break;
      // Visualization.
      case parameterKeys.CURVED_LINKS:
      case parameterKeys.COLORED_LINKS:
      case parameterKeys.DIMMING_EFFECT:
      case parameterKeys.GRADIENT_CIRCLES:
        if (_isBoolean(value)) acc[key] = value;
        break;
      case parameterKeys.ITEM_SIZE_VARIATION:
      case parameterKeys.LINK_SIZE_VARIATION:
      case parameterKeys.MAX_LABEL_LENGTH:
      case parameterKeys.MAX_N_LINKS:
      case parameterKeys.MAX_SCORE:
      case parameterKeys.MIN_LINK_STRENGTH:
      case parameterKeys.MIN_SCORE:
      case parameterKeys.SCALE:
      case parameterKeys.ZOOM_LEVEL:
      case parameterKeys.ITEM_COLOR:
      case parameterKeys.ITEM_SIZE:
        if (_isNumber(value)) acc[key] = value;
        break;
      case parameterKeys.SCORE_COLORS:
      case parameterKeys.SHOW_ITEM:
        acc[key] = String(value);
        break;
      // UI.
      case parameterKeys.DARK_UI:
      case parameterKeys.SHOW_INFO:
      case parameterKeys.SIMPLE_UI:
        if (_isBoolean(value)) acc[key] = value;
        break;
      case parameterKeys.URL_PREVIEW_PANEL:
        if (_isNumber(value)) acc[key] = value;
        break;
      default: break;
    }

    return acc;
  }, {});

  return parsedQueryString2;
}

// Code adjusted from: https://github.com/sindresorhus/query-string/blob/master/index.js
function _parseQueryStringValue(value) {
  if (!Number.isNaN(Number(value)) && typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  } else if (value !== null && typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
    return value.toLowerCase() === 'true';
  } else return value;
}

export function getLabelValue(item) {
  return (_get(item, mapDataHeaders.LABEL) || _get(item, mapDataHeaders.ID)).toString();
}

export function getClusterKeys(keys) {
  return keys.filter(d => _searchClusterSubString(d) !== -1);
}

export function getWeightKeys(keys) {
  return keys.filter(d => _searchWeightSubString(d) !== -1);
}

export function getScoreKeys(keys) {
  return keys.filter(d => _searchScoreSubString(d) !== -1);
}

export function getItemWithTransformedKeysAndValues(item) {
  return _transform(item, (result, value, key) => {
    let resultValue = value;
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue === '' || trimmedValue.toLowerCase() === 'null' || trimmedValue.toLowerCase() === 'nan') {
        resultValue = null;
      } else if (!Number.isNaN(Number(trimmedValue))) {
        resultValue = Number(trimmedValue);
      }
    }
    if (_searchWeightSubString(key) !== -1 || _searchScoreSubString(key) !== -1) {
      result[key] = resultValue;
    } else {
      result[key.toLowerCase()] = resultValue;
    }
  });
}

function _searchClusterSubString(key) {
  return key.search(/((c|C)luster)/);
}

function _searchWeightSubString(key) {
  return key.search(/((w|W)eight)/);
}

function _searchScoreSubString(key) {
  return key.search(/((s|S)core)/);
}

export function getColorScheme(scoreColorSchemeName, colorValues, colors) {
  switch (scoreColorSchemeName.toLowerCase()) {
    case 'custom':
      return scaleLinear().domain(colorValues).range(colors);
    case 'plasma':
      return colorSchemes.PLASMA;
    case 'rainbow':
      return colorSchemes.RAINBOW;
    case 'white-blue-purple':
      return colorSchemes.WHITE_BLUE_PURPLE;
    case 'white-yellow-green-blue':
      return colorSchemes.WHITE_YELLOW_GREEN_BLUE;
    case 'white-yellow-orange-red':
      return colorSchemes.WHITE_YELLOW_ORANGE_RED;
    case 'coolwarm':
      return colorSchemes.COOLWARM;
    case 'spectral':
      return colorSchemes.SPECTRAL;
    case 'viridis':
    default:
      return colorSchemes.VIRIDIS;
  }
}

export function trimTextEnd(text = '', maxLength = 15) {
  return text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;
}

export const roundNumberByDigits = (number) => {
  const nDigitsBeforeDecimalPoint = Math.round(number).toString().length;
  const b = number / (10 ** (nDigitsBeforeDecimalPoint - 1));
  return Math.round(b) * (10 ** (nDigitsBeforeDecimalPoint - 1));
};

export function getNiceMinValue(minValue, maxValue, desiredNTicks) {
  if (minValue === maxValue) return minValue;
  const range = _getNiceValue(maxValue - minValue, false);
  const distance = _getNiceValue(range / (desiredNTicks - 1), true);
  return Math.round(minValue / distance) * distance;
}

export function getNiceMaxValue(minValue, maxValue, desiredNTicks) {
  if (minValue === maxValue) return maxValue;
  const range = _getNiceValue(maxValue - minValue, false);
  const distance = _getNiceValue(range / (desiredNTicks - 1), true);
  return Math.round(maxValue / distance) * distance;
}

function _getNiceValue(value, round) {
  const EPSILON = 1e-8;

  let niceFractionalPart;
  const exponent = Math.floor(Math.log10(value));
  const fractionalPart = value / 10 ** exponent;
  if (round) {
    if (fractionalPart < 1.5) {
      niceFractionalPart = 1;
    } else if (fractionalPart < 3) {
      niceFractionalPart = 2;
    } else if (
      fractionalPart < 7) {
      niceFractionalPart = 5;
    } else {
      niceFractionalPart = 10;
    }
  } else if (fractionalPart <= 1 + EPSILON) {
    niceFractionalPart = 1;
  } else if (fractionalPart <= 2 + EPSILON) {
    niceFractionalPart = 2;
  } else if (fractionalPart <= 5 + EPSILON) {
    niceFractionalPart = 5;
  } else {
    niceFractionalPart = 10;
  }

  return niceFractionalPart * 10 ** exponent;
}

export function getFullscreenOrBodyContainer() {
  return document.fullscreenElement ?? document.body;
}
