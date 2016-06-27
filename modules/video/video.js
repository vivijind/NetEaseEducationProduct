!function(_){

	/**
	 * 暂时仅支持html5中video原始控件及自定义控件中播放、时间显示、进度条等。
	 */
	// 接口实现
	// 表单 主体html模板
	var template = 
	'<div class="m-video">\
        <video class="video" preload="auto">当前浏览器不兼容该视频播放，请升级浏览器或更换chrome等其他浏览器</video>\
        <div class="controls">\
        	<div class="playIcon"></div>\
            <div class="control">\
                <div class="pause"></div>\
                <div class="current">00:00</div>\
                /\
                <div class="total">00:00</div>\
                <div class="logo"></div>\
                <div class="full"></div>\
                <div class="resolution"></div>\
                <div class="volume"></div>\
            </div>\
            <div class="progress">\
                <div class="progress-bar cache"></div>\
                <div class="progress-bar play">\
                    <div class="dragball"></div>\
                </div>\
            </div>\
        </div>\
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
	    this.controlsNode = _.$qs(".controls",this.video);

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
		    if (this.poster) {
		    	videoNode.poster = this.poster;
		    }

		    // 原生控件或自定义控件
		    if (this.controls) {
		    	videoNode.controls = "controls";
		    	this.controlsNode.style.display = "none";
		    } else {
		    	this.controlsNode.style.display = "block";
		    	this.playIcon = _.$qs(".playIcon",this.controlsNode);
		    	this.pause = _.$qs(".pause",this.controlsNode);
		    	this.play = _.$qs(".progress .play",this.controlsNode);
		    	this.cache = _.$qs(".progress .cache",this.controlsNode);
		    	this.current = _.$qs(".current",this.controlsNode);
		    	this.total = _.$qs(".total",this.controlsNode);
		    	this.progress = _.$qs(".progress",this.controlsNode);
		    	this._initControls();
		    }   	
	    },

	    // 时间转换
		_convertTime:function (time) {
		    var time = Math.ceil(time);
		    var scd = time%60;
		    scd = scd<10 ? '0'+scd : scd;

		    var mnt = parseInt(time/60);
		    mnt = mnt<10 ? '0'+mnt : mnt;

		    return mnt + ':' + scd;    
		},

		// 获得自定义控制条的左边位置
		_getBarLeft: function(ele){
		    var actualLeft = ele.offsetLeft;
		    var current = ele.offsetParent;

		    while (current !== null){
		        actualLeft += current.offsetLeft;
		        current = current.offsetParent;
		    }
		    return actualLeft;
		},

		// 进度条改变
		_changeBar: function() {
			var video = this.videoNode,
				newLength = this.newLength,
            	crt = video.currentTime/video.duration*889,
                crtLength = crt + 'px';

            if (video.buffered.length) {
                var bf = video.buffered.end(video.buffered.length-1)/video.duration*889,
                    bfLength = bf + 'px',
                    loaded = this.cache;

                // 插入已播放时间文本
                this.current.innerHTML = this._convertTime(video.currentTime);

                // 改变已播放进度条
                if (crt > 7) {
                    this.play.style.width = crtLength;              
                }
                // 改变已加载进度条
                if (newLength === 0) {
                    loaded.style.width = bfLength;
                } else {
                    // 点击进度条时
                    var newbf = video.buffered.end(video.buffered.length - 1)/video.duration*889;
                    if (parseInt(loaded.style.width) < 889) {
                        loaded.style.width = newbf + 'px';
                    } else {
                        loaded.style.width = '889px';
                    }
                }
            } else {
                clearInterval(this.cgTime);
            }
        },

        _change: function() {
        	this.newLength = 0;
        	// 每100毫秒改变一次进度条和进度时间
	        this.cgTime = setInterval(this._changeBar.bind(this), 100);
        },

        // 点击更改进度条进度
        _modifyPlayLoad: function (event) {
        	var newLength = this.newLength,
        		video = this.videoNode;
	        // 获取点击位置
	        this.newLength = newLength = event.clientX - this._getBarLeft(this.progress); 
	        // 转换为相应时间
	        var toTime = (newLength)/889*video.duration;
	        video.currentTime = toTime;
	    },

	    _initControls: function() {
	    	this._initEvent();
	    },

	    // 点击按钮开始或暂停视频
    	_startOrPause: function (){
    		var video = this.videoNode;
	        if(video.paused) {
	            video.play();
	            // 开始按钮隐藏，暂停按钮显示
	            this.playIcon.style.display = "none";          
	        }else {
	            video.pause();
	            // 开始按钮显示，暂停按钮隐藏
	            this.playIcon.style.display = "block";           
	        }
	    },

	    // 事件初始化
		_initEvent: function() {
			var self = this;
			_.addEvent(self.videoNode,"click",self._startOrPause.bind(self));
			_.addEvent(self.playIcon,"click",self._startOrPause.bind(self));
			_.addEvent(self.pause,"click",self._startOrPause.bind(self));
			_.addEvent(self.videoNode,"canplay",self._change.bind(self));
			_.addEvent(self.videoNode,"loadedmetadata",function() {
				// 进度时间显示初始化
				self.total.innerHTML = self._convertTime(self.videoNode.duration);
			});
			_.addEvent(self.progress,"click",self._modifyPlayLoad.bind(self));
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