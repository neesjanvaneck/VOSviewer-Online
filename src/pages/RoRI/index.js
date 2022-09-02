import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import VisualizationComponent from 'components/visualization/VisualizationComponent';
import ControlPanel from 'components/ui-rori/ControlPanel';
import LegendInfoPanel from 'components/ui-rori/LegendInfoPanel';
import LoadingScreen from 'components/ui/LoadingScreen';
import IntroDialog from 'components/ui-rori/IntroDialog';
import RoRILogo from 'components/ui-rori/Logos/RoRILogo';
import PoweredByLogo from 'components/ui-rori/Logos/PoweredByLogo';

import { ConfigStoreContext, UiStoreContext, VisualizationStoreContext, WebworkerStoreContext } from 'store/stores';
import { roriPantone298 } from 'utils/variables-rori';
import 'utils/fonts/Nexa';

const RoRI = observer(({ dataType }) => {
  const configStore = useContext(ConfigStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);

  const parameters = {
    item_size: 0,
    item_color: (dataType === 'health') ? 2 : 1,
    dimming_effect: false,
    gradient_circles: false
  };
  configStore.init({ parameters });
  uiStore.updateStore({ parameters });
  uiStore.setScoreOptionsPanelIsOpen(true);
  visualizationStore.setCanvasMarginTop(70);
  visualizationStore.setCanvasMarginBottom(80);

  useEffect(() => {
    const mapUrl = (dataType === 'health') ? 'data/RoRI_research_funding_landscape_2019jun_health.txt' : 'data/RoRI_research_funding_landscape_2019jun_global.txt';
    webworkerStore.openMapNetworkData(mapUrl);
  });

  const muiTheme = createTheme({
    typography: {
      fontFamily: "Nexa Light",
    },
    palette: {
      primary: {
        main: roriPantone298,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 400,
            textTransform: 'none',
          },
        },
      },
      MuiFormControl: {
        defaultProps: {
          variant: 'standard',
        },
      },
      MuiSlider: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          fontSizeSmall: {
            fontSize: '1.1rem',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'standard',
        },
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <>
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
