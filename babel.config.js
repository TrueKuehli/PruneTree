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
            'edge >= 79',
            'safari >= 10',
            'firefox >= 57',
            'ios >= 10',
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
