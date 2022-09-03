import { css } from '@emotion/css';

export const hidden = css`
  label: hidden;
`;

export const loadingScreen = (isDark) => css`
  label: loading-screen;
  visibility: visible;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: ${isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
  opacity: 1;
  transition: opacity 0.6s, visibility 0.6s;

  &${`.${hidden}`} {
    visibility: hidden;
    opacity: 0;
  }
`;

export const progressBox = css`
  label: progress-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

export const description = css`
  label: description;
  margin: 20px !important;
`;
