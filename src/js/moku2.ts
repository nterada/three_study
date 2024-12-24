import {Logger, Ticker} from './_utils';

//windowサイズ取得
let _windowWidth:number;
let _windowHeight:number;
const resized = ()=> {
  _windowWidth = window.innerWidth;
  _windowHeight = window.innerHeight;
  Logger.add('window-width', _windowWidth);
  Logger.add('window-height', _windowHeight);
}
window.addEventListener('resize', resized);
resized();

//マウス座標取得
let _mouseX:number = 0;
let _mouseY:number = 0;
window.addEventListener('mousemove', (e) => {
  _mouseX = e.clientX - (_windowWidth * 0.5);
  _mouseY = e.clientY - (_windowHeight * 0.5);
});


//
const cube = document.getElementById('js_cube');

let x = 0;
let vx = 0;
let h = 0;
let y = 0;
let vy = 0;
// const friction = 0.72;
const friction = .45;
// const friction = .6;

//requestAnimationFrame（60fps固定）
Ticker.onUpdate(()=> {
  Logger.add('mouse-x', _mouseX);
  Logger.add('mouse-y', _mouseY);
  Logger.add('time', new Date().toISOString());

  //todo ここに毎フレームの処理を書く
  // x += 1;
  // x += (_mouseX - x) * 0.1;


  vx += (_mouseX - x) * 0.1;
  vx *= friction;
  x += vx;


  if(_mouseX < 0) {
    h += (_mouseX + h) * -0.1;
  } else {
    h += (_mouseX - h) * 0.1;
  }
  console.log(h);
  h *= friction;
  h += h;


  // vy += (_mouseY - y) * 0.1;
  // vy += (_mouseY - y) * 0.1;
  // vy *= .04;
  // y += vy;

  if(_mouseY < 0) {
    // h += (_mouseX + h) * -0.1;
    cube.style.top = `50%`;
    cube.style.background = `red`;

  } else {
    // h += (_mouseX - h) * 0.1;
    cube.style.bottom = `50%`;
    cube.style.top = `auto`;
    cube.style.background = `blue`;
  }


  cube.style.transform = `translate(${x}px, 0)`;
  cube.style.height = `${h}px`;
});
