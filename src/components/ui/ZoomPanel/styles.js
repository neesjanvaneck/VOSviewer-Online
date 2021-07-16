import { css } from 'emotion';
import { grey } from '@material-ui/core/colors';
import { panelMargin } from 'utils/variables';

export const previewIsOpen = css`
  label: preview-is-open;
`;

export const zoomPanel = (previewPanelWidth) => css`
  label: zoom-panel;
  position: absolute;
  top: 50%;
  right: ${panelMargin}px;
  transform: translateY(-50%);

  &${`.${previewIsOpen}`} {
    right: ${previewPanelWidth + panelMargin}px;
  }
`;

export const iconButton = css`
  label: icon-button;
  padding: 5px;
  cursor: pointer;
  user-select: none;
`;

export const icon = css`
  label: icon;
  color: ${grey[600]};
`;

export const borderTop = css`
  label: border-top;
  border-top: 1px solid ${grey[200]};
`;
