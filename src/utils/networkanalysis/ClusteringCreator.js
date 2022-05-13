import Random from 'java-random';
import { Clustering, LeidenAlgorithm } from 'networkanalysis-ts';

export const DEFAULT_RESOLUTION = 1.0;
export const DEFAULT_MIN_CLUSTER_SIZE = 1;
export const DEFAULT_MERGE_SMALL_CLUSTERS = true;
export const DEFAULT_N_ITERATIONS = 10;
export const DEFAULT_RANDOMNESS = 0.01;
export const DEFAULT_N_RANDOM_STARTS = 10;
export const DEFAULT_FIXED_SEED = 0;
export const DEFAULT_USE_RANDOM_SEED = false;

export class ClusteringCreator {
  init(network, parameters, useLinLogModularityNormalization) {
    this.network = network;
    this.resolution = parameters.resolution;
    this.minClusterSize = parameters.minClusterSize;
    this.mergeSmallClusters = parameters.mergeSmallClusters;
    this.nIterations = parameters.nIterations;
    this.randomness = parameters.randomness;
    this.nRandomStarts = parameters.nRandomStarts;
    this.fixedSeed = parameters.fixedSeed;
    this.useRandomSeed = parameters.useRandomSeed;
    this.useLinLogModularityNormalization = useLinLogModularityNormalization;

    this.random = this.useRandomSeed ? new Random() : new Random(this.fixedSeed);

    let resolution2 = parameters.resolution;
    if (this.useLinLogModularityNormalization) {
      resolution2 /= (2 * this.network.getTotalEdgeWeight());
    }
    this.clusteringAlgorithm = new LeidenAlgorithm();
    this.clusteringAlgorithm.initializeBasedOnResolutionAndNIterationsAndRandomnessAndRandom(resolution2, this.nIterations, this.randomness, this.random);
    this.bestClustering = undefined;
    this.maxQuality = -Infinity;
    this.randomStart = 0;
  }

  performRandomStart() {
    const clustering = new Clustering({ nNodes: this.network.getNNodes() });
    this.clusteringAlgorithm.improveClustering(this.network, clustering);
    const quality = this.clusteringAlgorithm.calcQuality(this.network, clustering);
    if ((this.bestClustering === undefined) || (quality > this.maxQuality)) {
      this.bestClustering = clustering;
      this.maxQuality = quality;
    }
    this.randomStart += 1;
  }

  performPostProcessing() {
    if (this.mergeSmallClusters) {
      this.clusteringAlgorithm.removeSmallClustersBasedOnNNodes(this.network, this.bestClustering, this.minClusterSize);
    }
    this.bestClustering.orderClustersByNNodes();
  }
}
