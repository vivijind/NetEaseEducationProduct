;(function(_){
  // 通过模板来设定当前显示的轮播项
  var template = 
  '<div class="m-slider hotcourse" >\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
  </div>';

  var templateCourse = 
  '<div class="f-cb">\
        <a class="img f-fl" href="##"><img src="{{smallPhotoUrl}}" alt="{{name}}"></a>\
        <div class="txt">\
            <h5 class="f-toe" title="{{name}}"><a href="##">{{name}}</a></h5>\
            <div class="u-participate"><i></i>{{learnerCount}}</div>\
        </div>\
    </div>';

  function SliderCourse(opt) {
    // 继承属性，借用构造函数方法
    Slider.call(this,opt);

    this.pageNum = this.courses? this.courses.length : 3;
    this.directionH = false;

    // ie8 transform兼容处理
    this.ie8 = navigator.userAgent.indexOf("MSIE 8.0")>0? true: false;
  }

  // 继承方法
  SliderCourse.prototype = new Slider();
  SliderCourse.prototype.constructor = SliderCourse;
  SliderCourse.prototype._layout = _.html2node(template);

  SliderCourse.prototype._calcSlide = function() {
      var showNum = this.showNum;
      var pageIndex = this.pageIndex = this._getNum(this.pageIndex, this.pageNum);
      var slideIndex = this.slideIndex = this._getNum(this.slideIndex,showNum);
      var prevslideIndex = this._getNum(this.slideIndex-1,showNum);
      var nextslideIndex = 0;
      var offsetAll = this.offsetAll;
      var pageNum = this.pageNum;
      
      var slides = this.slides;
      slides[slideIndex].style.top = offsetAll*70 + "px";
      slides[prevslideIndex].style.top = (offsetAll-1)*70 + "px";
      
      for (var i = 1; i < showNum-1; i++) {
        nextslideIndex = this._getNum(this.slideIndex+i,showNum);
        slides[nextslideIndex].style.top = (offsetAll+i)*70 + "px";
      }

      
      if (this.ie8) {
        this.slider.style.top = (-offsetAll*70) + "px";
      } else {
        // 容器偏移——动画
        this.slider.style.transform = "translateY(" + (-offsetAll*70) + "px) translateZ(0px)";
      }

      // 给当前slideIndex添加z-active
      slides.forEach(function(node){ _.delClass(node, 'z-active') })
      _.addClass(slides[slideIndex], 'z-active');

      // 图片url处理
      this._onNav(this.pageIndex, this.slideIndex);
  }

  SliderCourse.prototype._onNav = function(pageIndex, slideIndex) {
      var imgList = this.images;
      var slides = this.slides;

      // 图片下标和slide下标由0开始
      for(var i = -1; i <= this.showNum-2; i ++) {
        var index = this._getNum((slideIndex+i),this.showNum);
        var imgIndex = this._getNum((pageIndex+i),this.pageNum);
        // 根据数据更新课程  
        slides[index].innerHTML = this._getCourse(imgIndex);
      }

      // 触发nav事件
      this.emit("nav",{pageIndex:pageIndex, slideIndex: slideIndex});
  }

  _.extend(SliderCourse.prototype,{
    // 根据course数据替换模板
    _getCourse: function(index) {
      var courseData = this.courses[index];
      var template = templateCourse;

      // 根据数据构建模板
      template = template.replace(/{{name}}/g, _.escape(courseData.name));
      template = template.replace(/{{smallPhotoUrl}}/g, courseData.smallPhotoUrl);
      template = template.replace(/{{learnerCount}}/g, courseData.learnerCount);

      return template;
    }
  });

  //          5.Exports
  // ----------------------------------------------------------------------
  // 暴露API:  Amd || Commonjs  || Global 
  // 支持commonjs
  if (typeof exports === 'object') {
      module.exports = SliderCourse;
      // 支持amd
  } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return SliderCourse;
      });
  } else {
      // 直接暴露到全局
      window.SliderCourse = SliderCourse;
  }
})(util);








