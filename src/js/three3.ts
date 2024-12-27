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
    fovy: 70, //視野角
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    // far: 20.0,
    far: 100.0,
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
    // color: 0x3399ff, // マテリアルの基本色
    color: 0xffffff, // マテリアルの基本色
  };


  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,                            // 光の色
    intensity: 1.0,                             // 光の強度
    // position: new THREE.Vector3(2.0, 2.0, 2.0), // 光の向き
    position: new THREE.Vector3(20.0, 10.0, 10.0), // 光の向き
  };

  static AMBIENT_LIGHT_PARAM = {
    // color: 0xffffff, // 光の色
    color: 0xffffff, // 光の色
    intensity: 0.1,  // 光の強度
  };

  static SPOT_LIGHT_PARAM = {
    // color: 0xffffff, // 光の色
    // color:  0xf0f0f0, // 光の色
    color:  0xf00000, // 光の色
    // intensity: 0.1,  // 光の強度
    intensity: 0.1,  // 光の強度
  };



  x: number = 0.0;
  vx: number = 0.0;
  // friction: number = 0.95;  // 摩擦（0.95は少しスムーズな減速）
  friction: number = 0.95;  // 摩擦（0.95は少しスムーズな減速）
  // friction: number = 0.55;  // 摩擦（0.95は少しスムーズな減速）

  planeGeo;
  clock;
  box;
  boxArray
  geometry;
  plane;
  arrowHelper;
  lighthelper;
  spotlight;


  sphere
  group;
  spheres;


  spotLightHelper;
  hemisphereLight;


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
    // this.camera.position.copy(ThreeApp.CAMERA_PARAM.position);
    this.camera.position.set(10, 10, 30);
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
    // this.ambientLight = new THREE.AmbientLight(
    //   ThreeApp.AMBIENT_LIGHT_PARAM.color,
    //   ThreeApp.AMBIENT_LIGHT_PARAM.intensity,
    // );
    // this.scene.add(this.ambientLight);



    this.spotlight = new THREE.SpotLight(
      ThreeApp.SPOT_LIGHT_PARAM.color,
      ThreeApp.SPOT_LIGHT_PARAM.intensity
    );

    this.scene.add(this.spotlight);
    // this.spotlight.position.set( 10, 20, 20 )

    this.spotlight.position.set( 10, 20, 20 );  // スポットライトの位置
    this.spotlight.position.set( 0, 10, 0 );  // スポットライトの位置
    // this.spotlight.target.position.set( 0, 0, 0 );  // スポットライトのターゲット（照らす位置）
    // this.scene.add(this.spotlight.target);

    this.spotlight.angle = Math.PI / 5; // 光の広がり角度（45度）
    this.spotlight.penumbra = 0.2;  // 光の端のぼかし具合
    this.spotlight.decay = 2;  // 減衰
    // this.spotlight.decay = 10;  // 減衰
    this.spotlight.distance = 8;

    const spotLightHelper = new THREE.SpotLightHelper( this.spotlight );
    this.scene.add( spotLightHelper );


    //軸ヘルパー
    const axesBarLength = 5.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);

    // const gridHelperLength = 5.0;
    this.gridHelper = new THREE.GridHelper(100,50);
    this.scene.add(this.gridHelper);

    // this.lighthelper = new THREE.DirectionalLightHelper( this.directionalLight, 1 );
    // this.scene.add( this.lighthelper );




  // // GridHelper
  // const gridHelper = new THREE.GridHelper(200, 10);
  // scene.add(gridHelper);


    // // オブジェクト




    this.geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    this.geometry = new THREE.SphereGeometry(1, 32, 32);

    // this.material = new THREE.MeshBasicMaterial(ThreeApp.MATERIAL_PARAM);
    this.material = new THREE.MeshPhongMaterial(ThreeApp.MATERIAL_PARAM);
    // this.material = new THREE.MeshStandardMaterial(ThreeApp.MATERIAL_PARAM);
    this.box = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.box);


    this.planeGeo = new THREE.PlaneGeometry( 100, 100, 50, 50 );
    this.plane = new THREE.Mesh(this.planeGeo, this.material);
    this.scene.add(this.plane);
    this.plane.rotation.set( -Math.PI/2, 0, 0 )

    this.clock = new THREE.Clock();


    this.group = new THREE.Group();

    this.scene.add(this.group);





    const radius = 5; // 円の半径
    const numSpheres = 8; // 配置する球体の数


    this.spheres = [];

    for (let i = 0; i < numSpheres; i++) {
      const angle = (i / numSpheres) * Math.PI * 2; // 角度を均等に分ける
      console.log(angle);
      const x = radius * Math.cos(angle); // x座標
      const z = radius * Math.sin(angle); // z座標

      // 球体のジオメトリ
      const sphereGeometry = new THREE.SphereGeometry(.3, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x3399ff }); // 色を変更することもできます
      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // 球体の位置を設定
      this.sphere.position.set(x, 1, z); // 高さyは1に設定

      // シーンに追加
      this.scene.add(this.sphere);
      this.group.add(this.sphere);  // ここでグループに追加
      this.spheres.push(this.sphere); // 配列に追加
    }

    console.log(this.spheres);

    this.scene.add(this.spheres);

    this.group.add(this.box);
    this.group.add(this.spheres);



    for (let i = 0; i < 10; i++) {
      const groupCopy = this.group.clone(); // groupを複製

      // 各複製の位置を調整（y軸方向に5単位ずつずらす）
      groupCopy.position.y = i * 5;  // 例えば、y軸方向に5単位ずつ配置

      // 複製したgroupをシーンに追加
      this.scene.add(groupCopy);
    }





    // for (let i = 0; i < 10; i++) {
    //   const groupCopy = this.group.clone(); // groupを複製

    //   // 各複製の位置を調整（y軸方向に5単位ずつずらす）
    //   groupCopy.position.y = i * 5;  // 例えば、y軸方向に5単位ずつ配置

    //   // 複製したgroupをシーンに追加
    //   this.scene.add(groupCopy);

    //   // 複製されたgroup内の各sphereにアニメーションを適用
    //   for (let j = 0; j < groupCopy.children.length; j++) {
    //     const child = groupCopy.children[j];
    //     if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
    //       // ここでアニメーション処理を適用
    //       child.position.y = j * (Math.sin(this.clock.getElapsedTime() * 0.4) + 1) + 1;
    //       child.rotation.x += 0.01;
    //       child.rotation.y -= 0.01;
    //       child.rotation.z -= 0.005;
    //     }
    //   }
    // }






  }


  render() {
    requestAnimationFrame(this.render);

    const time = this.clock.getElapsedTime();
    // console.log(time);


    this.box.position.y = 1 * (Math.sin(time * .4) + 1) + 1
    this.box.rotation.x += .01
    this.box.rotation.y -= .01
    this.box.rotation.z -= .005




    for (let i = 0; i < this.spheres.length; i++) {
      const sphere = this.spheres[i];

      // 各球体の位置と回転をアニメーション
      sphere.position.y = i * (Math.sin(time * 0.4) + 1) + 1;
      sphere.rotation.x += 0.01;
      sphere.rotation.y -= 0.01;
      sphere.rotation.z -= 0.005;
    }


    // this.spheres.position.y = 1 * (Math.sin(time * .4) + 1) + 1
    // this.spheres.rotation.x += .01
    // this.spheres.rotation.y -= .01
    // this.spheres.rotation.z -= .005


    // this.group.position.y = 1 * (Math.sin(time * .4) + 1) + 1
    // this.group.rotation.x += .01
    // this.group.rotation.y -= .008
    // this.group.rotation.z -= .005



    // this.scene.children.forEach(group => {
    //   if (group instanceof THREE.Group) {
    //     // group内の各sphereをアニメーション
    //     group.children.forEach(child => {
    //       if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
    //         child.position.y = 1 * (Math.sin(time * 0.4) + 1) + 1;
    //         child.rotation.x += 0.01;
    //         child.rotation.y -= 0.01;
    //         child.rotation.z -= 0.005;
    //       }
    //     });
    //   }
    // });









    // コントロールを更新
    this.controls.update();

    // シーンをレンダリング
    this.renderer.render(this.scene, this.camera);
  }
}


