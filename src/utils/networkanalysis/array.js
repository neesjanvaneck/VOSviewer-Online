export function calcSum(values) {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum;
}

export function calcSumWithinRange(values, beginIndex, endIndex) {
  let sum = 0;
  for (let i = beginIndex; i < endIndex; i++) {
    sum += values[i];
  }
  return sum;
}

export function calcAverage(values) {
  let average = 0;
  for (let i = 0; i < values.length; i++) {
    average += values[i];
  }
  average /= values.length;
  return average;
}

export function calcMedian(values) {
  let median;
  const sortedValue = values.slice();
  sortedValue.sort((a, b) => a - b);
  if (sortedValue.length % 2 === 1) {
    median = sortedValue[(sortedValue.length - 1) / 2];
  } else {
    median = (sortedValue[sortedValue.length / 2 - 1] + sortedValue[sortedValue.length / 2]) / 2;
  }
  return median;
}

export function calcMinimum(values) {
  let minimum = values[0];
  for (let i = 1; i < values.length; i++) {
    minimum = Math.min(minimum, values[i]);
  }
  return minimum;
}

export function calcMaximum(values) {
  let maximum = values[0];
  for (let i = 1; i < values.length; i++) {
    maximum = Math.max(maximum, values[i]);
  }
  return maximum;
}

export function generateRandomPermutation(nElements, random) {
  const permutation = new Uint32Array(nElements);
  for (let i = 0; i < nElements; i++) {
    permutation[i] = i;
  }
  for (let i = 0; i < nElements; i++) {
    const j = random.nextInt(nElements);
    const k = permutation[i];
    permutation[i] = permutation[j];
    permutation[j] = k;
  }
  return permutation;
}
