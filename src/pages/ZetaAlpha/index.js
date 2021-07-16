/* global NODE_ENV */
import React, { useContext, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
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
import zetaalphaLogo from 'assets/images/zeta-alpha-logo.svg';
import zetaalphaLogoDark from 'assets/images/zeta-alpha-logo-dark.svg';

import {
  ClusteringStoreContext, ConfigStoreContext, LayoutStoreContext, UiStoreContext, VisualizationStoreContext, QueryStringStoreContext, WebworkerStoreContext
} from 'store/stores';
import { getProxyUrl } from 'utils/helpers';
import { parameterKeys, panelBackgroundColors, visualizationBackgroundColors } from 'utils/variables';
import * as s from './style';

const ZetaAlpha = observer(({ queryString }) => {
  const clusteringStore = useContext(ClusteringStoreContext);
  const configStore = useContext(ConfigStoreContext);
  const layoutStore = useContext(LayoutStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const queryStringStore = useContext(QueryStringStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);
  const vosviewerLogoEl = useRef(null);
  const zetaalphaLogoEl = useRef(null);

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
    let jsonURL = getProxyUrl(proxy, queryString[parameterKeys.JSON]);
    if (NODE_ENV === 'development' && !mapURL && !networkURL && !jsonURL) {
      jsonURL = 'data/Zeta-Alpha_ICLR2021.json';
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
      configStore.setUrlPreviewPanelIsOpen(false);
      uiStore.setLoadingScreenIsOpen(false);
    }
  }, []);

  useEffect(() => {
    visualizationStore.setGetLogoImages(() => ([vosviewerLogoEl.current, zetaalphaLogoEl.current]));
  }, [vosviewerLogoEl, zetaalphaLogoEl]);

  const muiTheme = (isDark) => {
    const { uiStyle } = configStore;
    const theme = createTheme({
      typography: {
        fontFamily: uiStyle.font_family,
        useNextVariants: true,
      },
      palette: {
        type: isDark ? 'dark' : 'light',
        background: {
          default: isDark ? visualizationBackgroundColors.DARK : visualizationBackgroundColors.LIGHT,
          paper: isDark ? panelBackgroundColors.DARK : panelBackgroundColors.LIGHT,
        },
        primary: {
          main: uiStyle.palette_primary_main_color,
        },
      }
    });

    theme.overrides = {
      MuiInputBase: {
        root: {
          fontSize: '0.875rem',
        },
      },
      MuiMenuItem: {
        root: {
          fontSize: '0.875rem',
        },
      },
      MuiButton: {
        label: {
          fontWeight: 400,
          textTransform: 'none',
        }
      },
      MuiAccordion: {
        root: {
          'box-shadow': 'none',
          'background-color': 'transparent',
          '&:before': {
            'background-color': 'transparent',
          },
          '&$expanded': {
            margin: '0px 0px 12px',
          },
        }
      },
      MuiAccordionSummary: {
        root: {
          padding: '0px',
          height: '48px',
          '&$expanded': {
            height: '48px',
            'min-height': '48px',
          },
        }
      },
      MuiAccordionDetails: {
        root: {
          padding: '0px',
        }
      },
      MuiListItem: {
        root: {
          'padding-top': '0px',
          'padding-bottom': '0px',
        }
      },
      MuiListItemText: {
        root: {
          'margin-top': '0px',
          'margin-bottom': '0px',
        }
      },
      MuiTab: {
        root: {
          fontSize: theme.typography.pxToRem(13),
        }
      },
      MuiSvgIcon: {
        fontSizeSmall: {
          fontSize: theme.typography.pxToRem(20),
        }
      },
      MuiFormControl: {
        root: {
          margin: '4px 0px 12px 0px',
          width: '100%',
        }
      },
      MuiFormControlLabel: {
        label: {
          fontSize: theme.typography.pxToRem(14),
        }
      },
      MuiCircularProgress: {
        colorPrimary: {
          color: '#757575',
        },
      }
    };
    return theme;
  };

  return (
    <ThemeProvider theme={muiTheme(uiStore.darkTheme)}>
      <div className={s.app(uiStore.darkTheme)}>
        <CssBaseline />
        <VisualizationComponent customFont={configStore.uiStyle.font_family} />
        <img
          className={s.vosviewerLogo}
          src={uiStore.darkTheme ? vosviewerLogoDarkLowRes : vosviewerLogoLowRes}
          srcSet={`${uiStore.darkTheme ? vosviewerLogoDarkHighRes : vosviewerLogoHighRes} 2x`}
          alt="VOSviewer"
          ref={vosviewerLogoEl}
        />
        <img className={s.zetaalphaLogo} src={uiStore.darkTheme ? zetaalphaLogoDark : zetaalphaLogo} alt="Zeta Alpha" ref={zetaalphaLogoEl} />
        <div className={`${s.actionIcons(configStore.urlPreviewPanelWidth)} ${configStore.urlPreviewPanel ? s.previewIsOpen : ''}`}>
          <Open />
          <Save />
          <Share />
          <Screenshot />
          <DarkLightTheme />
          <Fullscreen />
          <Info />
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
export default ZetaAlpha;
