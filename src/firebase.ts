import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

// Initialize Firebase
const app = !getApps().length ? initializeApp(config) : getApps()[0];
export const db = getFirestore(app);
export default app;
