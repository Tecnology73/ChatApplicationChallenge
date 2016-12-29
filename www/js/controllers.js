'use strict';

/**
 * Created by texpe on 30/12/2016.
 */

var host = window.location.hostname + ':' + 8080;
var controllers = angular.module('chat');

controllers.controller('AppCtrl', function ($scope, authService, $state, $ionicHistory) {
    $scope.loginSubmitted = false;

    $scope.$watch(authService.isLoggedIn, function (value, oldValue) {
        $ionicHistory.nextViewOptions({ disableBack: true });
        if (!value && oldValue) $state.go('app.login');else $state.go('app.chat');
        $scope.isLoggedIn = authService.isLoggedIn();
    });

    $scope.$watch(authService.loginSubmitted, function (value, oldValue) {
        if (value && !oldValue) $scope.loginSubmitted = true;else $scope.loginSubmitted = false;
    });

    $scope.logout = function () {
        authService.logout();
    };
});

controllers.controller('ChatListCtrl', function ($scope, chatService) {
    console.log(chatService.list.get());
});

controllers.controller('LoginCtrl', function ($scope, authService) {
    $scope.data = {};

    $scope.login = function () {
        authService.login($scope.data);
    };
});