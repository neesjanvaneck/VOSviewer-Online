import Network from './Network';

export const NO_NORMALIZATION = 'No normalization';
export const ASSOCIATION_STRENGTH = 'Association strength';
export const FRACTIONALIZATION = 'Fractionalization';
export const LINLOG_MODULARITY = 'LinLog/modularity';

export const DEFAULT_NORMALIZATION_METHOD = ASSOCIATION_STRENGTH;

export class NetworkNormalizer {
  constructor() {
    this.normalizedNetwork = undefined;
    this.normalizationMethod = DEFAULT_NORMALIZATION_METHOD;
    this.networkComponents = undefined;
  }

  init(nNodes, edge, weight) {
    this.unnormalizedNetwork = new Network(nNodes, edge, weight);
    this.performNormalization(this.normalizationMethod);
  }

  performNormalization(normalizationMethod) {
    this.normalizationMethod = normalizationMethod;
    if (normalizationMethod === NO_NORMALIZATION) {
      this.normalizedNetwork = this.unnormalizedNetwork.createNetworkWithoutNodeWeights();
    } else if (normalizationMethod === ASSOCIATION_STRENGTH) {
      this.normalizedNetwork = this.unnormalizedNetwork.createNormalizedNetwork1();
    } else if (normalizationMethod === FRACTIONALIZATION) {
      this.normalizedNetwork = this.unnormalizedNetwork.createNormalizedNetwork2();
    } else this.normalizedNetwork = this.unnormalizedNetwork;
  }

  setNetworkComponents(networkComponents) {
    this.networkComponents = networkComponents;
  }

  getNetworkComponents() {
    return this.networkComponents;
  }
}
