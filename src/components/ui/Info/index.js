import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link, Menu, MenuItem, Tooltip, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

import { ConfigStoreContext, FileDataStoreContext, UiStoreContext } from 'store/stores';
import { cleanPlainText, parseFormattedText } from 'utils/helpers2';
import vosviewerOnlineLogo from 'assets/images/vosviewer-online-logo.svg';
import vosviewerOnlineLogoDark from 'assets/images/vosviewer-online-logo-dark.svg';
import * as s from './styles';

const Info = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const fileDataStore = useContext(FileDataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const [infoMenuAnchorEl, setInfoMenuAnchorEl] = useState(null);
  const [aboutDialogIsOpen, setAboutDialogIsOpen] = useState(false);

  const openInfoMenu = (event) => {
    setInfoMenuAnchorEl(event.currentTarget);
  };

  const exitInfoMenu = () => {
    setInfoMenuAnchorEl(null);
  };

  const showInfoDialog = () => {
    exitInfoMenu();
    uiStore.setInfoDialogIsOpen(!uiStore.infoDialogIsOpen);
  };

  const exitInfoDialog = () => {
    uiStore.setInfoDialogIsOpen(!uiStore.infoDialogIsOpen);
  };

  const openDocsUrl = () => {
    exitInfoMenu();
    window.open(configStore.docsUrl, "_blank");
  };

  const showAboutDialog = () => {
    exitInfoMenu();
    setAboutDialogIsOpen(!aboutDialogIsOpen);
  };

  const exitAboutDialog = () => {
    setAboutDialogIsOpen(!aboutDialogIsOpen);
  };

  return (
    <>
      {configStore.docsUrl || (fileDataStore.title && fileDataStore.description) ? (
        <div className={s.infoButton}>
          <Tooltip title="Info">
            <IconButton aria-controls="info-menu" onClick={openInfoMenu}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="info-menu"
            anchorEl={infoMenuAnchorEl}
            open={Boolean(infoMenuAnchorEl)}
            onClose={exitInfoMenu}
          >
            {fileDataStore.title && fileDataStore.description && (
              <MenuItem onClick={showInfoDialog} divider>Visualization information</MenuItem>
            )}
            {configStore.docsUrl && (
              <MenuItem onClick={openDocsUrl}>VOSviewer Online Docs</MenuItem>
            )}
            <MenuItem onClick={showAboutDialog}>About VOSviewer Online</MenuItem>
          </Menu>
        </div>
      ) : (
        <div
          className={s.infoButton}
          onClick={showAboutDialog}
        >
          <Tooltip title="About">
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}

      <Dialog
        open={uiStore.infoDialogIsOpen}
        onClose={exitInfoDialog}
        fullWidth
      >
        <DialogTitle>
          { cleanPlainText(fileDataStore.title) }
          <IconButton className={s.closeButton} onClick={exitInfoDialog}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: s.dialogContent }} align="justify">
          { parseFormattedText(fileDataStore.description) }
        </DialogContent>
        <DialogActions>
          <Button onClick={exitInfoDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={aboutDialogIsOpen}
        onClose={exitAboutDialog}
        fullWidth
      >
        <DialogTitle>
          <img className={s.logo} src={uiStore.darkTheme ? vosviewerOnlineLogoDark : vosviewerOnlineLogo} alt="VOSviewer Online" />
          <IconButton className={s.closeButton} onClick={exitAboutDialog}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: s.dialogContent }}>
          <Typography variant="body1" align="justify" paragraph>
            VOSviewer Online has been developed by
            {' '}
            <Link href="https://orcid.org/0000-0001-8448-4521" target="_blank" underline="always" color="inherit">Nees Jan van Eck</Link>
            {' '}
            and
            {' '}
            <Link href="https://orcid.org/0000-0001-8249-1752" target="_blank" underline="always" color="inherit">Ludo Waltman</Link>
            {' '}
            at the
            {' '}
            <Link href="https://www.cwts.nl" target="_blank" underline="always" color="inherit">Centre for Science and Technology Studies (CWTS)</Link>
            {' '}
            at
            {' '}
            <Link href="https://www.universiteitleiden.nl/en" target="_blank" underline="always" color="inherit">Leiden University</Link>
            .
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            The development of VOSviewer Online has benefited from contributions by
            {' '}
            <Link href="https://interacta.io" target="_blank" underline="always" color="inherit">Interacta</Link>
            .
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            The development of VOSviewer Online has been supported financially by
            {' '}
            <Link href="https://www.digital-science.com" target="_blank" underline="always" color="inherit">Digital Science</Link>
            {' '}
            and
            {' '}
            <Link href="https://www.zeta-alpha.com" target="_blank" underline="always" color="inherit">Zeta Alpha</Link>
            .
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            VOSviewer Online has been developed in JavaScript using
            {' '}
            <Link href="https://github.com/facebook/react" target="_blank" underline="always" color="inherit">React</Link>
            ,
            {' '}
            <Link href="https://github.com/mui-org/material-ui" target="_blank" underline="always" color="inherit">Material-UI</Link>
            ,
            {' '}
            <Link href="https://github.com/d3/d3" target="_blank" underline="always" color="inherit">D3</Link>
            , and a few other open source libraries. The source code is available on
            {' '}
            <Link href="https://github.com/neesjanvaneck/VOSviewer-Online" target="_blank" underline="always" color="inherit">GitHub</Link>
            .
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            VOSviewer Online is distributed under the
            {' '}
            <Link href="https://github.com/neesjanvaneck/VOSviewer-Online/blob/master/LICENSE" target="_blank" underline="always" color="inherit">MIT license</Link>
            .
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={exitAboutDialog} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Info;
