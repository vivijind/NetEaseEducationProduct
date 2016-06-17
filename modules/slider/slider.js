/**
 *      -------------------
 *      |     |     |     |  <- 只有三栏是常驻的
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


// 立即执行，传入util，使用一些通用函数接口
;(function(_){
  // 需要使用到的函数
  // 将HTML转换为节点
  function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
  }


  var template = 
  '<div class="m-slider" >\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
  </div>';

  function Slider(opt) {
    // 将数据复制到自身示例上
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

    this.pageNum = this.images.length;

    // 内部数据结构
    this.slideIndex = 1;
    this.pageIndex = this.pageIndex || 0;
    this.offsetAll = this.pageIndex;

    // 拖拽
    if(this.drag) {
      this._initDrag();
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
    _layout: html2node(template),

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
      this.slideIndex = typeof this.slideIndex === 'number'? this.slideIndex: (pageIndex+1) % 3;
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

      this.offsetAll += offset;
      this.pageIndex += offset;
      this.slideIndex += offset;
      this.slider.style.transitionDuration = '.5s';

      this._calcSlide();
    },
    // 执行
    _calcSlide: function() {
      var pageIndex = this.pageIndex = this._getNum(this.pageIndex, this.pageNum);
      var slideIndex = this.slideIndex = this._getNum(this.slideIndex,3);
      var prevslideIndex = this._getNum(this.slideIndex-1,3);
      var nextslideIndex = this._getNum(this.slideIndex+1,3);
      var offsetAll = this.offsetAll;
      var pageNum = this.pageNum;
      
      var slides = this.slides;
      slides[slideIndex].style.left = offsetAll*100 + "%";
      slides[prevslideIndex].style.left = (offsetAll-1)*100 + "%";
      slides[nextslideIndex].style.left = (offsetAll+1)*100 + "%";

      // 容器偏移
      this.slider.style.transform = "translateX(" + (-offsetAll*100) + "%) translateZ(0px)";
    
      // 给当前slideIndex添加z-active
      slides.forEach(function(node){ _.delClass(node, 'z-active') })
      _.addClass(slides[slideIndex], 'z-active');

      // 图片url处理
      this._onNav(this.pageIndex, this.slideIndex);
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
      var imgList = this.images;
      var slides = this.slides;

      // 图片下标和slide下标由0开始
      for(var i = -1; i <= 1; i ++) {
        var index = this._getNum((slideIndex+i),3);
        var img = slides[index].querySelector("img");     // 当前img结点
        if(!img) {
          img = document.createElement("img");
          slides[index].appendChild(img);
        }
        var index = this._getNum((pageIndex+i),this.pageNum);
        img.src = imgList[index];

        // 先移除已有的click事件
        _.delEvent(img,"click",this._onClick);
        // 给img添加新的click事件，跳转到新的页面链接
        _.addEvent(img,"click",this._onClick);
        _.delEvent(img,"click",this._onClick);
      }

      // _.addEvent(this.slider,"click",this._onClick.bind(this,index));
      // 触发nav事件
      this.emit("nav",{pageIndex:pageIndex, slideIndex: slideIndex});
    },

    _onClick: function(index) {
      index = 
      var dragInfo = this._dragInfo,
          imgLinkList = this.links;
      if(dragInfo.start) return false;
      // img点击后跳转到链接
      window.open(imgLinkList[index]);
    },

    // 拖拽
    _initDrag: function() {
      // 拖拽初始化
      this._dragInfo = {};
      _.addEvent(this.slider,"mousedown", this._dragstart.bind(this));
      _.addEvent(this.slider,"mouseleave", this._dragend.bind(this));
    },

    _dragstart: function(ev) {
      var dragInfo = this._dragInfo;
      dragInfo.start = {x: ev.pageX, y: ev.pageY};
      _.addEvent(this.slider,"mousemove", this._dragmove.bind(this));
      _.addEvent(this.slider,"mouseup", this._dragend.bind(this));
      _.delEvent(this.slider,"mousemove", this._dragmove.bind(this));
      _.delEvent(this.slider,"mouseup", this._dragend.bind(this));
      this.slider.removeEventListener('mousemove',this._dragmove.bind(this));
      this.slider.removeEventListener('mouseup',this._dragmove.bind(this));
      this.slider.onmousemove = null;
      this.slider.onmouseup = null;
    },

    _dragmove: function(ev) {
      _.delEvent(this.slider,"mousemove", this._dragmove.bind(this));
      _.delEvent(this.slider,"mouseup", this._dragend.bind(this));
      this.slider.removeEventListener('mousemove',this._dragmove.bind(this),true);
      this.slider.removeEventListener('mouseup',this._dragmove.bind(this),true);
      this.slider.onmousemove = null;
      this.slider.onmouseup = null;
      var dragInfo = this._dragInfo;
      if(!dragInfo.start) return;

      // 默认，及选取清除
      ev.preventDefault();
      ev.stopPropagation();
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
      ev.stopPropagation();
      var start = dragInfo.start;
      this._dragInfo = {};
      var pageX = ev.pageX;

      // 看走了多少距离
      var deltX = pageX - start.x;
      if( Math.abs(deltX) > this.breakPoint ){
        this._step(deltX>0? -1: 1);
      }else{
        this._step(0);
      }

      _.delEvent(this.slider,"mousemove", this._dragmove.bind(this));
      _.delEvent(this.slider,"mouseup", this._dragend.bind(this));
      this.slider.removeEventListener('mousemove',this._dragmove.bind(this),true);
      this.slider.removeEventListener('mouseup',this._dragmove.bind(this),true);
      this.slider.onmousemove = null;
      this.slider.onmouseup = null;
      return false;
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

  // 接口暴露到全局
  window.Slider = Slider;
})(util);








