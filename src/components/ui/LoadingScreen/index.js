import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import { ClusteringStoreContext, LayoutStoreContext, UiStoreContext } from 'store/stores';
import { processTypes, processDescriptions } from 'utils/variables';
import * as s from './styles';

const LoadingScreen = observer(() => {
  const clusteringStore = useContext(ClusteringStoreContext);
  const layoutStore = useContext(LayoutStoreContext);
  const uiStore = useContext(UiStoreContext);

  const onKeyDown = e => {
    if (
      e.keyCode === 27
      && uiStore.loadingScreenIsOpen
      && (uiStore.loadingScreenProcessType === processTypes.RUNNING_LAYOUT || uiStore.loadingScreenProcessType === processTypes.RUNNING_CLUSTERING)
    ) {
      if (uiStore.loadingScreenProcessType === processTypes.RUNNING_LAYOUT) layoutStore.setCanceled(true);
      if (uiStore.loadingScreenProcessType === processTypes.RUNNING_CLUSTERING) clusteringStore.setCanceled(true);
      uiStore.setLoadingScreenIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, false);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const progressWithLabel = () => (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={Math.round(uiStore.loadingScreenProgressValue)} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(uiStore.loadingScreenProgressValue)}%`}
        </Typography>
      </Box>
    </Box>
  );

  const progress = () => (<CircularProgress />);

  const getProgressElement = () => {
    switch (uiStore.loadingScreenProcessType) {
      case processTypes.RUNNING_LAYOUT:
        return layoutStore.nRandomStarts > 1 ? progressWithLabel() : progress();
      case processTypes.RUNNING_CLUSTERING:
        return clusteringStore.nRandomStarts > 1 ? progressWithLabel() : progress();
      case processTypes.READING_MAP_DATA:
      case processTypes.READING_NETWORK_DATA:
      case processTypes.READING_JSON_DATA:
      case processTypes.PROCESSING_DATA:
      default:
        return progress();
    }
  };

  return (
    <div className={`${s.loadingScreen(uiStore.darkTheme)} ${uiStore.loadingScreenIsOpen ? '' : s.hidden}`}>
      <div className={s.progressBox}>
        {getProgressElement()}
        <Typography className={s.description} variant="caption" component="div" color="textSecondary">
          { processDescriptions[uiStore.loadingScreenProcessType] }
        </Typography>
      </div>
    </div>
  );
});

export default LoadingScreen;
