'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }


// Implement request class with Promise
class request {
  get(url) {
    return new Promise((resolve, reject) => {
      function request(url, cb) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            cb(null, xhr.responseText);
          } else {
            cb(new Error(`Request failed. Status: ${xhr.status}`));
          }
        };
        xhr.onerror = function() {
          cb(new Error('Network error'));
        };
        xhr.send();
      }

      request(url, (error, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  defaults(_conf) {
    this.conf = _conf;

    return this;
  }
}

var _request = new request();

var BASE_URL = 'https://api.genius.com/';
var AUTH_URL = 'https://api.genius.com/oauth/authorize';

var Api = (function () {
  function Api(accessToken, options) {
    _classCallCheck(this, Api);

    if (!accessToken) {}

    var defaults = {};

    this.options = options || defaults;
    this.at = accessToken;
    this.AuthHeader = { 'Authentication': 'Bearer ' + this.at };
  }

  _createClass(Api, [{
    key: 'request',
    value: function request(options, callback) {
      var defaultRequest = _request.defaults({
        baseUrl: BASE_URL,
        headers: { 'Authorization': 'Bearer ' + this.at }
      });

      var promise = new Promise(function (resolve, reject) {
        defaultRequest(options, function (err, response) {
          if (response.statusCode !== 200) {
            var payload = {
              'Error': response,
              'Status': response.statusCode
            };

            reject(payload);
          }

          resolve(response.body);
        });
      });

      return promise;
    }
  }, {
    key: 'requestPromise',
    value: function requestPromise(request) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.request(request).then(function (data) {
          resolve(JSON.parse(data).response);
        })['catch'](function (data) {
          reject(JSON.parse(data.Error.body));
        });
      });
    }
  }, {
    key: 'annotation',
    value: function annotation(id, options) {
      var request = {
        url: 'annotations/' + id,
        qs: options
      };

      return this.requestPromise(request);
    }
  }, {
    key: 'referents',
    value: function referents(id, options) {
      var request = {
        url: 'referents',
        /* qs: _.merge(id, options) */
        qs: Object.assign({ 'annotation_id': id }, options)
      };

      return this.requestPromise(request);
    }
  }, {
    key: 'song',
    value: function song(id, options) {
      var request = {
        url: 'songs/' + id,
        qs: options
      };

      return this.requestPromise(request);
    }
  }, {
    key: 'artist',
    value: function artist(id, options) {
      var request = {
        url: 'artists/' + id,
        qs: options
      };

      return this.requestPromise(request);
    }
  }, {
    key: 'songsByArtist',
    value: function songsByArtist(id, options) {
      var request = {
        url: 'artists/' + id + '/songs',
        qs: options
      };

      return this.requestPromise(request);
    }
  }, {
    key: 'webPage',
    value: function webPage(options) {
      var request = {
        url: 'web_pages/lookup',
        qs: options
      };

      return this.requestPromise(request);
    }
  }, {
    key: 'search',
    value: function search(query) {
      var request = {
        url: 'search',
        qs: { 'q': query }
      };

      return this.requestPromise(request);
    }
  }]);

  return Api;
})();

var geniusApi = new Api(GENIUS_ACCESS_TOKEN);