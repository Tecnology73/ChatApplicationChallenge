'use strict';

/**
 * Created by texpe on 30/12/2016.
 */

var host = window.location.hostname + ':' + 8080;
var chat = angular.module('chat');

chat.service('authService', function ($http) {
    var token = readLocalCookie('chatToken');

    if (token) {
        $http.get('http://' + host + '/api/users/' + token).then(function (result) {
            if (result.data.success) user = result.data.user;
        });
    }

    return {
        login: function login(data) {
            $http.post('http://' + host + '/login', data).then(function (result) {
                user = result.data.user;
                document.cookie = 'chatToken=' + result.data.token;
                if (result.data.success) $window.location.reload();

                $scope.closeLogin();
            });
        },
        logout: function logout() {
            $http.get('http://' + host + '/logout?token=' + readLocalCookie('chatToken')).then(function (result) {
                if (result.data.success) {
                    document.cookie = 'chatToken=;expires=-1;';
                    user = null;
                    $state.go('app.home');
                }
            });
        },
        isLoggedIn: function isLoggedIn() {
            return user ? true : false;
        }
    };
});
var user = void 0;