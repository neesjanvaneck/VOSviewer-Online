import React, { useContext, useRef } from 'react';
import { Button } from '@material-ui/core';
import _uniqueId from 'lodash/uniqueId';

import { FileDataStoreContext, UiStoreContext } from 'store/stores';
import * as s from './styles';

const JsonFileChooser = () => {
  const fileDataStore = useContext(FileDataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const inputFile = useRef(null);
  const uniqUploadId = _uniqueId('upload');

  const clearInputFile = () => {
    inputFile.current.value = '';
  };

  const selectInputFile = async event => {
    event.preventDefault();
    const file = inputFile.current.files[0];
    if (file) {
      uiStore.setJsonFileSelectedName(file.name);
      fileDataStore.setJsonFile(file);
    }
  };

  return (
    <div className={s.fileChooser}>
      <label htmlFor={`upload-json-${uniqUploadId}`}>
        <input id={`upload-json-${uniqUploadId}`} ref={inputFile} multiple type="file" style={{ display: 'none' }} onClick={clearInputFile} onChange={selectInputFile} />
        <Button className={s.button} variant="outlined" component="span">
          JSON file
        </Button>
      </label>
    </div>
  );
};

export default JsonFileChooser;
