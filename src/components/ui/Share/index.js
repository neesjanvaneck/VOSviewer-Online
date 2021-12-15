/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useContext, useRef, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, FormControlLabel, Switch, TextField, Tooltip, Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ShareIcon from '@material-ui/icons/Share';
import QRCode from 'qrcode.react';
import _cloneDeep from 'lodash/cloneDeep';
import TinyURL from 'tinyurl';

import { ConfigStoreContext, QueryStringStoreContext, UiStoreContext } from 'store/stores';
import { parameterKeys } from 'utils/variables';
import vosviewerIcon from 'assets/images/vosviewer-favicon.png';
import * as s from './styles';

const Share = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const queryStringStore = useContext(QueryStringStoreContext);
  const uiStore = useContext(UiStoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isShortLink, setIsShortLink] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const qrImageEl = useRef(null);

  useEffect(async () => {
    setShareUrl(isShortLink ? await getShortenedShareURL() : getShareURL());
    setEmbedCode(getEmbedCode(isShortLink ? await getShortenedShareURL(true) : getShareURL(true)));
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

  const copyImageToClipboard = (id) => {
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

  const getShareURL = (isEmbedded = false) => {
    const { origin, pathname } = window.location;
    const queryObject = getQueryObject();
    if (isEmbedded) queryObject[parameterKeys.SIMPLE_UI] = true;
    const queryString = Object.keys(queryObject).reduce((acc, key, idx) => `${acc}${idx === 0 ? '?' : '&'}${key}=${queryObject[key]}`, '');
    return `${origin}${pathname}${queryString}`;
  };

  const getShortenedShareURL = async (isEmbedded = false) => {
    const url = await TinyURL.shorten(getShareURL(isEmbedded));
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
    return result;
  };

  return (
    <>
      {configStore.uiConfig.share_icon && (uiStore.jsonQueryStringValue || uiStore.mapQueryStringValue || uiStore.networkQueryStringValue)
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
              <DialogTitle>Share</DialogTitle>
              <DialogContent classes={{ root: s.dialogContent }}>
                <IconButton className={s.closeButton} onClick={exitShareDialog}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography className={s.qrCodeLabel}>QR code</Typography>
                <div className={s.qrCodeBox}>
                  <a ref={qrImageEl} style={{ display: 'none' }} />
                  <QRCode
                    id="qr-code-image"
                    value={getShareURL()}
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
                    onClick={() => copyImageToClipboard('qr-code-image')}
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
                <div className={s.switchBox}>
                  <FormControlLabel
                    classes={{ label: s.switchLabel }}
                    control={(
                      <Switch
                        checked={isShortLink}
                        onChange={event => setIsShortLink(event.target.checked)}
                        color="primary"
                      />
                    )}
                    label="Short link"
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
                    value={shareUrl}
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
