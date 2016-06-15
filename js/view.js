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

        // cursor
        this.$cursor = _.$qs('.m-cursor');
        this.$cursors = _.$qsa('.m-cursor .cursor');
        this.$cursorCrt = _.$qs('.crt',this.$cursor);

        // 课程列表
        this.$courseLst = _.$qs('.g-mn .lst');

        // 浏览器宽度
        this.width = document.body.clientWidth;
        this.pageNo = parseInt(this.$cursorCrt.innerHTML) || 1;
        this.type = 10;
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
            this.pageNo = pageNo;

            handler(pageNo,psize,this.type);
        },
        _updateCourse: function(data) {
            this.$courseLst.innerHTML = this.courseShow(data);
        },
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
                _.delegateEvent(self.$tab, 'li', 'click', function(){
                    self.type = this.value;
                    self._getCourseValue(handler);
                });
            } else if (event === 'cursorChange') {
                _.delegateEvent(self.$cursor, 'li', 'click', function(){
                    self.$cursorCrt = this;
                    self._getCourseValue(handler);
                });
            } else if (event === 'getCourseValue') {
                self._getCourseValue(handler);
            } else if (event === 'resize') {
                window.onresize = function() {
                    self.width = document.body.clientWidth;
                    self._getCourseValue(handler);
                }
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
                    self.$tabs.forEach(function(tab, index) {
                        if (tab.value === self.type) {
                            _.addClass(tab,'sel');
                        } else {
                            _.delClass(tab,'sel');
                        }
                    });
                },
                cursorChange: function() {
                    self.$cursors.forEach(function(cursor, index) {
                        if (parseInt(cursor.innerHTML) === this.pageNo) {
                            _.addClass(cursor,'crt');
                        } else {
                            _.delClass(cursor,'crt');
                        }
                    });
                },
                updateCourse: function() {
                    self._updateCourse(parameter);
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