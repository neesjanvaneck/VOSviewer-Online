import Clustering from './Clustering';
import { calcMaximum, generateRandomPermutation } from './array';

export default class ClusteringTechnique {
  constructor({ network, clustering, resolution }) {
    this.network = network;
    this.resolution = resolution;
    if (clustering) {
      this.clustering = clustering;
    } else {
      this.clustering = new Clustering(network.nNodes);
      this.clustering.initSingletonClusters();
    }
  }

  runIteratedSmartLocalMovingAlgorithm(nIterations, random) {
    let update = false;
    for (let i = 0; i < nIterations; i++) {
      const newUpdate = this.runSmartLocalMovingAlgorithm(random);
      update = update || newUpdate;
    }
    return update;
  }

  runSmartLocalMovingAlgorithm(random) {
    const { network, clustering, resolution } = this;

    if (network.nNodes === 1) return false;
    let update = this.runFastLocalMovingAlgorithm(random);

    if (clustering.nClusters < network.nNodes) {
      const subnetwork = network.createSubnetworks(clustering);
      const nodePerCluster = clustering.getNodesPerCluster();

      clustering.nClusters = 0;

      const nNodesPerClusterReducedNetwork = new Uint32Array(subnetwork.length);

      for (let i = 0; i < subnetwork.length; i++) {
        const newClusteringTechnique = new ClusteringTechnique({ network: subnetwork[i], resolution });
        newClusteringTechnique.runFastLocalMovingAlgorithm(random);
        for (let j = 0; j < subnetwork[i].nNodes; j++) {
          clustering.cluster[nodePerCluster[i][j]] = clustering.nClusters + newClusteringTechnique.clustering.cluster[j];
        }

        clustering.nClusters += newClusteringTechnique.clustering.nClusters;
        nNodesPerClusterReducedNetwork[i] = newClusteringTechnique.clustering.nClusters;
      }

      const newClusteringTechnique = new ClusteringTechnique({ network: network.createReducedNetwork(clustering), resolution });

      let i = 0;
      for (let j = 0; j < nNodesPerClusterReducedNetwork.length; j++) {
        for (let k = 0; k < nNodesPerClusterReducedNetwork[j]; k++) {
          newClusteringTechnique.clustering.cluster[i] = j;
          i += 1;
        }
      }

      newClusteringTechnique.clustering.nClusters = nNodesPerClusterReducedNetwork.length;
      const newUpdate = newClusteringTechnique.runSmartLocalMovingAlgorithm(random);
      update = update || newUpdate;

      clustering.mergeClusters(newClusteringTechnique.clustering);
    }


    return update;
  }

  runFastLocalMovingAlgorithm(random) {
    const { network, clustering, resolution } = this;
    if (network.nNodes === 1) return false;

    let update = false;

    const clusterWeight = new Float64Array(network.nNodes);
    const nNodesPerCluster = new Uint32Array(network.nNodes);
    for (let i = 0; i < network.nNodes; i++) {
      clusterWeight[clustering.cluster[i]] += network.nodeWeight[i];
      nNodesPerCluster[clustering.cluster[i]] += 1;
    }

    let nUnusedClusters = 0;
    const unusedCluster = new Uint32Array(network.nNodes - 1);

    for (let i = 0; i < network.nNodes; i++) {
      if (nNodesPerCluster[i] === 0) {
        unusedCluster[nUnusedClusters] = i;
        nUnusedClusters += 1;
      }
    }

    const stableNode = new Array(network.nNodes).fill(false);
    let nUnstableNodes = network.nNodes;
    const nodeOrder = generateRandomPermutation(network.nNodes, random);
    const edgeWeightPerCluster = new Float64Array(network.nNodes);
    const neighboringCluster = new Uint32Array(network.nNodes - 1);
    let i = 0;
    do {
      const j = nodeOrder[i];
      let nNeighboringClusters = 0;
      for (let k = network.firstNeighborIndex[j]; k < network.firstNeighborIndex[j + 1]; k++) {
        const l = clustering.cluster[network.neighbor[k]];
        if (edgeWeightPerCluster[l] === 0) {
          edgeWeightPerCluster[l] = network.edgeWeight[k];
          neighboringCluster[nNeighboringClusters] = l;
          nNeighboringClusters += 1;
        } else {
          edgeWeightPerCluster[l] += network.edgeWeight[k];
        }
      }

      clusterWeight[clustering.cluster[j]] -= network.nodeWeight[j];
      nNodesPerCluster[clustering.cluster[j]] -= 1;

      if (nNodesPerCluster[clustering.cluster[j]] === 0) {
        unusedCluster[nUnusedClusters] = clustering.cluster[j];
        nUnusedClusters += 1;
      }

      let bestCluster = -1;
      let maxQualityFunction = 0;
      for (let k = 0; k < nNeighboringClusters; k++) {
        const l = neighboringCluster[k];
        const qualityFunction = edgeWeightPerCluster[l] - network.nodeWeight[j] * clusterWeight[l] * resolution;
        if ((qualityFunction > maxQualityFunction) || ((qualityFunction === maxQualityFunction) && (l < bestCluster))) {
          bestCluster = l;
          maxQualityFunction = qualityFunction;
        }
        edgeWeightPerCluster[l] = 0;
      }
      if (maxQualityFunction === 0) {
        bestCluster = unusedCluster[nUnusedClusters - 1];
        nUnusedClusters -= 1;
      }

      clusterWeight[bestCluster] += network.nodeWeight[j];
      nNodesPerCluster[bestCluster] += 1;
      stableNode[j] = true;
      nUnstableNodes -= 1;

      if (clustering.cluster[j] !== bestCluster) {
        clustering.cluster[j] = bestCluster;
        for (let k = network.firstNeighborIndex[j]; k < network.firstNeighborIndex[j + 1]; k++) {
          if (stableNode[network.neighbor[k]] && (clustering.cluster[network.neighbor[k]] !== bestCluster)) {
            stableNode[network.neighbor[k]] = false;
            nUnstableNodes += 1;
            nodeOrder[(i + nUnstableNodes < network.nNodes) ? (i + nUnstableNodes) : (i + nUnstableNodes - network.nNodes)] = network.neighbor[k];
          }
        }
        update = true;
      }

      i = (i < network.nNodes - 1) ? (i + 1) : 0;
    } while (nUnstableNodes > 0);

    const newCluster = new Uint32Array(network.nNodes);
    clustering.nClusters = 0;
    for (let i = 0; i < network.nNodes; i++) {
      if (nNodesPerCluster[i] > 0) {
        newCluster[i] = clustering.nClusters;
        clustering.nClusters += 1;
      }
    }

    for (let i = 0; i < network.nNodes; i++) {
      clustering.cluster[i] = newCluster[clustering.cluster[i]];
    }

    return update;
  }

  calcQualityFunction() {
    const { network, clustering, resolution } = this;

    let qualityFunction = 0;

    for (let i = 0; i < network.nNodes; i++) {
      const j = clustering.cluster[i];
      for (let k = network.firstNeighborIndex[i]; k < network.firstNeighborIndex[i + 1]; k++) {
        if (clustering.cluster[network.neighbor[k]] === j) {
          qualityFunction += network.edgeWeight[k];
        }
      }
    }
    qualityFunction += network.totalEdgeWeightSelfLinks;

    const clusterWeight = new Float64Array(clustering.nClusters);
    for (let i = 0; i < network.nNodes; i++) {
      clusterWeight[clustering.cluster[i]] += network.nodeWeight[i];
    }
    for (let i = 0; i < clustering.nClusters; i++) {
      qualityFunction -= clusterWeight[i] * clusterWeight[i] * resolution;
    }

    qualityFunction /= 2 * network.getTotalEdgeWeight() + network.totalEdgeWeightSelfLinks;

    return qualityFunction;
  }

  getClustering() {
    return this.clustering;
  }

  removeCluster(cluster) {
    const { clustering, network } = this;

    const clusterWeight = new Float64Array(clustering.nClusters);
    const totalEdgeWeightPerCluster = new Float64Array(clustering.nClusters);
    for (let i = 0; i < network.nNodes; i++) {
      clusterWeight[clustering.cluster[i]] += network.nodeWeight[i];
      if (clustering.cluster[i] === cluster) {
        for (let j = network.firstNeighborIndex[i]; j < network.firstNeighborIndex[i + 1]; j++) {
          totalEdgeWeightPerCluster[clustering.cluster[network.neighbor[j]]] += network.edgeWeight[j];
        }
      }
    }

    let i = -1;
    let maxQualityFunction = 0;
    for (let j = 0; j < clustering.nClusters; j++) {
      if ((j !== cluster) && (clusterWeight[j] > 0)) {
        const qualityFunction = totalEdgeWeightPerCluster[j] / clusterWeight[j];
        if (qualityFunction > maxQualityFunction) {
          i = j;
          maxQualityFunction = qualityFunction;
        }
      }
    }

    if (i >= 0) {
      for (let j = 0; j < network.nNodes; j++) {
        if (clustering.cluster[j] === cluster) {
          clustering.cluster[j] = i;
        }
      }

      if (cluster === clustering.nClusters - 1) {
        clustering.nClusters = calcMaximum(clustering.cluster) + 1;
      }
    }

    return i;
  }

  removeSmallClustersBasedOnNNodes(minNNodesPerCluster) {
    const { network, clustering, resolution } = this;
    const newClusteringTechnique = new ClusteringTechnique({ network: network.createReducedNetwork(clustering), resolution });

    const nNodesPerCluster = clustering.getNNodesPerCluster();

    let i;
    do {
      i = -1;
      let nNodesSmallestCluster = minNNodesPerCluster;
      for (let j = 0; j < newClusteringTechnique.clustering.nClusters; j++) {
        if ((nNodesPerCluster[j] > 0) && (nNodesPerCluster[j] < nNodesSmallestCluster)) {
          i = j;
          nNodesSmallestCluster = nNodesPerCluster[j];
        }
      }

      if (i >= 0) {
        const j = newClusteringTechnique.removeCluster(i);
        if (j >= 0) {
          nNodesPerCluster[j] += nNodesPerCluster[i];
        }

        nNodesPerCluster[i] = 0;
      }
    }
    while (i >= 0);

    clustering.mergeClusters(newClusteringTechnique.clustering);
  }
}
