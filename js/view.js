// 传入util，使用一些通用函数接口
;(function(_){
    /**
     * view层
     * 提供两个接口：
     * - bind(eventName, handler)
     *   事件注册和处理
     * - render(command, parameterObject)
     *   绘制（根据命令和选择项）
     */

    function View(template) {
        // 将模板复制到自身实例上
        _.extend(this,template);

        // tips
        this.$tips = _.$qs('.g-tips');
        this.$tipsClose = _.$qs('.tips-cl',this.$tips);

        // nav
        this.$navConcern = _.$qs('.m-nav .nav-info .concern');
        this.$navConcernd = _.$qs('.m-nav .nav-info .concernd');
        this.$navCancel = _.$qs('.m-nav .nav-info .cancel');
        this.$navFansNum = _.$qs('.m-nav .nav-info .number');

        // tab
        this.$tab = _.$qs('.g-mn .tab');
        this.$tabs = _.$gt('li',this.$tab);
        this.$tabSel = _.$qs('.sel',this.$tab);

        // cursor
        this.$cursor = _.$qs('.m-cursor');
        this.$cursors = _.$qsa('.m-cursor .cursor');
        this.$cursorCrt = _.$qs('.crt',this.$cursor);

        // 课程列表
        this.$courseLst = _.$qs('.g-mn .lst');
        this.$

        // 浏览器宽度
        this.width = document.body.clientWidth;
        this.pageNo = parseInt(this.$cursorCrt.innerHTML) || 1;
        this.type = this.$tabSel.value || 10;
    }

    // 事件注册
    _.extend(View.prototype, _.emitter);

    // view层事件(私有)
    _.extend(View.prototype, {
        _getCourseValue: function(handler) {
            var psize = this.width>= 1205? 20 : 15;
            var pageNo = this.pageNo;
            if (this.$cursorCrt.innerHTML === '<') {
                pageNo = pageNo-1>0 ? pageNo-1:1;
            } else if (this.$cursorCrt.innerHTML === '>') {
                pageNo = pageNo+1<9 ? pageNo+1:1;
            } else {
                pageNo = parseInt(this.$cursorCrt.innerHTML) || 1;
            }
            this.type = this.$tabSel.value || 10;
            this.pageNo = pageNo;

            handler(pageNo,psize,this.type);
        },
        _updateCourse: function(data) {
            this.$courseLst.innerHTML = this.courseShow(data);
        },
        _itemIndex: function (element) {
            this.$curCourse = element;
            this.originHTML = element.innerHTML;
            return parseInt(element.dataset.index);
        },
        _expandCourse: function(data) {
            this.$curCourse.innerHTML = this.courseExpand(data);
        },
        _restoreCourse: function() {
            this.$curCourse.innerHTML = this.originHTML;
        }
    });

    // 对外暴露的接口
   _.extend(View.prototype, {
        bind: function (event, handler) {
            var self = this;
            if (event === 'removeTips') {   // 不再提醒
                _.addEvent(self.$tipsClose, 'click', function () {
                    handler();
                });
            } else if (event === 'concern') {   // 点击关注按钮
                _.addEvent(self.$navConcern, 'click', function(){
                    handler();
                });
            } else if (event === 'concerndCancel') {   // 点击取消
                _.addEvent(self.$navCancel, 'click', function(){
                    handler();
                });
            } else if (event === 'tabChange') {
                _.delegateEvent(self.$nav, 'li', function(){
                    self.$tabSel = this;
                    self._getCourseValue(handler);
                });
            } else if (event === 'cursorChange') {
                _.delegateEvent(self.$cursor, 'li', function(){
                    self.$cursorCrt = this;
                    self._getCourseValue(handler);
                });
            } else if (event === 'courseHover') {
                _.delegateByClass(self.$courseLst, '.m-course', 'mouseover', function(){
                    handler(self._itemIndex(this));
                });
            } else if (event === 'courseOut') {
                _.delegateByClass(self.$courseLst, '.m-course .course-wrap', 'mouseover', function(){
                    handler();
                });
            } else if (event === 'getCourseValue') {
                self._getCourseValue(handler);
            }
        },
        render: function (viewCmd, parameter) {
            var self = this;
            var viewCommands = {
                // 根据visible显示或者关闭提醒tips
                displayTips: function () {
                    self.$tips.style.display = parameter ? 'none' : 'block';
                },
                concern: function() {
                    if (parameter) {
                        self.$navConcern.style.display = 'none';
                        self.$navConcernd.style.display = 'table-cell';
                        // 对应修改粉丝数
                        var fansNum = parseInt(self.$navFansNum.innerHTML) + 1;
                        self.$navFansNum.innerHTML = fansNum;
                    } else {
                        self.$navConcern.style.display = 'table-cell';
                        self.$navConcernd.style.display = 'none';
                    }
                },
                concerndCancel: function() {
                    self.$navConcern.style.display = 'table-cell';
                    self.$navConcernd.style.display = 'none';
                    // 对应修改粉丝数
                    var fansNum = parseInt(self.$navFansNum.innerHTML) - 1;
                    self.$navFansNum.innerHTML = fansNum;
                },
                tabChange: function() {
                    tabs.forEach(function(tab, index) {
                        if (tab.value === this.type) {
                            _.addClass(tab,'sel');
                        } else {
                            _.delClass(tab,'sel');
                        }
                    });
                    self._updateCourse(parameter);
                },
                cursorChange: function() {
                    cursors.forEach(function(cursor, index) {
                        if (parseInt(cursor.innerHTML) === this.pageNo) {
                            _.addClass(cursor,'crt');
                        } else {
                            _.delClass(cursor,'crt');
                        }
                    });
                    self._updateCourse(parameter);
                },
                updateCourse: function() {
                    self._updateCourse(parameter);
                },
                expandCourse: function() {
                    self._expandCourse(parameter);
                },
                restoreCourse: function() {
                    self._restoreCourse();
                }
            };

            viewCommands[viewCmd]();
        }
    });

    //          Exports
    // ----------------------------------------------------------------------
    // 暴露API:  Amd || Commonjs  || Global 
    // 支持commonjs
    if (typeof exports === 'object') {
        module.exports = View;
        // 支持amd
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
          return View;
        });
    } else {
       // 直接暴露到全局
       window.View = View;
    }
})(util);