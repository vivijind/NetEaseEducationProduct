!function(_){
	// 接口实现
	// modal 主体html模板
	var template = 
	'<div class="m-modal">\
		<div class="modal_mask"></div>\
        <div class="modal_align"></div>\
        <div class="modal_wrap">\
            <i class="modal_cancel"></i>\
            <h3 class="modal_head">标题</h3>\
            <div class="modal_body">内容</div>\
        </div>\
    </div>';

	// Modal 实现
	function Modal(options) {
		// options判断，给定初始值，输入不存在为空都等于{}
		options = options || {};
		// 将原型上的_layout赋值一份到Modal构造函数中，保证每个实例有自己的节点
		// cloneNode方法，设置为 true，如果您需要克隆节点及其属性，以及后代，设置为 false，如果您只需要克隆节点及其后代
		// 即 div.m-modal 节点
	    this.container = this._layout.cloneNode(true);
	    // 标题
	    this.head = _.$qs('.modal_head',this.container);
	    // body 用于插入自定义内容
	    this.body = _.$qs('.modal_body',this.container);
	    // 获得取消节点
		this.close = _.$qs(".modal_cancel",this.container);
		
		// 将options 复制到 组件实例上，让options.content等于this.content，这样使用比较简单
	    _.extend(this, options);

	    // 初始化标题
	    this.head.innerHTML = this.title;
	    if (this.name) {
	    	_.addClass(this.container,this.name);
	    }
	    
	    // 初始化事件
	    this._initEvent();
	}

	// 事件注册
  	_.extend( Modal.prototype, _.emitter);

	// 构建Modal方法
	_.extend(Modal.prototype, {
		
		// 根据模板转换为节点
		_layout: _.html2node(template),

		setContent: function(content){
	      	if(!content) return;

	      	//支持两种字符串结构和DOM节点
	      	if(content.nodeType === 1){ 

	        	this.body.innerHTML = "";
	        	this.body.appendChild(content);

	      	}else{

	        	this.body.innerHTML = content;
	      	}
	    },

		// Modal show接口
		show: function(content) {
			if(content) this.setContent(content);
			// 给html的body节点增加整个窗体节点
			document.body.appendChild(this.container);
		},

		// Modal hide接口
		hide: function() {
			var container = this.container;
			document.body.removeChild(container);
		},

		// 内部接口
		// 取消
		_onCancel: function() {
			this.emit("cancel");
			this.hide();
		},

		// 事件初始化
		_initEvent: function() {
			// 取消
			_.addEvent(this.close, 'click',this._onCancel.bind(this));
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