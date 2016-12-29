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

controllers.controller('ChatListCtrl', function ($scope, chatService, authService) {
    $scope.searchTimeout;
    $scope.search = { fragment: '' };
    $scope.userSearchResults = [];
    $scope.performingUserSearch = false;
    $scope.chatlist = [];
    $scope.user = null;

    $scope.$watch(authService.getUser, function (newValue, oldValue) {
        $scope.user = newValue;
    });

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

    $scope.formatDate = function (a, b) {
        return chatService.formatDate(a, b);
    };
});

controllers.controller('LoginCtrl', function ($scope, authService) {
    $scope.data = {};

    $scope.login = function () {
        authService.login($scope.data).then(function (success) {
            if (success) $scope.data = {};else $scope.data.Password = '';
        }).catch(function (err) {
            $scope.data.Password = '';
        });
    };
});

controllers.controller('ChatMessageCtrl', function ($scope, $stateParams, $timeout, chatService, authService) {
    $scope.chatId = $stateParams.id;
    $scope.messages = [];
    $scope.socket = null;
    $scope.userMessage;
    $scope.user = null;
    $scope.chatInfo = null;
    $scope.scrollLocked = false;

    $scope.$on('$destroy', function () {
        $scope.socket.disconnect();
    });

    $scope.$watch(chatService.chatInfo.get, function (newValue, oldValue) {
        $scope.chatInfo = newValue;
    });

    $scope.$watch(authService.getUser, function (newValue, oldValue) {
        $scope.user = newValue;
    });

    $scope.$watch(chatService.messages.get, function (newValue, oldValue) {
        $scope.messages = newValue;
    });

    $scope.sendMessage = function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $scope.userMessage.Timestamp = Date.now();

            $scope.socket.send($scope.userMessage);
            chatService.messages.add($scope.userMessage);

            $scope.chatInfo.LastMessage = $scope.userMessage.Message;
            $scope.chatInfo.LastTimestamp = $scope.userMessage.Timestamp;
            chatService.list.update($scope.chatInfo._id, $scope.chatInfo);

            setTimeout(function () {
                $scope.scrollChatToBottom();
            }, 1);

            $scope.resetUserMessage();
        }
    };

    $scope.resetUserMessage = function () {
        var recipient = !$scope.user || !$scope.chatInfo ? null : $scope.user.Username === $scope.chatInfo.Recipient.Username ? $scope.chatInfo.Sender : $scope.chatInfo.Recipient;
        $scope.userMessage = {
            Sender: {
                DisplayName: $scope.user ? $scope.user.DisplayName : '',
                Username: $scope.user ? $scope.user.Username : ''
            },
            Recipient: {
                DisplayName: recipient ? recipient.DisplayName : '',
                Username: recipient ? recipient.Username : ''
            },
            Message: '',
            Timestamp: 0
        };
    };

    $scope.scrollChatToBottom = function () {
        var messagesScrollContainer = document.querySelector('.chat-messages');

        if ($scope.messages.length > 0 && !$scope.scrollLocked) messagesScrollContainer.scrollTop = messagesScrollContainer.scrollHeight - messagesScrollContainer.offsetHeight;
        if ($scope.messages.length >= 100) $scope.messages = chatService.messages.removeRange(100, $scope.messages.length - 100);
    };

    $scope.formatDate = function (a, b) {
        return chatService.formatDate(a, b);
    };

    $timeout(function () {
        chatService.chatInfo.getRemoteInfo($scope.chatId);
        chatService.messages.getHistory($scope.chatId);

        $scope.socket = io.connect('http://' + host + '/');

        $scope.socket.on('connect', function () {
            $scope.resetUserMessage();
            $scope.scrollChatToBottom();

            $scope.socket.emit('userInfo', $scope.user);
        });

        $scope.socket.on('message', function (data) {
            chatService.messages.add(data);
            $scope.$digest();
            setTimeout(function () {
                $scope.scrollChatToBottom();
            }, 1);
        });

        document.querySelector('.chat-messages').addEventListener('mousewheel', function (e) {
            var scrollUp = e.deltaY < 0;
            var scrollHeight = this.scrollHeight - this.offsetHeight;

            if (scrollUp && this.scrollTop >= scrollHeight - 200) $scope.scrollLocked = true;else if (!scrollUp && this.scrollTop >= scrollHeight - 200) $scope.scrollLocked = false;
        });
    });
});