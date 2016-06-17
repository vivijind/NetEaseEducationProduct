;(function(_){
  var template = 
  '<div class="m-slider hotcourse" >\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
    <div class="slide"></div>\
  </div>';

  var templateCourse = 
  '<div class="f-cb">\
        <a class="img f-fl" href="##"><img src="{{smallPhotoUrl}}" alt="{{name}}"></a>\
        <div class="txt">\
            <h5 class="f-toe"><a href="##">{{name}}</a></h5>\
            <div class="u-participate"><i></i>{{learnerCount}}</div>\
        </div>\
    </div>';

  function SliderCourse(opt) {
    // 继承属性，借用构造函数方法
    Slider.call(this,opt);

    this.pageNum = this.courses? this.courses.length : 3;
    this.showNum = this.showNum || 3;
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
      var nextslideIndex = this._getNum(this.slideIndex+1,showNum);
      var offsetAll = this.offsetAll;
      var pageNum = this.pageNum;
      
      var slides = this.slides;
      slides[slideIndex].style.top = offsetAll*70 + "px";
      slides[prevslideIndex].style.top = (offsetAll-1)*70 + "px";
      slides[nextslideIndex].style.top = (offsetAll+1)*70 + "px";

      // 容器偏移
      this.slider.style.transform = "translateY(" + (-offsetAll*100) + "%) translateZ(0px)";
    
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
      for(var i = -1; i <= this.showNum-1; i ++) {
        var index = this._getNum((slideIndex+i),this.showNum);
        // var img = slides[index].querySelector(".f-cb"); // 当前img结点
        // if(!img) {
        //   img = document.createElement("img");
        //   slides[index].appendChild(img);
        // }
        // img.src = imgList[this._getNum((pageIndex+i),this.pageNum)];
        slides[index].innerHTML = templateCourse;
        var test = slides[index].querySelector(".f-toe");
        test.innerHTML = "test    " + index;
      }

      // 触发nav事件
      this.emit("nav",{pageIndex:pageIndex, slideIndex: slideIndex});
  }

  _.extend(SliderCourse.prototype,{
    // 根据course数据替换模板
    _getCourse: function(index) {
      var courseData = this.courses[index];
      var template = this.templateCourse;

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








