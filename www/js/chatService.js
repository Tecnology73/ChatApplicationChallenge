'use strict';

/**
 * Created by texpe on 30/12/2016.
 */

var chat = angular.module('chat');

chat.service('chatService', function ($http) {
    var chatList = [];
    var chatMessages = [];
    var token = readLocalCookie('chatToken');
    var userSearchResults = [];

    $http.get('http://' + host + '/api/chat/list?token=' + token).then(function (response) {
        if (response.data.success) chatList = response.data.result;
    });

    return {
        users: {
            search: function search(fragment) {
                $http.get('http://' + host + '/api/users/search/' + fragment + '?token=' + token).then(function (response) {
                    userSearchResults = response.data.results;
                });
            },
            results: function results() {
                return userSearchResults;
            },
            clear: function clear() {
                userSearchResults = [];
            }
        },
        list: {
            get: function get() {
                return chatList;
            },
            removeSingle: function removeSingle(index) {
                if (chatList.length - 1 < index) return;
                chatList.splice(index, 1);
            },
            removeMultiple: function removeMultiple(arr) {
                var tmp = [];
                for (var i = 0; i < chatList.length; i++) {
                    if (arr.indexOf(i) < 0) tmp.push(chatList[i]);
                }
                chatList = tmp;
            },
            clear: function clear() {
                chatList = [];
            },
            add: function add(user) {
                chatList.push(user);
                $http.put('http://' + host + '/api/chat/list/' + user.Username + '?token=' + token).then(function (response) {
                    console.log(response.data);
                });
            }
        },
        messages: {
            get: function get() {
                return chatMessages;
            },
            add: function add(item, index) {
                if (!item) return;
                if (index && chatMessages.length - 1 < index) index = chatMessages.length - 1;
                if (index) chatMessages.splice(index, 0, item);else chatMessages.push(item);
            },
            removeSingle: function removeSingle(index) {
                if (chatMessages.length - 1 < index) return;
                chatMessages.splice(index, 1);
            },
            removeMultiple: function removeMultiple(arr) {
                var tmp = [];
                for (var i = 0; i < chatMessages.length; i++) {
                    if (arr.indexOf(i) < 0) tmp.push(chatMessage[i]);
                }
                chatMessages = tmp;
            },
            clear: function clear() {
                chatMessages = [];
            }
        }
    };
});