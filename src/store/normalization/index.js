import { extendObservable } from 'mobx';
import * as NetworkNormalizer from 'utils/networkanalysis/NetworkNormalizer';

export default class State {
  constructor() {
    extendObservable(
      this,
      {
        normalizationMethod: NetworkNormalizer.DEFAULT_NORMALIZATION_METHOD,
      },
    );
    this.normalizationMethods = [NetworkNormalizer.NO_NORMALIZATION, NetworkNormalizer.ASSOCIATION_STRENGTH, NetworkNormalizer.FRACTIONALIZATION, NetworkNormalizer.LINLOG_MODULARITY];
  }

  setNormalizationMethod(normalizationMethod) {
    this.normalizationMethod = normalizationMethod;
  }
}
