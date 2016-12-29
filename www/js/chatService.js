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
    var chatInfo = null;

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
        chatInfo: {
            getRemoteInfo: function getRemoteInfo(chatId) {
                $http.get('http://' + host + '/api/chat/' + chatId + '?token=' + token).then(function (response) {
                    if (response.data.success) chatInfo = response.data.info;
                });
            },
            get: function get() {
                return chatInfo;
            },
            set: function set(info) {
                chatInfo = info;
            },
            clear: function clear() {
                chatInfo = null;
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
            update: function update(id, r) {
                for (var i = 0; i < chatList.length; i++) {
                    if (chatList[i]._id === id) {
                        chatList[i] = r;
                        break;
                    }
                }
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
            getHistory: function getHistory(chatId, l, o) {
                var query = {};
                query.token = token;
                if (l) query.limit = l;
                if (o) query.offset = o;
                var urlQuery = '';
                for (var q in query) {
                    if (query.hasOwnProperty(q)) urlQuery += q + '=' + query[q] + '&';
                }
                urlQuery = urlQuery.substr(0, urlQuery.length - 1);
                $http.get('http://' + host + '/api/chat/' + chatId + '/history?' + urlQuery).then(function (response) {
                    if (response.data.success) chatMessages = response.data.history;
                });
            },
            add: function add(item, index) {
                if (!item) return;
                if (index && chatMessages.length - 1 < index) index = chatMessages.length - 1;
                if (index) chatMessages.splice(index, 0, item);else {
                    chatMessages.push(item);
                    $http.post('http://' + host + '/api/chat/' + chatInfo._id + '?token=' + token, item).then(function (response) {
                        console.log(response);
                    });
                }
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
            removeRange: function removeRange(a, b) {
                if (a < 0) a = 0;
                if (b > chatMessages.length) b = chatMessages.length;
                chatMessages.splice(a, b);
            },
            clear: function clear() {
                chatMessages = [];
            }
        },
        formatDate: function formatDate(date, userFormat) {
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
        }
    };
});