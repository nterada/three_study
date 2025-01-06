// = 028 ======================================================================
// glTF は、ウェブの画像で言うところの JPEG のように、ウェブで安心して利用できる
// 3D データフォーマットとして仕様策定が行われているデータ形式です。
// 仕様を策定しているのは WebGL の管理を行っている Khronos で、仕様は GitHub で
// 確認することができます。
// https://github.com/KhronosGroup/glTF
//
// glTF には仕様そのものにバージョンがあり、現状は 2.0 が主流です。
// 1.0 の頃は、ファイル拡張子が *.gltf といったものもありましたが、現在はバイナ
// リ形式の *.glb がほとんどです。
// three.js ではローダーが実装されているので、テクスチャの場合と同様にローダーを
// 利用して手軽にファイルをロード・パースすることができます。
// ============================================================================

// 必要なモジュールを読み込み
import * as THREE from '../lib/three.module.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { GLTFLoader } from '../lib/GLTFLoader.js'; // glTF のローダーを追加 @@@

window.addEventListener('DOMContentLoaded', async () => {
  const wrapper = document.querySelector('#webgl');
  const app = new ThreeApp(wrapper);
  await app.loadModels(); // loadModels に変更 @@@
  app.init();
  app.render();
  const canvas = app.renderer.domElement;
  canvas.style.width = `${window.innerWidth - 400}px`;
  canvas.style.height = `${window.innerHeight}px`;
}, false);

class ThreeApp {
  /**
   * カメラ定義のための定数
   */
  static CAMERA_PARAM = {
    fovy: 60,
    // aspect: window.innerWidth / window.innerHeight,
    aspect: (window.innerWidth - 400) / window.innerHeight, // 400px 引いた幅に基づいて計算
    near: 0.1,
    far: 50.0,
    position: new THREE.Vector3(0.0, 2.0, 10.0),
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };
  /**
   * レンダラー定義のための定数
   */
  static RENDERER_PARAM = {
    clearColor: 0xffffff,
    width: window.innerWidth - 400, // 400px 引いた幅に設定
    height: window.innerHeight,
  };
  /**
   * 平行光源定義のための定数
   */
  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    // color: 0xff00ff,
    // intensity: 1.0,
    intensity: 1.0,
    position: new THREE.Vector3(1.0, 1.0, 1.0),
  };
  /**
   * アンビエントライト定義のための定数
   */
  static AMBIENT_LIGHT_PARAM = {
    color: 0xffffff,
    // color: 0xffff00,
    // intensity: 0.1,
    intensity: 0.8,
  };
  /**
   * マテリアル定義のための定数
   */
  static MATERIAL_PARAM = {
    color: 0xffffff,
  };
  /**
   * フォグの定義のための定数
   */
  static FOG_PARAM = {
    color: 0xffffff,
    near: 15.0,
    far: 25.0,
  };

  wrapper;          // canvas の親要素
  renderer;         // レンダラ
  scene;            // シーン
  camera;           // カメラ
  directionalLight; // 平行光源（ディレクショナルライト）
  ambientLight;     // 環境光（アンビエントライト）
  controls;         // オービットコントロール
  axesHelper;       // 軸ヘルパー
  gltf;             // 読み込んだ glTF 格納用 @@@
  objectGroup;      // オブジェクトグループ @@@
  raycaster;        // レイキャスター @@@
  mouse;            // マウスベクトル @@@

  mixer;
  actions;
  clock;
  hoveredObject;    // ホバーしているオブジェクトを追跡するための変数 @@@

  /**
   * コンストラクタ
   * @constructor
   * @param {HTMLElement} wrapper - canvas 要素を append する親要素
   */
  constructor(wrapper) {
    // 初期化時に canvas を append できるようにプロパティに保持
    this.wrapper = wrapper;

    // this のバインド
    this.render = this.render.bind(this);

    // ウィンドウのリサイズを検出できるようにする
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);
  }

  /**
   * 初期化処理
   */
  init() {
    // レンダラー
    const color = new THREE.Color(ThreeApp.RENDERER_PARAM.clearColor);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(color);
    this.renderer.setSize(ThreeApp.RENDERER_PARAM.width, ThreeApp.RENDERER_PARAM.height);
    this.wrapper.appendChild(this.renderer.domElement);

    // シーン
    this.scene = new THREE.Scene();

    // フォグ
    this.scene.fog = new THREE.Fog(
      ThreeApp.FOG_PARAM.color,
      ThreeApp.FOG_PARAM.near,
      ThreeApp.FOG_PARAM.far
    );

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      ThreeApp.CAMERA_PARAM.fovy,
      ThreeApp.CAMERA_PARAM.aspect,
      ThreeApp.CAMERA_PARAM.near,
      ThreeApp.CAMERA_PARAM.far,
    );
    this.camera.position.copy(ThreeApp.CAMERA_PARAM.position);
    this.camera.lookAt(ThreeApp.CAMERA_PARAM.lookAt);

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

    // レイキャスターとマウスベクトルを初期化 @@@
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // マウスムーブイベントを追加 @@@
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this), false); // クリックイベントを追加

    // グループを作成 @@@
    this.objectGroup = new THREE.Group();

    // アニメーション時間管理のための Clock オブジェクトを生成しておく @@@
    this.clock = new THREE.Clock();

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // ホバーしているオブジェクトを追跡するための変数 @@@
    this.hoveredObject = null;

    // 3Dオブジェクトを読み込み、円状に配置 @@@
    this.loadModels().then((models) => {
      const numObjects = models.length; // 読み込んだオブジェクトの数
      const radius = 5; // 円の半径
      for (let i = 0; i < numObjects; i++) {
        const model = models[i].scene;
        const mixer = models[i].mixer;
        const angle = (i / numObjects) * Math.PI * 2;
        model.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        model.scale.set(0.2, 0.2, 0.2);
        model.rotation.y = angle + Math.PI / -6; // +30度回転させる @@@
        model.userData.mixer = mixer; // モデルにミキサーを設定
        this.objectGroup.add(model);
      }

      // グループをシーンに追加 @@@
      this.scene.add(this.objectGroup);
    });
  }

  /**
   * 複数の glTF モデルを読み込む
   * @returns {Promise<{scene: THREE.Group, mixer: THREE.AnimationMixer}[]>}
   */
  loadModels(): Promise<{scene: THREE.Group, mixer: THREE.AnimationMixer}[]> {
    const modelPaths = [
      'assets/data/dogu_dammy1.glb',
      'assets/data/dogu_dammy2.glb',
      'assets/data/dogu_dammy3.glb',
    ];
    const loader = new GLTFLoader();
    const promises = modelPaths.map((path) => {
      return new Promise<{scene: THREE.Group, mixer: THREE.AnimationMixer}>((resolve, reject) => {
        loader.load(path, (gltf) => {
          const mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });
          resolve({scene: gltf.scene, mixer: mixer});
        }, undefined, reject);
      });
    });
    return Promise.all(promises);
  }

  /**
   * マウスムーブイベントハンドラ
   * @param {MouseEvent} event
   */
  onMouseMove(event) {
    // マウス座標を正規化
    // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.x = (event.clientX / (window.innerWidth - 400)) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // レイキャストを設定
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 交差するオブジェクトを取得
    const intersects = this.raycaster.intersectObjects(this.objectGroup.children, true);

    // 最初に交差したオブジェクトを追跡
    if (intersects.length > 0) {
      this.hoveredObject = intersects[0].object.parent; // 親の Group を取得
    } else {
      this.hoveredObject = null;
    }
  }

  /**
   * マウスクリックイベントハンドラ
   * @param {MouseEvent} event
   */

  onMouseClick(event) {
    // console.log('クリックイベント発火'); // デバッグ用ログ

    // マウス座標を正規化
    this.mouse.x = (event.clientX / (window.innerWidth - 400)) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // レイキャストを設定
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 交差するオブジェクトを取得
    const intersects = this.raycaster.intersectObjects(this.objectGroup.children, true);

    // 最初に交差したオブジェクトの色を変更
    if (intersects.length > 0) {
      intersects[0].object.material.color.set(0x00ff00); // 緑色に変更
      // console.log('クリックされました');

      // すべての modalListItem から ._show クラスを削除
      const modalListItems = document.querySelectorAll('.modalListItem');
      modalListItems.forEach(item => item.classList.remove('_show'));

      // 交差したオブジェクトに対応する modalListItem に ._show クラスを付与
      const intersectedObject = intersects[0].object.parent || intersects[0].object;
      const index = this.objectGroup.children.indexOf(intersectedObject);
      // console.log('交差したオブジェクト:', intersectedObject); // デバッグ用ログ
      // console.log('交差したオブジェクトのインデックス:', index); // デバッグ用ログ
      if (index !== -1 && modalListItems[index]) {
        // console.log('対応する modalListItem:', modalListItems[index]); // デバッグ用ログ
        modalListItems[index].classList.add('_show');
      } else {
        console.log('対応する modalListItem が見つかりません'); // デバッグ用ログ
      }
    } else {
      console.log('交差するオブジェクトが見つかりません'); // デバッグ用ログ
    }
  }


  /**
   * 描画処理
   */
  render() {
    // 恒常ループ
    requestAnimationFrame(this.render);

    // グループを回転させる @@@
    if (this.objectGroup) {
      this.objectGroup.rotation.y -= 0.001; // Y軸回転
    }

    // 前回からの経過時間（デルタ）を取得してミキサーに適用する @@@
    const delta = this.clock.getDelta();
    if (this.hoveredObject && this.hoveredObject.userData.mixer) {
      this.hoveredObject.userData.mixer.update(delta);
    }

    // コントロールを更新
    this.controls.update();

    // レンダラーで描画
    this.renderer.render(this.scene, this.camera);
  }
}
