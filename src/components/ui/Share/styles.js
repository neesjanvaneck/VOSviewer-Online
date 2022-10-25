import { css } from '@emotion/css';

export const shareButton = css`
  label: share-button;
  margin-left: -2px;
`;

export const closeButton = css`
  label: close-button;
  position: absolute !important;
  top: 5px;
  right: 5px;
`;

export const dialogContent = css`
  label: dialog-content;
  min-width: 240px;
  padding: 0px 24px !important;
`;

export const qrCodeLabel = css`
  label: qr-label;
  transform: scale(0.75);
  transform-origin: top left;
  opacity: 0.65;
  font-size: 1rem;
`;

export const qrCodeBox = css`
  label: qr-box;
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
  align-items: center;
`;

export const inputBox = css`
  label: input-box;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const input = css`
  label: input;
  display: inline-flex;
`;

export const copyButton = css`
  label: copy-button;
  display: inline-flex;
  margin-top: 10px !important;
  margin-bottom: 10px !important;
  margin-left: 20px !important;
`;

export const downloadButton = css`
  label: download-button;
  display: inline-flex;
  margin-top: 10px !important;
  margin-bottom: 10px !important;
  margin-left: 20px !important;
`;

export const switchBox = css`
  label: switch-box;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const switchLabel = css`
  label: switch-label;
  margin-left: -16px !important;
  margin-right: 16px !important;
  transform-origin: left;
  opacity: 0.65;
  font-size: 0.75rem !important;
`;
