import { css } from '@emotion/css';
import { controlPanelWidth } from 'utils/variables';

export const open = css`
  label: control-panel-open;

  z-index: 0;
`;

export const closed = css`
  label: control-panel-closed;

  z-index: 0;
`;

export const controlPanel = css`
  label: control-panel;
  top: 0;
  position: absolute;
  width: ${controlPanelWidth - 2}px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 0px 6px 1px rgba(191, 192, 193, 0.25);

  &${`.${open}`} {
    transition: left 0.3s;
    left: 0px;
  }

  &${`.${closed}`} {
    transition: left 0.3s;
    left: -${controlPanelWidth}px;
  }
`;

export const closeOpenButton = css`
  label: close-open-button;
  position: absolute !important;
  top: 50%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 0px;
  padding-left: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  transition: left 0.3s !important;
  z-index: -1;
`;

export const closeButton = css`
  label: close-button;
  left: calc(${controlPanelWidth}px - 15px);
  width: max-content;
  line-height: 0.6;
`;

export const openButton = css`
  label: open-button;
  left: calc(${controlPanelWidth}px - 10px);
  width: max-content;
  line-height: 0.6;
`;

export const contentBox = css`
  label: content-box;
  padding: 8px 20px;
  height: calc(100% - 49px);
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: inherit;
`;

export const subtitle = css`
  label: subtitle;
  padding-bottom: 4px;
  padding-top: 16px;
  text-align: center;
`;

export const switchBox = css`
  label: switch-box;
  display: flex;
  margin: 4px 3px 4px 0px;
`;

export const formControlLabel = css`
  label: form-control-label;
  width: 100%;
  justify-content: space-between;
`;

export const switchLabel = css`
  label: switch-label;
  margin-left: -16px !important;
  transform: scale(0.75);
  transform-origin: left;
  opacity: 0.65;
  font-size: 1rem !important;
`;

export const sliderBox = css`
  label: slider-box;
  margin: 4px 2px 12px 0px;
  line-height: 0px;
`;

export const sliderBoxLabel = css`
  label: slider-box-label;
  transform: scale(0.75);
  transform-origin: top left;
  opacity: 0.65;
  font-size: 1rem;
`;

export const buttonBox = css`
  label: button-box;
  margin-bottom: 10px;
`;

export const button = css`
  label: button;
  display: inline;
  width: 100%;
`;

export const gradientPic = (background) => css`
  label: gradient;
  display: inline-block;
  width: 20px;
  height: 12px;
  margin-left: 5px;
  margin-right: 5px;
  background: ${background};
`;

export const expansionPanelItems = (fontFamily) => css`
  label: color-pickers;
  font-family: ${fontFamily};
  position: relative;
`;

export const expansionPanelButton = css`
  margin: 10px 0px !important;
`;

export const colorPickerItem = css`
  label: color-picker;
  display: flex;
  margin-right: -6px;
`;

export const colorPickerTitle = (darkTheme) => css`
  label: color-picker-title;
  width: 176px;
  margin: auto 0px;
  font-size: 0.75rem;
  color: ${darkTheme ? '#fff' : 'rgba(0, 0, 0, 0.87)'};
  opacity: 0.65;
`;

export const listItem = css`
  label: list-item;
  margin: 0px 0px 8px 0px;
  line-height: 1rem;
  cursor: pointer;
`;

export const labelPartNormal = css`
  label: label-part-normal;
  font-weight: 300;
  font-size: 0.875rem;
`;

export const labelPartHighlighted = css`
  label: label-part-highlighted;
  font-weight: 500;
  font-size: 0.875rem;
`;
