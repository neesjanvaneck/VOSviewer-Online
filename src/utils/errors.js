/* eslint-disable consistent-return */
import _includes from 'lodash/includes';
import _every from 'lodash/every';
import _get from 'lodash/get';
import _isNull from 'lodash/isNull';
import _isInteger from 'lodash/isInteger';
import _filter from 'lodash/filter';
import _isNumber from 'lodash/isNumber';
import _indexOf from 'lodash/indexOf';
import _isUndefined from 'lodash/isUndefined';

import { mapDataHeaders, dataTypeKeys, dataTypeNames, errorKeys, errorMessages } from 'utils/variables';
import { getWeightKeys, getScoreKeys } from 'utils/helpers';

export const getError = (errorKey, dataTypeKey, lineNumber) => ({
  key: errorKey,
  message: errorMessages[errorKey],
  dataType: dataTypeNames[dataTypeKey],
  lineNumber
});

export const getFileReaderError = (catchedError, dataTypeKey) => {
  if (catchedError.message === 'Not Found') {
    return getError(errorKeys.FILE_NOT_FOUND, dataTypeKey);
  }
  if (catchedError) {
    return getError(errorKeys.FILE_READ_ERROR, dataTypeKey);
  }
  return null;
};

export const getMapDataError = (parseResults, networkDataAvailable) => {
  const dataTypeKey = dataTypeKeys.VOSVIEWER_MAP_DATA;
  if (!parseResults || _checkNoData(parseResults)) {
    return getError(errorKeys.NO_DATA, dataTypeKey);
  }
  let lineNumber = _checkIncorrectUseOfQuotes(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.INCORRECT_USE_OF_QUOTES, dataTypeKey, lineNumber);
  }
  lineNumber = _checkHeaderMissing(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.HEADER_MISSING, dataTypeKey, lineNumber);
  }
  const multipleColumnsError = _checkMultipleColumns(parseResults);
  if (multipleColumnsError.columns.length) {
    return {
      key: errorKeys.MULTIPLE_COLUMNS,
      message: errorMessages[errorKeys.MULTIPLE_COLUMNS](multipleColumnsError.columns),
      dataType: dataTypeNames[dataTypeKey],
      lineNumber: multipleColumnsError.lineNumber
    };
  }
  lineNumber = _checkIncorrectNColumnsMapData(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.INCORRECT_N_COLUMNS, dataTypeKey, lineNumber);
  }
  if (_checkLessThanThreeItems(parseResults)) {
    return getError(errorKeys.LESS_THAN_THREE_ITEMS, dataTypeKey);
  }
  lineNumber = _checkIdAndLabelColumnsMissing(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.ID_AND_LABEL_COLUMNS_MISSING, dataTypeKey, lineNumber);
  }
  if (networkDataAvailable && _checkIdColumnMissing(parseResults)) {
    return getError(errorKeys.ID_COLUMN_MISSING, dataTypeKey);
  }
  if (!networkDataAvailable && _checkXAndYColumnsMissing(parseResults)) {
    return getError(errorKeys.X_AND_Y_COLUMNS_MISSING, dataTypeKey);
  }
  lineNumber = _checkIdEmpty(parseResults);
  if (_checkIdEmpty(parseResults)) {
    return getError(errorKeys.ID_EMPTY, dataTypeKey, lineNumber);
  }
  lineNumber = _checkIdNotUnique(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.ID_NOT_UNIQUE, dataTypeKey, lineNumber);
  }
  lineNumber = _checkXOrYNotNumber(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.X_OR_Y_NOT_NUMBER, dataTypeKey, lineNumber);
  }
  lineNumber = _checkWeightNotNonnegativeNumber(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.WEIGHT_NOT_NONNEGATIVE_NUMBER, dataTypeKey, lineNumber);
  }
  lineNumber = _checkScoreNotNumber(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.SCORE_NOT_NUMBER, dataTypeKey, lineNumber);
  }
  lineNumber = _checkClusterNotPositiveInteger(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.CLUSTER_NOT_POSITIVE_INTEGER, dataTypeKey, lineNumber);
  }
  if (_checkItemsSameCoordinates(parseResults)) {
    return getError(errorKeys.ITEMS_SAME_COORDINATES, dataTypeKey);
  }
  return null;
};

export const getNetworkDataError = (parseResults, mapData) => {
  const dataTypeKey = dataTypeKeys.VOSVIEWER_NETWORK_DATA;
  if (!parseResults || _checkNoData(parseResults)) {
    return getError(errorKeys.NO_DATA, dataTypeKey);
  }
  let lineNumber = _checkIncorrectUseOfQuotes(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.INCORRECT_USE_OF_QUOTES, dataTypeKey, lineNumber);
  }
  if (_checkLessThanTwoColumnsNetworkData(parseResults)) {
    return getError(errorKeys.LESS_THAN_TWO_COLUMNS_NETWORK_DATA, dataTypeKey);
  }
  if (_checkMoreThanThreeColumnsNetworkData(parseResults)) {
    return getError(errorKeys.MORE_THAN_THREE_COLUMNS_NETWORK_DATA, dataTypeKey);
  }
  lineNumber = _checkIncorrectNColumnsNetworkData(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.INCORRECT_N_COLUMNS, dataTypeKey, lineNumber);
  }
  lineNumber = _checkInvalidIdNetworkData(parseResults, mapData);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.INVALID_ID_NETWORK_DATA, dataTypeKey, lineNumber);
  }
  lineNumber = _checkStrengthNotNonnegativeNumber(parseResults);
  if (_isNumber(lineNumber)) {
    return getError(errorKeys.STRENGTH_NOT_NONNEGATIVE_NUMBER, dataTypeKey, lineNumber);
  }
  return null;
};

export const getJsonDataError = (parseResultsMapData, parseResultsNetworkData) => {
  const dataTypeKey = dataTypeKeys.VOSVIEWER_JSON_DATA;
  if ((!parseResultsMapData || _checkNoData(parseResultsMapData)) && (!parseResultsNetworkData || _checkNoData(parseResultsNetworkData))) {
    return getError(errorKeys.NO_DATA, dataTypeKey);
  }
  if (parseResultsMapData.data.length > 0) {
    if (_checkLessThanThreeItems(parseResultsMapData)) {
      return getError(errorKeys.LESS_THAN_THREE_ITEMS, dataTypeKey);
    }
    if (_checkIdAndLabelColumnsMissing(parseResultsMapData)) {
      return getError(errorKeys.ID_AND_LABEL_ATTRIBUTES_MISSING, dataTypeKey);
    }
    if (parseResultsNetworkData.data.length > 0 && _checkIdColumnMissing(parseResultsMapData)) {
      return getError(errorKeys.ID_ATTRIBUTE_MISSING, dataTypeKey);
    }
    if (parseResultsNetworkData.data.length === 0 && _checkXAndYColumnsMissing(parseResultsMapData)) {
      return getError(errorKeys.X_AND_Y_ATTRIBUTES_MISSING, dataTypeKey);
    }
    if (_checkIdEmpty(parseResultsMapData)) {
      return getError(errorKeys.ID_EMPTY, dataTypeKey);
    }
    if (_checkIdNotUnique(parseResultsMapData)) {
      return getError(errorKeys.ID_NOT_UNIQUE, dataTypeKey);
    }
    if (_checkXOrYNotNumber(parseResultsMapData)) {
      return getError(errorKeys.X_OR_Y_NOT_NUMBER, dataTypeKey);
    }
    if (_checkWeightNotNonnegativeNumber(parseResultsMapData)) {
      return getError(errorKeys.WEIGHT_NOT_NONNEGATIVE_NUMBER, dataTypeKey);
    }
    if (_checkScoreNotNumber(parseResultsMapData)) {
      return getError(errorKeys.SCORE_NOT_NUMBER, dataTypeKey);
    }
    if (_checkClusterNotPositiveInteger(parseResultsMapData)) {
      return getError(errorKeys.CLUSTER_NOT_POSITIVE_INTEGER, dataTypeKey);
    }
    if (_checkItemsSameCoordinates(parseResultsMapData)) {
      return getError(errorKeys.ITEMS_SAME_COORDINATES, dataTypeKey);
    }
  }
  if (parseResultsNetworkData.data.length > 0) {
    if (_checkSourceIdAttributeMissing(parseResultsNetworkData)) {
      return getError(errorKeys.SOURCE_ID_ATTRIBUTE_MISSING, dataTypeKey);
    }
    if (_checkTargetIdAttributeMissing(parseResultsNetworkData)) {
      return getError(errorKeys.TARGET_ID_ATTRIBUTE_MISSING, dataTypeKey);
    }
    if (_checkInvalidIdJsonData(parseResultsNetworkData, parseResultsMapData.data)) {
      return getError(errorKeys.INVALID_SOURCE_ID_OR_TARGET_ID, dataTypeKey);
    }
    if (_checkStrengthNotNonnegativeNumber(parseResultsNetworkData)) {
      return getError(errorKeys.STRENGTH_NOT_NONNEGATIVE_NUMBER, dataTypeKey);
    }
  }
  return null;
};


// General data error checks.

const _checkNoData = parseResults => {
  const header = _get(parseResults, 'meta.fields');
  return !_get(header, 'length') && !parseResults.data.length;
};

const _checkIncorrectUseOfQuotes = parseResults => {
  const filteredErrors = _filter(parseResults.errors, error => error.type === 'Quotes');
  return filteredErrors.length !== 0 && filteredErrors[0].row + 1;
};


// VOSviewer map data error checks.

const _checkHeaderMissing = parseResults => {
  const header = parseResults.meta.fields[0];
  return header === "" && 1;
};

const _checkMultipleColumns = parseResults => {
  const header = parseResults.meta.fields;
  const columns = _filter(header, (val, i, iterate) => _includes(iterate, val, i + 1));
  return {
    lineNumber: columns.length && 1,
    columns
  };
};

const _checkIdColumnMissing = parseResults => {
  const header = parseResults.meta.fields;
  const idColumn = _includes(header, mapDataHeaders.ID);
  return !idColumn;
};

const _checkIdAndLabelColumnsMissing = parseResults => {
  const header = parseResults.meta.fields;
  const idColumn = _includes(header, mapDataHeaders.ID);
  const labelColumn = _includes(header, mapDataHeaders.LABEL);
  return !idColumn && !labelColumn && 1;
};

const _checkIncorrectNColumnsMapData = parseResults => {
  const filteredErrors = _filter(parseResults.errors, error => error.type === 'FieldMismatch');
  return filteredErrors.length !== 0 && filteredErrors[0].row + 2;
};

const _checkLessThanThreeItems = parseResults => parseResults.data.length < 3;

const _checkIdEmpty = parseResults => {
  if (!_includes(parseResults.meta.fields, mapDataHeaders.ID)) return;
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    const item = parseResults.data[i];
    const id = _get(item, mapDataHeaders.ID);
    if (_isUndefined(id) || _isNull(id) || id === '') {
      lineNumber = i + 2;
      break;
    }
  }
  return lineNumber;
};

const _checkIdNotUnique = parseResults => {
  if (!_includes(parseResults.meta.fields, mapDataHeaders.ID)) return;
  let lineNumber;
  const ids = parseResults.data.map(d => _get(d, mapDataHeaders.ID));
  for (let i = 0; i < parseResults.data.length; i++) {
    const id = ids[i];
    const nonUniqueIdIndex = _indexOf(ids, id, i + 1);
    if (nonUniqueIdIndex !== -1) {
      lineNumber = nonUniqueIdIndex + 2;
      break;
    }
  }
  return lineNumber;
};

const _checkXOrYNotNumber = parseResults => {
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    const item = parseResults.data[i];
    const x = _get(item, mapDataHeaders.X);
    const y = _get(item, mapDataHeaders.Y);
    if (!_isUndefined(x) && !_isUndefined(y) && (!_isNumber(x) || !_isNumber(y))) {
      lineNumber = i + 2;
      break;
    }
  }
  return lineNumber;
};

const _checkWeightNotNonnegativeNumber = parseResults => {
  const header = parseResults.meta.fields;
  const weightKeys = getWeightKeys(header);
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    const item = parseResults.data[i];
    const weights = weightKeys.map(key => _get(item, key));
    if (!_every(weights, weight => !_isNull(weight) && _isNumber(weight) && (weight >= 0))) {
      lineNumber = i + 2;
      break;
    }
  }
  return lineNumber;
};

const _checkScoreNotNumber = parseResults => {
  const header = parseResults.meta.fields;
  const scoreKeys = getScoreKeys(header);
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    const item = parseResults.data[i];
    const scores = scoreKeys.map(key => _get(item, key));
    if (!_every(scores, score => _isNull(score) || _isNumber(score))) {
      lineNumber = i + 2;
      break;
    }
  }
  return lineNumber;
};

const _checkClusterNotPositiveInteger = parseResults => {
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    const item = parseResults.data[i];
    const cluster = _get(item, mapDataHeaders.CLUSTER);
    if (!_isUndefined(cluster) && !_isNull(cluster) && (!_isInteger(cluster) || cluster <= 0 || cluster > 1000)) {
      lineNumber = i + 2;
      break;
    }
  }
  return lineNumber;
};

const _checkXAndYColumnsMissing = parseResults => {
  const header = parseResults.meta.fields;
  const xColumn = _includes(header, mapDataHeaders.X);
  const yColumn = _includes(header, mapDataHeaders.Y);
  return (!xColumn || !yColumn);
};

const _checkItemsSameCoordinates = parseResults => {
  const header = parseResults.meta.fields;
  const xColumn = _includes(header, mapDataHeaders.X);
  const yColumn = _includes(header, mapDataHeaders.Y);
  if (!xColumn || !yColumn) return;
  const xValues = parseResults.data.map(item => _get(item, mapDataHeaders.X));
  const yValues = parseResults.data.map(item => _get(item, mapDataHeaders.Y));
  const xAllSame = _every(xValues, x => x === xValues[0]);
  const yAllSame = _every(yValues, y => y === yValues[0]);
  return xAllSame && yAllSame;
};


// VOSviewer network data error checks.

const _checkLessThanTwoColumnsNetworkData = parseResults => {
  let error = false;
  if (parseResults.data[0].length < 2) {
    error = true;
  }
  return error;
};

const _checkMoreThanThreeColumnsNetworkData = parseResults => {
  let error = false;
  if (parseResults.data[0].length > 3) {
    error = true;
  }
  return error;
};

const _checkIncorrectNColumnsNetworkData = parseResults => {
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    if (parseResults.data[i].length !== parseResults.data[0].length) {
      lineNumber = i + 1;
      break;
    }
  }
  return lineNumber;
};

const _checkInvalidIdNetworkData = (parseResults, mapData) => {
  const ids = mapData.reduce((acc, curr) => {
    acc[_get(curr, mapDataHeaders.ID)] = curr;
    return acc;
  }, {});
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    if ((_isUndefined(parseResults.data[i][0]) || _isUndefined(parseResults.data[i][1])) || (mapData.length && (!ids[parseResults.data[i][0]] || !ids[parseResults.data[i][1]]))) {
      lineNumber = i + 1;
      break;
    }
  }
  return lineNumber;
};

const _checkStrengthNotNonnegativeNumber = parseResults => {
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    if (parseResults.data[i][2] < 0) {
      lineNumber = i + 1;
      break;
    }
  }
  return lineNumber;
};


// VOSviewer JSON data error checks.

const _checkSourceIdAttributeMissing = parseResults => {
  const header = parseResults.meta.fields;
  const sourceIdAttribute = _includes(header, 'source_id');
  return (!sourceIdAttribute);
};

const _checkTargetIdAttributeMissing = parseResults => {
  const header = parseResults.meta.fields;
  const targetIdAttribute = _includes(header, 'target_id');
  return (!targetIdAttribute);
};

const _checkInvalidIdJsonData = (parseResults, mapData) => {
  const ids = mapData.reduce((acc, curr) => {
    acc[_get(curr, mapDataHeaders.ID)] = curr;
    return acc;
  }, {});
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    if ((_isUndefined(parseResults.data[i][0]) || _isUndefined(parseResults.data[i][1])) || (mapData.length && (!ids[parseResults.data[i][0]] || !ids[parseResults.data[i][1]]))) {
      lineNumber = i + 1;
      break;
    }
  }
  return lineNumber;
};
