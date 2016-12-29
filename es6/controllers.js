/**
 * Created by texpe on 30/12/2016.
 */

let controllers = angular.module('controllers', []);

controllers.controller('AppCtrl', ($scope, $ionicModal, $timeout, $http, $window) => {
    $scope.loginData = {};
    $scope.user = null;

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
        document.cookie = 'chatToken=;expires=-1;'
        $window.location.reload();
    };

    $scope.doLogin = () => {
        $http.post('http://localhost:8080/login', $scope.loginData).then(result => {
            document.cookie = 'chatToken=' + result.data.token;
            if(result.data.success) $window.location.reload();

            $scope.closeLogin();
        });
    };

    $scope.readLocalCookie = (name) => {
        if(!name) return null;
        const cookies = document.cookie.split(';');
        for(let i = 0; i < cookies.length; i++) {
            if(cookies[i].indexOf('=') < 0) continue;
            if(cookies[i].substr(0, cookies[i].indexOf('=')) === name) {
                return cookies[i].substr(cookies[i].indexOf('=') + 1, cookies[i].length - cookies[i].indexOf('=') - 1);
            }
        }
        return null;
    };

    $timeout(() => {
        const token = $scope.readLocalCookie('chatToken');

        if(token) {
            $http.get('http://localhost:8080/' + token).then(result => {
                if (result.data.success) $scope.user = result.data.user;
            });
        }
    }, 0);
});

controllers.controller('PlaylistsCtrl', $scope => {
    $scope.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
    ];
});