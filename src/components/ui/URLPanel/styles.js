import { css } from '@emotion/css';

export const urlPreviewPanel = (previewPanelWidth) => css`
  label: url-preview-panel;
  position: fixed;
  width: ${previewPanelWidth}px;
  height: 100%;
  top: 0;
  right: 0;
  transition: right 0.3s;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 0px 6px 1px rgba(191, 192, 193, 0.25);
`;

export const urlPreviewContent = css`
  label: url-content-box;
  width: 100%;
  height: 100%;
`;

export const iframeBox = css`
  label: iframe-box;
  height: 100%;
  border: none;
`;
