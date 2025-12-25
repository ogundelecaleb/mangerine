const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure Metro only looks in the current project's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Reset any inherited resolver settings
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Clear any inherited watch folders
config.watchFolders = [];

module.exports = config;