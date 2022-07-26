import { css } from '@emotion/css';
import { color } from 'd3-color';
import { device, media, roriPantoneCoolGray4, roriPantoneCoolGray7 } from 'utils/variables-rori';

let boxShadowColor = color(roriPantoneCoolGray4);
boxShadowColor.opacity = 0.25;
boxShadowColor = `${boxShadowColor}`;

export const panel = css`
  label: rori-legends;
  position: absolute;
  width: 100%;
  height: auto;
  bottom: 0;
  user-select: none;
  pointer-events: none;
  font-family: Nexa Light;

  .flexPanel {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 10px;
    pointer-events: all;
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 6px 1px ${boxShadowColor};

    .colorLegend {
      margin: auto 15px auto 15px;
      cursor: pointer;

      ${media(device.phone, device.tabletPortrait)} {
        margin: 0px auto 54px auto;
      }
    }
  
    .sizeLegend {
      margin: auto 0px;
      cursor: pointer;

      svg {
        text {
          font-size: 0.83rem !important;
        }
      }

      ${media(device.phone, device.tabletPortrait)} {
        position: absolute;
        left: 0px;
        bottom: 0px;
        margin: 12px;
      }
    }
  }
`;

export const controls = css`
  label: controls;
  position: relative;
  width: 315px;
  margin: 5px;
  padding: 10px 15px;
  pointer-events: all;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 6px 1px rgba(191,192,193,0.25);
  border-radius: 4px;

  .item {
    margin-top: 10px;
  }

  .dropdown-box {
    padding-top: 15px;
    padding-bottom: 10px;

    .form-control {
      width: 100%;
      font-size: 0.875rem;
    }

    label {
      width: max-content !important;
    }
  }

  .color-pickers {
    margin: 15px 10px 15px 10px;

    .color-picker {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .color-picker-title {
      width: 70px;
      font-size: 0.875rem;
    }

    .color-picker-input {
      input {
        width: 175px;
      }
      font-size: 0.875rem;
    }

    div[data-testid="colorpicker-noinput"] {
      display: flex;
      align-items: center;
    }

    .chrome-picker {
      position: absolute;
      top: -100px;
      left: 90px;
    }
  }

  button.close-btn {
    position: absolute;
    top: 0px;
    right: 0px;
    color: ${roriPantoneCoolGray7};
  }

  button.label {
    left: 50%;
    margin-bottom: 10px;
    text-transform: capitalize;
    transform: translateX(-50%);
  }

  span {
    font-size: 1rem;
  }

  input {
    font-size: 0.83rem;
  }

  label {
    transform: scale(1);
    color: black;
  }
 `;

export const menuItemStyle = css`
 display: inline-block;
 font-size: 0.83rem;
`;
