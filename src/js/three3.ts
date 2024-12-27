import * as THREE from '../lib/three.module.js';
import { OrbitControls } from '../lib/OrbitControls.js';

//windowサイズ取得
let _windowWidth;
let _windowHeight;
const resized = () => {
  _windowWidth = window.innerWidth;
  _windowHeight = window.innerHeight;
}
window.addEventListener('resize', resized);
resized();

//マウス座標取得
let _mouseX = 0;
let _mouseY = 0;
window.addEventListener('mousemove', (e) => {
  _mouseX = e.clientX - (_windowWidth * 0.5);
  _mouseX = _mouseX * 0.1;
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
    far: 100.0,
    position: new THREE.Vector3(0.0, 2.0, 10.0),
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };

  static RENDERER_PARAM = {
    clearColor: 0x666666,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  static MATERIAL_PARAM = {
    color: 0xffffff,
  };

  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1.0,
    position: new THREE.Vector3(20.0, 10.0, 10.0),
  };

  static SPOT_LIGHT_PARAM = {
    color: 0xf00000,
    intensity: 0.1,
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
  groupCopies;
  // render;

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

    this.render = this.render.bind(this);


    // シーン
    this.scene = new THREE.Scene();

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      ThreeApp.CAMERA_PARAM.fovy,
      ThreeApp.CAMERA_PARAM.aspect,
      ThreeApp.CAMERA_PARAM.near,
      ThreeApp.CAMERA_PARAM.far,
    );
    this.camera.position.set(10, 10, 30);
    this.camera.lookAt(ThreeApp.CAMERA_PARAM.lookAt);

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // ライト
    this.directionalLight = new THREE.DirectionalLight(
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.color,
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.copy(ThreeApp.DIRECTIONAL_LIGHT_PARAM.position);
    this.scene.add(this.directionalLight);

    this.spotlight = new THREE.SpotLight(
      ThreeApp.SPOT_LIGHT_PARAM.color,
      ThreeApp.SPOT_LIGHT_PARAM.intensity
    );
    this.scene.add(this.spotlight);
    this.spotlight.position.set(0, 10, 0);
    this.spotlight.angle = Math.PI / 5;
    this.spotlight.penumbra = 0.2;
    this.spotlight.decay = 2;
    this.spotlight.distance = 8;

    // 軸ヘルパー
    const axesBarLength = 5.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);

    // グリッドヘルパー
    this.gridHelper = new THREE.GridHelper(100, 50);
    this.scene.add(this.gridHelper);

    // オブジェクト
    this.geometry = new THREE.SphereGeometry(1, 32, 32);
    this.material = new THREE.MeshPhongMaterial(ThreeApp.MATERIAL_PARAM);
    this.box = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.box);

    this.planeGeo = new THREE.PlaneGeometry(100, 100, 50, 50);
    this.plane = new THREE.Mesh(this.planeGeo, this.material);
    this.scene.add(this.plane);
    this.plane.rotation.set(-Math.PI / 2, 0, 0);

    this.clock = new THREE.Clock();

    // グループ
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // 複製された group を格納する配列
    this.groupCopies = [];

    // 球体の作成
    const radius = 5;
    const numSpheres = 8;
    this.spheres = [];

    for (let i = 0; i < numSpheres; i++) {
      const angle = (i / numSpheres) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      // const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x3399ff });

      const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
      const sphereMaterial = new THREE.MeshPhongMaterial({ color: randomColor });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      sphere.position.set(x, 1, z);
      this.group.add(sphere);
      this.group.add(this.box);
      this.spheres.push(sphere);
    }

    this.group.add(this.box);
    // グループの複製
    for (let i = 0; i < 10; i++) {
      const groupCopy = this.group.clone();
      groupCopy.position.y = i * 5;
      this.scene.add(groupCopy);
      this.groupCopies.push(groupCopy);  // 複製した group を配列に追加
      this.groupCopies.push(this.group);  //オリジナルもいれた
    }

    // その他の初期化
    this.sphere = new THREE.Mesh(this.geometry, this.material);
  }

  render() {
    requestAnimationFrame(this.render);
    const time = this.clock.getElapsedTime();

    // 複製した group 内の sphere にアニメーションを適用
    this.groupCopies.forEach((groupCopy, index)=> {
      groupCopy.children.forEach((sphere, index) => {
        if (sphere instanceof THREE.Mesh && sphere.geometry instanceof THREE.SphereGeometry) {
          // sphere.position.y = index * (Math.sin(time * 0.4) + 1) + 1;
          // sphere.rotation.x += 0.01;
          // sphere.rotation.y -= 0.01;
          // sphere.rotation.z -= 0.005;
        }
      });


      // groupCopy.position.y = index * (Math.sin(time * 0.4) + 1) + 1;
      // groupCopy.rotation.x += 0.01;
      // groupCopy.rotation.y -= 0.01;
      // groupCopy.rotation.z -= 0.005;

    });

    // メインの箱（box）のアニメーション
    // this.box.position.y = 1 * (Math.sin(time * 0.4) + 1) + 1;
    // this.box.rotation.x += 0.01;
    // this.box.rotation.y -= 0.01;
    // this.box.rotation.z -= 0.005;

    // コントロールを更新
    this.controls.update();

    // シーンをレンダリング
    this.renderer.render(this.scene, this.camera);
  }
}
