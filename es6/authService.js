/**
 * Created by texpe on 30/12/2016.
 */

const host = (window.location.hostname + ':' + 8080);
let chat = angular.module('chat');

chat.service('authService', ($http) => {
    const token = readLocalCookie('chatToken');

    if(token) {
        $http.get(`http://${host}/api/users/${token}`).then(result => {
            if(result.data.success) user = result.data.user;
        });
    }

    return {
        login: (data) => {
            $http.post(`http://${host}/login`, data).then(result => {
                user = result.data.user;
                document.cookie = 'chatToken=' + result.data.token;
                if(result.data.success) $window.location.reload();

                $scope.closeLogin();
            });
        },
        logout: () => {
            $http.get(`http://${host}/logout?token=` + readLocalCookie('chatToken')).then(result => {
                if(result.data.success) {
                    document.cookie = 'chatToken=;expires=-1;'
                    user = null;
                    $state.go('app.home');
                }
            });
        },
        isLoggedIn: () => {
            return user ? true : false;
        }
    }
});
let user;
