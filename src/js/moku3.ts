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
const friction = 0.72;
// const friction = 1;
let y = 0;
let vy = 0;

//requestAnimationFrame（60fps固定）
Ticker.onUpdate(()=> {
  Logger.add('mouse-x', _mouseX);
  Logger.add('mouse-y', _mouseY);
  Logger.add('time', new Date().toISOString());

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
  
  Ticker.onUpdate(() => {
    Logger.add('mouse-x', _mouseX);
    Logger.add('mouse-y', _mouseY);
    Logger.add('time', new Date().toISOString());
  
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
    } else {
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
  } else {
    vx *= friction;
    vy *= friction;
  }

  cube.style.transform = `translate(${x}px, ${y}px)`;
});
