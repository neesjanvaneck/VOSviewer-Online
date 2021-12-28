import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button, Accordion, AccordionDetails, AccordionSummary, FormControlLabel, Switch, TextField, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ClusteringStoreContext, WebworkerStoreContext } from 'store/stores';
import * as s from './styles';

const Clustering = observer(() => {
  const clusteringStore = useContext(ClusteringStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);

  const updateClustering = () => {
    webworkerStore.updateClustering(clusteringStore.getParameters());
  };

  return (
    <>
      <TextField
        label="Resolution"
        type="number"
        inputProps={{ min: 0, max: 1000, step: 0.1 }}
        value={clusteringStore.resolution}
        fullWidth
        onChange={event => clusteringStore.setResolution(event.target.value)}
        onBlur={event => clusteringStore.setResolution(event.target.value, true)}
      />
      <TextField
        label="Minimum cluster size"
        type="number"
        inputProps={{ min: 1, max: 1000, step: 1 }}
        value={clusteringStore.minClusterSize}
        fullWidth
        onChange={event => clusteringStore.setMinClusterSize(event.target.value)}
        onBlur={event => clusteringStore.setMinClusterSize(event.target.value, true)}
      />
      <div className={s.switchBox}>
        <FormControlLabel
          classes={{ root: s.formControlLabel, label: s.switchLabel }}
          control={(
            <Switch
              checked={clusteringStore.mergeSmallClusters}
              onChange={event => clusteringStore.setMergeSmallClusters(event.target.checked)}
              color="primary"
            />
          )}
          label="Merge small clusters"
          labelPlacement="start"
        />
      </div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2">Advanced parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ position: 'relative' }}>
            <TextField
              label="Random starts"
              type="number"
              inputProps={{ min: 1, max: 1000, step: 1 }}
              value={clusteringStore.nRandomStarts}
              fullWidth
              onChange={event => clusteringStore.setNRandomStarts(event.target.value)}
              onBlur={event => clusteringStore.setNRandomStarts(event.target.value, true)}
            />
            <TextField
              label="Iterations"
              type="number"
              inputProps={{ min: 1, max: 1000, step: 1 }}
              value={clusteringStore.nIterations}
              fullWidth
              onChange={event => clusteringStore.setNIterations(event.target.value)}
              onBlur={event => clusteringStore.setNIterations(event.target.value, true)}
            />
            <TextField
              label="Random seed"
              type="number"
              inputProps={{ min: 0, max: Number.MAX_SAFE_INTEGER, step: 1 }}
              value={clusteringStore.fixedSeed}
              fullWidth
              onChange={event => clusteringStore.setFixedSeed(event.target.value)}
              onBlur={event => clusteringStore.setFixedSeed(event.target.value, true)}
            />
            <div className={s.switchBox}>
              <FormControlLabel
                classes={{ root: s.formControlLabel, label: s.switchLabel }}
                control={(
                  <Switch
                    checked={clusteringStore.useRandomSeed}
                    onChange={event => clusteringStore.setUseRandomSeed(event.target.checked)}
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
          onClick={updateClustering}
        >
          Update clustering
        </Button>
      </div>
    </>
  );
});

export default Clustering;
