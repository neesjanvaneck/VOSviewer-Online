import { calcMaximum } from './array';

export default class Clustering {
  constructor(nNodes) {
    if (typeof nNodes === 'number') {
      this.nNodes = nNodes;
      this.cluster = new Uint32Array(nNodes);
      this.nClusters = 1;
    } else {
      const cluster = nNodes;
      this.nNodes = cluster.length;
      this.cluster = cluster.slice();
      this.nClusters = calcMaximum(cluster) + 1;
    }
  }

  getNClusters() {
    return this.nClusters;
  }

  initSingletonClusters() {
    const { nNodes, cluster } = this;
    for (let i = 0; i < nNodes; i++) {
      cluster[i] = i;
    }
    this.nClusters = nNodes;
  }

  getNodesPerCluster() {
    const { nClusters, nNodes, cluster } = this;

    const nodePerCluster = new Array(nClusters);

    const nNodesPerCluster = this.getNNodesPerCluster();

    for (let i = 0; i < nClusters; i++) {
      nodePerCluster[i] = new Uint32Array(nNodesPerCluster[i]);
      nNodesPerCluster[i] = 0;
    }
    for (let i = 0; i < nNodes; i++) {
      nodePerCluster[cluster[i]][nNodesPerCluster[cluster[i]]] = i;
      nNodesPerCluster[cluster[i]] += 1;
    }

    return nodePerCluster;
  }

  getNNodesPerCluster() {
    const { nClusters, nNodes, cluster } = this;

    const nNodesPerCluster = new Uint32Array(nClusters);
    for (let i = 0; i < nNodes; i++) {
      nNodesPerCluster[cluster[i]] += 1;
    }
    return nNodesPerCluster;
  }

  mergeClusters(clustering) {
    const { nNodes, cluster } = this;
    for (let i = 0; i < nNodes; i++) {
      cluster[i] = clustering.cluster[cluster[i]];
    }
    this.nClusters = clustering.nClusters;
  }

  orderClustersByNNodes() {
    const nNodesPerCluster = this.getNNodesPerCluster();

    const clusterNNodes = new Array(this.nClusters);
    for (let i = 0; i < this.nClusters; i++) {
      const newClusterNNodes = {
        cluster: i,
        nNodes: nNodesPerCluster[i]
      };
      clusterNNodes[i] = newClusterNNodes;
    }

    clusterNNodes.sort((a, b) => ((b.nNodes > a.nNodes) ? 1 : ((b.nNodes < a.nNodes) ? -1 : 0)));

    const newCluster = new Uint32Array(this.nClusters);
    let i = 0;
    do {
      newCluster[clusterNNodes[i].cluster] = i;
      i += 1;
    } while ((i < this.nClusters) && (clusterNNodes[i].nNodes > 0));
    this.nClusters = i;
    for (let i = 0; i < this.nNodes; i++) {
      this.cluster[i] = newCluster[this.cluster[i]];
    }
  }
}
