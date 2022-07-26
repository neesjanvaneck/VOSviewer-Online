import { css } from '@emotion/css';
import { controlPanelWidth, panelMargin, panelPadding } from 'utils/variables';

export const visible = css`
  label: visible;
`;

export const notshifted = css`
  label: not-shifted;
`;

export const shifted = css`
  label: shifted;
`;

export const infoPanel = css`
  label: info-panel;
  visibility: hidden;
  position: absolute;
  width: max-content;
  bottom: 0;
  margin: ${panelMargin}px;
  padding: ${panelPadding}px;
  font-size: 0.75rem !important;

  &${`.${visible}`} {
    visibility: unset;
  }

  &${`.${notshifted}`} {
    transition: left 0.3s;
    left: 0px;
  }
  
  &${`.${shifted}`} {
    transition: left 0.3s;
    left: ${controlPanelWidth}px;
  }

  hr {
    height: 1px;
    border: none;
    flex-shrink: 0;
    background-color: rgba(0, 0, 0, 0.12);
  }

  p {
    font-size: 0.75rem;
  }

  table {
    font-size: 0.75rem !important;
    tr {
      td:first-child {
        min-width: 100px;
      }
    }
  }
`;

export const description = css`
  label: description;
  min-width: 400px;
  max-width: fit-content;
  margin: 0px 4px !important;
  font-size: 0.75rem !important;
`;

export const divider = css`
  label: divider;
  display: inline !important;
  color: rgba(148, 148, 147, 0.8) !important;
`;

export const infoItem = css`
  label: info-item;
  display: inline !important;
  padding: 4px 4px;
`;

export const closeButton = css`
  label: close-button;
  position: absolute !important;
  top: 0;
  right: 0;
  padding: 10px !important;
`;
