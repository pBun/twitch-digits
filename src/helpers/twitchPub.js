import http from './http';

var API_URL = window.location.hostname.indexOf('localhost') >= 0 ? '//localhost:5000/' : 'http://api.twitch.pub/';

export default {
    url: API_URL,
    get: (endpoint) => {
        return new Promise(function(resolve, reject) {
            http.getJson(API_URL + endpoint).then((res) => {
                if (res.status === 'error') return reject(res.message);
                resolve(res.data);
            }, reject);
        });
    }
};
