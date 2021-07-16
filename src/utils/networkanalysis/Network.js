import Clustering from './Clustering';
import { calcSum, calcSumWithinRange } from './array';

export default class Network {
  constructor(nNodes, edge, edgeWeight) {
    if (edge) {
      this.nNodes = nNodes;
      let nEdges = 0;
      this.firstNeighborIndex = new Uint32Array(nNodes + 1);
      const neighbor = new Uint32Array(edge[0].length);
      const edgeWeight2 = new Float64Array(edge[0].length);
      this.totalEdgeWeightSelfLinks = 0;

      let i = 1;
      for (let j = 0; j < edge[0].length; j++) {
        if (edge[0][j] !== edge[1][j]) {
          if (edge[0][j] >= i) {
            for (i; i <= edge[0][j]; i++) {
              this.firstNeighborIndex[i] = nEdges;
            }
          }
          neighbor[nEdges] = edge[1][j];
          edgeWeight2[nEdges] = (edgeWeight !== undefined) ? edgeWeight[j] : 1;
          nEdges += 1;
        } else {
          this.totalEdgeWeightSelfLinks += (edgeWeight !== undefined) ? edgeWeight[j] : 1;
        }
      }

      for (i; i <= nNodes; i++) {
        this.firstNeighborIndex[i] = nEdges;
      }
      this.nEdges = nEdges;

      this.neighbor = neighbor.slice(0, nEdges);
      this.edgeWeight = edgeWeight2.slice(0, nEdges);

      this.nodeWeight = this._getTotalEdgeWeightPerNode2();
    }
  }

  getNNodes() {
    return this.nNodes;
  }

  getTotalNodeWeight() {
    return calcSum(this.nodeWeight);
  }

  getTotalEdgeWeight() {
    return calcSum(this.edgeWeight) / 2;
  }

  _getTotalEdgeWeightPerNode2() {
    const totalEdgeWeightPerNode = new Float64Array(this.nNodes);
    for (let i = 0; i < this.nNodes; i++) {
      totalEdgeWeightPerNode[i] = calcSumWithinRange(this.edgeWeight, this.firstNeighborIndex[i], this.firstNeighborIndex[i + 1]);
    }
    return totalEdgeWeightPerNode;
  }

  createSubnetwork(clustering, cluster) {
    const nodePerCluster = clustering.getNodesPerCluster();
    const subnetworkNode = new Uint32Array(this.nNodes);
    const subnetworkNeighbor = new Uint32Array(this.nEdges);
    const subnetworkEdgeWeight = new Float64Array(this.nEdges);
    const subnetwork = this._createSubnetwork(clustering, cluster, nodePerCluster[cluster], subnetworkNode, subnetworkNeighbor, subnetworkEdgeWeight);
    return subnetwork;
  }

  _createSubnetwork(clustering, cluster, node, subnetworkNode, subnetworkNeighbor, subnetworkEdgeWeight) {
    let j;
    let k;

    const subnetwork = new Network();

    subnetwork.nNodes = node.length;

    if (subnetwork.nNodes === 1) {
      subnetwork.nEdges = 0;
      subnetwork.nodeWeight = new Float64Array(this.nodeWeight[node[0]]);
      subnetwork.firstNeighborIndex = new Uint32Array(2);
      subnetwork.neighbor = new Uint32Array(0);
      subnetwork.edgeWeight = new Float64Array(0);
    } else {
      for (let i = 0; i < node.length; i++) {
        subnetworkNode[node[i]] = i;
      }

      subnetwork.nEdges = 0;
      subnetwork.nodeWeight = new Float64Array(subnetwork.nNodes);
      subnetwork.firstNeighborIndex = new Uint32Array(subnetwork.nNodes + 1);
      for (let i = 0; i < subnetwork.nNodes; i++) {
        j = node[i];
        subnetwork.nodeWeight[i] = this.nodeWeight[j];
        for (k = this.firstNeighborIndex[j]; k < this.firstNeighborIndex[j + 1]; k++) {
          if (clustering.cluster[this.neighbor[k]] === cluster) {
            subnetworkNeighbor[subnetwork.nEdges] = subnetworkNode[this.neighbor[k]];
            subnetworkEdgeWeight[subnetwork.nEdges] = this.edgeWeight[k];
            subnetwork.nEdges += 1;
          }
        }
        subnetwork.firstNeighborIndex[i + 1] = subnetwork.nEdges;
      }
      subnetwork.neighbor = subnetworkNeighbor.slice(0, subnetwork.nEdges);
      subnetwork.edgeWeight = subnetworkEdgeWeight.slice(0, subnetwork.nEdges);
    }

    subnetwork.totalEdgeWeightSelfLinks = 0;

    return subnetwork;
  }

  createSubnetworks(clustering) {
    const { nNodes, nEdges } = this;
    const subnetwork = new Array(clustering.nClusters);
    const nodePerCluster = clustering.getNodesPerCluster();
    const subnetworkNode = new Uint32Array(nNodes);
    const subnetworkNeighbor = new Uint32Array(nEdges);
    const subnetworkEdgeWeight = new Float64Array(nEdges);
    for (let i = 0; i < clustering.nClusters; i++) {
      subnetwork[i] = this._createSubnetwork2(clustering, i, nodePerCluster[i], subnetworkNode, subnetworkNeighbor, subnetworkEdgeWeight);
    }
    return subnetwork;
  }

  _createSubnetwork2(clustering, cluster, node, subnetworkNode, subnetworkNeighbor, subnetworkEdgeWeight) {
    const { nodeWeight, edgeWeight, firstNeighborIndex, neighbor } = this;
    const subnetwork = new Network();

    subnetwork.nNodes = node.length;

    if (subnetwork.nNodes === 1) {
      subnetwork.nEdges = 0;
      subnetwork.nodeWeight = new Float64Array([this.nodeWeight[node[0]]]);
      subnetwork.firstNeighborIndex = new Uint32Array(2);
      subnetwork.neighbor = new Uint32Array(0);
      subnetwork.edgeWeight = new Float64Array(0);
    } else {
      for (let i = 0; i < node.length; i++) {
        subnetworkNode[node[i]] = i;
      }

      subnetwork.nEdges = 0;
      subnetwork.nodeWeight = new Float64Array(subnetwork.nNodes);
      subnetwork.firstNeighborIndex = new Uint32Array(subnetwork.nNodes + 1);
      for (let i = 0; i < subnetwork.nNodes; i++) {
        const j = node[i];
        subnetwork.nodeWeight[i] = nodeWeight[j];

        for (let k = firstNeighborIndex[j]; k < firstNeighborIndex[j + 1]; k++) {
          if (clustering.cluster[neighbor[k]] === cluster) {
            subnetworkNeighbor[subnetwork.nEdges] = subnetworkNode[neighbor[k]];
            subnetworkEdgeWeight[subnetwork.nEdges] = edgeWeight[k];
            subnetwork.nEdges += 1;
          }
        }

        subnetwork.firstNeighborIndex[i + 1] = subnetwork.nEdges;
      }

      subnetwork.neighbor = subnetworkNeighbor.slice(0, subnetwork.nEdges);
      subnetwork.edgeWeight = subnetworkEdgeWeight.slice(0, subnetwork.nEdges);
    }

    subnetwork.totalEdgeWeightSelfLinks = 0;

    return subnetwork;
  }

  createReducedNetwork(clustering) {
    const {
      nEdges, edgeWeight, nodeWeight, firstNeighborIndex, totalEdgeWeightSelfLinks, neighbor
    } = this;

    const reducedNetwork = new Network();

    reducedNetwork.nNodes = clustering.nClusters;
    reducedNetwork.nEdges = 0;
    reducedNetwork.nodeWeight = new Float64Array(clustering.nClusters);
    reducedNetwork.firstNeighborIndex = new Uint32Array(clustering.nClusters + 1);
    reducedNetwork.totalEdgeWeightSelfLinks = totalEdgeWeightSelfLinks;
    const reducedNetworkNeighbor1 = new Uint32Array(nEdges);
    const reducedNetworkEdgeWeight1 = new Float64Array(nEdges);
    const reducedNetworkNeighbor2 = new Uint32Array(clustering.nClusters - 1);
    const reducedNetworkEdgeWeight2 = new Float64Array(clustering.nClusters);
    const nodePerCluster = clustering.getNodesPerCluster();
    for (let i = 0; i < clustering.nClusters; i++) {
      let j = 0;
      for (let k = 0; k < nodePerCluster[i].length; k++) {
        const l = nodePerCluster[i][k];

        reducedNetwork.nodeWeight[i] += nodeWeight[l];

        for (let m = firstNeighborIndex[l]; m < firstNeighborIndex[l + 1]; m++) {
          const n = clustering.cluster[neighbor[m]];
          if (n !== i) {
            if (reducedNetworkEdgeWeight2[n] === 0) {
              reducedNetworkNeighbor2[j] = n;
              j += 1;
            }
            reducedNetworkEdgeWeight2[n] += edgeWeight[m];
          } else {
            reducedNetwork.totalEdgeWeightSelfLinks += edgeWeight[m];
          }
        }
      }

      for (let k = 0; k < j; k++) {
        reducedNetworkNeighbor1[reducedNetwork.nEdges + k] = reducedNetworkNeighbor2[k];
        reducedNetworkEdgeWeight1[reducedNetwork.nEdges + k] = reducedNetworkEdgeWeight2[reducedNetworkNeighbor2[k]];
        reducedNetworkEdgeWeight2[reducedNetworkNeighbor2[k]] = 0;
      }
      reducedNetwork.nEdges += j;
      reducedNetwork.firstNeighborIndex[i + 1] = reducedNetwork.nEdges;
    }

    reducedNetwork.neighbor = reducedNetworkNeighbor1.slice(0, reducedNetwork.nEdges);
    reducedNetwork.edgeWeight = reducedNetworkEdgeWeight1.slice(0, reducedNetwork.nEdges);

    return reducedNetwork;
  }

  identifyComponents() {
    const clustering = new Clustering(this.nNodes);

    clustering.nClusters = 0;
    const nodeVisited = new Array(this.nNodes).fill(false);
    const node = new Uint32Array(this.nNodes);

    for (let i = 0; i < this.nNodes; i++) {
      if (!nodeVisited[i]) {
        clustering.cluster[i] = clustering.nClusters;
        nodeVisited[i] = true;
        node[0] = i;
        let j = 1;
        let k = 0;
        do {
          for (let l = this.firstNeighborIndex[node[k]]; l < this.firstNeighborIndex[node[k] + 1]; l++) {
            if (!nodeVisited[this.neighbor[l]]) {
              clustering.cluster[this.neighbor[l]] = clustering.nClusters;
              nodeVisited[this.neighbor[l]] = true;
              node[j] = this.neighbor[l];
              j += 1;
            }
          }

          k += 1;
        } while (k < j);

        clustering.nClusters += 1;
      }
    }
    clustering.orderClustersByNNodes();

    return clustering;
  }

  createNetworkWithoutNodeWeights() {
    const networkWithoutNodeWeights = new Network();
    networkWithoutNodeWeights.nNodes = this.nNodes;
    networkWithoutNodeWeights.nEdges = this.nEdges;
    networkWithoutNodeWeights.nodeWeight = new Float64Array(this.nNodes).fill(1);
    networkWithoutNodeWeights.firstNeighborIndex = this.firstNeighborIndex;
    networkWithoutNodeWeights.neighbor = this.neighbor;
    networkWithoutNodeWeights.edgeWeight = this.edgeWeight;
    networkWithoutNodeWeights.totalEdgeWeightSelfLinks = this.totalEdgeWeightSelfLinks;
    return networkWithoutNodeWeights;
  }

  createNormalizedNetwork1() {
    const normalizedNetwork = new Network();

    normalizedNetwork.nNodes = this.nNodes;
    normalizedNetwork.nEdges = this.nEdges;
    normalizedNetwork.nodeWeight = new Float64Array(this.nNodes).fill(1);
    normalizedNetwork.firstNeighborIndex = this.firstNeighborIndex;
    normalizedNetwork.neighbor = this.neighbor;

    normalizedNetwork.edgeWeight = new Float64Array(this.nEdges);
    const totalNodeWeight = this.getTotalNodeWeight();
    for (let i = 0; i < this.nNodes; i++) {
      for (let j = this.firstNeighborIndex[i]; j < this.firstNeighborIndex[i + 1]; j++) {
        normalizedNetwork.edgeWeight[j] = this.edgeWeight[j] / ((this.nodeWeight[i] * this.nodeWeight[this.neighbor[j]]) / totalNodeWeight);
      }
    }

    normalizedNetwork.totalEdgeWeightSelfLinks = 0;

    return normalizedNetwork;
  }

  createNormalizedNetwork2() {
    const normalizedNetwork = new Network();

    normalizedNetwork.nNodes = this.nNodes;
    normalizedNetwork.nEdges = this.nEdges;
    normalizedNetwork.nodeWeight = new Float64Array(this.nNodes).fill(1);
    normalizedNetwork.firstNeighborIndex = this.firstNeighborIndex;
    normalizedNetwork.neighbor = this.neighbor;

    normalizedNetwork.edgeWeight = new Float64Array(this.nEdges);
    for (let i = 0; i < this.nNodes; i++) {
      for (let j = this.firstNeighborIndex[i]; j < this.firstNeighborIndex[i + 1]; j++) {
        normalizedNetwork.edgeWeight[j] = this.edgeWeight[j] / (2 / (this.nNodes / this.nodeWeight[i] + this.nNodes / this.nodeWeight[this.neighbor[j]]));
      }
    }

    normalizedNetwork.totalEdgeWeightSelfLinks = 0;

    return normalizedNetwork;
  }
}
