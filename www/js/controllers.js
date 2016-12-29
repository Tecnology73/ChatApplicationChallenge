'use strict';

/**
 * Created by texpe on 30/12/2016.
 */

var controllers = angular.module('controllers', []);

controllers.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http, $window) {
    $scope.loginData = {};
    $scope.user = null;

    var token = readLocalCookie('chatToken');

    if (token) {
        $http.get('http://localhost:8080/' + token).then(function (result) {
            if (result.data.success) $scope.user = result.data.user;
        });
    }

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.closeLogin = function () {
        $scope.loginData = {};
        $scope.modal.hide();
    };

    $scope.login = function () {
        $scope.modal.show();
    };

    $scope.logout = function () {
        document.cookie = 'chatToken=;expires=-1;';
        $window.location.reload();
    };

    $scope.doLogin = function () {
        $http.post('http://localhost:8080/login', $scope.loginData).then(function (result) {
            document.cookie = 'chatToken=' + result.data.token;
            if (result.data.success) $window.location.reload();

            $scope.closeLogin();
        });
    };
});

controllers.controller('ChatListCtrl', function ($scope, $http) {
    $scope.playlists = [{ title: 'Reggae', id: 1 }, { title: 'Chill', id: 2 }, { title: 'Dubstep', id: 3 }, { title: 'Indie', id: 4 }, { title: 'Rap', id: 5 }, { title: 'Cowbell', id: 6 }];

    $scope.chatList = [];
    var token = readLocalCookie('chatToken');

    if (token) {
        $http.get('http://localhost:8080/api/chatlist?token=' + token).then(function (response) {
            console.log(response);
        });
    }
});