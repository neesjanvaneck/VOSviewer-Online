/* global NODE_ENV */
import React, { useContext, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import _isPlainObject from 'lodash/isPlainObject';

import VisualizationComponent from 'components/visualization/VisualizationComponent';
import Open from 'components/ui/Open';
import Save from 'components/ui/Save';
import Share from 'components/ui/Share';
import Screenshot from 'components/ui/Screenshot';
import DarkLightTheme from 'components/ui/DarkLightTheme';
import Fullscreen from 'components/ui/Fullscreen';
import Info from 'components/ui/Info';
import ControlPanel from 'components/ui/ControlPanel';
import InfoPanel from 'components/ui/InfoPanel';
import URLPanel from 'components/ui/URLPanel';
import LegendPanel from 'components/ui/LegendPanel';
import ZoomPanel from 'components/ui/ZoomPanel';
import ErrorDialog from 'components/ui/ErrorDialog';
import UnconnectedItemsDialog from 'components/ui/UnconnectedItemsDialog';
import LoadingScreen from 'components/ui/LoadingScreen';
import vosviewerLogoLowRes from 'assets/images/vosviewer-logo-low-res.png';
import vosviewerLogoHighRes from 'assets/images/vosviewer-logo-high-res.png';
import vosviewerLogoDarkLowRes from 'assets/images/vosviewer-logo-dark-low-res.png';
import vosviewerLogoDarkHighRes from 'assets/images/vosviewer-logo-dark-high-res.png';

import {
  ClusteringStoreContext, ConfigStoreContext, VisualizationStoreContext, LayoutStoreContext, UiStoreContext, QueryStringStoreContext, WebworkerStoreContext
} from 'store/stores';
import { getProxyUrl } from 'utils/helpers';
import { parameterKeys, panelBackgroundColors, visualizationBackgroundColors } from 'utils/variables';
import 'utils/fonts/Roboto'
import * as s from './style';

const VOSviewer = observer(({ queryString = {}, fullscreenHandle }) => {
  const clusteringStore = useContext(ClusteringStoreContext);
  const configStore = useContext(ConfigStoreContext);
  const layoutStore = useContext(LayoutStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const queryStringStore = useContext(QueryStringStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);
  const vosviewerLogoEl = useRef(null);

  useEffect(() => {
    queryStringStore.init(queryString);
    if (_isPlainObject(queryStringStore.parameters)) {
      visualizationStore.updateStore({ parameters: queryStringStore.parameters });
      uiStore.updateStore({ parameters: queryStringStore.parameters });
      layoutStore.updateStore({ parameters: queryStringStore.parameters });
      clusteringStore.updateStore({ parameters: queryStringStore.parameters });
      configStore.updateStore({ parameters: queryStringStore.parameters });
    }

    const proxy = (NODE_ENV !== 'development') ? configStore.proxyUrl : undefined;
    let mapURL = getProxyUrl(proxy, queryString[parameterKeys.MAP]);
    let networkURL = getProxyUrl(proxy, queryString[parameterKeys.NETWORK]);
    let jsonURL = queryString[parameterKeys.JSON] instanceof Object ? queryString[parameterKeys.JSON] : getProxyUrl(proxy, queryString[parameterKeys.JSON]);
    if (NODE_ENV === 'development' && !mapURL && !networkURL && !jsonURL) {
      mapURL = 'data/JOI_2007-2016_co-authorship_map.txt';
      networkURL = 'data/JOI_2007-2016_co-authorship_network.txt';
    } else if (!mapURL && !networkURL && !jsonURL) {
      mapURL = getProxyUrl(proxy, configStore.parameters.map);
      networkURL = getProxyUrl(proxy, configStore.parameters.network);
      jsonURL = getProxyUrl(proxy, configStore.parameters.json);
    }

    if (mapURL || networkURL) {
      webworkerStore.openMapNetworkFile(mapURL, networkURL);
    } else if (jsonURL) {
      webworkerStore.openJsonFile(jsonURL);
    } else {
      uiStore.setIntroDialogIsOpen(true);
      configStore.setUrlPreviewPanelIsOpen(false);
      uiStore.setLoadingScreenIsOpen(false);
    }
  }, []);

  useEffect(() => {
    visualizationStore.setGetLogoImages(() => ([vosviewerLogoEl.current]));
  }, [vosviewerLogoEl]);

  const muiTheme = (isDark) => {
    const { uiStyle } = configStore;
    const theme = createTheme({
      typography: {
        fontFamily: uiStyle.font_family,
        useNextVariants: true,
      },
      palette: {
        mode: isDark ? 'dark' : 'light',
        background: {
          default: isDark ? visualizationBackgroundColors.DARK : visualizationBackgroundColors.LIGHT,
          paper: isDark ? panelBackgroundColors.DARK : panelBackgroundColors.LIGHT,
        },
        primary: {
          main: uiStyle.palette_primary_main_color,
        },
      },
      components: {
        MuiAccordion: {
          defaultProps: {
            disableGutters: true,
          },
          styleOverrides: {
            root: {
              boxShadow: 'none',
              backgroundImage: 'none',
              backgroundColor: 'transparent',
              '&:before': {
                backgroundColor: 'transparent',
              },
            },
          },
        },
        MuiAccordionDetails: {
          styleOverrides: {
            root: {
              padding: '0px 0px 12px',
            },
          },
        },
        MuiAccordionSummary: {
          styleOverrides: {
            root: {
              padding: '0px',
            },
          },
        },
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
          styleOverrides: {
            root: {
              margin: '4px 0px 12px 0px',
              width: '100%',
            },
          },
        },
        MuiFormControlLabel: {
          styleOverrides: {
            label: {
              fontSize: '0.875rem',
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              fontSize: '0.875rem',
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              fontSize: '0.875rem',
            },
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
        MuiSwitch: {
          defaultProps: {
            size: 'small',
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              fontSize: '0.875rem',
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
    return theme;
  };

  return (
    <ThemeProvider theme={muiTheme(uiStore.darkTheme)}>
      <div className={s.app(uiStore.darkTheme)}>
        <VisualizationComponent customFont={configStore.uiStyle.font_family} />
        <img
          className={s.vosviewerLogo}
          src={uiStore.darkTheme ? vosviewerLogoDarkLowRes : vosviewerLogoLowRes}
          srcSet={`${uiStore.darkTheme ? vosviewerLogoDarkHighRes : vosviewerLogoHighRes} 2x`}
          alt="VOSviewer"
          ref={vosviewerLogoEl}
        />
        <div className={`${s.actionIcons(configStore.urlPreviewPanelWidth)} ${configStore.urlPreviewPanel ? s.previewIsOpen : ''}`}>
          <Open />
          <Save />
          <Share />
          <Screenshot />
          <DarkLightTheme />
          <Info />
          <Fullscreen enter={fullscreenHandle.enter} exit={fullscreenHandle.exit} active={fullscreenHandle.active} />
        </div>
        <URLPanel />
        <LegendPanel />
        <InfoPanel />
        <ZoomPanel />
        <ControlPanel />
        <ErrorDialog />
        <UnconnectedItemsDialog />
        <LoadingScreen />
      </div>
    </ThemeProvider>
  );
});
export default VOSviewer;
