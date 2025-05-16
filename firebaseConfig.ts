import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: 'AIzaSyAbv9Ngpsgbzw9EoTKKNomB-iCs5UB-0nM',
  authDomain: 'noteapp-7f9fe.firebaseapp.com',
  projectId: 'noteapp-7f9fe',
  storageBucket: 'noteapp-7f9fe.appspot.com',
  messagingSenderId: '60069723496',
  appId: '1:60069723496:android:f320f9466f485668cdaadd',
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
