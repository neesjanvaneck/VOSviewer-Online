import { makeAutoObservable } from 'mobx';
import _clamp from 'lodash/clamp';
import _isUndefined from 'lodash/isUndefined';

import * as LayoutCreator from 'utils/networkanalysis/LayoutCreator';

export default class State {
  constructor() {
    makeAutoObservable(this);
    this.canceled = false;
  }

  attraction = LayoutCreator.DEFAULT_ATTRACTION

  repulsion= LayoutCreator.DEFAULT_REPULSION

  maxNIterations= LayoutCreator.DEFAULT_MAX_N_ITERATIONS

  initialStepSize= LayoutCreator.DEFAULT_INITIAL_STEP_SIZE

  stepSizeConvergence= LayoutCreator.DEFAULT_STEP_SIZE_CONVERGENCE

  stepSizeReduction= LayoutCreator.DEFAULT_STEP_SIZE_REDUCTION

  requiredNQualityFunctionImprovements= LayoutCreator.DEFAULT_REQUIRED_N_QUALITY_FUNTION_IMPROVEMENTS

  nRandomStarts= LayoutCreator.DEFAULT_N_RANDOM_STARTS

  fixedSeed= LayoutCreator.DEFAULT_FIXED_SEED

  useRandomSeed= LayoutCreator.DEFAULT_USE_RANDOM_SEED

  getParameters() {
    return {
      attraction: this.attraction,
      repulsion: this.repulsion,
      maxNIterations: this.maxNIterations,
      initialStepSize: this.initialStepSize,
      stepSizeConvergence: this.stepSizeConvergence,
      stepSizeReduction: this.stepSizeReduction,
      requiredNQualityFunctionImprovements: this.requiredNQualityFunctionImprovements,
      nRandomStarts: this.nRandomStarts,
      fixedSeed: this.fixedSeed,
      useRandomSeed: this.useRandomSeed,
    };
  }

  setAttraction(attraction, onBlur) {
    if (onBlur) {
      this.attraction = _clamp(Math.round(+attraction), -9, 10);
      if (this.repulsion >= this.attraction) this.repulsion = this.attraction - 1;
    } else {
      this.attraction = attraction;
    }
  }

  setRepulsion(repulsion, onBlur) {
    if (onBlur) {
      this.repulsion = _clamp(Math.round(+repulsion), -10, 9);
      if (this.repulsion >= this.attraction) this.attraction = this.repulsion + 1;
    } else {
      this.repulsion = repulsion;
    }
  }

  setUseDefaultAttractionRepulsionValues(useDefaultAttractionRepulsionValues) {
    this.useDefaultAttractionRepulsionValues = useDefaultAttractionRepulsionValues;
  }

  setMaxNIterations(maxNIterations, onBlur) {
    if (onBlur) {
      this.maxNIterations = _clamp(Math.round(+maxNIterations), 1, 1000000);
    } else {
      this.maxNIterations = maxNIterations;
    }
  }

  setInitialStepSize( initialStepSize, onBlur) {
    if (onBlur) {
      this.initialStepSize = _clamp(+initialStepSize, 0.000001, 1);
    } else {
      this.initialStepSize = initialStepSize;
    }
  }

  setStepSizeConvergence(stepSizeConvergence, onBlur) {
    if (onBlur) {
      this.stepSizeConvergence = _clamp(+stepSizeConvergence, 0.000001, 1);
    } else {
      this.stepSizeConvergence = stepSizeConvergence;
    }
  }

  setStepSizeReduction(stepSizeReduction, onBlur) {
    if (onBlur) {
      this.stepSizeReduction = _clamp(+stepSizeReduction, 0.000001, 1);
    } else {
      this.stepSizeReduction = stepSizeReduction;
    }
  }

  setRequiredNQualityFunctionImprovements( requiredNQualityFunctionImprovements) {
    this.requiredNQualityFunctionImprovements = requiredNQualityFunctionImprovements;
  }

  setNRandomStarts(nRandomStarts, onBlur) {
    if (onBlur) {
      this.nRandomStarts = _clamp(Math.round(+nRandomStarts), 1, 1000);
    } else {
      this.nRandomStarts = nRandomStarts;
    }
  }

  setFixedSeed(fixedSeed, onBlur) {
    if (onBlur) {
      this.fixedSeed = _clamp(Math.round(+fixedSeed), 0, Number.MAX_SAFE_INTEGER);
    } else {
      this.fixedSeed = fixedSeed;
    }
  }

  setUseRandomSeed(useRandomSeed) {
    this.useRandomSeed = useRandomSeed;
  }

  setCanceled(canceled) {
    this.canceled = canceled;
  }

  updateStore({ parameters }) {
    if (!parameters) return;
    if (!_isUndefined(parameters.attraction)) this.setAttraction(parameters.attraction, true);
    if (!_isUndefined(parameters.repulsion)) this.setRepulsion(parameters.repulsion, true);
  }
}
