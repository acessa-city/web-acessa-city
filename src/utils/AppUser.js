import firebase from 'firebase/app'
import api from './API'
import {isAuthenticated} from 'utils/auth'

const currentUser = () => {
    return new Promise((resolve, reject) => {

        if (!isAuthenticated()) {
          reject();
        }

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              user.getIdTokenResult().then((token) => {
                const claims = token.claims;
                api.get('/user/'+claims.app_user_id).
                  then(response => {
                      resolve(response.data)
                  })
                  .catch(error => {
                    reject(error)
                  })
              })
              .catch(error => {
                reject(error)
              })
            }
        })
    }) 
}

export const userClaims = () => {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              user.getIdTokenResult().then((token) => {
                const claims = token.claims;

                return resolve(claims);
              })
            }
        });
    }) 
}

export default currentUser;