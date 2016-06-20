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
      } catch (e) {
          alert("获取节点失败，可能当前浏览器不支持！");
      }
    },

    $qsa: function( selector, scope ){
      if (document.querySelectorAll && scope?scope.querySelectorAll:true) try {
          return [].slice.call((scope || document).querySelectorAll(selector));
      } catch (e) {
        alert("获取节点失败，可能当前浏览器不支持！");
      }
    },

    $gt: function(selector, scope) {
      if (document.querySelector && scope?scope.querySelector:true) try {
          return [].slice.call((scope || document).getElementsByTagName(selector));
      } catch (e) {
        alert("获取节点失败，可能当前浏览器不支持！");
      }
    },

    // 根据id获取元素
    $: function(id) {
      return document.getElementById(id);
    },

    getTarget: function(event) {
      return event.target || event.srcElement;
    },

    getDataset: function(ele,str) {
      if(!ele.dataset){
        var data_attributes ={};
        var arrs = ele.attributes,
            length=arrs.length;
        for(var i=0;i<length;i++){
          if(/^data-/.test(arrs[i].name)){
            var key=arrs[i].name.match(/^data-(.+)/)[1]; 
            var value=arrs[i].value;
            key=key.replace(/-\w/g,function(match){
                return match.substring(1).toUppserCase();
            });
            data_attributes[key]=value; 
          } 
        } 
        return data_attributes [str];
      }else{
        return ele.dataset[str];
      }
    },
    setDataset: function(ele,str,value) {
      if(!ele.dataset){
        var finalStr = "data-";
        var originPos = 0;
        var pos = 0;
        do {
          pos = str.search(/[A-Z]/);
          if (pos === -1) {
            finalStr += str.substring(originPos);
          } else {
            finalStr += str.substring(originPos,pos);
            originPos = pos;
            str = str.substring(pos);
          }
        } while (pos !== -1);

        ele.setAttribute("finalStr",value);
      }else{
        ele.dataset[str] = value;
      }
    },

    // element.children能够获取元素的元素子节点，但是低版本的ie不支持，如何在低版本的ie上兼容类似的功能。
    // 思想：通过获取element的所有子节点，判断每个子节点是否为元素节点，取得所有元素节点即可。
    // nodeType=1 元素节点 nodeType=2 属性节点 nodeType=3 文本节点
    getChildren: function(element){
        if (!element.children) {  //如果没有children方法
            var result_elementchild = [],    //新的元素子节点数组
                nodelist = element.childNodes;    //获取所有子节点
            for (var i = 0; i < nodelist.length; i++) {
                if(nodelist[i].nodeType == 1){        //判断节点是否为元素节点
                    result_elementchild.push(nodelist[i]);
                }
            }
            return result_elementchild;
        }
        else {
            return element.children;
        }
    },

    preventDefault: function(event) {
      if(event && event.preventDefault){
        event.preventDefault();
      }else{
        window.event.returnValue = false;//注意加window
      }
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
})();

// 兼容性函数
// bind ie8兼容
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// call在ie9以下不能以节点为变量兼容
/**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES6, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when
 * called on other DOM objects.
 */
(function () {
  'use strict';
  var _slice = Array.prototype.slice;

  try {
    // Can't be used with DOM elements in IE < 9
    _slice.call(document.documentElement);
  } catch (e) { // Fails in IE < 9
    // This will work for genuine arrays, array-like objects, 
    // NamedNodeMap (attributes, entities, notations),
    // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
    // and will not fail on other DOM objects (as do DOM elements in IE < 9)
    Array.prototype.slice = function(begin, end) {
      // IE < 9 gets unhappy with an undefined end argument
      end = (typeof end !== 'undefined') ? end : this.length;

      // For native Array objects, we use the native slice function
      if (Object.prototype.toString.call(this) === '[object Array]'){
        return _slice.call(this, begin, end); 
      }

      // For array like object we handle it ourselves.
      var i, cloned = [],
        size, len = this.length;

      // Handle negative value for "begin"
      var start = begin || 0;
      start = (start >= 0) ? start : Math.max(0, len + start);

      // Handle negative value for "end"
      var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
      if (end < 0) {
        upTo = len + end;
      }

      // Actual expected size of the slice
      size = upTo - start;

      if (size > 0) {
        cloned = new Array(size);
        if (this.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = this.charAt(start + i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = this[start + i];
          }
        }
      }

      return cloned;
    };
  }
}());

// forEach ie8兼容
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. 
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

// trim ie8兼容
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}