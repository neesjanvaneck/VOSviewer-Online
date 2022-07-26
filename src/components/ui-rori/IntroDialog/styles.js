import { css } from '@emotion/css';
import { roriPantone3005 } from 'utils/variables-rori';

export const introStyle = css`
  label: intro;
  visibility: visible;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  font-family: "Nexa Light";
  font-size: 0.92rem;
  opacity: 1;
  transition: opacity 1s;
  animation: fadein 2s;

  &.close {
    opacity: 0;
    visibility: hidden;
  }

  .intro-box {
    position: absolute;
    width: 70%;
    max-width: 540px;
    max-height: 85%;
    top: 49%;
    left: 50%;
    padding: 15px 30px;
    transform: translate(-50%, -50%);
    overflow-y: auto;
    border-radius: 4px;
    background-color: rgba(255,255,255,0.95);
    box-shadow: 0px 0px 6px 1px rgba(191,192,193,0.25);

    .intro-content {
      text-align: justify;
      white-space: pre-wrap;

      h3 {
        color: ${roriPantone3005};
        font-weight: 600;
      }

      ul {
        padding-left: 20px;
      }

      .bold-span {
        font-family: Nexa Bold;
      }
    }
  }

  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .close-btn {
    visibility: visible;
    left: 50%;
    transform: translateX(-50%);
    text-transform: none;

    &.hidden {
      visibility: hidden;
    }
  }
`;
