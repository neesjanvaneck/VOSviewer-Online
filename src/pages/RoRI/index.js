import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { Global } from "@emotion/core";

import VisualizationComponent from 'components/visualization/VisualizationComponent';
import ControlPanel from 'components/ui-rori/ControlPanel';
import LegendInfoPanel from 'components/ui-rori/LegendInfoPanel';
import LoadingScreen from 'components/ui/LoadingScreen';
import IntroDialog from 'components/ui-rori/IntroDialog';
import RoRILogo from 'components/ui-rori/Logos/RoRILogo';
import PoweredByLogo from 'components/ui-rori/Logos/PoweredByLogo';

import { UiStoreContext, VisualizationStoreContext, WebworkerStoreContext } from 'store/stores';
import { roriPantone298 } from 'utils/variables-rori';
import * as s from './styles';

const RoRI = observer(({ dataType }) => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);

  uiStore.setScoreOptionsPanelIsOpen(true);
  visualizationStore.setCanvasMarginTop(70);
  visualizationStore.setCanvasMarginBottom(80);
  uiStore.setDimmingEffect(false);
  uiStore.setGradientCircles(false);

  useEffect(() => {
    const mapURL = (dataType === 'health') ? 'data/RoRI_research_funding_landscape_2019jun_health.txt' : 'data/RoRI_research_funding_landscape_2019jun_global.txt';
    uiStore.setSizeIndex(0);
    uiStore.setColorIndex((dataType === 'health') ? 1 : 0);
    webworkerStore.openMapNetworkFile(mapURL);
  });

  const muiTheme = createTheme({
    typography: {
      fontFamily: "Nexa Light",
    },
    palette: {
      primary: {
        main: roriPantone298,
      }
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <>
        <Global styles={s.globalStyles} />
        <VisualizationComponent withoutUrlPreviewPanel withoutLinks withoutItemLabels customFont="Nexa Bold" />
        <ControlPanel />
        <LegendInfoPanel />
        <RoRILogo />
        <PoweredByLogo />
        <LoadingScreen />
        <IntroDialog type={dataType} />
      </>
    </ThemeProvider>
  );
});
export default RoRI;
