import { makeAutoObservable } from 'mobx';

import * as NetworkNormalizer from 'utils/networkanalysis/NetworkNormalizer';

export default class State {
  constructor() {
    makeAutoObservable(this);
    this.normalizationMethods = [NetworkNormalizer.NO_NORMALIZATION, NetworkNormalizer.ASSOCIATION_STRENGTH, NetworkNormalizer.FRACTIONALIZATION, NetworkNormalizer.LINLOG_MODULARITY];
  }

  normalizationMethod = NetworkNormalizer.DEFAULT_NORMALIZATION_METHOD

  setNormalizationMethod(normalizationMethod) {
    this.normalizationMethod = normalizationMethod;
  }
}
