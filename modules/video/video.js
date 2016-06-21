!function(_){

	/**
	 * 暂时仅支持html5中video原始控件效果，后续自定义控件
	 */
	// 接口实现
	// 表单 主体html模板
	var template = 
	'<div clas="m-video">\
			<video class="video">浏览器不兼容该video播放，请升级浏览器或更换chrome等其他浏览器</video>\
	    </div>';

	 //表单验证工厂
	function Video(opt) {
		// 将数据复制到自身实例上
    	_.extend(this,opt);

	    this.video = this._layout.cloneNode(true);
	    this.videoNode = _.$qs(".video",this.video);
	    if (!this.videoNode) {
	    	return;
	    }

	    // 初始化
	    this._init();
	}

	// 事件注册
  	_.extend( Video.prototype, _.emitter);

	// 构建Video方法
	_.extend(Video.prototype, {
		
		// 根据模板转换为节点
		_layout: _.html2node(template),

		// Video show接口
		show: function(container) {
			this.container = container || this.container || document.body;
			this.container.appendChild(this.container);
		},

		// 内部接口
		_init: function() {
			var videoNode = this.videoNode;
			videoNode.src = this.src || "";
		    videoNode.width = this.width || 100;
		    videoNode.height = this.height || 100;
		    if (this.controls) {
		    	videoNode.controls = "controls";
		    }

	    	// 初始化事件
	    	this._initEvent();
	    },

	    // 事件初始化
		_initEvent: function() {
			
		}
	});

	//          5.Exports
	// ----------------------------------------------------------------------
	// 暴露API:  Amd || Commonjs  || Global 
	// 支持commonjs
	if (typeof exports === 'object') {
	    module.exports = Video;
	    // 支持amd
	} else if (typeof define === 'function' && define.amd) {
	    define(function() {
	      return Video;
	    });
	} else {
	    // 直接暴露到全局
	    window.Video = Video;
	}
	
}(util);