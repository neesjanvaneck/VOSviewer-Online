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

import { mapFileHeaders, fileTypeKeys, fileTypeNames, errorKeys, errorMessages } from 'utils/variables';
import { getWeightKeys, getScoreKeys } from 'utils/helpers';

export const getFileError = (errorKey, fileTypeKey, lineNumber) => ({
  key: errorKey,
  message: errorMessages[errorKey],
  fileType: fileTypeNames[fileTypeKey],
  lineNumber
});

export const getFileReaderError = (catchedError, fileTypeKey) => {
  if (catchedError.message === 'Not Found') {
    return getFileError(errorKeys.FILE_NOT_FOUND, fileTypeKey);
  }
  if (catchedError) {
    return getFileError(errorKeys.FILE_READ_ERROR, fileTypeKey);
  }
  return null;
};

export const getMapFileError = (parseResults, networkDataAvailable) => {
  const fileTypeKey = fileTypeKeys.VOSVIEWER_MAP_FILE;
  if (!parseResults || _checkFileEmpty(parseResults)) {
    return getFileError(errorKeys.FILE_EMPTY, fileTypeKey);
  }
  let lineNumber = _checkIncorrectUseOfQuotes(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.INCORRECT_USE_OF_QUOTES, fileTypeKey, lineNumber);
  }
  lineNumber = _checkHeaderMissing(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.HEADER_MISSING, fileTypeKey, lineNumber);
  }
  const multipleColumnsError = _checkMultipleColumns(parseResults);
  if (multipleColumnsError.columns.length) {
    return {
      key: errorKeys.MULTIPLE_COLUMNS,
      message: errorMessages[errorKeys.MULTIPLE_COLUMNS](multipleColumnsError.columns),
      fileType: fileTypeNames[fileTypeKey],
      lineNumber: multipleColumnsError.lineNumber
    };
  }
  lineNumber = _checkIncorrectNColumnsMapFile(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.INCORRECT_N_COLUMNS, fileTypeKey, lineNumber);
  }
  if (_checkLessThanThreeItems(parseResults)) {
    return getFileError(errorKeys.LESS_THAN_THREE_ITEMS, fileTypeKey);
  }
  lineNumber = _checkIdAndLabelColumnsMissing(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.ID_AND_LABEL_COLUMNS_MISSING, fileTypeKey, lineNumber);
  }
  if (networkDataAvailable && _checkIdColumnMissing(parseResults)) {
    return getFileError(errorKeys.ID_COLUMN_MISSING, fileTypeKey);
  }
  if (!networkDataAvailable && _checkXAndYColumnsMissing(parseResults)) {
    return getFileError(errorKeys.X_AND_Y_COLUMNS_MISSING, fileTypeKey);
  }
  lineNumber = _checkIdEmpty(parseResults);
  if (_checkIdEmpty(parseResults)) {
    return getFileError(errorKeys.ID_EMPTY, fileTypeKey, lineNumber);
  }
  lineNumber = _checkIdNotUnique(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.ID_NOT_UNIQUE, fileTypeKey, lineNumber);
  }
  lineNumber = _checkXOrYNotNumber(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.X_OR_Y_NOT_NUMBER, fileTypeKey, lineNumber);
  }
  lineNumber = _checkWeightNotNonnegativeNumber(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.WEIGHT_NOT_NONNEGATIVE_NUMBER, fileTypeKey, lineNumber);
  }
  lineNumber = _checkScoreNotNumber(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.SCORE_NOT_NUMBER, fileTypeKey, lineNumber);
  }
  lineNumber = _checkClusterNotPositiveInteger(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.CLUSTER_NOT_POSITIVE_INTEGER, fileTypeKey, lineNumber);
  }
  if (_checkItemsSameCoordinates(parseResults)) {
    return getFileError(errorKeys.ITEMS_SAME_COORDINATES, fileTypeKey);
  }
  return null;
};

export const getNetworkFileError = (parseResults, mapData) => {
  const fileTypeKey = fileTypeKeys.VOSVIEWER_NETWORK_FILE;
  if (!parseResults || _checkFileEmpty(parseResults)) {
    return getFileError(errorKeys.FILE_EMPTY, fileTypeKey);
  }
  let lineNumber = _checkIncorrectUseOfQuotes(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.INCORRECT_USE_OF_QUOTES, fileTypeKey, lineNumber);
  }
  if (_checkLessThanTwoColumnsNetworkFile(parseResults)) {
    return getFileError(errorKeys.LESS_THAN_TWO_COLUMNS_NETWORK_FILE, fileTypeKey);
  }
  if (_checkMoreThanThreeColumnsNetworkFile(parseResults)) {
    return getFileError(errorKeys.MORE_THAN_THREE_COLUMNS_NETWORK_FILE, fileTypeKey);
  }
  lineNumber = _checkIncorrectNColumnsNetworkFile(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.INCORRECT_N_COLUMNS, fileTypeKey, lineNumber);
  }
  lineNumber = _checkInvalidIdNetworkFile(parseResults, mapData);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.INVALID_ID_NETWORK_FILE, fileTypeKey, lineNumber);
  }
  lineNumber = _checkStrengthNotNonnegativeNumber(parseResults);
  if (_isNumber(lineNumber)) {
    return getFileError(errorKeys.STRENGTH_NOT_NONNEGATIVE_NUMBER, fileTypeKey, lineNumber);
  }
  return null;
};

export const getJsonFileError = (parseResultsMapData, parseResultsNetworkData) => {
  const fileTypeKey = fileTypeKeys.VOSVIEWER_JSON_FILE;
  if ((!parseResultsMapData || _checkFileEmpty(parseResultsMapData)) && (!parseResultsNetworkData || _checkFileEmpty(parseResultsNetworkData))) {
    return getFileError(errorKeys.FILE_EMPTY, fileTypeKey);
  }
  if (parseResultsMapData.data.length > 0) {
    if (_checkLessThanThreeItems(parseResultsMapData)) {
      return getFileError(errorKeys.LESS_THAN_THREE_ITEMS, fileTypeKey);
    }
    if (_checkIdAndLabelColumnsMissing(parseResultsMapData)) {
      return getFileError(errorKeys.ID_AND_LABEL_ATTRIBUTES_MISSING, fileTypeKey);
    }
    if (parseResultsNetworkData.data.length > 0 && _checkIdColumnMissing(parseResultsMapData)) {
      return getFileError(errorKeys.ID_ATTRIBUTE_MISSING, fileTypeKey);
    }
    if (parseResultsNetworkData.data.length === 0 && _checkXAndYColumnsMissing(parseResultsMapData)) {
      return getFileError(errorKeys.X_AND_Y_ATTRIBUTES_MISSING, fileTypeKey);
    }
    if (_checkIdEmpty(parseResultsMapData)) {
      return getFileError(errorKeys.ID_EMPTY, fileTypeKey);
    }
    if (_checkIdNotUnique(parseResultsMapData)) {
      return getFileError(errorKeys.ID_NOT_UNIQUE, fileTypeKey);
    }
    if (_checkXOrYNotNumber(parseResultsMapData)) {
      return getFileError(errorKeys.X_OR_Y_NOT_NUMBER, fileTypeKey);
    }
    if (_checkWeightNotNonnegativeNumber(parseResultsMapData)) {
      return getFileError(errorKeys.WEIGHT_NOT_NONNEGATIVE_NUMBER, fileTypeKey);
    }
    if (_checkScoreNotNumber(parseResultsMapData)) {
      return getFileError(errorKeys.SCORE_NOT_NUMBER, fileTypeKey);
    }
    if (_checkClusterNotPositiveInteger(parseResultsMapData)) {
      return getFileError(errorKeys.CLUSTER_NOT_POSITIVE_INTEGER, fileTypeKey);
    }
    if (_checkItemsSameCoordinates(parseResultsMapData)) {
      return getFileError(errorKeys.ITEMS_SAME_COORDINATES, fileTypeKey);
    }
  }
  if (parseResultsNetworkData.data.length > 0) {
    if (_checkSourceIdAttributeMissing(parseResultsNetworkData)) {
      return getFileError(errorKeys.SOURCE_ID_ATTRIBUTE_MISSING, fileTypeKey);
    }
    if (_checkTargetIdAttributeMissing(parseResultsNetworkData)) {
      return getFileError(errorKeys.TARGET_ID_ATTRIBUTE_MISSING, fileTypeKey);
    }
    if (_checkInvalidIdJsonFile(parseResultsNetworkData, parseResultsMapData.data)) {
      return getFileError(errorKeys.INVALID_SOURCE_ID_OR_TARGET_ID, fileTypeKey);
    }
    if (_checkStrengthNotNonnegativeNumber(parseResultsNetworkData)) {
      return getFileError(errorKeys.STRENGTH_NOT_NONNEGATIVE_NUMBER, fileTypeKey);
    }
  }
  return null;
};


// General file error checks.

const _checkFileEmpty = parseResults => {
  const header = _get(parseResults, 'meta.fields');
  return !_get(header, 'length') && !parseResults.data.length;
};

const _checkIncorrectUseOfQuotes = parseResults => {
  const filteredErrors = _filter(parseResults.errors, error => error.type === 'Quotes');
  return filteredErrors.length !== 0 && filteredErrors[0].row + 1;
};


// VOSviewer map file error checks.

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
  const idColumn = _includes(header, mapFileHeaders.ID);
  return !idColumn;
};

const _checkIdAndLabelColumnsMissing = parseResults => {
  const header = parseResults.meta.fields;
  const idColumn = _includes(header, mapFileHeaders.ID);
  const labelColumn = _includes(header, mapFileHeaders.LABEL);
  return !idColumn && !labelColumn && 1;
};

const _checkIncorrectNColumnsMapFile = parseResults => {
  const filteredErrors = _filter(parseResults.errors, error => error.type === 'FieldMismatch');
  return filteredErrors.length !== 0 && filteredErrors[0].row + 2;
};

const _checkLessThanThreeItems = parseResults => parseResults.data.length < 3;

const _checkIdEmpty = parseResults => {
  if (!_includes(parseResults.meta.fields, mapFileHeaders.ID)) return;
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    const item = parseResults.data[i];
    const id = _get(item, mapFileHeaders.ID);
    if (_isUndefined(id) || _isNull(id) || id === '') {
      lineNumber = i + 2;
      break;
    }
  }
  return lineNumber;
};

const _checkIdNotUnique = parseResults => {
  if (!_includes(parseResults.meta.fields, mapFileHeaders.ID)) return;
  let lineNumber;
  const ids = parseResults.data.map(d => _get(d, mapFileHeaders.ID));
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
    const x = _get(item, mapFileHeaders.X);
    const y = _get(item, mapFileHeaders.Y);
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
    const cluster = _get(item, mapFileHeaders.CLUSTER);
    if (!_isUndefined(cluster) && !_isNull(cluster) && (!_isInteger(cluster) || cluster <= 0 || cluster > 1000)) {
      lineNumber = i + 2;
      break;
    }
  }
  return lineNumber;
};

const _checkXAndYColumnsMissing = parseResults => {
  const header = parseResults.meta.fields;
  const xColumn = _includes(header, mapFileHeaders.X);
  const yColumn = _includes(header, mapFileHeaders.Y);
  return (!xColumn || !yColumn);
};

const _checkItemsSameCoordinates = parseResults => {
  const header = parseResults.meta.fields;
  const xColumn = _includes(header, mapFileHeaders.X);
  const yColumn = _includes(header, mapFileHeaders.Y);
  if (!xColumn || !yColumn) return;
  const xValues = parseResults.data.map(item => _get(item, mapFileHeaders.X));
  const yValues = parseResults.data.map(item => _get(item, mapFileHeaders.Y));
  const xAllSame = _every(xValues, x => x === xValues[0]);
  const yAllSame = _every(yValues, y => y === yValues[0]);
  return xAllSame && yAllSame;
};


// Network file error checks.

const _checkLessThanTwoColumnsNetworkFile = parseResults => {
  let error = false;
  if (parseResults.data[0].length < 2) {
    error = true;
  }
  return error;
};

const _checkMoreThanThreeColumnsNetworkFile = parseResults => {
  let error = false;
  if (parseResults.data[0].length > 3) {
    error = true;
  }
  return error;
};

const _checkIncorrectNColumnsNetworkFile = parseResults => {
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    if (parseResults.data[i].length !== parseResults.data[0].length) {
      lineNumber = i + 1;
      break;
    }
  }
  return lineNumber;
};

const _checkInvalidIdNetworkFile = (parseResults, mapData) => {
  const ids = mapData.reduce((acc, curr) => {
    acc[_get(curr, mapFileHeaders.ID)] = curr;
    return acc;
  }, {});
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    if ((!parseResults.data[i][0] || !parseResults.data[i][1]) || (mapData.length && (!ids[parseResults.data[i][0]] || !ids[parseResults.data[i][1]]))) {
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


// JSON file error checks.

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

const _checkInvalidIdJsonFile = (parseResults, mapData) => {
  const ids = mapData.reduce((acc, curr) => {
    acc[_get(curr, mapFileHeaders.ID)] = curr;
    return acc;
  }, {});
  let lineNumber;
  for (let i = 0; i < parseResults.data.length; i++) {
    if ((!parseResults.data[i][0] || !parseResults.data[i][1]) || (mapData.length && (!ids[parseResults.data[i][0]] || !ids[parseResults.data[i][1]]))) {
      lineNumber = i + 1;
      break;
    }
  }
  return lineNumber;
};
