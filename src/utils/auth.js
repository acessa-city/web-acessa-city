import API from './API';
export const TOKEN_KEY = "@api-Token";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
  API.post('/auth').then((result) => {
    // setUser(result.data);
    // console.log("UserFromAPI", getUser());
  })  
};

export const asyncLogin = token => {  
  return new Promise((resolve, reject) => {
    localStorage.setItem(TOKEN_KEY, token);    
    API.post('/auth').then(result => {
      resolve(result)
    })
    .catch(error => {
      reject()
    })
  })
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};