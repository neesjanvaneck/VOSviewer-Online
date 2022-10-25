/* global IS_REACT_COMPONENT */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Switch, TextField, Tooltip, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import TinyURL from 'tinyurl';
import QRCode from 'qrcode.react';
import _cloneDeep from 'lodash/cloneDeep';

import Dialog from 'components/ui/Dialog';
import {
  ClusteringStoreContext, ConfigStoreContext, LayoutStoreContext, QueryStringStoreContext, UiStoreContext, VisualizationStoreContext 
} from 'store/stores';
import { parameterKeys, defaultParameterValues } from 'utils/variables';
import vosviewerIcon from 'assets/images/vosviewer-favicon.png';
import * as s from './styles';

const Share = observer(() => {
  const clusteringStore = useContext(ClusteringStoreContext);
  const configStore = useContext(ConfigStoreContext);
  const layoutStore = useContext(LayoutStoreContext);
  const queryStringStore = useContext(QueryStringStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const [useShortLink, setUseShortLink] = useState(true);
  const [useCustomSettings, setUseCustomSettings] = useState(false);
  const [link, setLink] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const qrImageEl = useRef(null);

  useEffect(() => {
    // https://github.com/facebook/react/issues/14326
    async function setLinkAndEmbedCode() {
      setLink(useShortLink ? await getShortenedLink() : getLink());
      setEmbedCode(getEmbedCode(useShortLink ? await getShortenedLink(true) : getLink(true)));
    }
    setLinkAndEmbedCode();
  });

  const showShareDialog = () => {
    setIsOpen(!isOpen);
  };

  const exitShareDialog = () => {
    setIsOpen(!isOpen);
  };

  const downloadQRImage = (id) => {
    const canvas = document.getElementById(id);
    qrImageEl.current.href = canvas.toDataURL("image/png");
    qrImageEl.current.download = `VOSviewer-QR-code.png`;
    qrImageEl.current.click();
  };

  const copyQRImageToClipboard = (id) => {
    const canvas = document.getElementById(id);
    canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));
  };

  const copyTextToClickboard = (id) => {
    const textInput = document.getElementById(id);
    textInput.select();
    try {
      return document.execCommand("copy");
    } catch (err) {
      return false;
    }
  };

  const getLink = (isEmbedded = false) => {
    const { origin, pathname } = window.location;
    const queryObject = getQueryObject();
    if (isEmbedded) queryObject[parameterKeys.SIMPLE_UI] = true;
    const queryString = Object.keys(queryObject).reduce((acc, key, idx) => `${acc}${idx === 0 ? '?' : '&'}${key}=${queryObject[key]}`, '');
    return `${origin}${pathname}${queryString}`;
  };

  const getShortenedLink = async (isEmbedded = false) => {
    const url = await TinyURL.shorten(getLink(isEmbedded));
    return url;
  };

  const getEmbedCode = (url) => `<iframe allowfullscreen="true" src="${url}" width="100%" height="75%" style="border: 1px solid #ddd; max-width: 1000px; min-height: 500px"></iframe>`;

  const getQueryObject = () => {
    const result = _cloneDeep(queryStringStore.parameters);
    if (result[parameterKeys.JSON]) {
      result[parameterKeys.JSON] = encodeURIComponent(result[parameterKeys.JSON]);
    }
    if (result[parameterKeys.MAP]) {
      result[parameterKeys.MAP] = encodeURIComponent(result[parameterKeys.MAP]);
    }
    if (result[parameterKeys.NETWORK]) {
      result[parameterKeys.NETWORK] = encodeURIComponent(result[parameterKeys.NETWORK]);
    }
    if (useCustomSettings) {
      Object.keys(defaultParameterValues).forEach(key => {
        switch (key) {
          // Layout and clustering.
          case parameterKeys.ATTRACTION:
            if (layoutStore.attraction !== configStore.parameters[key]) {
              result[key] = layoutStore.attraction;
            }
            break;
          case parameterKeys.MERGE_SMALL_CLUSTERS:
            if (clusteringStore.mergeSmallClusters !== configStore.parameters[key]) {
              result[key] = clusteringStore.mergeSmallClusters;
            }
            break;
          case parameterKeys.MIN_CLUSTER_SIZE:
            if (clusteringStore.minClusterSize !== configStore.parameters[key]) {
              result[key] = clusteringStore.minClusterSize;
            }
            break;
          case parameterKeys.REPULSION:
            if (layoutStore.repulsion !== configStore.parameters[key]) {
              result[key] = layoutStore.repulsion;
            }
            break;
          case parameterKeys.RESOLUTION:
            if (clusteringStore.resolution !== configStore.parameters[key]) {
              result[key] = clusteringStore.resolution;
            }
            break;
          // Visualization.
          case parameterKeys.COLORED_LINKS:
            if (uiStore.coloredLinks !== configStore.parameters[key]) {
              result[parameterKeys.COLORED_LINKS] = uiStore.coloredLinks;
            }
            break;
          case parameterKeys.CURVED_LINKS:
            if (uiStore.curvedLinks !== configStore.parameters[key]) {
              result[key] = uiStore.curvedLinks;
            }
            break;
          case parameterKeys.DIMMING_EFFECT:
            if (uiStore.dimmingEffect !== configStore.parameters[key]) {
              result[key] = uiStore.dimmingEffect;
            }
            break;
          case parameterKeys.GRADIENT_CIRCLES:
            if (uiStore.gradientCircles !== configStore.parameters[key]) {
              result[key] = uiStore.gradientCircles;
            }
            break;
          case parameterKeys.ITEM_COLOR:
            if (uiStore.colorIndex !== configStore.parameters[key] - 1) {
              result[key] = uiStore.colorIndex + 1;
            }
            break;
          case parameterKeys.ITEM_SIZE:
            if (uiStore.sizeIndex !== configStore.parameters[key] - 1) {
              result[key] = uiStore.sizeIndex + 1;
            }
            break;
          case parameterKeys.ITEM_SIZE_VARIATION:
            if (uiStore.itemSizeVariation !== configStore.parameters[key]) {
              result[key] = uiStore.itemSizeVariation;
            }
            break;
          case parameterKeys.LINK_SIZE_VARIATION:
            if (uiStore.linkSizeVariation !== configStore.parameters[key]) {
              result[key] = uiStore.linkSizeVariation;
            }
            break;
          case parameterKeys.MAX_LABEL_LENGTH:
            if (uiStore.maxLabelLength !== configStore.parameters[key]) {
              result[key] = uiStore.maxLabelLength;
            }
            break;
          case parameterKeys.MAX_N_LINKS:
            if (uiStore.maxNLinks !== configStore.parameters[key]) {
              result[key] = uiStore.maxNLinks;
            }
            break;
          case parameterKeys.MAX_SCORE:
            if (visualizationStore.scoreColorLegendMaxScore !== configStore.parameters[key] && !visualizationStore.scoreColorLegendMaxScoreAutoValue) {
              result[key] = visualizationStore.scoreColorLegendMaxScore;
            }
            break;
          case parameterKeys.MIN_LINK_STRENGTH:
            if (uiStore.minLinkStrength !== configStore.parameters[key]) {
              result[key] = uiStore.minLinkStrength;
            }
            break;
          case parameterKeys.MIN_SCORE:
            if (visualizationStore.scoreColorLegendMinScore !== configStore.parameters[key] && !visualizationStore.scoreColorLegendMinScoreAutoValue) {
              result[key] = visualizationStore.scoreColorLegendMinScore;
            }
            break;
          case parameterKeys.SCALE:
            if (uiStore.scale !== configStore.parameters[key]) {
              result[key] = uiStore.scale;
            }
            break;
          case parameterKeys.SCORE_COLORS_SCHEME:
            if (visualizationStore.scoreColorsSchemeName !== configStore.parameters[key] && visualizationStore.scoreColorsSchemeName !== 'custom') {
              result[key] = visualizationStore.scoreColorsSchemeName;
            }
            break;
          case parameterKeys.SHOW_ITEM:
            if (visualizationStore.clickedItem) {
              result[key] = encodeURIComponent(visualizationStore.clickedItem.label);
            }
            break;
          // UI.
          case parameterKeys.DARK_UI:
            if (uiStore.darkTheme !== configStore.parameters[key]) {
              result[key] = uiStore.darkTheme;
            }
            break;
          default:
            break;
        }
      });
    }
    return result;
  };

  return (
    <>
      {!IS_REACT_COMPONENT && configStore.uiConfig.share_icon && (uiStore.jsonQueryStringValue || uiStore.mapQueryStringValue || uiStore.networkQueryStringValue)
        && (
          <>
            <div
              className={s.shareButton}
              onClick={showShareDialog}
            >
              <Tooltip title="Share">
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Dialog
              open={isOpen}
              onClose={exitShareDialog}
              fullWidth
            >
              <DialogTitle>
                Share
                <IconButton className={s.closeButton} onClick={exitShareDialog}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </DialogTitle>
              <DialogContent classes={{ root: s.dialogContent }}>
                <div className={s.switchBox}>
                  <FormControlLabel
                    classes={{ label: s.switchLabel }}
                    control={(
                      <Switch
                        checked={useShortLink}
                        onChange={event => setUseShortLink(event.target.checked)}
                        color="primary"
                      />
                    )}
                    label="Short link"
                    labelPlacement="start"
                  />
                </div>
                <div className={s.switchBox}>
                  <FormControlLabel
                    classes={{ label: s.switchLabel }}
                    control={(
                      <Switch
                        checked={useCustomSettings}
                        onChange={event => setUseCustomSettings(event.target.checked)}
                        color="primary"
                      />
                    )}
                    label="Custom visualization settings"
                    labelPlacement="start"
                  />
                </div>
                <div className={s.inputBox}>
                  <TextField
                    id="share-link-input"
                    className={s.input}
                    label="Link"
                    multiline
                    maxRows={3}
                    value={link}
                    InputProps={{ readOnly: true }}
                  />
                  <Button
                    className={s.copyButton}
                    variant="outlined"
                    onClick={() => copyTextToClickboard('share-link-input')}
                  >
                    Copy
                  </Button>
                </div>
                <div className={s.inputBox}>
                  <TextField
                    id="share-embed-code-input"
                    className={s.input}
                    label="Embed code"
                    multiline
                    maxRows={3}
                    value={embedCode}
                    InputProps={{ readOnly: true }}
                  />
                  <Button
                    className={s.copyButton}
                    variant="outlined"
                    onClick={() => copyTextToClickboard('share-embed-code-input')}
                  >
                    Copy
                  </Button>
                </div>
                <Typography className={s.qrCodeLabel}>QR code</Typography>
                <div className={s.qrCodeBox}>
                  <a ref={qrImageEl} style={{ display: 'none' }} />
                  <QRCode
                    id="qr-code-image"
                    value={link}
                    size={90}
                    level="L"
                    renderAs="canvas"
                    imageSettings={{
                      src: `${vosviewerIcon}`,
                      x: null,
                      y: null,
                      height: 15,
                      width: 15,
                      excavate: false,
                    }}
                  />
                  <Button
                    className={s.copyButton}
                    variant="outlined"
                    onClick={() => copyQRImageToClipboard('qr-code-image')}
                  >
                    Copy
                  </Button>
                  <Button
                    className={s.downloadButton}
                    variant="outlined"
                    onClick={() => downloadQRImage('qr-code-image')}
                  >
                    Download
                  </Button>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={exitShareDialog} color="primary" autoFocus>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )
      }
    </>
  );
});

export default Share;
