// import {Logger, Ticker} from './_utils';
import * as THREE from '../lib/three.module.js';
import { OrbitControls } from '../lib/OrbitControls.js';



//windowサイズ取得
let _windowWidth:number;
let _windowHeight:number;
const resized = ()=> {
  _windowWidth = window.innerWidth;
  _windowHeight = window.innerHeight;
  // Logger.add('window-width', _windowWidth);
  // Logger.add('window-height', _windowHeight);
}
window.addEventListener('resize', resized);
resized();

//マウス座標取得
let _mouseX:number = 0;
let _mouseY:number = 0;
window.addEventListener('mousemove', (e) => {
  _mouseX = e.clientX - (_windowWidth * 0.5);
  _mouseX = _mouseX *  0.1;
  _mouseY = e.clientY - (_windowHeight * 0.5);
});




window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('#webgl');
  const app = new ThreeApp(wrapper);
  app.render();
}, false);



class ThreeApp {
  static CAMERA_PARAM = {
    // fovy は Field of View Y のことで、縦方向の視野角を意味する
    fovy: 70, //視野角
    // 描画する空間のアスペクト比（縦横比）
    aspect: window.innerWidth / window.innerHeight,
    // 描画する空間のニアクリップ面（最近面）
    near: 0.1,
    // 描画する空間のファークリップ面（最遠面）
    // far: 20.0,
    far: 60.0,
    // カメラの座標
    position: new THREE.Vector3(0.0, 2.0, 10.0),
    // カメラの注視点
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };

  static RENDERER_PARAM = {
    clearColor: 0x666666,       // 画面をクリアする色
    width: window.innerWidth,   // レンダラーに設定する幅
    height: window.innerHeight, // レンダラーに設定する高さ
  };

  static MATERIAL_PARAM = {
    color: 0x3399ff, // マテリアルの基本色
  };


  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,                            // 光の色
    intensity: 1.0,                             // 光の強度
    position: new THREE.Vector3(2.0, 2.0, 2.0), // 光の向き
  };

  static AMBIENT_LIGHT_PARAM = {
    color: 0xffffff, // 光の色
    intensity: 0.1,  // 光の強度
  };



  x: number = 0.0;
  vx: number = 0.0;
  // friction: number = 0.95;  // 摩擦（0.95は少しスムーズな減速）
  friction: number = 0.95;  // 摩擦（0.95は少しスムーズな減速）
  // friction: number = 0.55;  // 摩擦（0.95は少しスムーズな減速）

  box;
  boxArray
  geometry;
  arrowHelper;
  lighthelper;



  renderer;         // レンダラ
  scene;            // シーン
  camera;           // カメラ
  directionalLight; // 平行光源（ディレクショナルライト）
  ambientLight;     // 環境光（アンビエントライト）
  material;         // マテリアル
  torusGeometry;    // トーラスジオメトリ
  torusArray;       // トーラスメッシュの配列 @@@
  controls;         // オービットコントロール
  axesHelper;       // 軸ヘルパー
  gridHelper;
  isDown;           // キーの押下状態用フラグ


    /**
   * コンストラクタ
   * @constructor
   * @param {HTMLElement} wrapper - canvas 要素を append する親要素
   */
  constructor(wrapper) {

    // レンダラー
    const color = new THREE.Color(ThreeApp.RENDERER_PARAM.clearColor);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(color);
    this.renderer.setSize(ThreeApp.RENDERER_PARAM.width, ThreeApp.RENDERER_PARAM.height);
    wrapper.appendChild(this.renderer.domElement);

    // シーン
    this.scene = new THREE.Scene();


    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      ThreeApp.CAMERA_PARAM.fovy,
      ThreeApp.CAMERA_PARAM.aspect,
      ThreeApp.CAMERA_PARAM.near,
      ThreeApp.CAMERA_PARAM.far,
    );
    this.camera.position.copy(ThreeApp.CAMERA_PARAM.position);
    this.camera.lookAt(ThreeApp.CAMERA_PARAM.lookAt);

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // this のバインド
    this.render = this.render.bind(this);

    // ディレクショナルライト（平行光源）
    this.directionalLight = new THREE.DirectionalLight(
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.color,
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.copy(ThreeApp.DIRECTIONAL_LIGHT_PARAM.position);
    this.scene.add(this.directionalLight);

    // アンビエントライト（環境光）
    this.ambientLight = new THREE.AmbientLight(
      ThreeApp.AMBIENT_LIGHT_PARAM.color,
      ThreeApp.AMBIENT_LIGHT_PARAM.intensity,
    );
    this.scene.add(this.ambientLight);







    //軸ヘルパー
    const axesBarLength = 5.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);

    // const gridHelperLength = 5.0;
    this.gridHelper = new THREE.GridHelper(100,50);
    this.scene.add(this.gridHelper);

    this.lighthelper = new THREE.DirectionalLightHelper( this.directionalLight, 1 );
    this.scene.add( this.lighthelper );



  // // GridHelper
  // const gridHelper = new THREE.GridHelper(200, 10);
  // scene.add(gridHelper);


    // // オブジェクト
    this.geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    // this.material = new THREE.MeshBasicMaterial(ThreeApp.MATERIAL_PARAM);
    this.material = new THREE.MeshPhongMaterial(ThreeApp.MATERIAL_PARAM);
    // this.box = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.box);


    const Count = 100;
    this.boxArray = [];
    // const transformScale = 5.0;
    const transformScale = 1.0;
     for (let i = 0; i < Count; ++i) {
      const box = new THREE.Mesh(this.geometry, this.material);
      // box.position.z = (Math.random() * 2.0 - 1.0) * transformScale;
      box.position.y = i * transformScale;
      this.scene.add(box);
      //   this.scene.add(torus);
      this.boxArray.push(box);
     }


    // const torusCount = 100;
    // const transformScale = 5.0;
    // // this.torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 8, 16);
    // this.geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    // this.torusArray = [];
    // for (let i = 0; i < torusCount; ++i) {
    //   // トーラスメッシュのインスタンスを生成
    //   const torus = new THREE.Mesh(this.geometry, this.material);
    //   // box = new THREE.Mesh(this.geometry, this.material);
    //   // 座標をランダムに散らす
    //   // torus.position.x = (Math.random() * 2.0 - 1.0) * transformScale;
    //   // torus.position.y = (Math.random() * 2.0 - 1.0) * transformScale;
    //   // torus.position.z = (Math.random() * 2.0 - 1.0) * transformScale;



    //   torus.position.z = (Math.random() * 2.0 - 1.0) * transformScale;
    //   // シーンに追加する
    //   this.scene.add(torus);
    //   // 配列に入れておく
    //   this.torusArray.push(torus);
    // }

  }



  // render() {
  //   requestAnimationFrame(this.render);

  //   // コントロールを更新
  //   this.controls.update();

  //   this.renderer.render(this.scene, this.camera);
  // }


  render() {
    requestAnimationFrame(this.render);

    // マウスの動きに基づいて速度と位置を更新
    const moveFactorX = 0.1; // 左右の動きの強さ（調整可能）

    // 速度の更新（マウスの位置と現在の位置の差分に基づく）
    // console.log(_mouseX);
    // this.vx += (_mouseX - this.x) * moveFactorX;   // x軸の速度を計算
    // this.vx *= this.friction;                      // 摩擦を適用して減速
    // this.x += this.vx;                             // 位置を更新

    // // 更新した位置をカメラやオブジェクトに適用
    // this.box.position.x = this.x;



    for (let i = 0; i < this.boxArray.length; i++) {
      // console.log(this.boxArray[i]);
      // console.log(_mouseX);
      this.vx += (_mouseX - this.x) * moveFactorX;   // x軸の速度を計算
      this.vx *= this.friction;                      // 摩擦を適用して減速
      this.x += this.vx;
      this.boxArray[i].position.x = this.x;
      // this.boxArray[i].position.x = (Math.random() * 2.0 - 1.0) * this.x;
      // this.boxArray[i].position.y = this.x;
      // this.boxArray[i].position.z = (Math.random() * 2.0 - 1.0) * this.x;
    }

    // this.box.position.x = this.x;




    // this.box.position.y = -_mouseY * 0.1 + 2.0; // Y軸はそのままマウスで調整
    // this.box.lookAt(this.scene.position);       // 常にシーンの中心を見つめる

    // コントロールを更新
    this.controls.update();

    // シーンをレンダリング
    this.renderer.render(this.scene, this.camera);
  }
}


