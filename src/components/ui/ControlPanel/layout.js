import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button, Accordion, AccordionDetails, AccordionSummary, FormControlLabel, Switch, TextField, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { LayoutStoreContext, WebworkerStoreContext } from 'store/stores';
import * as s from './styles';

const Layout = observer(() => {
  const layoutStore = useContext(LayoutStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);

  const updateLayout = () => {
    webworkerStore.updateLayout(layoutStore.getParameters());
  };

  return (
    <>
      <TextField
        label="Attraction"
        type="number"
        inputProps={{ min: -9, max: 10, step: 1 }}
        value={layoutStore.attraction}
        fullWidth
        onChange={event => layoutStore.setAttraction(event.target.value)}
        onBlur={event => layoutStore.setAttraction(event.target.value, true)}
      />
      <TextField
        label="Repulsion"
        type="number"
        inputProps={{ min: -10, max: 9, step: 1 }}
        value={layoutStore.repulsion}
        fullWidth
        onChange={event => layoutStore.setRepulsion(event.target.value)}
        onBlur={event => layoutStore.setRepulsion(event.target.value, true)}
      />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2">Advanced parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ position: 'relative' }}>
            <TextField
              label="Random starts"
              type="number"
              inputProps={{ min: 1, max: 10000, step: 1 }}
              value={layoutStore.nRandomStarts}
              fullWidth
              onChange={event => layoutStore.setNRandomStarts(event.target.value)}
              onBlur={event => layoutStore.setNRandomStarts(event.target.value, true)}
            />
            <TextField
              label="Maximum iterations"
              type="number"
              inputProps={{ min: 1, max: 1000000, step: 1 }}
              value={layoutStore.maxNIterations}
              fullWidth
              onChange={event => layoutStore.setMaxNIterations(event.target.value)}
              onBlur={event => layoutStore.setMaxNIterations(event.target.value, true)}
            />
            <TextField
              label="Initial step size"
              type="number"
              inputProps={{ min: 0.000001, max: 1, step: 0.1 }}
              value={layoutStore.initialStepSize}
              fullWidth
              onChange={event => layoutStore.setInitialStepSize(event.target.value)}
              onBlur={event => layoutStore.setInitialStepSize(event.target.value, true)}
            />
            <TextField
              label="Step size reduction"
              type="number"
              inputProps={{ min: 0.000001, max: 1, step: 0.1 }}
              value={layoutStore.stepSizeReduction}
              fullWidth
              onChange={event => layoutStore.setStepSizeReduction(event.target.value)}
              onBlur={event => layoutStore.setStepSizeReduction(event.target.value, true)}
            />
            <TextField
              label="Step size convergence"
              type="number"
              inputProps={{ min: 0.000001, max: 1, step: 0.1 }}
              value={layoutStore.stepSizeConvergence}
              fullWidth
              onChange={event => layoutStore.setStepSizeConvergence(event.target.value)}
              onBlur={event => layoutStore.setStepSizeConvergence(event.target.value, true)}
            />
            <TextField
              label="Random seed"
              type="number"
              inputProps={{ min: 0, max: Number.MAX_SAFE_INTEGER, step: 1 }}
              value={layoutStore.fixedSeed}
              fullWidth
              onChange={event => layoutStore.setFixedSeed(event.target.value)}
              onBlur={event => layoutStore.setFixedSeed(event.target.value, true)}
            />
            <div className={s.switchBox}>
              <FormControlLabel
                classes={{ root: s.formControlLabel, label: s.switchLabel }}
                control={(
                  <Switch
                    checked={layoutStore.useRandomSeed}
                    onChange={event => layoutStore.setUseRandomSeed(event.target.checked)}
                    color="primary"
                  />
                )}
                label="Use random seed"
                labelPlacement="start"
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      <div className={s.buttonBox}>
        <Button
          className={s.button}
          variant="outlined"
          onClick={updateLayout}
        >
          Update layout
        </Button>
      </div>
    </>
  );
});

export default Layout;
