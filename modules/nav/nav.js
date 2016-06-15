!function(_){
	// 接口实现
	// Cursor 主体html模板
	var template = 
	'<ul class="m-cursor">\
	      <li class='prev'><</li>\
	      <li class='cursor crt'>1</li>\
	      <li class='next'>></li>\
	    </ul>';

	// Cursor 实现
	function Cursor(options) {
		// options判断，给定初始值，输入不存在为空都等于{}
		options = options || {};
		// 容器节点，如果没有传入container，默认为body节点，
	    this.container = this.container || document.body;
	    // cursor节点
	    this.cursor = this._layout.cloneNode(true);

	    // 根据数据初始化指示器
	    this._init();

		// 将后续经常用到的节点放在实例上，避免查找开销
		// 指示器节点
		this.cursors = _.$qsa('.m-cursor .cursor');
		if (this.prev) {
			this.prev = _.$qa('.m-cursor .prev');
		}
        if (this.next) {
        	this.next = _.$qa('.m-cursor .next');
        }
        
		// 将options 复制到 组件实例上，让options.content等于this.content，这样使用比较简单
	    _.extend(this, options);

	    // 初始化，给外部容器增加指示器组件
    	this.container.appendChild(this.slider);

	    // 初始化事件
	    this._initEvent();
	}

	// 事件注册
  	_.extend( Cursor.prototype, _.emitter);

	// 构建Cursor方法
	_.extend(Cursor.prototype, {
		
		// 根据模板转换为节点
		_layout: _.html2node(template),

		_init: function() {
			var template = "";
			// 根据数据构建指示器
			if (this.prev) {
				template += "<li class='prev'>" + this.prev + "</li>";
			}
			if (this.cursor) {
				for (var i = 0; i < this.cursor.length; i++) {
					if (i === 0) {
						template += "<li class='prev crt'>" + this.cursor[i] + "</li>";
					} else {
						template += "<li class='prev'>" + this.cursor[i] + "</li>";
					}
				}
			}
			if (this.next) {
				template += "<li class='next'>" + this.next + "</li>";
			}
		},

		// 事件初始化
		_initEvent: function() {
			// focus事件
			_.addEvent(this.name, 'focus',this._focus.bind(this));
			_.addEvent(this.password, 'focus',this._focus.bind(this));
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
	    module.exports = Cursor;
	    // 支持amd
	} else if (typeof define === 'function' && define.amd) {
	    define(function() {
	      return Cursor;
	    });
	} else {
	    // 直接暴露到全局
	    window.Cursor = Cursor;
	}
	
}(util);