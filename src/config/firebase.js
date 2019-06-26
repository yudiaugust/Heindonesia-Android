import * as firebase from "firebase";
​
export const initialize = () => firebase.initializeApp({
    apiKey: "AIzaSyBnogj2xZAl56KaSlpyoaAP4iJ8V8ymfz0",
    authDomain: "heindonesia-a7bbe.firebaseapp.com",
    databaseURL: "https://heindonesia-a7bbe.firebaseio.com",
    projectId: "heindonesia-a7bbe",
    storageBucket: "heindonesia-a7bbe.appspot.com",
    messagingSenderId: "197438737662"
});

export const setListener = (endpoint, updaterFn) => {
    firebase.database().ref(endpoint).on('value', updaterFn);
    return () => firebase.database().ref(endpoint).off();
}

export const pushData = (endpoint, data) => {
    return firebase.database().ref(endpoint).push(data);
}