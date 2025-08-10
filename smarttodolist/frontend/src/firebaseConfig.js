
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCRdgUKCIYXBMolCmIa_E5RV80VFMH7FXw",
  authDomain: "smarttodo-f7f51.firebaseapp.com",
  projectId: "smarttodo-f7f51",
  storageBucket: "smarttodo-f7f51.appspot.com", 
  messagingSenderId: "80912904226",
  appId: "1:80912904226:web:d00f94b121f9b58f32da7b",
  measurementId: "G-BRPF1VKFXE"
};

export const app = initializeApp(firebaseConfig);