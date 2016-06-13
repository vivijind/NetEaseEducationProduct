(function (_) {
	'use strict';

	/**
	 * Model层
	 */
	function Model(cookie) {
		this.cookie = cookie;
	}


	_.extend(Model.prototype,{
		// 控制tips cookie
		displayTips: function(callback){
			this.cookie.getCookie('tipsSuc',callback);
		},
		removeTips: function(){
			this.cookie.setCookie('tipsSuc',1);
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
