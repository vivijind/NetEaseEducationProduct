(function (_) {
	'use strict';

	/**
	 * Model层
	 */
	function Model(store) {
		this.store = store;
	}


	_.extend(Model.prototype,{
		/* 控制tips cookie */
		displayTips: function(callback){
			this.store.getCookie('tipsSuc',callback);
		},
		removeTips: function(){
			this.store.setCookie('tipsSuc',1);
		},
		/* 登陆cookie */
		login: function(callback){
			this.store.getCookie('loginSuc', callback);
		},
        loginSuccess: function(){
        	
        },
        attention: function() {
        	this.store.attention(function(attentioned) {
        		if (attentioned) {
        			this.store.setCookie('followSuc',1);
        		}
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
