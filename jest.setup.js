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
