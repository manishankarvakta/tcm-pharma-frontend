const getNewPoint = (grossTotal) => {
  if (grossTotal > 0) {
    return parseInt(grossTotal) / 100;
  } else {
    return 0;
  }
};
const totalPoint = (currentPoint, grossTotal) => {
  if (grossTotal > 0) {
    return currentPoint + getNewPoint(grossTotal);
  } else {
    return currentPoint;
  }
};
const remaningPoint = (newCurrentPoint, usedPoint) => {
  return newCurrentPoint - usedPoint;
};
export { getNewPoint, totalPoint, remaningPoint };
