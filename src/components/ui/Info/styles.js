import { css } from 'emotion';

export const infoButton = css`
  label: about-button;
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

  p {
    margin: 0;
    margin-bottom: 16px;
  }
`;

export const logo = css`
  label: logo;
  display: block;
  height: 72px;
  margin: 14px auto 14px;
`;
