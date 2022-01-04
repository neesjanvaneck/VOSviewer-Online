import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';

import { VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const ScoreOptionsPanel = observer(() => {
  const visualizationStore = useContext(VisualizationStoreContext);

  const changeMinScore = (minScore, onBlur) => {
    if (+minScore !== visualizationStore.scoreColorLegendAutoMinScore) {
      visualizationStore.setScoreColorLegendMinScoreAutoValue(false);
    }
    visualizationStore.updateScoreColorLegendMinScore(minScore, onBlur);
    visualizationStore.updateItems();
  };

  const changeMaxScore = (maxScore, onBlur) => {
    if (+maxScore !== visualizationStore.scoreColorLegendAutoMaxScore) {
      visualizationStore.setScoreColorLegendMaxScoreAutoValue(false);
    }
    visualizationStore.updateScoreColorLegendMaxScore(maxScore, onBlur);
    visualizationStore.updateItems();
  };

  const changeMinScoreAuto = () => {
    visualizationStore.setScoreColorLegendMinScoreAutoValue();
    if (visualizationStore.scoreColorLegendMinScoreAutoValue) {
      visualizationStore.updateScoreColorLegendMinScore(visualizationStore.scoreColorLegendAutoMinScore);
      visualizationStore.updateItems();
    }
  };

  const changeMaxScoreAuto = () => {
    visualizationStore.setScoreColorLegendMaxScoreAutoValue();
    if (visualizationStore.scoreColorLegendMaxScoreAutoValue) {
      visualizationStore.updateScoreColorLegendMaxScore(visualizationStore.scoreColorLegendAutoMaxScore);
      visualizationStore.updateItems();
    }
  };

  return (
    <>
      <Typography id="p">Set Overlay Color Range</Typography>
      <TextField
        className={s.textField}
        label="Minimum"
        type="number"
        inputProps={{ step: visualizationStore.scoreColorLegendAutoMaxScore - visualizationStore.scoreColorLegendAutoMinScore < 1 ? "0.1" : "1" }}
        value={visualizationStore.scoreColorLegendMinScore}
        onChange={event => changeMinScore(event.target.value)}
        onBlur={event => changeMinScore(event.target.value, true)}
      />
      <div className={s.checkbox}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={visualizationStore.scoreColorLegendMinScoreAutoValue}
              onChange={changeMinScoreAuto}
              color="primary"
              size="small"
            />
          )}
          label="auto"
        />
      </div>
      <TextField
        className={s.textField}
        label="Maximum"
        type="number"
        inputProps={{ step: visualizationStore.scoreColorLegendAutoMaxScore - visualizationStore.scoreColorLegendAutoMinScore < 1 ? "0.1" : "1" }}
        value={visualizationStore.scoreColorLegendMaxScore}
        onChange={event => changeMaxScore(event.target.value)}
        onBlur={event => changeMaxScore(event.target.value, true)}
      />
      <div className={s.checkbox}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={visualizationStore.scoreColorLegendMaxScoreAutoValue}
              onChange={changeMaxScoreAuto}
              color="primary"
              size="small"
            />
          )}
          label="auto"
        />
      </div>
    </>
  );
});

export default ScoreOptionsPanel;
