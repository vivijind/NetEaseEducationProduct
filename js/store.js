(function () {
	/**
	 * Cookie用于对页面cookie进行管理和操作，提供加密功能
	 */
	function Store(callback) {
		callback = callback || function () {};

		this.cookie = this._updatecookie();

		callback.call(this);
	}

	Store.prototype = {
		/* cookie操作 */
		_updatecookie: function() {
		    var cookie = this.cookie || {};
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
        this.cookie = cookie;
		    return cookie;
		},
		_removeCookie: function(name, path, domain) {
		    document.cookie = name + '='
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
    /**
     * Ajax GET POST方法
    */
    ajax: {
      // 请求参数序列化，把对象转换为例如'name1=value1&name2=value2'的格式
      serialize: function (data) {
          if (!data) {return '';}
          var pairs = [];
          for(var name in data){
              if (!data.hasOwnProperty(name)) {continue;}     //判断对象自身是否有name属性
              if (typeof data[name] === 'function') {continue;}   //如果对象的值是一个函数，忽略
              var value = data[name].toString();
              name = encodeURIComponent(name);    //把字符串作为URI 组件进行编码。将转义用于分隔 URI 各个部分的标点符号
              value = encodeURIComponent(value);
              pairs.push(name + '=' + value);
          }
          return pairs.join('&');
      },
      get: function (url, options, callback) {
          var xhr = new XMLHttpRequest();     //创建XHR对象
          // 处理返回数据
          xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {      //浏览器结束请求
                  if ((xhr.status >= 200 && xhr.status <300) || xhr.status == 304) {  //status为200-300表示success，304为读取缓存
                      callback(xhr.responseText);     //执行返回的html、xml
                  }
                  else {
                      alert('Requeset was unsuccessful: ' + xhr.status);
                  }
              }
          }
          var URL = url +'?'+ this.serialize(options);     //url+查询参数序列号结果 
          xhr.open('get', URL, true);
          xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded'); //放在open后执行，表示文本内容的编码方式是URL编码，即除了标准字符外，每字节以双字节16进制前加个“%”表示
          xhr.send(null);
      },
      post: function (url, options, callback) {
          var xhr = new XMLHttpRequest();     //创建XHR对象
          // 处理返回数据
          xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {      //浏览器结束请求
                  if ((xhr.status >= 200 && xhr.status <300) || xhr.status == 304) {  //status为200-300表示success，304为读取缓存
                      callback(xhr.responseText);     //执行返回的html、xml
                  }
                  else {
                      alert('Requeset was unsuccessful: ' + xhr.status);
                  }
              }
          }
          xhr.open('post', url, true);
          xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded'); //放在open后执行，表示文本内容的编码方式是URL编码，即除了标准字符外，每字节以双字节16进制前加个“%”表示
          xhr.send(this.serialize(options));
      }
    },
    /* /Ajax */

  	// 对外接口
    // 设置的cookie的有效时间默认，即关闭浏览器后失效 
  	getCookie: function(name,callback){
  		callback.call(this,this.cookie[name]);
  		return this.cookie[name];
  	},
  	setCookie: function(name,value){
  		this._setCookie(name,value);
  	},
  	removeCookie: function(name,callback) {
  		this._removeCookie(name);
      callback.call(this);
  	},

    // 前后端交互接口
    // 获取课程列表
    getCourse: function(pageNo,psize,type,callback) {
        var url = 'http://study.163.com/webDev/couresByCategory.htm';
        var options =  {pageNo: pageNo, psize: psize, type: type};
        this.ajax.get(url, options, callback);
    },
    // 右侧“最热排行”
    getHotCourse: function(callback) {
        var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';
        this.ajax.get(url, '', callback);
    },
    // 导航关注
    attention: function(callback) {
        var url = 'http://study.163.com/webDev/attention.htm';
        this.ajax.get(url, '', callback);
    },
    // 用户登陆
    login: function(userName,password,callback) {
        var url = 'http://study.163.com/webDev/login.htm';
        var options =  {userName: hex_md5(userName), password: hex_md5(password)};
        this.ajax.get(url, options, callback);
    },
    // 右侧“机构介绍”视频 
    videoUrl: function(callback) {
        var url = 'http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4 ';
        callback.call(this, url);
    }
	};

	//          Exports
	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global 
	// 支持commonjs
	if (typeof exports === 'object') {
  	module.exports = Store;
  	// 支持amd
	} else if (typeof define === 'function' && define.amd) {
  	define(function() {
  	  return Store;
  	});
 	} else {
 	   // 直接暴露到全局
 	   window.Store = Store;
  	}
})();
