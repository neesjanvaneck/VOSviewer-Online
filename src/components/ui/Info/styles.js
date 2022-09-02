import { css } from '@emotion/css';

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
  width: 100%;
  height: auto;
  max-height: 72px;
  margin: 14px auto 14px;
`;

export const inlineIcon = css`
  label: inline-icon;
  display: inline-block;
  vertical-align: text-bottom;
  font-size: 1.3rem !important;
`;

export const image = css`
  label: image;
  box-sizing: border-box;
  border: 1px solid #ccc;
`;

export const imageBarTitle = css`
  label: image-bar-title;
  font-size: 0.875rem !important;
  text-align: center;
`;
