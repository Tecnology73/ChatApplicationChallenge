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
    console.log(chatService.list.get());
});

controllers.controller('LoginCtrl', ($scope, authService) => {
    $scope.data = {};

    $scope.login = () => {
        authService.login($scope.data);
    }
});