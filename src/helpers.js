const getRandomNumberInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getIterator = () => (() => {
  let count = 0;

  return () => {
    count++;

    return count - 1;
  }
})();

module.exports = {
  getRandomNumberInRange,
  getIterator
};
