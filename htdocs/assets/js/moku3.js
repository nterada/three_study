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
  !*** ./src/js/moku3.ts ***!
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
// const friction = 1;
let y = 0;
let vy = 0;
//requestAnimationFrame（60fps固定）
_utils__WEBPACK_IMPORTED_MODULE_0__.Ticker.onUpdate(() => {
    _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('mouse-x', _mouseX);
    _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('mouse-y', _mouseY);
    _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('time', new Date().toISOString());
    //todo ここに毎フレームの処理を書く
    // x += 1;
    // x += (_mouseX - x) * 0.1;
    // vx += (_mouseX - x) * 0.1;
    const radius = 100; // 円運動の半径  const cube = document.getElementById('js_cube');
    let x = 0;
    let vx = 0;
    const friction = 0.72;
    let y = 0;
    let vy = 0;
    _utils__WEBPACK_IMPORTED_MODULE_0__.Ticker.onUpdate(() => {
        _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('mouse-x', _mouseX);
        _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('mouse-y', _mouseY);
        _utils__WEBPACK_IMPORTED_MODULE_0__.Logger.add('time', new Date().toISOString());
        const radius = 100; // 円運動の半径
        const speed = 0.05; // 円運動の速度
        const angle = performance.now() * speed;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;
        const depth = 100; // 奥行きdの範囲
        const depthSpeed = 0.02; // 奥行きの速度
        const depthOffset = Math.sin(angle * depthSpeed) * depth;
        if (Math.abs(_mouseX - x) > 1 || Math.abs(_mouseY - y) > 1) {
            vx += (offsetX + _mouseX - x) * 0.1;
            vy += (offsetY + _mouseY - y) * 0.1;
        }
        else {
            vx *= friction;
            vy *= friction;
        }
        vx *= friction;
        vy *= friction;
        x += vx;
        y += vy;
        if (cube) {
            cube.style.transform = `translate3d(${x}px, ${y}px, ${depthOffset}px)`;
        }
    });
    const speed = 0.05; // 円運動の速度
    const angle = performance.now() * speed;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;
    const depth = 100; // 奥行きの範囲
    const depthSpeed = 0.02; // 奥行きの速度
    const depthOffset = Math.sin(angle * depthSpeed) * depth;
    // Combine the transformations into a single transform property
    cube.style.transform = `translate3d(${x}px, ${y}px, ${depthOffset}px) translate(${x}px, ${y}px)`;
    // vx += (offsetX + _mouseX - x) * 0.1;
    // vy += (offsetY + _mouseY - y) * 0.1;
    // vx *= friction;
    // x += vx;
    // vy += (_mouseY - y) * 0.1;
    vy *= friction;
    // y += vy;
    if (Math.abs(_mouseX - x) > 1 || Math.abs(_mouseY - y) > 1) {
        vx += (offsetX + _mouseX - x) * 0.1;
        vy += (offsetY + _mouseY - y) * 0.1;
    }
    else {
        vx *= friction;
        vy *= friction;
    }
    cube.style.transform = `translate(${x}px, ${y}px)`;
});

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFDdkMsdUNBQXVDO0lBQ3ZDLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsNkJBQTZCO0lBQzdCLEVBQUUsSUFBSSxRQUFRLENBQUM7SUFDZixXQUFXO0lBR1gsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzFELEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3BDLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0tBQ3JDO1NBQU07UUFDTCxFQUFFLElBQUksUUFBUSxDQUFDO1FBQ2YsRUFBRSxJQUFJLFFBQVEsQ0FBQztLQUNoQjtJQUVELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQ3JELENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0YXRzLmpzL2J1aWxkL3N0YXRzLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvX3V0aWxzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL3NyYy9qcy9tb2t1My50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzdGF0cy5qcyAtIGh0dHA6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qc1xuKGZ1bmN0aW9uKGYsZSl7XCJvYmplY3RcIj09PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZSk6Zi5TdGF0cz1lKCl9KSh0aGlzLGZ1bmN0aW9uKCl7dmFyIGY9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGEpe2MuYXBwZW5kQ2hpbGQoYS5kb20pO3JldHVybiBhfWZ1bmN0aW9uIHUoYSl7Zm9yKHZhciBkPTA7ZDxjLmNoaWxkcmVuLmxlbmd0aDtkKyspYy5jaGlsZHJlbltkXS5zdHlsZS5kaXNwbGF5PWQ9PT1hP1wiYmxvY2tcIjpcIm5vbmVcIjtsPWF9dmFyIGw9MCxjPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Yy5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO2N1cnNvcjpwb2ludGVyO29wYWNpdHk6MC45O3otaW5kZXg6MTAwMDBcIjtjLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLGZ1bmN0aW9uKGEpe2EucHJldmVudERlZmF1bHQoKTtcbnUoKytsJWMuY2hpbGRyZW4ubGVuZ3RoKX0sITEpO3ZhciBrPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCksZz1rLGE9MCxyPWUobmV3IGYuUGFuZWwoXCJGUFNcIixcIiMwZmZcIixcIiMwMDJcIikpLGg9ZShuZXcgZi5QYW5lbChcIk1TXCIsXCIjMGYwXCIsXCIjMDIwXCIpKTtpZihzZWxmLnBlcmZvcm1hbmNlJiZzZWxmLnBlcmZvcm1hbmNlLm1lbW9yeSl2YXIgdD1lKG5ldyBmLlBhbmVsKFwiTUJcIixcIiNmMDhcIixcIiMyMDFcIikpO3UoMCk7cmV0dXJue1JFVklTSU9OOjE2LGRvbTpjLGFkZFBhbmVsOmUsc2hvd1BhbmVsOnUsYmVnaW46ZnVuY3Rpb24oKXtrPShwZXJmb3JtYW5jZXx8RGF0ZSkubm93KCl9LGVuZDpmdW5jdGlvbigpe2ErKzt2YXIgYz0ocGVyZm9ybWFuY2V8fERhdGUpLm5vdygpO2gudXBkYXRlKGMtaywyMDApO2lmKGM+ZysxRTMmJihyLnVwZGF0ZSgxRTMqYS8oYy1nKSwxMDApLGc9YyxhPTAsdCkpe3ZhciBkPXBlcmZvcm1hbmNlLm1lbW9yeTt0LnVwZGF0ZShkLnVzZWRKU0hlYXBTaXplL1xuMTA0ODU3NixkLmpzSGVhcFNpemVMaW1pdC8xMDQ4NTc2KX1yZXR1cm4gY30sdXBkYXRlOmZ1bmN0aW9uKCl7az10aGlzLmVuZCgpfSxkb21FbGVtZW50OmMsc2V0TW9kZTp1fX07Zi5QYW5lbD1mdW5jdGlvbihlLGYsbCl7dmFyIGM9SW5maW5pdHksaz0wLGc9TWF0aC5yb3VuZCxhPWcod2luZG93LmRldmljZVBpeGVsUmF0aW98fDEpLHI9ODAqYSxoPTQ4KmEsdD0zKmEsdj0yKmEsZD0zKmEsbT0xNSphLG49NzQqYSxwPTMwKmEscT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3Eud2lkdGg9cjtxLmhlaWdodD1oO3Euc3R5bGUuY3NzVGV4dD1cIndpZHRoOjgwcHg7aGVpZ2h0OjQ4cHhcIjt2YXIgYj1xLmdldENvbnRleHQoXCIyZFwiKTtiLmZvbnQ9XCJib2xkIFwiKzkqYStcInB4IEhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmXCI7Yi50ZXh0QmFzZWxpbmU9XCJ0b3BcIjtiLmZpbGxTdHlsZT1sO2IuZmlsbFJlY3QoMCwwLHIsaCk7Yi5maWxsU3R5bGU9ZjtiLmZpbGxUZXh0KGUsdCx2KTtcbmIuZmlsbFJlY3QoZCxtLG4scCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPS45O2IuZmlsbFJlY3QoZCxtLG4scCk7cmV0dXJue2RvbTpxLHVwZGF0ZTpmdW5jdGlvbihoLHcpe2M9TWF0aC5taW4oYyxoKTtrPU1hdGgubWF4KGssaCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPTE7Yi5maWxsUmVjdCgwLDAscixtKTtiLmZpbGxTdHlsZT1mO2IuZmlsbFRleHQoZyhoKStcIiBcIitlK1wiIChcIitnKGMpK1wiLVwiK2coaykrXCIpXCIsdCx2KTtiLmRyYXdJbWFnZShxLGQrYSxtLG4tYSxwLGQsbSxuLWEscCk7Yi5maWxsUmVjdChkK24tYSxtLGEscCk7Yi5maWxsU3R5bGU9bDtiLmdsb2JhbEFscGhhPS45O2IuZmlsbFJlY3QoZCtuLWEsbSxhLGcoKDEtaC93KSpwKSl9fX07cmV0dXJuIGZ9KTtcbiIsImNvbnN0IHN0YXRzID0gbmV3IChyZXF1aXJlKCdzdGF0cy5qcycpKSgpO1xyXG5zdGF0cy5kb20uc3R5bGUub3BhY2l0eSA9IDAuNzU7XHJcbnN0YXRzLmRvbS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XHJcblxyXG5leHBvcnQgY2xhc3MgVGlja2VyIHtcclxuICBwcml2YXRlIHN0YXRpYyBfbGFzdFVwZGF0ZWQ6IG51bWJlciA9IDA7XHJcblxyXG4gIHN0YXRpYyBvblVwZGF0ZShmbjogRnVuY3Rpb24pIHtcclxuICAgIGNvbnN0IGZyYW1lTVMgPSAxMDAwIC8gNjA7XHJcbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICAgIGNvbnN0IGVsYXBzZWQgPSAobm93IC0gdGhpcy5fbGFzdFVwZGF0ZWQpIC8gZnJhbWVNUztcclxuICAgICAgaWYgKGVsYXBzZWQgPiAwLjcpIHtcclxuICAgICAgICB0aGlzLl9sYXN0VXBkYXRlZCA9IG5vdztcclxuICAgICAgICBzdGF0cy5iZWdpbigpO1xyXG4gICAgICAgIGZuKCk7XHJcbiAgICAgICAgTG9nZ2VyLm91dHB1dCgpO1xyXG4gICAgICAgIHN0YXRzLmVuZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcclxuICAgIH07XHJcbiAgICB1cGRhdGUoKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xyXG4gIHByaXZhdGUgc3RhdGljIF9lbDogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX21lbW86IHsgW2xhYmVsOiBzdHJpbmddOiBudW1iZXIgfCBzdHJpbmcgfSA9IHt9O1xyXG5cclxuICBzdGF0aWMgYWRkKGxhYmVsOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIgfCBzdHJpbmcpIHtcclxuICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICB0aGlzLl9tZW1vW2xhYmVsXSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNyZWF0ZSgpIHtcclxuICAgIGlmICh0aGlzLl9lbCkgcmV0dXJuO1xyXG4gICAgdGhpcy5fZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMuX2VsLmNsYXNzTGlzdC5hZGQoJ2pzX2xvZ2dlcicpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9lbCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgb3V0cHV0KCkge1xyXG4gICAgaWYgKCF0aGlzLl9lbCkgcmV0dXJuO1xyXG4gICAgY29uc3QgaHRtbCA9IE9iamVjdC5rZXlzKHRoaXMuX21lbW8pLm1hcCgoa2V5KSA9PiB7XHJcbiAgICAgIHJldHVybiBgJHtrZXl9OiAke3RoaXMuX21lbW9ba2V5XX1gO1xyXG4gICAgfSkuam9pbignPGJyPicpO1xyXG4gICAgdGhpcy5fZWwuaW5uZXJIVE1MID0gaHRtbDtcclxuICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtMb2dnZXIsIFRpY2tlcn0gZnJvbSAnLi9fdXRpbHMnO1xyXG5cclxuLy93aW5kb3fjgrXjgqTjgrrlj5blvpdcclxubGV0IF93aW5kb3dXaWR0aDpudW1iZXI7XHJcbmxldCBfd2luZG93SGVpZ2h0Om51bWJlcjtcclxuY29uc3QgcmVzaXplZCA9ICgpPT4ge1xyXG4gIF93aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gIF93aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgTG9nZ2VyLmFkZCgnd2luZG93LXdpZHRoJywgX3dpbmRvd1dpZHRoKTtcclxuICBMb2dnZXIuYWRkKCd3aW5kb3ctaGVpZ2h0JywgX3dpbmRvd0hlaWdodCk7XHJcbn1cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZWQpO1xyXG5yZXNpemVkKCk7XHJcblxyXG4vL+ODnuOCpuOCueW6p+aomeWPluW+l1xyXG5sZXQgX21vdXNlWDpudW1iZXIgPSAwO1xyXG5sZXQgX21vdXNlWTpudW1iZXIgPSAwO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcclxuICBfbW91c2VYID0gZS5jbGllbnRYIC0gKF93aW5kb3dXaWR0aCAqIDAuNSk7XHJcbiAgX21vdXNlWSA9IGUuY2xpZW50WSAtIChfd2luZG93SGVpZ2h0ICogMC41KTtcclxufSk7XHJcblxyXG5cclxuLy9cclxuY29uc3QgY3ViZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqc19jdWJlJyk7XHJcblxyXG5sZXQgeCA9IDA7XHJcbmxldCB2eCA9IDA7XHJcbmNvbnN0IGZyaWN0aW9uID0gMC43MjtcclxuLy8gY29uc3QgZnJpY3Rpb24gPSAxO1xyXG5sZXQgeSA9IDA7XHJcbmxldCB2eSA9IDA7XHJcblxyXG4vL3JlcXVlc3RBbmltYXRpb25GcmFtZe+8iDYwZnBz5Zu65a6a77yJXHJcblRpY2tlci5vblVwZGF0ZSgoKT0+IHtcclxuICBMb2dnZXIuYWRkKCdtb3VzZS14JywgX21vdXNlWCk7XHJcbiAgTG9nZ2VyLmFkZCgnbW91c2UteScsIF9tb3VzZVkpO1xyXG4gIExvZ2dlci5hZGQoJ3RpbWUnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpO1xyXG5cclxuICAvL3RvZG8g44GT44GT44Gr5q+O44OV44Os44O844Og44Gu5Yem55CG44KS5pu444GPXHJcbiAgLy8geCArPSAxO1xyXG4gIC8vIHggKz0gKF9tb3VzZVggLSB4KSAqIDAuMTtcclxuICAvLyB2eCArPSAoX21vdXNlWCAtIHgpICogMC4xO1xyXG4gIGNvbnN0IHJhZGl1cyA9IDEwMDsgLy8g5YaG6YGL5YuV44Gu5Y2K5b6EICBjb25zdCBjdWJlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzX2N1YmUnKTtcclxuICBcclxuICBsZXQgeCA9IDA7XHJcbiAgbGV0IHZ4ID0gMDtcclxuICBjb25zdCBmcmljdGlvbiA9IDAuNzI7XHJcbiAgbGV0IHkgPSAwO1xyXG4gIGxldCB2eSA9IDA7XHJcbiAgXHJcbiAgVGlja2VyLm9uVXBkYXRlKCgpID0+IHtcclxuICAgIExvZ2dlci5hZGQoJ21vdXNlLXgnLCBfbW91c2VYKTtcclxuICAgIExvZ2dlci5hZGQoJ21vdXNlLXknLCBfbW91c2VZKTtcclxuICAgIExvZ2dlci5hZGQoJ3RpbWUnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpO1xyXG4gIFxyXG4gICAgY29uc3QgcmFkaXVzID0gMTAwOyAvLyDlhobpgYvli5Xjga7ljYrlvoRcclxuICAgIGNvbnN0IHNwZWVkID0gMC4wNTsgLy8g5YaG6YGL5YuV44Gu6YCf5bqmXHJcbiAgICBjb25zdCBhbmdsZSA9IHBlcmZvcm1hbmNlLm5vdygpICogc3BlZWQ7XHJcbiAgXHJcbiAgICBjb25zdCBvZmZzZXRYID0gTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzO1xyXG4gICAgY29uc3Qgb2Zmc2V0WSA9IE1hdGguc2luKGFuZ2xlKSAqIHJhZGl1cztcclxuICAgIGNvbnN0IGRlcHRoID0gMTAwOyAvLyDlpaXooYzjgY1k44Gu56+E5ZuyXHJcbiAgICBjb25zdCBkZXB0aFNwZWVkID0gMC4wMjsgLy8g5aWl6KGM44GN44Gu6YCf5bqmXHJcbiAgICBjb25zdCBkZXB0aE9mZnNldCA9IE1hdGguc2luKGFuZ2xlICogZGVwdGhTcGVlZCkgKiBkZXB0aDtcclxuICBcclxuICAgIGlmIChNYXRoLmFicyhfbW91c2VYIC0geCkgPiAxIHx8IE1hdGguYWJzKF9tb3VzZVkgLSB5KSA+IDEpIHtcclxuICAgICAgdnggKz0gKG9mZnNldFggKyBfbW91c2VYIC0geCkgKiAwLjE7XHJcbiAgICAgIHZ5ICs9IChvZmZzZXRZICsgX21vdXNlWSAtIHkpICogMC4xO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdnggKj0gZnJpY3Rpb247XHJcbiAgICAgIHZ5ICo9IGZyaWN0aW9uO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgdnggKj0gZnJpY3Rpb247XHJcbiAgICB2eSAqPSBmcmljdGlvbjtcclxuICBcclxuICAgIHggKz0gdng7XHJcbiAgICB5ICs9IHZ5O1xyXG4gIFxyXG4gICAgaWYgKGN1YmUpIHtcclxuICAgICAgY3ViZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHt4fXB4LCAke3l9cHgsICR7ZGVwdGhPZmZzZXR9cHgpYDtcclxuICAgIH1cclxuICB9KTtcclxuICBjb25zdCBzcGVlZCA9IDAuMDU7IC8vIOWGhumBi+WLleOBrumAn+W6plxyXG4gIGNvbnN0IGFuZ2xlID0gcGVyZm9ybWFuY2Uubm93KCkgKiBzcGVlZDtcclxuXHJcblxyXG4gIGNvbnN0IG9mZnNldFggPSBNYXRoLmNvcyhhbmdsZSkgKiByYWRpdXM7XHJcbiAgY29uc3Qgb2Zmc2V0WSA9IE1hdGguc2luKGFuZ2xlKSAqIHJhZGl1cztcclxuICBjb25zdCBkZXB0aCA9IDEwMDsgLy8g5aWl6KGM44GN44Gu56+E5ZuyXHJcbiAgY29uc3QgZGVwdGhTcGVlZCA9IDAuMDI7IC8vIOWlpeihjOOBjeOBrumAn+W6plxyXG4gIGNvbnN0IGRlcHRoT2Zmc2V0ID0gTWF0aC5zaW4oYW5nbGUgKiBkZXB0aFNwZWVkKSAqIGRlcHRoO1xyXG4gIC8vIENvbWJpbmUgdGhlIHRyYW5zZm9ybWF0aW9ucyBpbnRvIGEgc2luZ2xlIHRyYW5zZm9ybSBwcm9wZXJ0eVxyXG4gIGN1YmUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7eH1weCwgJHt5fXB4LCAke2RlcHRoT2Zmc2V0fXB4KSB0cmFuc2xhdGUoJHt4fXB4LCAke3l9cHgpYDtcclxuICAvLyB2eCArPSAob2Zmc2V0WCArIF9tb3VzZVggLSB4KSAqIDAuMTtcclxuICAvLyB2eSArPSAob2Zmc2V0WSArIF9tb3VzZVkgLSB5KSAqIDAuMTtcclxuICAvLyB2eCAqPSBmcmljdGlvbjtcclxuICAvLyB4ICs9IHZ4O1xyXG4gIC8vIHZ5ICs9IChfbW91c2VZIC0geSkgKiAwLjE7XHJcbiAgdnkgKj0gZnJpY3Rpb247XHJcbiAgLy8geSArPSB2eTtcclxuXHJcblxyXG4gIGlmIChNYXRoLmFicyhfbW91c2VYIC0geCkgPiAxIHx8IE1hdGguYWJzKF9tb3VzZVkgLSB5KSA+IDEpIHtcclxuICAgIHZ4ICs9IChvZmZzZXRYICsgX21vdXNlWCAtIHgpICogMC4xO1xyXG4gICAgdnkgKz0gKG9mZnNldFkgKyBfbW91c2VZIC0geSkgKiAwLjE7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZ4ICo9IGZyaWN0aW9uO1xyXG4gICAgdnkgKj0gZnJpY3Rpb247XHJcbiAgfVxyXG5cclxuICBjdWJlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4fXB4LCAke3l9cHgpYDtcclxufSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==