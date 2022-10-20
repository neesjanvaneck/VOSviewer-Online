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
import InfoPanel from 'components/ui-zeta-alpha/InfoPanel';
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
import { parameterKeys, defaultMuiTheme } from 'utils/variables';
import 'utils/fonts/Roboto';
import * as s from './style';

const ZetaAlpha = observer(({ queryString = {}, fullscreenHandle }) => {
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
    let mapUrl = getProxyUrl(proxy, queryString[parameterKeys.MAP]);
    let networkUrl = getProxyUrl(proxy, queryString[parameterKeys.NETWORK]);
    let jsonUrlOrObject = queryString[parameterKeys.JSON] instanceof Object ? queryString[parameterKeys.JSON] : getProxyUrl(proxy, queryString[parameterKeys.JSON]);
    if (NODE_ENV === 'development' && !mapUrl && !networkUrl && !jsonUrlOrObject) {
      jsonUrlOrObject = 'data/Zeta-Alpha_ICLR2022.json';
    } else if (!mapUrl && !networkUrl && !jsonUrlOrObject) {
      mapUrl = getProxyUrl(proxy, configStore.parameters.map);
      networkUrl = getProxyUrl(proxy, configStore.parameters.network);
      jsonUrlOrObject = getProxyUrl(proxy, configStore.parameters.json);
    }

    if (mapUrl || networkUrl) {
      webworkerStore.openMapNetworkData(mapUrl, networkUrl);
    } else if (jsonUrlOrObject) {
      webworkerStore.openJsonData(jsonUrlOrObject);
    } else {
      uiStore.setIntroDialogIsOpen(false);
      configStore.setUrlPreviewPanelIsOpen(false);
      uiStore.setLoadingScreenIsOpen(false);
    }
  }, []);

  useEffect(() => {
    visualizationStore.setGetLogoImages(() => ([vosviewerLogoEl.current, zetaalphaLogoEl.current]));
  }, [vosviewerLogoEl, zetaalphaLogoEl]);

  const muiTheme = (isDark) => {
    const { uiStyle } = configStore;
    const defaultValues = defaultMuiTheme(isDark, uiStyle);
    const theme = createTheme({
      typography: defaultValues.typography,
      palette: defaultValues.palette,
      components: {
        ...defaultValues.components,
        MuiCircularProgress: {
          styleOverrides: {
            colorPrimary: {
              color: '#757575',
            },
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
        <img className={s.zetaalphaLogo} src={uiStore.darkTheme ? zetaalphaLogoDark : zetaalphaLogo} alt="Zeta Alpha" ref={zetaalphaLogoEl} />
        <div className={`${s.actionIcons(configStore.urlPreviewPanelWidth)} ${configStore.urlPreviewPanel ? s.previewIsOpen : ''}`}>
          <Open />
          <Save />
          <Share />
          <Screenshot />
          <DarkLightTheme />
          <Fullscreen enter={fullscreenHandle.enter} exit={fullscreenHandle.exit} active={fullscreenHandle.active} />
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
