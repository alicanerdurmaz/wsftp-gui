module.exports = function({ env }) {
  return {
    webpack: {
      configure: {
        target: 'electron-renderer',
        node: {
          __filename: true,
          __dirname: true
        }
      }
    }
  };
};
