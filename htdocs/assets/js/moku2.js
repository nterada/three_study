/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/stats.js/build/stats.min.js":
/*!**************************************************!*\
  !*** ./node_modules/stats.js/build/stats.min.js ***!
  \**************************************************/
/***/ (function(module) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():0})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ }),

/***/ "./src/js/_utils.ts":
/*!**************************!*\
  !*** ./src/js/_utils.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Logger: function() { return /* binding */ Logger; },
/* harmony export */   Ticker: function() { return /* binding */ Ticker; }
/* harmony export */ });
const stats = new (__webpack_require__(/*! stats.js */ "./node_modules/stats.js/build/stats.min.js"))();
stats.dom.style.opacity = 0.75;
stats.dom.style.pointerEvents = 'none';
document.body.appendChild(stats.dom);
class Ticker {
    static onUpdate(fn) {
        const frameMS = 1000 / 60;
        const update = () => {
            const now = Date.now();
            const elapsed = (now - this._lastUpdated) / frameMS;
            if (elapsed > 0.7) {
                this._lastUpdated = now;
                stats.begin();
                fn();
                Logger.output();
                stats.end();
            }
            window.requestAnimationFrame(update);
        };
        update();
    }
}
Ticker._lastUpdated = 0;
class Logger {
    static add(label, value) {
        this.create();
        this._memo[label] = value;
    }
    static create() {
        if (this._el)
            return;
        this._el = document.createElement('div');
        this._el.classList.add('js_logger');
        document.body.appendChild(this._el);
    }
    static output() {
        if (!this._el)
            return;
        const html = Object.keys(this._memo).map((key) => {
            return `${key}: ${this._memo[key]}`;
        }).join('<br>');
        this._el.innerHTML = html;
    }
}
Logger._memo = {};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
!function() {
"use strict";
/*!*************************!*\
  !*** ./src/js/moku2.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_utils */ "./src/js/_utils.ts");

//windowサイズ取得
let _windowWidth;
let _windowHeight;
const resized = () => {
    _windowWidth = window.innerWidth;
    _windowHeight = window.innerHeight;
    _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('window-width', _windowWidth);
    _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('window-height', _windowHeight);
};
window.addEventListener('resize', resized);
resized();
//マウス座標取得
let _mouseX = 0;
let _mouseY = 0;
window.addEventListener('mousemove', (e) => {
    _mouseX = e.clientX - (_windowWidth * 0.5);
    _mouseY = e.clientY - (_windowHeight * 0.5);
});
//
const cube = document.getElementById('js_cube');
let x = 0;
let vx = 0;
const friction = 0.72;
//requestAnimationFrame（60fps固定）
_utils__WEBPACK_IMPORTED_MODULE_0__.Ticker.onUpdate(() => {
    _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('mouse-x', _mouseX);
    _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('mouse-y', _mouseY);
    _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('time', new Date().toISOString());
    //todo ここに毎フレームの処理を書く
    // x += 1;
    // x += (_mouseX - x) * 0.1;
    vx += (_mouseX - x) * 0.1;
    vx *= friction;
    x += vx;
    cube.style.transform = `translate(${x}px, 0)`;
});

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3RhdHMuanMvYnVpbGQvc3RhdHMubWluLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9fdXRpbHMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21va3UyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHN0YXRzLmpzIC0gaHR0cDovL2dpdGh1Yi5jb20vbXJkb29iL3N0YXRzLmpzXG4oZnVuY3Rpb24oZixlKXtcIm9iamVjdFwiPT09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPWUoKTpcImZ1bmN0aW9uXCI9PT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShlKTpmLlN0YXRzPWUoKX0pKHRoaXMsZnVuY3Rpb24oKXt2YXIgZj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoYSl7Yy5hcHBlbmRDaGlsZChhLmRvbSk7cmV0dXJuIGF9ZnVuY3Rpb24gdShhKXtmb3IodmFyIGQ9MDtkPGMuY2hpbGRyZW4ubGVuZ3RoO2QrKyljLmNoaWxkcmVuW2RdLnN0eWxlLmRpc3BsYXk9ZD09PWE/XCJibG9ja1wiOlwibm9uZVwiO2w9YX12YXIgbD0wLGM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjLnN0eWxlLmNzc1RleHQ9XCJwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7Y3Vyc29yOnBvaW50ZXI7b3BhY2l0eTowLjk7ei1pbmRleDoxMDAwMFwiO2MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsZnVuY3Rpb24oYSl7YS5wcmV2ZW50RGVmYXVsdCgpO1xudSgrK2wlYy5jaGlsZHJlbi5sZW5ndGgpfSwhMSk7dmFyIGs9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKSxnPWssYT0wLHI9ZShuZXcgZi5QYW5lbChcIkZQU1wiLFwiIzBmZlwiLFwiIzAwMlwiKSksaD1lKG5ldyBmLlBhbmVsKFwiTVNcIixcIiMwZjBcIixcIiMwMjBcIikpO2lmKHNlbGYucGVyZm9ybWFuY2UmJnNlbGYucGVyZm9ybWFuY2UubWVtb3J5KXZhciB0PWUobmV3IGYuUGFuZWwoXCJNQlwiLFwiI2YwOFwiLFwiIzIwMVwiKSk7dSgwKTtyZXR1cm57UkVWSVNJT046MTYsZG9tOmMsYWRkUGFuZWw6ZSxzaG93UGFuZWw6dSxiZWdpbjpmdW5jdGlvbigpe2s9KHBlcmZvcm1hbmNlfHxEYXRlKS5ub3coKX0sZW5kOmZ1bmN0aW9uKCl7YSsrO3ZhciBjPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCk7aC51cGRhdGUoYy1rLDIwMCk7aWYoYz5nKzFFMyYmKHIudXBkYXRlKDFFMyphLyhjLWcpLDEwMCksZz1jLGE9MCx0KSl7dmFyIGQ9cGVyZm9ybWFuY2UubWVtb3J5O3QudXBkYXRlKGQudXNlZEpTSGVhcFNpemUvXG4xMDQ4NTc2LGQuanNIZWFwU2l6ZUxpbWl0LzEwNDg1NzYpfXJldHVybiBjfSx1cGRhdGU6ZnVuY3Rpb24oKXtrPXRoaXMuZW5kKCl9LGRvbUVsZW1lbnQ6YyxzZXRNb2RlOnV9fTtmLlBhbmVsPWZ1bmN0aW9uKGUsZixsKXt2YXIgYz1JbmZpbml0eSxrPTAsZz1NYXRoLnJvdW5kLGE9Zyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb3x8MSkscj04MCphLGg9NDgqYSx0PTMqYSx2PTIqYSxkPTMqYSxtPTE1KmEsbj03NCphLHA9MzAqYSxxPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cS53aWR0aD1yO3EuaGVpZ2h0PWg7cS5zdHlsZS5jc3NUZXh0PVwid2lkdGg6ODBweDtoZWlnaHQ6NDhweFwiO3ZhciBiPXEuZ2V0Q29udGV4dChcIjJkXCIpO2IuZm9udD1cImJvbGQgXCIrOSphK1wicHggSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWZcIjtiLnRleHRCYXNlbGluZT1cInRvcFwiO2IuZmlsbFN0eWxlPWw7Yi5maWxsUmVjdCgwLDAscixoKTtiLmZpbGxTdHlsZT1mO2IuZmlsbFRleHQoZSx0LHYpO1xuYi5maWxsUmVjdChkLG0sbixwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkLG0sbixwKTtyZXR1cm57ZG9tOnEsdXBkYXRlOmZ1bmN0aW9uKGgsdyl7Yz1NYXRoLm1pbihjLGgpO2s9TWF0aC5tYXgoayxoKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9MTtiLmZpbGxSZWN0KDAsMCxyLG0pO2IuZmlsbFN0eWxlPWY7Yi5maWxsVGV4dChnKGgpK1wiIFwiK2UrXCIgKFwiK2coYykrXCItXCIrZyhrKStcIilcIix0LHYpO2IuZHJhd0ltYWdlKHEsZCthLG0sbi1hLHAsZCxtLG4tYSxwKTtiLmZpbGxSZWN0KGQrbi1hLG0sYSxwKTtiLmZpbGxTdHlsZT1sO2IuZ2xvYmFsQWxwaGE9Ljk7Yi5maWxsUmVjdChkK24tYSxtLGEsZygoMS1oL3cpKnApKX19fTtyZXR1cm4gZn0pO1xuIiwiY29uc3Qgc3RhdHMgPSBuZXcgKHJlcXVpcmUoJ3N0YXRzLmpzJykpKCk7XHJcbnN0YXRzLmRvbS5zdHlsZS5vcGFjaXR5ID0gMC43NTtcclxuc3RhdHMuZG9tLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaWNrZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9sYXN0VXBkYXRlZDogbnVtYmVyID0gMDtcclxuXHJcbiAgc3RhdGljIG9uVXBkYXRlKGZuOiBGdW5jdGlvbikge1xyXG4gICAgY29uc3QgZnJhbWVNUyA9IDEwMDAgLyA2MDtcclxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcclxuICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgY29uc3QgZWxhcHNlZCA9IChub3cgLSB0aGlzLl9sYXN0VXBkYXRlZCkgLyBmcmFtZU1TO1xyXG4gICAgICBpZiAoZWxhcHNlZCA+IDAuNykge1xyXG4gICAgICAgIHRoaXMuX2xhc3RVcGRhdGVkID0gbm93O1xyXG4gICAgICAgIHN0YXRzLmJlZ2luKCk7XHJcbiAgICAgICAgZm4oKTtcclxuICAgICAgICBMb2dnZXIub3V0cHV0KCk7XHJcbiAgICAgICAgc3RhdHMuZW5kKCk7XHJcbiAgICAgIH1cclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xyXG4gICAgfTtcclxuICAgIHVwZGF0ZSgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2VsOiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIHN0YXRpYyBfbWVtbzogeyBbbGFiZWw6IHN0cmluZ106IG51bWJlciB8IHN0cmluZyB9ID0ge307XHJcblxyXG4gIHN0YXRpYyBhZGQobGFiZWw6IHN0cmluZywgdmFsdWU6IG51bWJlciB8IHN0cmluZykge1xyXG4gICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIHRoaXMuX21lbW9bbGFiZWxdID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3JlYXRlKCkge1xyXG4gICAgaWYgKHRoaXMuX2VsKSByZXR1cm47XHJcbiAgICB0aGlzLl9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGhpcy5fZWwuY2xhc3NMaXN0LmFkZCgnanNfbG9nZ2VyJyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuX2VsKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBvdXRwdXQoKSB7XHJcbiAgICBpZiAoIXRoaXMuX2VsKSByZXR1cm47XHJcbiAgICBjb25zdCBodG1sID0gT2JqZWN0LmtleXModGhpcy5fbWVtbykubWFwKChrZXkpID0+IHtcclxuICAgICAgcmV0dXJuIGAke2tleX06ICR7dGhpcy5fbWVtb1trZXldfWA7XHJcbiAgICB9KS5qb2luKCc8YnI+Jyk7XHJcbiAgICB0aGlzLl9lbC5pbm5lckhUTUwgPSBodG1sO1xyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge0xvZ2dlciwgVGlja2VyfSBmcm9tICcuL191dGlscyc7XHJcblxyXG4vL3dpbmRvd+OCteOCpOOCuuWPluW+l1xyXG5sZXQgX3dpbmRvd1dpZHRoOm51bWJlcjtcclxubGV0IF93aW5kb3dIZWlnaHQ6bnVtYmVyO1xyXG5jb25zdCByZXNpemVkID0gKCk9PiB7XHJcbiAgX3dpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgX3dpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICBMb2dnZXIuYWRkKCd3aW5kb3ctd2lkdGgnLCBfd2luZG93V2lkdGgpO1xyXG4gIExvZ2dlci5hZGQoJ3dpbmRvdy1oZWlnaHQnLCBfd2luZG93SGVpZ2h0KTtcclxufVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplZCk7XHJcbnJlc2l6ZWQoKTtcclxuXHJcbi8v44Oe44Km44K55bqn5qiZ5Y+W5b6XXHJcbmxldCBfbW91c2VYOm51bWJlciA9IDA7XHJcbmxldCBfbW91c2VZOm51bWJlciA9IDA7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xyXG4gIF9tb3VzZVggPSBlLmNsaWVudFggLSAoX3dpbmRvd1dpZHRoICogMC41KTtcclxuICBfbW91c2VZID0gZS5jbGllbnRZIC0gKF93aW5kb3dIZWlnaHQgKiAwLjUpO1xyXG59KTtcclxuXHJcblxyXG4vL1xyXG5jb25zdCBjdWJlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzX2N1YmUnKTtcclxuXHJcbmxldCB4ID0gMDtcclxubGV0IHZ4ID0gMDtcclxuY29uc3QgZnJpY3Rpb24gPSAwLjcyO1xyXG5cclxuLy9yZXF1ZXN0QW5pbWF0aW9uRnJhbWXvvIg2MGZwc+WbuuWumu+8iVxyXG5UaWNrZXIub25VcGRhdGUoKCk9PiB7XHJcbiAgTG9nZ2VyLmFkZCgnbW91c2UteCcsIF9tb3VzZVgpO1xyXG4gIExvZ2dlci5hZGQoJ21vdXNlLXknLCBfbW91c2VZKTtcclxuICBMb2dnZXIuYWRkKCd0aW1lJywgbmV3IERhdGUoKS50b0lTT1N0cmluZygpKTtcclxuXHJcbiAgLy90b2RvIOOBk+OBk+OBq+avjuODleODrOODvOODoOOBruWHpueQhuOCkuabuOOBj1xyXG4gIC8vIHggKz0gMTtcclxuICAvLyB4ICs9IChfbW91c2VYIC0geCkgKiAwLjE7XHJcbiAgdnggKz0gKF9tb3VzZVggLSB4KSAqIDAuMTtcclxuICB2eCAqPSBmcmljdGlvbjtcclxuICB4ICs9IHZ4O1xyXG4gIGN1YmUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3h9cHgsIDApYDtcclxufSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==