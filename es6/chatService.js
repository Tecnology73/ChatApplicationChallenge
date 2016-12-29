/**
 * Created by texpe on 30/12/2016.
 */

let chat = angular.module('chat');

chat.service('chatService', ($http) => {
    let chatList = [];
    let chatMessages = [];
    const token = readLocalCookie('chatToken');
    let userSearchResults = [];
    let chatInfo = null;

    $http.get(`http://${host}/api/chat/list?token=${token}`).then(response => {
        if (response.data.success) chatList = response.data.result;
    });

    return {
        users: {
            search: (fragment) => {
                $http.get(`http://${host}/api/users/search/${fragment}?token=${token}`).then(response => {
                    userSearchResults = response.data.results;
                });
            },
            results: () => {
                return userSearchResults;
            },
            clear: () => {
                userSearchResults = [];
            }
        },
        chatInfo: {
            getRemoteInfo: (chatId) => {
                $http.get(`http://${host}/api/chat/${chatId}?token=${token}`).then(response => {
                    if(response.data.success) chatInfo = response.data.info;
                });
            },
            get: () => {
                return chatInfo;
            },
            set: info => {
                chatInfo = info;
            },
            clear: () => {
                chatInfo = null;
            }
        },
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
            },
            add: (user) => {
                chatList.push(user);
                $http.put(`http://${host}/api/chat/list/${user.Username}?token=${token}`).then(response => {
                    console.log(response.data);
                });
            }
        },
        messages: {
            get: () => {
                return chatMessages;
            },
            add: (item, index) => {
                if (!item) return;
                if (index && chatMessages.length - 1 < index) index = chatMessages.length - 1;
                if (index) chatMessages.splice(index, 0, item);
                else chatMessages.push(item);
            },
            removeSingle: index => {
                if (chatMessages.length - 1 < index) return;
                chatMessages.splice(index, 1);
            },
            removeMultiple: arr => {
                let tmp = [];
                for (let i = 0; i < chatMessages.length; i++) {
                    if (arr.indexOf(i) < 0)
                        tmp.push(chatMessage[ i ]);
                }
                chatMessages = tmp;
            },
            removeRange: (a, b) => {
                if(a < 0) a = 0;
                if(b > chatMessages.length) b = chatMessages.length;
                chatMessages.splice(a, b);
            },
            clear: () => {
                chatMessages = [];
            }
        },
        formatDate: (date, userFormat) => {
            if (typeof date === 'string' || typeof date === 'number')
                date = new Date(date);

            const formats = {
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

            if (formats[ 'h' ] > 12)
                formats[ 'h' ] -= 12;
            if (formats[ 'h' ] === 0)
                formats[ 'h' ] = 12;
            formats[ 'hh' ] = ('0' + formats[ 'h' ]).slice(-2);

            for (let format in formats)
                userFormat = userFormat.replace(format, formats[ format ]);

            return userFormat;
        }
    };
});