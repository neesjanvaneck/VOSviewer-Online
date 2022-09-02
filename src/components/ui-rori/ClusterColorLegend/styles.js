import { css } from '@emotion/css';
import { device, media } from 'utils/variables-rori';

export const legendBox = css`
  label: legend-box;
  font-size: 0.83rem;
  column-count: 2;

  ${media(device.phone)} {
    column-count: 2;
    font-size: 0.5rem;
  }

  .circle {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 6px;
    border-radius: 4.5px;
  }

  .text {
    display: inline-block;
  }
`;
