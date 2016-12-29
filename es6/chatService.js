/**
 * Created by texpe on 30/12/2016.
 */

let chat = angular.module('chat');

chat.service('chatService', ($http) => {
    let chatList = [];
    let chatMessages = [];
    const token = readLocalCookie('chatToken');

    $http.get(`http://${host}/api/chat/list?token=` + token).then(response => {
        if(response.data.success) chatList = response.data.result;
    });

    return {
        list: {
            get: () => {
                return chatList;
            },
            removeSingle: index => {
                if (chatList.length - 1 < index) return;
                chatList.splice(index, 1);
            },
            removeMultiple: arr => {
                let tmp = [];
                for (let i = 0; i < chatList.length; i++) {
                    if (arr.indexOf(i) < 0)
                        tmp.push(chatList[ i ]);
                }
                chatList = tmp;
            },
            clear: () => {
                chatList = [];
            }
        },
        messages: {
            get: () => {
                return chatMessages;
            },
            add: (item, index) => {
                if(!item) return;
                if(index && chatMessages.length - 1 < index) index = chatMessages.length - 1;
                if(index) chatMessages.splice(index, 0, item);
                else chatMessages.push(item);
            },
            removeSingle: index => {
                if(chatMessages.length - 1 < index) return;
                chatMessages.splice(index, 1);
            },
            removeMultiple: arr => {
                let tmp = [];
                for(let i = 0; i < chatMessages.length; i++) {
                    if(arr.indexOf(i) < 0)
                        tmp.push(chatMessage[i]);
                }
                chatMessages = tmp;
            },
            clear: () => {
                chatMessages = [];
            }
        }
    };
});