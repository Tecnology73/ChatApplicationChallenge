/**
 * Created by texpe on 30/12/2016.
 */

const host = (window.location.hostname + ':' + 8080);
let controllers = angular.module('chat');

controllers.controller('AppCtrl', ($scope, authService, $state, $ionicHistory) => {
    $scope.loginSubmitted = false;

    $scope.$watch(authService.isLoggedIn, (value, oldValue) => {
        $ionicHistory.nextViewOptions({ disableBack: true });
        if (!value && oldValue) $state.go('app.login');
        else $state.go('app.chat');
        $scope.isLoggedIn = authService.isLoggedIn();
    });

    $scope.$watch(authService.loginSubmitted, (value, oldValue) => {
        if (value && !oldValue) $scope.loginSubmitted = true;
        else $scope.loginSubmitted = false;
    });

    $scope.logout = () => {
        authService.logout();
    }
});

controllers.controller('ChatListCtrl', ($scope, chatService, authService) => {
    $scope.searchTimeout;
    $scope.search = { fragment: '' };
    $scope.userSearchResults = [];
    $scope.performingUserSearch = false;
    $scope.chatlist = [];
    $scope.user = null;

    $scope.$watch(authService.getUser, (newValue, oldValue) => {
        $scope.user = newValue;
    });

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

    $scope.formatDate = (a, b) => { return chatService.formatDate(a, b); };
});

controllers.controller('LoginCtrl', ($scope, authService) => {
    $scope.data = {};

    $scope.login = () => {
        authService.login($scope.data).then(success => {
            if(success) $scope.data = {};
            else $scope.data.Password = '';
        }).catch(err => {
            $scope.data.Password = '';
        });
    }
});

controllers.controller('ChatMessageCtrl', ($scope, $stateParams, $timeout, chatService, authService) => {
    $scope.chatId = $stateParams.id;
    $scope.messages = [];
    $scope.socket = null;
    $scope.userMessage;
    $scope.user = null;
    $scope.chatInfo = null;
    $scope.scrollLocked = false;

    $scope.$on('$destroy', () => {
        $scope.socket.disconnect();
    });

    $scope.$watch(chatService.chatInfo.get, (newValue, oldValue) => {
        $scope.chatInfo = newValue;
    });

    $scope.$watch(authService.getUser, (newValue, oldValue) => {
        $scope.user = newValue;
    });

    $scope.$watch(chatService.messages.get, (newValue, oldValue) => {
        $scope.messages = newValue;
    });

    $scope.sendMessage = event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            $scope.userMessage.Timestamp = Date.now();

            $scope.socket.send($scope.userMessage);
            chatService.messages.add($scope.userMessage);
            setTimeout(() => { $scope.scrollChatToBottom() }, 1);

            $scope.resetUserMessage();
        }
    };

    $scope.resetUserMessage = () => {
        let recipient = (!$scope.user || !$scope.chatInfo ? null : ($scope.user.Username === $scope.chatInfo.Recipient.Username ? $scope.chatInfo.Sender : $scope.chatInfo.Recipient));
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

    $scope.scrollChatToBottom = () => {
        const messagesScrollContainer = document.querySelector('.chat-messages');

        if($scope.messages.length > 0 && !$scope.scrollLocked)
            messagesScrollContainer.scrollTop = (messagesScrollContainer.scrollHeight - messagesScrollContainer.offsetHeight);
        if($scope.messages.length >= 100)
            $scope.messages = chatService.messages.removeRange(100, $scope.messages.length - 100);
    };

    $scope.formatDate = (a, b) => { return chatService.formatDate(a, b); };

    $timeout(() => {
        chatService.chatInfo.getRemoteInfo($scope.chatId);

        $scope.socket = io.connect(`http://${host}/`);

        $scope.socket.on('connect', () => {
            $scope.resetUserMessage();

            $scope.socket.emit('userInfo', $scope.user);
        });

        $scope.socket.on('message', data => {
            chatService.messages.add(data);
            $scope.$digest();
            setTimeout(() => { $scope.scrollChatToBottom() }, 1);
        });

        document.querySelector('.chat-messages').addEventListener('mousewheel', function(e) {
            const scrollUp = e.deltaY < 0;
            const scrollHeight = this.scrollHeight - this.offsetHeight;

            if(scrollUp && this.scrollTop >= scrollHeight - 200)
                $scope.scrollLocked = true;
            else if(!scrollUp && this.scrollTop >= scrollHeight - 200)
                $scope.scrollLocked = false;
        });
    });
});