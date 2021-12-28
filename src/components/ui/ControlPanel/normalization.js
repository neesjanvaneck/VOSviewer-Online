import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { NormalizationStoreContext, WebworkerStoreContext } from 'store/stores';

const Normalization = observer(() => {
  const normalizationStore = useContext(NormalizationStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);

  const normalizationMethodMenuItems = () => normalizationStore.normalizationMethods.map(d => (
    <MenuItem key={d} value={d}>
      {d}
    </MenuItem>
  ));

  const updateNormalization = (normalizationMethod) => {
    normalizationStore.setNormalizationMethod(normalizationMethod);
    webworkerStore.updateNormalization(normalizationMethod);
  };

  return (
    <FormControl>
      <InputLabel>Normalization method</InputLabel>
      <Select
        displayEmpty
        value={normalizationStore.normalizationMethod}
        onChange={event => updateNormalization(event.target.value)}
      >
        {normalizationMethodMenuItems()}
      </Select>
    </FormControl>
  );
});

export default Normalization;
