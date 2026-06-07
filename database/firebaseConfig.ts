import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const { getReactNativePersistence } = require('firebase/auth');

const firebaseConfig = {
  apiKey:            "AIzaSyD9qag0V86xEJl8euQX6mlu0sq3b1yNlog",
  authDomain:        "transpsaude.firebaseapp.com",
  projectId:         "transpsaude",
  storageBucket:     "transpsaude.firebasestorage.app",
  messagingSenderId: "941645780353",
  appId:             "1:941645780353:web:d92af12502e0148c418480",
};

const app = initializeApp(firebaseConfig);

const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

const db = getFirestore(app);

export { auth, db };
export default app;