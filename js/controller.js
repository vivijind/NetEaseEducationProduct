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
      this._concernShow();
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

        self.view.bind('concerndCancel',function(){
          self.concerndCancel();
        });
    	},
      /* /和view层事件绑定 */

    	removeTips: function(){
    		this.model.removeTips();
    		this.displayTips();
    	},
    	displayTips: function() {
    		var self = this;
    		self.model.displayTips(function(close){
    			self.view.render('displayTips',close);
    		});
    	},
      // 关注
      concern: function(){
        var self = this;
        // 判断登录cookie是否设置
        self.model.getLogin(function(){
          self._loginShow();
        });
      },
      // 取消关注
      concerndCancel: function() {
        var self = this;
        self.model.cancelAttention(function(){
          self.view.render('concerndCancel');
        });
      },
      updateCourse: function() {
        var self = this;
        self.model.getCourse(function(data){
          self._updateCourse(data.list);
          self._updateCursor(data.totalPage);
        });
      }
    });

    // 私有事件
    _.extend(Controller.prototype, {
      _loginShow: function(login) {
        var self = this;
        if (!login) {  // 未设置登录cookie，需要登录，弹出登录框
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
          modal.on("confirm", function(userName,password){
              self._login(userName,password);
          });
          modal.on("cancel", function(){
              self._loginFailed();
          });

          // 调用
          modal.show("<h3>弹窗</h3");
        } else { // 已设置登录cookie
          self._loginSucess();
        }
      },
      // 根据关注cookie是否存在来判断并绘制
      _concernShow: function() {
        var self = this;
        self.model.getAttention(function(concerned){
            self.view.render('concern',concerned);
        });
      },
      _login: function(userName,password) {
        var self = this;
        self.model.login(userName,password,function(isLogin){
          if (isLogin === '1') {
            self._loginSucess();
          } else {
            self._loginFailed();
          }
        });
      },
      // 登录成功
      _loginSucess: function() {
        var self = this;
        console.log("登录成功");
        self.model.loginSuccess();
        // 关注
        self.model.attention(function(){
          self._concernShow();
        });
      },
      // 登录失败
      _loginFailed: function() {
        console.log("登录失败");
        // 取消关注
        this._concernShow(false);
      },
      _updateCourse: function(courseList) {
        self.view.render('updateCourse', courseList);
      },
      _updateCursor: function(totalPage) {
        
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
