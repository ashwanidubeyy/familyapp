module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-async-storage|@react-native-firebase|@react-navigation|lucide-react-native|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|react-native-reanimated|react-native-worklets)/)',
  ],
};
