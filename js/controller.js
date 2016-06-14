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
      /* 和view层事件绑定 */
    	init: function() {
    		var self = this;
    		self.view.bind('removeTips', function () {
  				self.removeTips();
  			});

        self.view.bind('concern',function(){
          self.concern();
        });
    	},
      /* /和view层事件绑定 */

    	removeTips: function(){
    		this.model.removeTips();
    		this.displayTips();
    	},
    	displayTips: function() {
    		var self = this;
    		self.model.displayTips(function(){
    			self.view.render('displayTips');
    		});
    	},
      concern: function(){
        var self = this;
        self.model.login(function(){
          self._loginShow();
        });
      }
    });

    // 私有事件
    _.extend(Controller.prototype, {
      _loginShow: function(login) {
        if (!login) {  // 需要登录，弹出登录框
          var modal = new Modal({
              // 1.内容配置
              content: "内容",
              // 2.动画设置
              animation: {
                  enter: 'fadeIn',
                  leave: 'fadeOut'
              },
              
              // 移动及拖拽
              drag: true
          });

          // 注册事件
          modal.on("confirm", function(){
              console.log("confirm");
          });
          modal.on("cancel", function(){
              console.log("cancel");
          });

          // 调用
          modal.show("<h3>弹窗</h3");
        }
      },
      _login: function() {

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
