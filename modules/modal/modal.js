!function(_){
	// 接口实现
	// modal 主体html模板
	var template = 
	'<div class="m-modal">\
        <div class="modal_mask"></div>\
        <div class="modal_wrap">\
            <i class="modal_cancel"></i>\
            <h3 class="modal_head">登录网易云课堂</h3>\
            <div class="modal_message">登录失败</div>\
            <form id="login" class="modal_body">\
                <input class="username" name="ID" placeholder="账号">\
                <input class="password" type="password" name="password" placeholder="密码">\
            </form>\
            <div class="modal_foot">\
                <button class="login" form="login">登录</button>\
            </div>\
        </div>\
    </div>';

	// Modal 实现
	function Modal(options) {
		// options判断，给定初始值，输入不存在为空都等于{}
		options = options || {};
		// 将原型上的_layout赋值一份到Modal构造函数中，保证每个实例有自己的节点
		// cloneNode方法，设置为 true，如果您需要克隆节点及其属性，以及后代，设置为 false，如果您只需要克隆节点及其后代
		this.container = this._layout.cloneNode(true);

		// 将后续经常用到的节点放在实例上，避免查找开销
		// 获得body节点
		this.body = this.container.querySelector(".modal_body");
		// 获得窗体节点，进行动画
		this.wrap = this.container.querySelector(".modal_wrap");
		// 获得head节点
		this.head = this.container.querySelector(".modal_head");
		// 获得关闭节点
		this.close = this.container.querySelector(".modal_cancel");
		// 输入节点
		this.name = this.body.querySelector(".username");
		this.password = this.body.querySelector(".password");
		// 验证结果消息节点
		this.message = this.container.querySelector(".modal_message");
		
		// 将options 复制到 组件实例上，让options.content等于this.content，这样使用比较简单
	    _.extend(this, options);

	    // 初始化事件
	    this._initEvent();
	}

	// 事件注册
  	_.extend( Modal.prototype, _.emitter);

	// 构建Modal方法
	_.extend(Modal.prototype, {
		
		// 根据模板转换为节点
		_layout: _.html2node(template),

		// Modal show接口
		show: function() {
			// 给html的body节点增加整个窗体节点
			document.body.appendChild(this.container);
			// 动画
			animateClass(this.wrap, this.animation.enter);
			// 去除消息显示
			this.message.style.display = "none";
		},

		// Modal hide接口
		hide: function() {
			var container = this.container;

			// 动画
			animateClass(this.wrap, this.animation.leave, function(){
		        document.body.removeChild(container);
		      });
		},

		// 内部接口
		// 确认
		_onLogin: function() {
			var event = arguments[0] || window.event;
			event.preventDefault();

			// 验证登录密码
			var userName = this.name.value;
			var passWord = this.password.value;

			if (this._valid(userName,password)) {
				if (this.emit("login",userName,passWord)) {
					this.message.innerHTML = "登录成功！";
					this.message.style.color = "#0f0";
					this.message.style.display = "block";
					this.hide();
				} else {
					this.message.innerHTML = "登录失败，用户名或密码错误！";
					this.message.style.display = "block";
				}
			}
		},

		// 取消
		_onCancel: function() {
			this.emit("cancel");
			this.hide();
		},

		_valid: function(userName,passWord) {
			if(!this.emit("valid",userName,passWord)) return false;

			this.message.style.color = "#f00";
			if (userName === "") {
				this.message.innerHTML = "请输入用户名，提示：studyOnline";
				this.message.style.display = "block";
				return false;
			}
			if (passWord === "") {
				this.message.innerHTML = "请输入密码，提示：study.163.com";
				this.message.style.display = "block";
				return false;
			}
			return true;
		},

		// 事件初始化
		_initEvent: function() {
			// 取消
			_.addEvent(this.close, 'click',this._onCancel.bind(this));
			// 登录验证
			_.addEvent(this.body, "submit", this._onLogin.bind(this));
		}
	});

	//          5.Exports
	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global 
	// 支持commonjs
	if (typeof exports === 'object') {
	    module.exports = Modal;
	    // 支持amd
	} else if (typeof define === 'function' && define.amd) {
	    define(function() {
	      return Modal;
	    });
	} else {
	    // 直接暴露到全局
	    window.Modal = Modal;
	}
	
}(util);