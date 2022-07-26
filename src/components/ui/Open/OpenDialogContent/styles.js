import { css } from '@emotion/css';

export const fileBox = css`
  label: file-box;
  margin-bottom: 6px;
`;

export const fileChooser = css`
  label: file-chooser;
  display: inline;
`;

export const button = css`
  label: button;
  display: inline-block;
  width: 120px;
`;

export const fileNameBox = (uiStyle) => css`
  label: file-name-box;
  display: inline-block;
  width: calc(100% - 120px - 10px);
  margin-left: 10px;
  vertical-align: middle;
  p {
    display: inline-block;
    width: calc(100% - 25px);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  svg {
    float: right;
    cursor: pointer;
    fill: ${uiStyle.palette_primary_main_color};
  }
`;

export const hint = css`
  label: hint;
  padding-top: 6px;
  font-size: 0.75rem !important;
  opacity: 0.7;
  text-align: left;
`;
