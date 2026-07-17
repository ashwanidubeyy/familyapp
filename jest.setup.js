jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');

  const interpolate = (value, inputRange, outputRange) => {
    if (value <= inputRange[0]) {
      return outputRange[0];
    }

    if (value >= inputRange[inputRange.length - 1]) {
      return outputRange[outputRange.length - 1];
    }

    return outputRange[1] ?? outputRange[0];
  };

  const Animated = {
    View,
    createAnimatedComponent: component => component,
  };

  return {
    __esModule: true,
    default: Animated,
    interpolate,
    useAnimatedProps: updater => updater(),
    useAnimatedStyle: updater => updater(),
    useSharedValue: value => ({ value }),
    withSpring: value => value,
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  const Icon = props => React.createElement(View, props);

  return new Proxy(
    {
      __esModule: true,
    },
    {
      get: (target, property) => {
        if (property === '__esModule') {
          return target.__esModule;
        }

        return Icon;
      },
    },
  );
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('@react-native-firebase/auth', () => {
  const auth = () => ({
    currentUser: null,
    onAuthStateChanged: callback => {
      callback(null);
      return jest.fn();
    },
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn(),
  });

  return {
    __esModule: true,
    default: auth,
  };
});

jest.mock('@react-native-firebase/firestore', () => {
  const doc = () => ({
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
  });
  const collection = () => ({
    doc,
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn(),
  });
  const firestore = () => ({
    collection,
    doc,
    batch: () => ({
      set: jest.fn(),
      update: jest.fn(),
      commit: jest.fn(),
    }),
  });

  firestore.FieldValue = {
    increment: jest.fn(value => value),
  };

  return {
    __esModule: true,
    default: firestore,
  };
});
