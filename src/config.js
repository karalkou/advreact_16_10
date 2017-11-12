import firebase from 'firebase'

export const appName = 'advreact-1610-kys'

firebase.initializeApp({
    apiKey: "AIzaSyCuzZg-9QjuEEIHNSmJEL4VaAb3QtKb4xQ",
    authDomain: `${appName}.firebaseapp.com`,
    databaseURL: `https://${appName}.firebaseio.com`,
    projectId: appName,
    storageBucket: "",
    messagingSenderId: "437473203897"
})