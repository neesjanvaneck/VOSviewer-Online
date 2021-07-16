import { scaleLinear } from 'd3-scale';
import { legendStrokeColors } from 'utils/variables';

export const padding = {
  top: 12,
  bottom: 22,
  left: 18,
  right: 18
};

export const tickScale = scaleLinear();

export const tickConfig = {
  width: 1,
  height: 8,
  colorLightTheme: legendStrokeColors.DARK,
  colorDarkTheme: legendStrokeColors.LIGHT,
};
