module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@assets': './assets',
            '@components': './components',
            '@constants': './constants',
            '@context': './context',
            '@controllers': './controllers',
            '@design-system': './design-system',
            '@enums': './enums',
            '@hooks': './hooks',
            '@interfaces': './interfaces',
            '@screens': './screens',
            '@services': './services',
            '@styles': './styles',
            '@unistyles': './unistyles',
            '@utils': './utils',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
