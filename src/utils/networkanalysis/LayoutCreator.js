import Random from 'java-random';
import { Layout, GradientDescentVOSLayoutAlgorithm } from 'networkanalysis-ts';

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

    this.layoutAlgorithm = new GradientDescentVOSLayoutAlgorithm();
    this.layoutAlgorithm.initializeBasedOnAttractionAndRepulsionAndEdgeWeightIncrementAndMaxNIterationsAndInitialStepSizeAndMinStepSizeAndStepSizeReductionAndRequiredNQualityValueImprovementsAndRandom(this.attraction, this.repulsion, this.edgeWeightIncrement, this.maxNIterations, this.initialStepSize, this.stepSizeConvergence, this.stepSizeReduction, this.requiredNQualityFunctionImprovements, this.random);
    this.bestLayout = null;
    this.minQuality = +Infinity;
    this.randomStart = 0;
  }

  performRandomStart() {
    const layout = new Layout({ nNodes: this.network.getNNodes(), random: this.random });
    this.layoutAlgorithm.improveLayout(this.network, layout);
    const quality = this.layoutAlgorithm.calcQuality(this.network, layout);
    if ((this.bestLayout == null) || (quality < this.minQuality)) {
      this.bestLayout = layout;
      this.minQuality = quality;
    }
    this.randomStart += 1;
  }

  performPostProcessing() {
    this.bestLayout.standardize(true);
  }
}
