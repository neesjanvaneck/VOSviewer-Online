import { css } from 'emotion';
import { visualizationBackgroundColors } from 'utils/variables';

export const app = (isDark) => css`
  label: app;

  &:fullscreen {
    background: ${isDark ? visualizationBackgroundColors.DARK : visualizationBackgroundColors.LIGHT};
  }
`;

export const previewIsOpen = css`
  label: preview-is-open;
`;

export const actionIcons = (previewPanelWidth) => css`
  label: action-icons;
  display: flex;
  position: absolute;
  top: 0px;
  right: 0px;

  &${`.${previewIsOpen}`} {
    right: ${previewPanelWidth}px;
  }
`;

export const vosviewerLogo = css`
  label: vosviewer-logo;
  position: absolute;
  height: 22px;
  margin: 15px;
`;

export const zetaalphaLogo = css`
  label: zetaalpha-logo;
  position: absolute;
  height: 22px;
  opacity: 0;
`;
