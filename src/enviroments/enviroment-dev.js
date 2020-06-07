
const enviroment = {
  firebase: {
    apiKey: 'AIzaSyDBxtpy4QlnhPfGK7mF_TnbLXooEXVPy_0',
    authDomain: 'acessa-city.firebaseapp.com',
    databaseURL: 'https://acessa-city.firebaseio.com',
    projectId: 'acessa-city',
    storageBucket: 'acessa-city.appspot.com',
    messagingSenderId: '810134304715',
    appId: '1:810134304715:web:040e88d44425f0e9f5684e',
    measurementId: 'G-VFS8ZJ3ECW'
  },
  functions: {
    localApi: process.env.REACT_APP_API_URL
  }
};

export default enviroment;
