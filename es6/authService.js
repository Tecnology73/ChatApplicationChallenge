/**
 * Created by texpe on 30/12/2016.
 */

const host = (window.location.hostname + ':' + 8080);
let chat = angular.module('chat');

chat.service('authService', ($http, $state) => {
    let user = null;
    const token = readLocalCookie('chatToken');
    let loginSubmitted = false;

    if (token) {
        loginSubmitted = true;
        $http.get(`http://${host}/api/users/${token}`).then(result => {
            if (result.data.success) user = result.data.user;
            loginSubmitted = false;
        });
    }

    return {
        loginSubmitted: () => {
            return loginSubmitted;
        },
        getUser: () => {
            return user;
        },
        login: (data) => {
            return new Promise((resolve, reject) => {
                loginSubmitted = true;
                $http.post(`http://${host}/login`, data).then(result => {
                    if (result.data.success) {
                        user = result.data.user;
                        document.cookie = 'chatToken=' + result.data.token;
                    }
                    loginSubmitted = false;
                    resolve(result.data.success);
                }).catch(err => {
                    loginSubmitted = false;
                    reject(err);
                });
            });
        },
        logout: () => {
            $http.get(`http://${host}/logout?token=` + readLocalCookie('chatToken')).then(result => {
                if (result.data.success) {
                    document.cookie = 'chatToken=;expires=-1;'
                    user = null;
                    $state.go('app.login');
                }
            });
        },
        isLoggedIn: () => {
            return user ? true : false;
        }
    }
});
let user;
