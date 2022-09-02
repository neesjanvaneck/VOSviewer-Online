import { css } from '@emotion/css';

export const textField = css`
  label: text-field;
  width: 65px;
  margin: 5px 0px !important;

  label {
    width: 80px;
  }
`;

export const checkbox = css`
  label: checkbox;
  display: inline-block;
  margin-top: 14px;
  margin-left: 4px;

  label {
    margin-left: 5px;
    margin-right: 9px;

    > span {
      padding: 5px;
    }
  }
`;
