/**
 * Created by texpe on 30/12/2016.
 */

const host = (window.location.hostname + ':' + 8080);
let controllers = angular.module('chat');

controllers.controller('AppCtrl', ($scope, authService, $state, $ionicHistory) => {
    $scope.loginSubmitted = false;

    $scope.$watch(authService.isLoggedIn, (value, oldValue) => {
        $ionicHistory.nextViewOptions({ disableBack: true });
        if(!value && oldValue) $state.go('app.login');
        else $state.go('app.chat');
        $scope.isLoggedIn = authService.isLoggedIn();
    });

    $scope.$watch(authService.loginSubmitted, (value, oldValue) => {
        if(value && !oldValue) $scope.loginSubmitted = true;
        else $scope.loginSubmitted = false;
    });

    $scope.logout = () => {
        authService.logout();
    }
});

controllers.controller('ChatListCtrl', ($scope, chatService) => {
    $scope.searchTimeout;
    $scope.search = { fragment: '' };
    $scope.userSearchResults = [];
    $scope.performingUserSearch = false;
    $scope.chatlist = [];

    $scope.$watch(chatService.users.results, (newValue, oldValue) => {
        $scope.userSearchResults = newValue;
    });

    $scope.$watch(chatService.list.get, (newValue, oldValue) => {
        $scope.chatlist = newValue;
    });

    $scope.searchUsers = () => {
        $scope.performingUserSearch = true;
        clearTimeout($scope.searchTimeout);
        $scope.searchTimeout = setTimeout(() => {
            chatService.users.search($scope.search.fragment);
        }, 150);
    };

    $scope.stopUserSearch = () => {
        $scope.search.fragment = '';
        chatService.users.clear();
        $scope.performingUserSearch = false;
    };

    $scope.addToChatList = (user) => {
        chatService.list.add(user);
    };

    $scope.formatDate = (date, userFormat) => {
        if(typeof date === 'string' || typeof date === 'number')
            date = new Date(date);

        const formats = {
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

        if(formats['h'] > 12)
            formats['h'] -= 12;
        if(formats['h'] === 0)
            formats['h'] = 12;
        formats['hh'] = ('0' + formats['h']).slice(-2);

        for(let format in formats)
            userFormat = userFormat.replace(format, formats[format]);

        return userFormat;
    };
});

controllers.controller('LoginCtrl', ($scope, authService) => {
    $scope.data = {};

    $scope.login = () => {
        authService.login($scope.data);
    }
});