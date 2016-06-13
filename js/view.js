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

        // 登录
        this.$login = _.$qs('.m-login');
        // tips
        this.$tips = _.$qs('.g-tips');
        this.$tipsClose = _.$qs('.tips-cl',this.$tips);
        // nav
        this.$navInfo = _.$qs('.m-nav .nav-info');
        // 
    }

    // 事件注册
    _.extend(View.prototype, _.emitter);

    // view层事件(私有)
    _.extend(View.prototype, {
    });

    // 对外暴露的接口
   _.extend(View.prototype, {
        bind: function (event, handler) {
            var self = this;
            if (event === 'removeTips') {
                _.addEvent(self.$tipsClose, 'click', function () {
                    handler();
                });
            }
        },
        render: function (viewCmd, parameter) {
            var self = this;
            var viewCommands = {
                // 根据visible显示或者关闭提醒tips
                displayTips: function (visible) {
                    self.$tips.style.display = visible ? 'block' : 'none';
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