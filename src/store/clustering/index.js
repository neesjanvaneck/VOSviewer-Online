import { makeAutoObservable } from 'mobx';
import _clamp from 'lodash/clamp';
import _isUndefined from 'lodash/isUndefined';
import * as ClusteringCreator from 'utils/networkanalysis/ClusteringCreator';

export default class State {
  constructor() {
    makeAutoObservable(this);
    this.canceled = false;
  }

  resolution = ClusteringCreator.DEFAULT_RESOLUTION

  minClusterSize = ClusteringCreator.DEFAULT_MIN_CLUSTER_SIZE

  mergeSmallClusters = ClusteringCreator.DEFAULT_MERGE_SMALL_CLUSTERS

  nIterations = ClusteringCreator.DEFAULT_N_ITERATIONS
  
  randomness = ClusteringCreator.DEFAULT_RANDOMNESS

  nRandomStarts = ClusteringCreator.DEFAULT_N_RANDOM_STARTS

  fixedSeed = ClusteringCreator.DEFAULT_FIXED_SEED

  useRandomSeed = ClusteringCreator.DEFAULT_USE_RANDOM_SEED

  getParameters() {
    return {
      resolution: this.resolution,
      minClusterSize: this.minClusterSize,
      mergeSmallClusters: this.mergeSmallClusters,
      nIterations: this.nIterations,
      randomness: this.randomness,
      nRandomStarts: this.nRandomStarts,
      fixedSeed: this.fixedSeed,
      useRandomSeed: this.useRandomSeed,
    };
  }

  setResolution(resolution, onBlur) {
    if (onBlur) {
      this.resolution = _clamp(+resolution, 0, 1000);
    } else {
      this.resolution = resolution;
    }
  }

  setMinClusterSize(minClusterSize, onBlur) {
    if (onBlur) {
      this.minClusterSize = _clamp(Math.round(+minClusterSize), 1, 1000);
    } else {
      this.minClusterSize = minClusterSize;
    }
  }

  setMergeSmallClusters(mergeSmallClusters) {
    this.mergeSmallClusters = mergeSmallClusters;
  }

  setNIterations(nIterations, onBlur) {
    if (onBlur) {
      this.nIterations = _clamp(Math.round(+nIterations), 1, 1000000);
    } else {
      this.nIterations = nIterations;
    }
  }

  setRandomness(randomness, onBlur) {
    if (onBlur) {
      this.randomness = _clamp(+randomness, 0.0005, 0.1);
    } else {
      this.randomness = randomness;
    }
  }

  setNRandomStarts(nRandomStarts, onBlur) {
    if (onBlur) {
      this.nRandomStarts = _clamp(Math.round(+nRandomStarts), 1, 10000);
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
    if (!_isUndefined(parameters.merge_small_clusters)) this.setMergeSmallClusters(parameters.merge_small_clusters);
    if (!_isUndefined(parameters.min_cluster_size)) this.setMinClusterSize(parameters.min_cluster_size, true);
    if (!_isUndefined(parameters.resolution)) this.setResolution(parameters.resolution, true);
  }
}
