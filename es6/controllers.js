/**
 * Created by texpe on 30/12/2016.
 */

let controllers = angular.module('controllers', []);

controllers.controller('AppCtrl', ($scope, $ionicModal, $timeout, $http, $window) => {
    $scope.loginData = {};
    $scope.user = null;

    const token = readLocalCookie('chatToken');

    if(token) {
        $http.get('http://localhost:8080/api/users/' + token).then(result => {
            if (result.data.success) $scope.user = result.data.user;
        });
    }

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(modal => {
        $scope.modal = modal;
    });

    $scope.closeLogin = () => {
        $scope.loginData = {};
        $scope.modal.hide();
    };

    $scope.login = () => {
        $scope.modal.show();
    };

    $scope.logout = () => {
        $http.get('http://localhost:8080/logout?token=' + readLocalCookie('chatToken')).then(result => {
            console.log(result.data);
            if(result.data.success) {
                document.cookie = 'chatToken=;expires=-1;'
                $window.location.reload();
            }
        });
    };

    $scope.doLogin = () => {
        $http.post('http://localhost:8080/login', $scope.loginData).then(result => {
            document.cookie = 'chatToken=' + result.data.token;
            if(result.data.success) $window.location.reload();

            $scope.closeLogin();
        });
    };
});

controllers.controller('ChatListCtrl', ($scope, $http) => {
    $scope.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
    ];

    $scope.chatList = [];
    const token = readLocalCookie('chatToken');

    if(token) {
        $http.get('http://localhost:8080/api/chat/list?token=' + token).then(response => {
            console.log(response);
        });
    }
});