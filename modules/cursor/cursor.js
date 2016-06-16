!function(_){
	// 接口实现
	// Cursor 主体html模板
	var template = 
	"<ul class='m-cursor'>\
			<li class='prev'>&lt;</li>\
			<li class='cursor crt'>1</li>\
			<li class='next'>&gt;</li>\
		</ul>";

	// Cursor 实现
	function Cursor(options) {
		// options判断，给定初始值，输入不存在为空都等于{}
		options = options || {};
		// 将options 复制到 组件实例上，让options.content等于this.content，这样使用比较简单
	    _.extend(this, options);

		// 容器节点，如果没有传入container，默认为body节点，
	    this.container = this.container || document.body;
	    // cursor节点
	    this.cursorNode = this._layout.cloneNode(true);

	    // 根据数据初始化指示器
	    if (!options) {
	    	this._init();
	    }

		// 将后续经常用到的节点放在实例上，避免查找开销
		// 指示器节点
		this.cursors = _.$qsa('.m-cursor .cursor',this.cursorNode);
		// 总共的数量
        this.allCursor = this.cursors.length;
		if (this.prevData) {
			this.prev = _.$qs('.m-cursor .prev',this.cursorNode);
			this.allCursor -= 1;
		}
        if (this.nextData) {
        	this.next = _.$qs('.m-cursor .next',this.cursorNode);
        	this.allCursor -= 1;
        }

        // 当前选中项
        this.crtIndex = 1;

	    // 初始化事件
	    this._initEvent();
	}

	// 事件注册
  	_.extend( Cursor.prototype, _.emitter);

	// 构建Cursor方法
	_.extend(Cursor.prototype, {
		
		// 根据模板转换为节点
		_layout: _.html2node(template),

		// 和容器绑定显示接口
		show: function(container) {
			this.container = container || this.container;
			// 初始化，给外部容器增加指示器组件
    		this.container.appendChild(this.cursorNode);
		}

		// 前一个
		doPrev: function() {
			var index = this.crtIndex === 1? 1:(this.crtIndex-1)/this.allCursor;
			this.select(index);
		},

		doNext: function() {
			var index = (this.crtIndex+1)/this.allCursor;
			this.select(index);
		},

		select: function(selIndex) {
			this.crtIndex = selIndex;
			this.cursors.forEach(function(cursor, index) {
                if (index === selIndex) {
                    _.addClass(cursor,'crt');
                } else {
                    _.delClass(cursor,'crt');
                }
            });
            // 触发select事件
            this.emit('select',this.cursorData[index-1]);
		},

		_init: function() {
			var template = "";
			// 根据数据构建指示器
			if (this.prevData) {
				template += "<li class='prev'>" + this.prev + "</li>";
			}
			if (this.cursorData) {
				for (var i = 0; i < this.cursorData.length; i++) {
					if (i === 0) {
						template += "<li class='prev crt'>" + this.cursorData[i] + "</li>";
					} else {
						template += "<li class='prev'>" + this.cursorData[i] + "</li>";
					}
				}
			}
			if (this.nextData) {
				template += "<li class='next'>" + this.next + "</li>";
			}
			this.cursorNode.innerHTML = template;
		},

		// 事件初始化
		_initEvent: function() {
			var self = this;
			// 给每个序号绑定click事件，点击定位到对应轮播图片位置
	        for (var i = 0,cursor; cursor = self.cursors[i]; i++) {
	        	_.addEvent(cursor,'click',function() {
	                self.select(index);
	            });
	        }
	        // prev及next
	        if (self.prevData) {
				_.addEvent(self.prev, 'click',self.doPrev);
			}
	        if (self.nextData) {
	        	_.addEvent(self.next, 'click',self.doNext);
	        }
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