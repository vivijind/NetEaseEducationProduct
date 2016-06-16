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
      this._sliderShow();
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

        self.view.bind('getCourseValue', function(pageNo,psize,type) {
          self.model.setCourse(pageNo,psize,type);
          self.updateCourse(self._updateCursor);
        });

        self.view.bind('tabChange', function(pageNo,psize,type) {
          self.model.setCourse(pageNo,psize,type);
          self.tabChange();
        });

        self.view.bind('resize', function(pageNo,psize,type) {
          self.model.setCourse(pageNo,psize,type);
          self.updateCourse(self._updateCursor);
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
      updateCourse: function(callback) {
        var self = this;
        self.model.getCourse(function(data){
          // 更新课程显示
          self._updateCourse(data.list);
          // 执行回调
          callback = callback || function () {};
          callback.call(self);
        });
      },
      tabChange: function() {
        var self = this;
        self.view.render('tabChange');
        self.updateCourse(function() {
          this._updateCursor();
        });
      }
    });

    // 私有事件
    _.extend(Controller.prototype, {
      _loginShow: function(login) {
        var self = this;
        if (!login) {  // 未设置登录cookie，需要登录，弹出登录框
          var modal = new Modal();

          // 注册事件
          modal.on("login", function(userName,password,callback){
              self._login(userName,password,function(value){
                callback(value);
              });
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
      _login: function(userName,password,callback) {
        var self = this;
        self.model.login(userName,password,function(isLogin){
          if (isLogin === '1') {
            self._loginSucess();
            callback(true);
          } else {
            self._loginFailed();
            callback(false);
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
        this.view.render('updateCourse', courseList);
      },
      _updateCursor: function() {
        var self = this;
        var pageSum = self.model.getAllPage();
        if (!pageSum) {
          return;
        }
        var cursorData = [];
        for (var i = 0; i < pageSum; i++) {
          cursorData.push(i+1);
        }
        // cursor组件
        var cursor = new Cursor({
            // 指示器
            prevData: "<",
            nextData: ">",
            cursorData: cursorData
        });

        cursor.on("select", function(pageNo){
          self.model.setCourse(pageNo);
          self.updateCourse();
        });

        // 显示
        self.view.render('updateCursor',cursor);
      },
      // 轮播图显示
      _sliderShow: function() {
        // 轮播组件
        var slider = new Slider({
            // 轮播图片列表
            images: [
                "img/banner1.jpg",
                "img/banner2.jpg",
                "img/banner3.jpg"
            ],
            // 图片对应的链接列表
            links: [
                "http://open.163.com/",
                "http://study.163.com/",
                "http://www.icourse163.org/"
            ],

            // 是否允许拖拽
            drag: true,

            // 是否自动轮播
            auto: true
        });

        // 轮播对应的cursor组件
        var pointer = new Cursor({
            // 指示器
            cursorData: ['','','']
        });

        pointer.on("select",function(value,index){
            slider.nav(index);
        });
        
        // 每次slider图片位置变化，cursor也变化，增加监听处理
        slider.on('nav', function( ev ) {
            var pageIndex = ev.pageIndex;
            pointer.update(pageIndex);
        });

        // 设置当前初始显示页
        slider.nav(0);
        // 显示
        this.view.render('sliderShow',slider);
        this.view.render('sliderShow',pointer);
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
