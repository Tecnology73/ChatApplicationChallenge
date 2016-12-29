'use strict';

/**
 * Created by texpe on 30/12/2016.
 */

var controllers = angular.module('controllers', []);

controllers.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    $scope.loginData = {};

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    $scope.login = function () {
        $scope.modal.show();
    };

    $scope.doLogin = function () {
        console.log("Doing Login", $scope.loginData);

        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
});

controllers.controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [{ title: 'Reggae', id: 1 }, { title: 'Chill', id: 2 }, { title: 'Dubstep', id: 3 }, { title: 'Indie', id: 4 }, { title: 'Rap', id: 5 }, { title: 'Cowbell', id: 6 }];
});