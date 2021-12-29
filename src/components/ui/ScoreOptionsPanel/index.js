import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, TextField
} from '@mui/material';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const ScoreOptionsPanel = observer(() => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  const handleScoreOptionsPanelKeyDown = (event) => {
    if (event.key === 'Enter') {
      uiStore.setScoreOptionsPanelIsOpen(false);
    }
  };

  const normalizeScoresMenuItems = () => visualizationStore.normalizeScoresMethods.map(d => (
    <MenuItem key={d} value={d}>
      {d}
    </MenuItem>
  ));

  const changeMinScore = (minScore, onBlur) => {
    if (+minScore !== visualizationStore.scoreColorLegendAutoMinScore) {
      visualizationStore.setScoreColorLegendMinScoreAutoValue(false);
    }
    visualizationStore.updateScoreColorLegendMinScore(minScore, onBlur);
    visualizationStore.updateItems();
    visualizationStore.updateLinks();
  };

  const changeMaxScore = (maxScore, onBlur) => {
    if (+maxScore !== visualizationStore.scoreColorLegendAutoMaxScore) {
      visualizationStore.setScoreColorLegendMaxScoreAutoValue(false);
    }
    visualizationStore.updateScoreColorLegendMaxScore(maxScore, onBlur);
    visualizationStore.updateItems();
    visualizationStore.updateLinks();
  };

  const changeMinScoreAuto = () => {
    visualizationStore.setScoreColorLegendMinScoreAutoValue();
    if (visualizationStore.scoreColorLegendMinScoreAutoValue) {
      visualizationStore.updateScoreColorLegendMinScore(visualizationStore.scoreColorLegendAutoMinScore);
      visualizationStore.updateItems();
      visualizationStore.updateLinks();
    }
  };

  const changeMaxScoreAuto = () => {
    visualizationStore.setScoreColorLegendMaxScoreAutoValue();
    if (visualizationStore.scoreColorLegendMaxScoreAutoValue) {
      visualizationStore.updateScoreColorLegendMaxScore(visualizationStore.scoreColorLegendAutoMaxScore);
      visualizationStore.updateItems();
      visualizationStore.updateLinks();
    }
  };

  const changeNormalizeScores = normalizationMethodName => {
    visualizationStore.setNormalizeScoresMethodName(normalizationMethodName);
    visualizationStore.updateScores(visualizationStore.scoreIndex);
    visualizationStore.updateItems();
    visualizationStore.updateLinks();
  };

  return (
    <Paper className={s.scoreOptionsPanel} onKeyDown={handleScoreOptionsPanelKeyDown} elevation={3}>
      <TextField
        className={s.textField}
        label="Min. score"
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
          label="Auto"
        />
      </div>
      <span className={s.span} />
      <TextField
        className={s.textField}
        label="Max. score"
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
          label="Auto"
        />
      </div>
      <FormControl className={s.formControl}>
        <InputLabel>Normalize scores</InputLabel>
        <Select
          displayEmpty
          value={visualizationStore.normalizeScoresMethodName}
          onChange={event => changeNormalizeScores(event.target.value)}
        >
          {normalizeScoresMenuItems()}
        </Select>
      </FormControl>
    </Paper>
  );
});

export default ScoreOptionsPanel;
