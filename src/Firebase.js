import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './config';

firebase.initializeApp(firebaseConfig);

export const Firebase = firebase;
