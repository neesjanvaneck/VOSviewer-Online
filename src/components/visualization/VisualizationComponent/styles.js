import { css } from 'emotion';

export const visContainer = (urlPreviewPanel, previewPanelWidth) => css`
  label: vis-container;
  position: absolute;
  top: 0;
  height: 100%;
  width: calc(100% - ${urlPreviewPanel ? previewPanelWidth : 0}px);
`;
