import { css } from '@emotion/css';

export const panel = css`
  label: info-panel;
  position: relative;
  width: fit-content;
  margin: 10px;
  padding: 10px 15px;
  pointer-events: all;
  font-family: Nexa Light;
  font-size: 0.83rem !important;
  border-radius: 4px;
  background-color: rgba(255,255,255,0.9);
  box-shadow: 0px 0px 6px 1px rgba(191,192,193,0.25);

  .head-content {
    min-width: 475px;
    max-width: fit-content;
  }

  p {
    font-family: Nexa Light;
  }

  hr {
    height: 1px;
    border: none;
    flex-shrink: 0;
    background-color: rgba(0, 0, 0, 0.12);
  }

  table {
    font-size: 0.83rem !important;

    tr {
      td:first-child {
        width: 110px;
      }
    }

  }
`;

export const divider = css`
  display: inline !important;  
  color: rgba(148, 148, 147, 0.8) !important;
`;

export const infoText = css`
  display: inline !important;  
  padding: 10px 2px;
  font-family: Nexa Light;
`;

export const closeButton = css`
  label: close-button;
  position: absolute !important;
  top: 0;
  right: 0;
  padding: 10px !important;
  color: rgba(0, 0, 0, 0.87);

  span {
    font-size: 1rem;
  }
`;
