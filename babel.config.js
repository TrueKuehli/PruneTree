module.exports = function (api) {
  api.cache(true)
  const presets = [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'entry',
        targets: {
          browsers: [
            'edge >= 16',
            'safari >= 9',
            'firefox >= 57',
            'ie >= 11',
            'ios >= 9',
            'chrome >= 49'
          ]
        }
      }
    ],
    ['@babel/preset-react']
  ]
  const plugins = []
  return {
    presets,
    plugins
  }
}
