/**
 * Created by texpe on 30/12/2016.
 */

let chat = angular.module('chat', ['ionic', 'controllers']);

chat.run($ionicPlatform => {
    $ionicPlatform.ready(() => {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if(window.StatusBar)
            StatusBar.styleDefault();
    });
});

chat.config(($stateProvider, $urlRouterProvider) => {
    const states = {
        'app': {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        },
        'app.chats': {
            url: '/chats',
            views: {
                'menuContent': {
                    templateUrl: 'templates/chatlist.html',
                    controller: 'ChatListCtrl'
                }
            }
        }
    };

    for(let state in states) {
        if(!states.hasOwnProperty(state)) continue;
        $stateProvider.state(state, states[state]);
    }

    $urlRouterProvider.otherwise('/app/chats');
});