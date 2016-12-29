'use strict';

/**
 * Created by texpe on 30/12/2016.
 */

var host = window.location.hostname + ':' + 8080;
var controllers = angular.module('chat');

controllers.controller('AppCtrl', function ($scope) {});

controllers.controller('ChatListCtrl', function ($scope) {
    /*$scope.chatList = [];
    const token = readLocalCookie('chatToken');
      if(token) {
        $http.get(`http://${host}/api/chat/list?token=` + token).then(response => {
            console.log(response);
        });
    }*/
});

controllers.controller('HomeCtrl', function ($scope) {});

controllers.controller('LoginCtrl', function ($scope) {});