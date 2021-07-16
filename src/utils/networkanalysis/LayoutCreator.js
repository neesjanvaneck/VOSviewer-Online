import Random from 'java-random';
import LayoutTechnique from './LayoutTechnique';

export const DEFAULT_ATTRACTION = 2;
export const DEFAULT_REPULSION = 1;
export const DEFAULT_MAX_N_ITERATIONS = 1000;
export const DEFAULT_INITIAL_STEP_SIZE = 1;
export const DEFAULT_STEP_SIZE_CONVERGENCE = 0.001;
export const DEFAULT_STEP_SIZE_REDUCTION = 0.75;
export const DEFAULT_REQUIRED_N_QUALITY_FUNTION_IMPROVEMENTS = 5;
export const DEFAULT_N_RANDOM_STARTS = 1;
export const DEFAULT_FIXED_SEED = 0;
export const DEFAULT_USE_RANDOM_SEED = false;

export const SIMILARITY_BETWEEN_UNCONNECTED_ITEMS = 0.01;

export class LayoutCreator {
  constructor() {
    this.bestLayout = null;
    this.minQualityFunction = +Infinity;
  }

  init(network, parameters) {
    this.network = network;
    this.edgeWeightIncrement = (this.network.identifyComponents().getNClusters() > 1) ? SIMILARITY_BETWEEN_UNCONNECTED_ITEMS : 0;
    this.attraction = parameters.attraction;
    this.repulsion = parameters.repulsion;
    this.maxNIterations = parameters.maxNIterations;
    this.initialStepSize = parameters.initialStepSize;
    this.stepSizeConvergence = parameters.stepSizeConvergence;
    this.stepSizeReduction = parameters.stepSizeReduction;
    this.requiredNQualityFunctionImprovements = parameters.requiredNQualityFunctionImprovements;
    this.nRandomStarts = parameters.nRandomStarts;
    this.fixedSeed = parameters.fixedSeed;
    this.useRandomSeed = parameters.useRandomSeed;

    this.random = this.useRandomSeed ? new Random() : new Random(this.fixedSeed);

    this.bestLayout = null;
    this.minQualityFunction = +Infinity;
  }

  performRandomStart() {
    const layoutTechnique = new LayoutTechnique(this.network, this.attraction, this.repulsion, this.edgeWeightIncrement, this.random);
    layoutTechnique.runGradientDescentAlgorithm(this.maxNIterations, this.initialStepSize, this.stepSizeConvergence, this.stepSizeReduction, this.requiredNQualityFunctionImprovements, this.random);
    const qualityFunction = layoutTechnique.calcQualityFunction();
    if ((this.bestLayout == null) || (qualityFunction < this.minQualityFunction)) {
      this.bestLayout = layoutTechnique.getLayout();
      this.minQualityFunction = qualityFunction;
    }
  }

  performPostProcessing() {
    this.bestLayout.standardizeCoordinates(true);
  }
}
