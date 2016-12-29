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
    $scope.searchTimeout;
    $scope.search = { fragment: '' };
    $scope.userSearchResults = [];
    $scope.performingUserSearch = false;
    $scope.chatlist = [];

    $scope.$watch(chatService.users.results, function (newValue, oldValue) {
        $scope.userSearchResults = newValue;
    });

    $scope.$watch(chatService.list.get, function (newValue, oldValue) {
        $scope.chatlist = newValue;
    });

    $scope.searchUsers = function () {
        $scope.performingUserSearch = true;
        clearTimeout($scope.searchTimeout);
        $scope.searchTimeout = setTimeout(function () {
            chatService.users.search($scope.search.fragment);
        }, 150);
    };

    $scope.stopUserSearch = function () {
        $scope.search.fragment = '';
        chatService.users.clear();
        $scope.performingUserSearch = false;
    };

    $scope.addToChatList = function (user) {
        chatService.list.add(user);
    };

    $scope.formatDate = function (date, userFormat) {
        if (typeof date === 'string' || typeof date === 'number') date = new Date(date);

        var formats = {
            'DD': ('0' + date.getDate()).slice(-2),
            'D': date.getDate(),
            'MM': ('0' + date.getMonth()).slice(-2),
            'M': date.getMonth(),
            'YYYY': date.getFullYear(),
            'YY': date.getYear(),
            'hh': ('0' + date.getHours()).slice(-2),
            'h': date.getHours(),
            'mm': ('0' + date.getMinutes()).slice(-2),
            'm': date.getMinutes(),
            'ss': ('0' + date.getSeconds()).slice(-2),
            's': date.getSeconds(),
            'AA': date.getHours() > 12 ? 'PM' : 'AM',
            'aa': date.getHours() > 12 ? 'pm' : 'am'
        };

        if (formats['h'] > 12) formats['h'] -= 12;
        if (formats['h'] === 0) formats['h'] = 12;
        formats['hh'] = ('0' + formats['h']).slice(-2);

        for (var format in formats) {
            userFormat = userFormat.replace(format, formats[format]);
        }return userFormat;
    };
});

controllers.controller('LoginCtrl', function ($scope, authService) {
    $scope.data = {};

    $scope.login = function () {
        authService.login($scope.data);
    };
});