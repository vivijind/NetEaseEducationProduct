/**
 *      -------------------
 *      |     |     |     |  <- 默认只有三栏是常驻的
 * -------------------------------
 * |    |     |     |     |      |
 * |    |     |     |     |      |
 * |    |  1  |  2  |  3  |      |
 * |    |     |     |     |      |
 * |    |     |     |     |      |
 * |    |     |     |     |      |
 * -------------------------------
 *      |     |     |     |
 *      -------------------
 */

// 还未解决点击click和拖拽问题，暂不支持拖拽事件

// 立即执行，传入util，使用一些通用函数接口
;(function(_){
  var template = 
  '<div class="m-slider" >\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
  </div>';

  function Slider(opt) {
    // 将数据复制到自身实例上
    _.extend(this,opt);

    // 容器节点，如果没有传入container，默认为body节点，
    // 且设置hidden样式，防止当前视口外显示
    this.container = this.container || document.body;

    // slider节点，并转换为数组
    this.slider = this._layout.cloneNode(true);
    this.slides = [].slice.call(this.slider.querySelectorAll('.slide'));

    // 拖拽相关设置
    this.offsetWidth = this.container.offsetWidth;
    this.breakPoint = this.offsetWidth/4;

    this.pageNum = this.images? this.images.length : 3;
    this.showNum = this.slides.length;

    // 内部数据结构
    this.slideIndex = 1;
    this.pageIndex = this.pageIndex || 0;

    // 动画设置
    this.fadeTime = this.fadeTime || 500;

    // 拖拽
    if(this.drag) {
      // this._initDrag();
    }

    // 轮播，并响应鼠标移动上去暂停轮播事件
    if(this.auto) {
      this.intervalTime = this.intervalTime || 3000;
      this._initAuto();
    }
  }

  // 事件注册
  _.extend( Slider.prototype, _.emitter);

  // 轮播组件事件
  _.extend( Slider.prototype, {
    _layout: _.html2node(template),

    // 和容器绑定显示接口
    show: function(container) {
      this.container = container || this.container;
      // 初始化，给外部容器增加指示器组件
      this.container.appendChild(this.slider);
      this.container.style.overflow = 'hidden';
    },

    // 页面跳转接口
    nav: function( pageIndex ) {
      this.pageIndex = pageIndex;
      this.slideIndex = typeof this.slideIndex === 'number'? this.slideIndex: (pageIndex+1) % this.showNum;
      this.offsetAll = pageIndex;

      this.slider.style.transitionDuration = '0s';

      this._calcSlide();
    },
    // 下一页
    next: function(){
      this._step(1);
    },
    // 上一页
    prev: function(){
      this._step(-1);
    },
    // 单步移动
    _step: function(offset){
      this.pageIndex += offset;
      this.slideIndex += offset;
      this.slider.style.transitionDuration = '.5s';

      this._calcSlide();
    },
    // 执行
    _calcSlide: function() {
      var showNum = this.showNum;
      var pageIndex = this.pageIndex = this._getNum(this.pageIndex, this.pageNum);
      var slideIndex = this.slideIndex = this._getNum(this.slideIndex,showNum);
      var prevslideIndex = this._getNum(this.slideIndex-1,showNum);
      var nextslideIndex = this._getNum(this.slideIndex+1,showNum);
      var pageNum = this.pageNum;
 
      var slides = this.slides;
      slides[slideIndex].style.opacity = 0;
      slides[prevslideIndex].style.opacity = 1;
      slides[nextslideIndex].style.opacity = 0;

      // 给当前slideIndex添加z-active
      slides.forEach(function(node){ _.delClass(node, 'z-active') })
      _.addClass(slides[slideIndex], 'z-active');

      // 图片url处理
      this._onNav(this.pageIndex, this.slideIndex);

      this._fadeIn(slides[slideIndex]);
    },

    // 淡入效果
    _fadeIn: function(ele) {
        var stepLength = 1/50;
        if (parseFloat(ele.style.opacity)) {
            ele.style.opacity = 0;
        }
        function step () {
            if (parseFloat(ele.style.opacity)+stepLength < 1) {
                ele.style.opacity = parseFloat(ele.style.opacity)+stepLength;
            } else {
                ele.style.opacity = 1;
                clearInterval(setIntervalId);
            }
        }
        var setIntervalId = setInterval(step, this.fadeTime/50);
    },

    // getNum index标准化
    _getNum: function(index, len) {
      return (index + len)%len;
    },
    // 标准化下标
    _normIndex: function(index, len){
      return (len + index) % len;
    },
    _onNav: function(pageIndex, slideIndex) {
      var linkList = this.links;
      var imgList = this.images;
      var slides = this.slides;

      // 图片下标和slide下标由0开始
      for(var i = -1; i <= this.showNum-1; i ++) {
        var index = this._getNum((slideIndex+i),this.showNum);
        var imglink = slides[index].querySelector("a");
        var img = slides[index].querySelector("img"); // 当前img结点
        if(!img) {
          img = document.createElement("img");
          imglink = document.createElement("a");
          imglink.appendChild(img);
          slides[index].appendChild(imglink);
        }
        var imgIndex = this._getNum((pageIndex+i),this.pageNum);
        img.src = imgList[imgIndex];
        imglink.href = linkList[imgIndex] || "";
        imglink.target = "_blank";
      }

      // 触发nav事件
      this.emit("nav",{pageIndex:pageIndex, slideIndex: slideIndex});
    },

    // 拖拽
    _initDrag: function() {
      // 拖拽初始化
      this._dragInfo = {};
      _.addEvent(this.slider,"mousedown", this._dragstart.bind(this));
      _.addEvent(this.slider,"mousemove", this._dragmove.bind(this));
      _.addEvent(this.slider,"mouseup", this._dragend.bind(this));
      _.addEvent(this.slider,"mouseleave", this._dragend.bind(this));
    },

    _dragstart: function(ev) {
      var dragInfo = this._dragInfo;
      dragInfo.start = {x: ev.pageX, y: ev.pageY};
    },

    _dragmove: function(ev) {
      var dragInfo = this._dragInfo;
      if(!dragInfo.start) return;

      // 默认，及选取清除
      ev.preventDefault();
      this.slider.style.transitionDuration = '0s';

      var start = dragInfo.start;
      // 清除恼人的选区
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      } else if (window.document.selection) {
        window.document.selection.empty();
      }

      // 加translateZ 分量是为了触发硬件加速
      this.slider.style.transform = 
       'translateX(' +  (-(this.offsetWidth * this.offsetAll - ev.pageX+start.x)) + 'px) translateZ(0)'

    },

    _dragend: function( ev ){

      var dragInfo = this._dragInfo;
      if(!dragInfo.start) return;

      ev.preventDefault();
      var start = dragInfo.start;
      this._dragInfo = {};
      var pageX = ev.pageX;

      // 看走了多少距离
      var deltX = pageX - start.x;
      if( Math.abs(deltX) > this.breakPoint ){
        this._step(deltX>0? -1: 1)
      }else{
        this._step(0)
      }
    },
    // 自动轮播相关
    _initAuto: function() {
      this.timmer = null;
      this.waitingTime = this.intervalTime;
      this.startAgain = false;
      this.autoStart();

      this.slider.addEventListener("mouseover", this._autoEnd.bind(this));
      this.slider.addEventListener("mouseout", this._autoStart.bind(this));
    },
    _autoStart: function() {
      var time = this.intervalTime;
      // 为防止也越来越快，在重复调用时，先清除
      clearInterval(this.timmer);
      this.timmer = setInterval(this._step.bind(this,1), time);
    },
    _autoEnd: function() {
      var timmer = this.timmer;
      if(!timmer) return;

      clearInterval(this.timmer);
    },

    // 对外接口，开启轮播
    autoStart: function(time) {
      this.intervalTime = time || this.intervalTime;
      this._autoStart();
    },

    // 对外接口，结束轮播
    // 仅对外接口考虑是否再次启动，startAgain判断为在一定时间内，再次启动
    autoEnd: function(startAgain, waitingTime) {
      this._autoEnd();
      var _this = this;
      if (startAgain) {
        // 新建一个定时器来控制启动，在指定时间后仅启动一次
        clearTimeout(newTimmer); 
        var newTimmer = setTimeout(function(){
            _this._autoStart();
        }, waitingTime);
      }
    }
  });

  //          5.Exports
  // ----------------------------------------------------------------------
  // 暴露API:  Amd || Commonjs  || Global 
  // 支持commonjs
  if (typeof exports === 'object') {
      module.exports = Slider;
      // Slider
  } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return Slider;
      });
  } else {
      // 直接暴露到全局
      window.Slider = Slider;
  }
})(util);








