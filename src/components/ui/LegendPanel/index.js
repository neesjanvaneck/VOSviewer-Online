import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Paper } from '@material-ui/core';

import { ConfigStoreContext, FileDataStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { controlPanelWidth, panelMargin, panelPadding, legendPanelMaxWidth } from 'utils/variables';
import SizeLegend from 'components/ui/SizeLegend';
import ClusterColorLegend from 'components/ui/ClusterColorLegend';
import ScoreColorLegend from 'components/ui/ScoreColorLegend';
import ScoreOptionsPanel from 'components/ui/ScoreOptionsPanel';
import * as s from './styles';

const sizeLegendPanelWidth = 76;

const LegendPanel = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const fileDataStore = useContext(FileDataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const [showTopClustersOnly, setShowTopClustersOnly] = useState(true);

  const showHideScoreOptionsPanel = () => {
    event.stopPropagation();
    uiStore.setScoreOptionsPanelIsOpen();
  };

  const showMoreLessClusterLabels = () => {
    setShowTopClustersOnly(!showTopClustersOnly);
  };

  const noOverlapLegendPanelAndInfoPanel = () => {
    let legendPanelWidth = sizeLegendPanelWidth + 2 * panelPadding;
    if ((uiStore.colorIndex > 0) || (uiStore.colorIndex === 0 && fileDataStore.clusters.size)) {
      legendPanelWidth = legendPanelMaxWidth;
    }
    return legendPanelWidth + 2 * panelMargin < uiStore.windowInnerWidth - (uiStore.controlPanelIsOpen ? controlPanelWidth : 0) - (configStore.urlPreviewPanel ? configStore.urlPreviewPanelWidth : 0) - uiStore.infoPanelWidth - panelMargin;
  };

  const showSizeLegend = visualizationStore.weightKeysCustomTerminology && visualizationStore.weightKeysCustomTerminology.length > 0;
  const showScoreColorLegend = uiStore.colorIndex > 0;
  const showClusterColorLegend = uiStore.colorIndex === 0 && fileDataStore.clusters && fileDataStore.clusters.size > 0;
  const showLegend = configStore.uiConfig.legend_panel && (showSizeLegend || showScoreColorLegend || showClusterColorLegend);

  return (
    <>
      {showLegend
        && (
          <div
            className={`${s.legendContainer(visualizationStore.items.length && noOverlapLegendPanelAndInfoPanel(), configStore.urlPreviewPanelWidth)} ${configStore.urlPreviewPanel ? s.previewIsOpen : ''}`}
          >
            {uiStore.scoreOptionsPanelIsOpen
              && (
                <ScoreOptionsPanel />
              )
            }
            <Paper className={s.legendPanel} elevation={3}>
              {
                showSizeLegend ? (
                  <div
                    className={s.sizeLegend(
                      sizeLegendPanelWidth,
                      uiStore.colorIndex > 0,
                      uiStore.colorIndex === 0 && fileDataStore.clusters.size
                    )}
                  >
                    <SizeLegend
                      canvasWidth={sizeLegendPanelWidth}
                      canvasHeight={48}
                      customFont={configStore.uiStyle.font_family}
                    />
                  </div>
                ) : null
              }
              {
                showScoreColorLegend ? (
                  <div
                    className={s.colorLegend}
                    onClick={() => showHideScoreOptionsPanel()}
                  >
                    <ScoreColorLegend
                      canvasWidth={legendPanelMaxWidth - 2 * panelPadding - sizeLegendPanelWidth - panelPadding}
                      canvasHeight={48}
                      customFont={configStore.uiStyle.font_family}
                    />
                  </div>
                  ) : null
              }
              {
                showClusterColorLegend ? (
                  <div
                    className={s.colorLegend}
                    onClick={() => showMoreLessClusterLabels()}
                  >
                    <ClusterColorLegend
                      showTopClustersOnly={showTopClustersOnly}
                      canvasWidth={legendPanelMaxWidth - 2 * panelPadding}
                      legendWidth={legendPanelMaxWidth - 2 * panelPadding - sizeLegendPanelWidth}
                      customFont={configStore.uiStyle.font_family}
                    />
                  </div>
                ) : null
              }
            </Paper>
          </div>
        )
      }
    </>
  );
});

export default LegendPanel;
