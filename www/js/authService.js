'use strict';

/**
 * Created by texpe on 30/12/2016.
 */

var host = window.location.hostname + ':' + 8080;
var chat = angular.module('chat');

chat.service('authService', function ($http, $state) {
    var token = readLocalCookie('chatToken');
    var _loginSubmitted = false;

    if (token) {
        _loginSubmitted = true;
        $http.get('http://' + host + '/api/users/' + token).then(function (result) {
            if (result.data.success) user = result.data.user;
            _loginSubmitted = false;
        });
    }

    return {
        loginSubmitted: function loginSubmitted() {
            return _loginSubmitted;
        },
        login: function login(data) {
            _loginSubmitted = true;
            $http.post('http://' + host + '/login', data).then(function (result) {
                if (result.data.success) {
                    user = result.data.user;
                    document.cookie = 'chatToken=' + result.data.token;
                }
                _loginSubmitted = false;
            });
        },
        logout: function logout() {
            $http.get('http://' + host + '/logout?token=' + readLocalCookie('chatToken')).then(function (result) {
                if (result.data.success) {
                    document.cookie = 'chatToken=;expires=-1;';
                    user = null;
                    $state.go('app.login');
                }
            });
        },
        isLoggedIn: function isLoggedIn() {
            return user ? true : false;
        }
    };
});
var user = void 0;