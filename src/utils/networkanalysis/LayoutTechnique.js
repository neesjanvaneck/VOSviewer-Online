import Layout from './Layout';
import { generateRandomPermutation } from './array';

export default class LayoutTechnique {
  constructor(network, attraction, repulsion, edgeWeightIncrement, random) {
    this.network = network;
    this.layout = new Layout(network.nNodes);
    this.layout.initRandomCoordinates(random);
    this.attraction = attraction;
    this.repulsion = repulsion;
    this.edgeWeightIncrement = edgeWeightIncrement;
  }

  getLayout() {
    return this.layout;
  }

  runGradientDescentAlgorithm(maxNIterations, initialStepLength, minStepLength, stepLengthReduction, requiredNQualityFunctionImprovements, random) {
    const { network, layout, attraction, repulsion, edgeWeightIncrement } = this;

    const nodePermutation = generateRandomPermutation(network.nNodes, random);

    let stepLength = initialStepLength;
    let qualityFunction = +Infinity;
    let nQualityFunctionImprovements = 0;

    let i = 0;
    while ((i < maxNIterations) && (stepLength >= minStepLength)) {
      const qualityFunctionOld = qualityFunction;
      qualityFunction = 0;
      const nodeVisited = new Array(network.nNodes).fill(false);

      for (let j = 0; j < network.nNodes; j++) {
        const k = nodePermutation[j];

        let gradient1 = 0;
        let gradient2 = 0;

        for (let l = network.firstNeighborIndex[k]; l < network.firstNeighborIndex[k + 1]; l++) {
          const distance1 = layout.coordinate[0][k] - layout.coordinate[0][network.neighbor[l]];
          const distance2 = layout.coordinate[1][k] - layout.coordinate[1][network.neighbor[l]];
          const squaredDistance = (distance1 * distance1 + distance2 * distance2);
          const distance = Math.sqrt(squaredDistance);
          const a = this.pow(distance, attraction);

          if (squaredDistance > 0) {
            const b = network.edgeWeight[l] * a / squaredDistance;
            gradient1 += b * distance1;
            gradient2 += b * distance2;
          }

          if (!nodeVisited[network.neighbor[l]]) {
            if (attraction !== 0) {
              qualityFunction += network.edgeWeight[l] * a / attraction;
            } else {
              qualityFunction += network.edgeWeight[l] * Math.log(distance);
            }
          }
        }

        for (let l = 0; l < network.nNodes; l++) {
          if (l !== k) {
            const distance1 = layout.coordinate[0][k] - layout.coordinate[0][l];
            const distance2 = layout.coordinate[1][k] - layout.coordinate[1][l];
            const squaredDistance = distance1 * distance1 + distance2 * distance2;
            const distance = Math.sqrt(squaredDistance);
            const a = this.pow(distance, repulsion);

            if (squaredDistance > 0) {
              const b = network.nodeWeight[k] * network.nodeWeight[l] * a / squaredDistance;
              gradient1 -= b * distance1;
              gradient2 -= b * distance2;
            }

            if (!nodeVisited[l]) {
              if (repulsion !== 0) {
                qualityFunction -= network.nodeWeight[k] * network.nodeWeight[l] * a / repulsion;
              } else {
                qualityFunction -= network.nodeWeight[k] * network.nodeWeight[l] * Math.log(distance);
              }
            }
          }
        }

        if (edgeWeightIncrement > 0) {
          for (let l = 0; l < network.nNodes; l++) {
            if (l !== k) {
              const distance1 = layout.coordinate[0][k] - layout.coordinate[0][l];
              const distance2 = layout.coordinate[1][k] - layout.coordinate[1][l];
              const squaredDistance = distance1 * distance1 + distance2 * distance2;
              const distance = Math.sqrt(squaredDistance);
              const a = this.pow(distance, attraction);

              if (squaredDistance > 0) {
                const b = edgeWeightIncrement * a / squaredDistance;
                gradient1 += b * distance1;
                gradient2 += b * distance2;
              }

              if (!nodeVisited[l]) {
                if (attraction !== 0) {
                  qualityFunction += edgeWeightIncrement * a / attraction;
                } else {
                  qualityFunction += edgeWeightIncrement * Math.log(distance);
                }
              }
            }
          }
        }

        const gradientLength = Math.sqrt(gradient1 * gradient1 + gradient2 * gradient2);
        layout.coordinate[0][k] -= stepLength * gradient1 / gradientLength;
        layout.coordinate[1][k] -= stepLength * gradient2 / gradientLength;

        nodeVisited[k] = true;
      }

      if (qualityFunction < qualityFunctionOld) {
        nQualityFunctionImprovements += 1;
        if (nQualityFunctionImprovements >= requiredNQualityFunctionImprovements) {
          stepLength /= stepLengthReduction;
          nQualityFunctionImprovements = 0;
        }
      } else {
        stepLength *= stepLengthReduction;
        nQualityFunctionImprovements = 0;
      }

      i += 1;
    }

    return stepLength;
  }

  calcQualityFunction() {
    const { network, layout, attraction, repulsion, edgeWeightIncrement } = this;

    let qualityFunction = 0;

    for (let i = 0; i < network.nNodes; i++) {
      for (let j = network.firstNeighborIndex[i]; j < network.firstNeighborIndex[i + 1]; j++) {
        if (network.neighbor[j] < i) {
          const distance1 = layout.coordinate[0][i] - layout.coordinate[0][network.neighbor[j]];
          const distance2 = layout.coordinate[1][i] - layout.coordinate[1][network.neighbor[j]];
          const distance = Math.sqrt(distance1 * distance1 + distance2 * distance2);
          if (attraction !== 0) {
            qualityFunction += network.edgeWeight[j] * this.pow(distance, attraction) / attraction;
          } else {
            qualityFunction += network.edgeWeight[j] * Math.log(distance);
          }
        }
      }
    }


    for (let i = 0; i < network.nNodes; i++) {
      for (let j = 0; j < i; j++) {
        const distance1 = layout.coordinate[0][i] - layout.coordinate[0][j];
        const distance2 = layout.coordinate[1][i] - layout.coordinate[1][j];
        const distance = Math.sqrt(distance1 * distance1 + distance2 * distance2);
        if (repulsion !== 0) {
          qualityFunction -= network.nodeWeight[i] * network.nodeWeight[j] * this.pow(distance, repulsion) / repulsion;
        } else {
          qualityFunction -= network.nodeWeight[i] * network.nodeWeight[j] * Math.log(distance);
        }
      }
    }


    if (edgeWeightIncrement > 0) {
      for (let i = 0; i < network.nNodes; i++) {
        for (let j = 0; j < i; j++) {
          const distance1 = layout.coordinate[0][i] - layout.coordinate[0][j];
          const distance2 = layout.coordinate[1][i] - layout.coordinate[1][j];
          const distance = Math.sqrt(distance1 * distance1 + distance2 * distance2);
          if (attraction !== 0) {
            qualityFunction += edgeWeightIncrement * this.pow(distance, attraction) / attraction;
          } else {
            qualityFunction += edgeWeightIncrement * Math.log(distance);
          }
        }
      }
    }


    return qualityFunction;
  }

  pow(base, exponent) {
    let power;
    if (exponent > 0) {
      power = base;
      for (let i = 1; i < exponent; i++) {
        power *= base;
      }
    } else if (exponent < 0) {
      power = 1 / base;
      for (let i = -1; i > exponent; i--) {
        power /= base;
      }
    } else {
      power = 1;
    }

    return power;
  }
}
