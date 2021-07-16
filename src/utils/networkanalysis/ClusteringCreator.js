import Random from 'java-random';
import ClusteringTechnique from './ClusteringTechnique';

export const DEFAULT_RESOLUTION = 1.0;
export const DEFAULT_MIN_CLUSTER_SIZE = 1;
export const DEFAULT_MERGE_SMALL_CLUSTERS = true;
export const DEFAULT_N_ITERATIONS = 10;
export const DEFAULT_N_RANDOM_STARTS = 10;
export const DEFAULT_FIXED_SEED = 0;
export const DEFAULT_USE_RANDOM_SEED = false;

export class ClusteringCreator {
  constructor() {
    this.bestClustering = undefined;
    this.maxQualityFunction = -Infinity;
  }

  init(network, parameters, useLinLogModularityNormalization) {
    this.network = network;
    this.resolution = parameters.resolution;
    this.minClusterSize = parameters.minClusterSize;
    this.mergeSmallClusters = parameters.mergeSmallClusters;
    this.nIterations = parameters.nIterations;
    this.nRandomStarts = parameters.nRandomStarts;
    this.fixedSeed = parameters.fixedSeed;
    this.useRandomSeed = parameters.useRandomSeed;
    this.useLinLogModularityNormalization = useLinLogModularityNormalization;

    this.random = this.useRandomSeed ? new Random() : new Random(this.fixedSeed);

    this.bestClustering = undefined;
    this.maxQualityFunction = -Infinity;
  }

  performRandomStart() {
    let { resolution } = this;
    if (this.useLinLogModularityNormalization) {
      resolution /= (2 * this.network.getTotalEdgeWeight());
    }
    const clusteringTechnique = new ClusteringTechnique({ network: this.network, resolution });
    clusteringTechnique.runIteratedSmartLocalMovingAlgorithm(this.nIterations, this.random);
    const qualityFunction = clusteringTechnique.calcQualityFunction();
    if ((this.bestClustering === undefined) || (qualityFunction > this.maxQualityFunction)) {
      this.bestClustering = clusteringTechnique.getClustering();
      this.maxQualityFunction = qualityFunction;
    }
  }

  performPostProcessing() {
    const { resolution, mergeSmallClusters, minClusterSize } = this;
    const clusteringTechnique = new ClusteringTechnique({ network: this.network, clustering: this.bestClustering, resolution });
    if (mergeSmallClusters) {
      clusteringTechnique.removeSmallClustersBasedOnNNodes(minClusterSize);
    }

    this.bestClustering = clusteringTechnique.getClustering();
    this.bestClustering.orderClustersByNNodes();
  }
}
