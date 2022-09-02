import { css } from '@emotion/css';
import { visualizationBackgroundColors } from 'utils/variables';

export const app = (isDark) => css`
  label: app;

  background: ${isDark ? visualizationBackgroundColors.DARK : visualizationBackgroundColors.LIGHT};
`;

export const previewIsOpen = css`
  label: preview-is-open;
`;

export const actionIcons = (previewPanelWidth) => css`
  label: action-icons;
  display: flex;
  position: absolute;
  top: 3px;
  right: 3px;

  &${`.${previewIsOpen}`} {
    right: ${previewPanelWidth}px;
  }
`;

export const vosviewerLogo = css`
  label: vosviewer-logo;
  position: absolute;
  height: 22px;
  margin: 12px;
`;

export const dimensionsLogo = css`
  label: dimensions-logo;
  position: absolute;
  height: 18px;
  opacity: 0;
`;
