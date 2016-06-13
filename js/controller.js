(function (_) {
	/**
	 * Controller层
	 */
	function Controller(model, view) {
		this.model = model;
		this.view = view;

		this.init();	
	}

	/**
	 * 页面初始化
	 */
	Controller.prototype.setView = function (locationHash) {
		this.displayTips();
	};

	// Controller层事件
    _.extend(Controller.prototype, {
    	init: function() {
    		var self = this;
    		self.view.bind('removeTips', function () {
				self.removeTips();
			});
    	},
    	removeTips: function(){
    		this.model.removeTips();
    		this.displayTips();
    	},
    	displayTips: function() {
    		var self = this;
    		self.model.displayTips(function(){
    			self.view.render('displayTips');
    		});
    	}
    });


	//          Exports
  	// ----------------------------------------------------------------------
  	// 暴露API:  Amd || Commonjs  || Global 
  	// 支持commonjs
  	if (typeof exports === 'object') {
    	module.exports = Controller;
    	// 支持amd
  	} else if (typeof define === 'function' && define.amd) {
    	define(function() {
    	  return Controller;
    	});
 	} else {
 	   // 直接暴露到全局
 	   window.Controller = Controller;
  	}
})(util);
