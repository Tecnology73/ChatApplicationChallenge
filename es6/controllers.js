/**
 * Created by texpe on 30/12/2016.
 */

const host = (window.location.hostname + ':' + 8080);
let controllers = angular.module('chat');

controllers.controller('AppCtrl', ($scope) => {

});

controllers.controller('ChatListCtrl', ($scope) => {
    /*$scope.chatList = [];
    const token = readLocalCookie('chatToken');

    if(token) {
        $http.get(`http://${host}/api/chat/list?token=` + token).then(response => {
            console.log(response);
        });
    }*/
});

controllers.controller('HomeCtrl', ($scope) => {

});

controllers.controller('LoginCtrl', ($scope) => {

});