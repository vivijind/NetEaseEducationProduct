(function (_) {
	'use strict';

	/**
	 * Model层
	 */
	function Model(store) {
		this.store = store;
        this.data = {};
	}


	_.extend(Model.prototype,{
		/* 控制tips cookie */
		displayTips: function(callback) {
			this.store.getCookie('tipsSuc',callback);
		},
		removeTips: function(){
			this.store.setCookie('tipsSuc',1);
		},
		/* 登陆cookie */
		getLogin: function(callback) {
			this.store.getCookie('loginSuc', callback);
		},
        getAttention: function(callback) {
            this.store.getCookie('followSuc',callback);
        },
        cancelAttention: function(callback) {
            this.store.removeCookie('followSuc',callback);
        },
        loginSuccess: function(){
        	this.store.setCookie('loginSuc',1);
        },
        login: function(userName,password,callback) {
            this.store.login(userName,password,callback);
        },
        // 调用关注API，并设置关注成功cookie
        attention: function(callback) {
            var self = this;
        	self.store.attention(function(attentioned) {
        		if (attentioned === '1') {
        			self.store.setCookie('followSuc',1);
                    callback.call(self);
        		}
        	});
        },
        getCourse: function(pageNo,psize,type,callback) {
            var self = this;
            self.store.getCourse(pageNo,psize,type,function(data){
                self.data = JSON.parse(data);
                callback.call(self,self.data);
            });
        },
        getData: function(callback) {
            callback.call(this,this.data); 
        },
        getHotCourse: function() {
            var self = this;
            self.store.getHotCourse(function(data){
                callback.call(self,JSON.parse(data));
            });
        }
	});

  	//          Exports
  	// ----------------------------------------------------------------------
  	// 暴露API:  Amd || Commonjs  || Global 
  	// 支持commonjs
  	if (typeof exports === 'object') {
    	module.exports = Model;
    	// 支持amd
  	} else if (typeof define === 'function' && define.amd) {
    	define(function() {
    	  return Model;
    	});
 	} else {
 	   // 直接暴露到全局
 	   window.Model = Model;
  	}
})(util);
