import { css } from '@emotion/css';
import { panelMargin, panelPadding } from 'utils/variables';

export const scoreOptionsPanel = css`
  label: score-options-panel;
  margin-bottom: ${panelMargin}px;
  padding: ${panelPadding}px;
  border-radius: 5px;
  pointer-events: all;
  line-height: 0.6;
`;

export const textField = css`
  label: text-field;
  max-width: 80px;
  margin: 5px 0px !important;

  label {
    width: 80px;
  }
`;

export const checkbox = css`
  label: checkbox;
  display: inline-block;
  margin: 14px 4px;

  label {
    margin-left: 0px;
    margin-right: 0px;

    > span {
      padding: 4px;
    }
  }
`;

export const span = css`
  label: span;
  display: inline-block;
  width: 40px;
`;

export const formControl = css`
  label: form-control;
  width: 100%;
  margin-top: 16px !important;
  margin-bottom: 8px !important;
`;
