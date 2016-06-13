(function () {
	/**
	 * Cookie用于对页面cookie进行管理和操作，提供加密功能
	 */
	function Cookie(callback) {
		callback = callback || function () {};

		this.cookie = this._updatecookie();

		callback.call(this);
	}

	// Cookie操作
	Cookie.prototype = {
		_updatecookie: function() {
		    var cookie = {};
		    var all = document.cookie;
		    if (all === '')
		        return cookie;
		    var list = all.split('; ');
		    for (var i = 0; i < list.length; i++) {
		        var item = list[i];
		        var p = item.indexOf('=');
		        var name = item.substring(0, p);
		        name = decodeURIComponent(name);
		        var value = item.substring(p + 1);
		        value = decodeURIComponent(value);
		        cookie[name] = value;
		    }
		    return cookie;
		},
		_removeCookie: function(name, path, domain) {
		    document.cookie = name + '='
		    + '; path=' + path
		    + '; domain=' + domain
		    + '; max-age=0';
		    this._updatecookie();
		},
		_setCookie: function(name, value, expires, path, domain, secure) {
		    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		    if (expires)    //失效时间
		        cookie += '; expires=' + expires.toGMTString();
		    if (path)   //作用路径
		        cookie += '; path=' + path;
		    if (domain) //作用域
		        cookie += '; domain=' + domain;
		    if (secure) //https协议时生效
		        cookie += '; secure=' + secure;
		    document.cookie = cookie;
		    this._updatecookie();
		},
		// 对外接口
		getCookie: function(name,callback){
			callback(this.cookie[name]);
			return this.cookie[name];
		},
		setCookie: function(name,value,encrypt){
			if (encrypt) {
				value = hex_md5(value);
			}
			this._setCookie(name,value);
		},
		removeCookie: function(name) {
			this._removeCookie(name);
		}
	};

  	//          Exports
  	// ----------------------------------------------------------------------
  	// 暴露API:  Amd || Commonjs  || Global 
  	// 支持commonjs
  	if (typeof exports === 'object') {
    	module.exports = Cookie;
    	// 支持amd
  	} else if (typeof define === 'function' && define.amd) {
    	define(function() {
    	  return Cookie;
    	});
 	} else {
 	   // 直接暴露到全局
 	   window.Cookie = Cookie;
  	}
})();
