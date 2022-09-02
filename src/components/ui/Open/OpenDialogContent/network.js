import React, { useContext, useRef } from 'react';
import { Button } from '@mui/material';
import _uniqueId from 'lodash/uniqueId';

import { DataStoreContext, UiStoreContext } from 'store/stores';
import * as s from './styles';

const NetworkFileChooser = () => {
  const dataStore = useContext(DataStoreContext);
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
      uiStore.setNetworkFileSelectedName(file.name);
      dataStore.setNetworkFile(file);
    }
  };

  return (
    <div className={s.fileChooser}>
      <label htmlFor={`upload-network-${uniqUploadId}`}>
        <input id={`upload-network-${uniqUploadId}`} ref={inputFile} multiple type="file" style={{ display: 'none' }} onClick={clearInputFile} onChange={selectInputFile} />
        <Button className={s.button} variant="outlined" component="span">
          Network file
        </Button>
      </label>
    </div>
  );
};

export default NetworkFileChooser;
