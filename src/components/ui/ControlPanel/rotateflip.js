import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, TextField } from '@mui/material';

import { VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const RotateFlip = observer(() => {
  const visualizationStore = useContext(VisualizationStoreContext);

  return (
    <>
      <TextField
        label="Degrees to rotate"
        type="number"
        inputProps={{ min: 0, max: 360, step: 1 }}
        value={visualizationStore.degreesToRotate}
        fullWidth
        onChange={event => visualizationStore.setDegreesToRotate(event.target.value)}
        onBlur={event => visualizationStore.setDegreesToRotate(event.target.value, true)}
      />
      <div className={s.buttonBox}>
        <Button
          className={s.button}
          variant="outlined"
          onClick={() => visualizationStore.rotate()}
        >
          Rotate
        </Button>
      </div>
      <div className={s.buttonBox}>
        <Button
          className={s.button}
          variant="outlined"
          onClick={() => visualizationStore.flip('horizontally')}
        >
          Flip horizontally
        </Button>
      </div>
      <div className={s.buttonBox}>
        <Button
          className={s.button}
          variant="outlined"
          onClick={() => visualizationStore.flip('vertically')}
        >
          Flip vertically
        </Button>
      </div>
    </>
  );
});

export default RotateFlip;
