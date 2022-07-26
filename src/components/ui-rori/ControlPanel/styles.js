import { css } from '@emotion/css';
import { color } from 'd3-color';
import { device, media, roriPantoneCoolGray4 } from 'utils/variables-rori';

let boxShadowColor = color(roriPantoneCoolGray4);
boxShadowColor.opacity = 0.25;
boxShadowColor = `${boxShadowColor}`;

export const panel = css`
  label: rori-controls;
  font-family: Nexa Light;

  position: absolute;
  width: 100%;
  height: auto;
  top: 0;
  user-select: none;
  pointer-events: none;

  .flexPanel {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 10px;
    pointer-events: all;
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 6px 1px ${boxShadowColor};

    .item {
      display: flex;
      margin: auto 15px auto 0px;

      .weightSelection {
        display: inline-block;

        & > div {
          max-width: 260px;
        }

        ${media(device.phone)} {
          display: grid;
          width: 100%;
          margin-left: 15px;
          margin-bottom: 5px;

          & > div {
            width: 100%;
            max-width: 100%;
          }
        }
      }
  
      .scoreSelection {
        display: inline-block;

        & > div {
          max-width: 260px;
        }

        ${media(device.phone)} {
          display: grid;
          width: 100%;
          margin-left: 6px;

          & > div {
            width: 100%;
            max-width: 100%;
          }
        }
      }

      ${media(device.phone)} {
        width: 100%;
      }
    }
  
    .title {
      display: inline-block;
      margin-top: 6px;
      padding-right: 10px;
      font-size: 1rem;
      font-weight: 600;
    }
  
    .sizeVariation {
      display: inline-block;
      width: 100px;
      padding-right: 5px;
      transform: translateY(-8px);
    }
  }
`;

export const menuItemStyle = css`
  width: 100%;
  // display: inline-block;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;
