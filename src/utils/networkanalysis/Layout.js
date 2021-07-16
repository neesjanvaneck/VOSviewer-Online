import { calcAverage, calcMedian } from './array';

export default class Layout {
  constructor(nNodes) {
    if (typeof nNodes === 'number') {
      this.nNodes = nNodes;
      this.coordinate = new Array(2);
      this.coordinate[0] = new Float64Array(nNodes);
      this.coordinate[1] = new Float64Array(nNodes);
    } else {
      const coordinate = nNodes;
      this.nNodes = coordinate[0].length;
      this.coordinate = new Array(2);
      this.coordinate[0] = coordinate[0].slice();
      this.coordinate[1] = coordinate[1].slice();
    }
  }

  initRandomCoordinates(random) {
    for (let i = 0; i < this.nNodes; i++) {
      this.coordinate[0][i] = 2 * random.nextDouble() - 1;
      this.coordinate[1][i] = 2 * random.nextDouble() - 1;
    }
  }

  standardizeCoordinates(standardizeDistances) {
    const { coordinate, nNodes } = this;

    const averageCoordinate1 = calcAverage(coordinate[0]);
    const averageCoordinate2 = calcAverage(coordinate[1]);
    for (let i = 0; i < nNodes; i++) {
      coordinate[0][i] -= averageCoordinate1;
      coordinate[1][i] -= averageCoordinate2;
    }

    let variance1 = 0;
    let variance2 = 0;
    let covariance = 0;
    for (let i = 0; i < nNodes; i++) {
      variance1 += coordinate[0][i] * coordinate[0][i];
      variance2 += coordinate[1][i] * coordinate[1][i];
      covariance += coordinate[0][i] * coordinate[1][i];
    }
    variance1 /= nNodes;
    variance2 /= nNodes;
    covariance /= nNodes;
    const discriminant = variance1 * variance1 + variance2 * variance2 - 2 * variance1 * variance2 + 4 * covariance * covariance;
    const eigenvalue1 = (variance1 + variance2 - Math.sqrt(discriminant)) / 2;
    const eigenvalue2 = (variance1 + variance2 + Math.sqrt(discriminant)) / 2;
    let normalizedEigenvector11 = variance1 + covariance - eigenvalue1;
    let normalizedEigenvector12 = variance2 + covariance - eigenvalue1;
    let vectorLength = Math.sqrt(normalizedEigenvector11 * normalizedEigenvector11 + normalizedEigenvector12 * normalizedEigenvector12);
    normalizedEigenvector11 /= vectorLength;
    normalizedEigenvector12 /= vectorLength;
    let normalizedEigenvector21 = variance1 + covariance - eigenvalue2;
    let normalizedEigenvector22 = variance2 + covariance - eigenvalue2;
    vectorLength = Math.sqrt(normalizedEigenvector21 * normalizedEigenvector21 + normalizedEigenvector22 * normalizedEigenvector22);
    normalizedEigenvector21 /= vectorLength;
    normalizedEigenvector22 /= vectorLength;
    for (let i = 0; i < nNodes; i++) {
      const coordinateOld1 = coordinate[0][i];
      const coordinateOld2 = coordinate[1][i];
      coordinate[0][i] = normalizedEigenvector11 * coordinateOld1 + normalizedEigenvector12 * coordinateOld2;
      coordinate[1][i] = normalizedEigenvector21 * coordinateOld1 + normalizedEigenvector22 * coordinateOld2;
    }

    for (let i = 0; i < 2; i++) {
      if (calcMedian(coordinate[i]) > 0) {
        for (let j = 0; j < nNodes; j++) {
          coordinate[i][j] *= -1;
        }
      }
    }

    if (standardizeDistances) {
      const averageDistance = this._getAverageDistance();
      for (let i = 0; i < nNodes; i++) {
        coordinate[0][i] /= averageDistance;
        coordinate[1][i] /= averageDistance;
      }
    }
  }

  _getAverageDistance() {
    const { coordinate, nNodes } = this;

    let averageDistance = 0;
    for (let i = 0; i < nNodes; i++) {
      for (let j = 0; j < i; j++) {
        const distance1 = coordinate[0][i] - coordinate[0][j];
        const distance2 = coordinate[1][i] - coordinate[1][j];
        averageDistance += Math.sqrt(distance1 * distance1 + distance2 * distance2);
      }
    }

    averageDistance /= nNodes * (nNodes - 1) / 2;
    return averageDistance;
  }
}
