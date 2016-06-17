/* 相关工具库 */

var util = (function(){
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '`': '&#x60;'
  };

  var escapeHtmlChar = function (chr) {
    return htmlEscapes[chr];
  };

  var reUnescapedHtml = /[&<>"'`]/g;
  var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

  return {
    // 根据css选择器获取元素
    $qs: function (selector, scope) {
      if (document.querySelector && scope?scope.querySelector:true) try {
          return (scope || document).querySelector(selector);
      } catch (e) {}
    },

    $qsa: function( selector, scope ){
      if (document.querySelectorAll && scope?scope.querySelectorAll:true) try {
          return [].slice.call((scope || document).querySelectorAll(selector));
      } catch (e) {}
    },

    $gt: function(selector, scope) {
      if (document.querySelector && scope?scope.querySelector:true) try {
          return [].slice.call((scope || document).getElementsByTagName(selector));
      } catch (e) {}
    },

    // 根据id获取元素
    $: function(id) {
      return document.getElementById(id);
    },

    getTarget: function(event) {
      return event.target || event.srcElement;
    },

    // 绑定事件
    addEvent: function(elem, type, listener, useCapture) {
      document.addEventListener ? elem.addEventListener(type, listener, useCapture):
        elem.attachEvent('on' + type, listener);
    },

    // 移除事件
    delEvent: function(elem, type, listener, useCapture) {
      document.removeEventListener ? elem.removeEventListener(type, listener, useCapture):
        elem.detachEvent('on' + type, listener);
    },

    // 事件代理
    delegateEvent: function(element, tag, eventName, listener) {
        this.addEvent(element, eventName, function () {
            var event = arguments[0] || window.event,
                target = event.target || event.srcElement;
            if (target && target.tagName === tag.toUpperCase()) {
                listener.call(target, event);
            }
        });
    },

    delegateByClass: function (target, selector, type, handler) {
      var self = this;
      function dispatchEvent(event) {
        var targetElement = self.getTarget(event);
        var potentialElements = self.$qsa(selector, target);
        var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

        if (hasMatch) {
          handler.call(targetElement, event);
        }
      }

      // https://developer.mozilla.org/en-US/docs/Web/Events/blur
      var useCapture = type === 'blur' || type === 'focus';

      self.addEvent(target, type, dispatchEvent, useCapture);
    },

    // 拷贝
    extend: function(o1, o2){
      for(var i in o2) if (o1[i] == undefined ) {
        o1[i] = o2[i]
      }
    },

    addClass: function (node, className){
      var current = node.className || "";
      if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
        node.className = current? ( current + " " + className ) : className;
      }
    },

    delClass: function (node, className){
      var current = node.className || "";
      node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
    },

    emitter: {
      // 注册事件
      on: function(event, fn) {
        var handles = this._handles || (this._handles = {}),
          calls = handles[event] || (handles[event] = []);

        // 找到对应名字的栈
        calls.push(fn);

        return this;
      },
      // 解绑事件
      off: function(event, fn) {
        if(!event || !this._handles) this._handles = {};
        if(!this._handles) return;

        var handles = this._handles , calls;

        if (calls = handles[event]) {
          if (!fn) {
            handles[event] = [];
            return this;
          }
          // 找到栈内对应listener 并移除
          for (var i = 0, len = calls.length; i < len; i++) {
            if (fn === calls[i]) {
              calls.splice(i, 1);
              return this;
            }
          }
        }
        return this;
      },
      // 触发事件
      emit: function(event){
        var args = [].slice.call(arguments, 1),
          handles = this._handles, calls;

        if (!handles || !(calls = handles[event])) return this;
        // 触发所有对应名字的listeners
        for (var i = 0, len = calls.length; i < len; i++) {
          calls[i].apply(this, args)
        }
        return this;
      }
    },

    // 将html字符串转换为节点，便于后续操作
    html2node: function(str) {
      var container = document.createElement('div');
      container.innerHTML = str;
      return container.children[0];
    },

    escape: function (string) {
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }
  }
})()