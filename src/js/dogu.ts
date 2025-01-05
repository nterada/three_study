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
  await app.load();
  app.init();
  app.render();
}, false);

class ThreeApp {
  /**
   * カメラ定義のための定数
   */
  static CAMERA_PARAM = {
    fovy: 60,
    aspect: window.innerWidth / window.innerHeight,
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
    width: window.innerWidth,
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

    // マウスクリックイベントを追加 @@@
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this), false);

    // グループを作成 @@@
    this.objectGroup = new THREE.Group();

    // 元の glTF オブジェクトをシーンに追加 @@@
    const numObjects = 8; // 複製するオブジェクトの数
    const radius = 5; // 円の半径
    for (let i = 0; i < numObjects; i++) {
      const clone = this.gltf.scene.clone();
      const angle = (i / numObjects) * Math.PI * 2;
      clone.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      clone.scale.set(0.2, 0.2, 0.2);

      // マテリアルを複製 @@@
      clone.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
        }
      });

      // アニメーションミキサーを設定 @@@
      const mixer = new THREE.AnimationMixer(clone);
      this.gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
      });

      this.objectGroup.add(clone);
    }

    // グループをシーンに追加 @@@
    this.scene.add(this.objectGroup);

    // 軸ヘルパー
    const axesBarLength = 5.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);

    // アニメーション時間管理のための Clock オブジェクトを生成しておく @@@
    this.clock = new THREE.Clock();

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  /**
   * アセット（素材）のロードを行う Promise
   */
  load(): Promise<void> {
    return new Promise<void>((resolve) => {
      // 読み込むファイルのパス
      const gltfPath = 'assets/data/dogu3.glb';
      const loader = new GLTFLoader();
      loader.load(gltfPath, (gltf) => {
        // glTF のロードが終わったらアニメーション関連の初期化を同時に行う @@@
        this.gltf = gltf;
        // ミキサーを生成する（scene プロパティを渡す点に注意）
        this.mixer = new THREE.AnimationMixer(this.gltf.scene);
        // アニメーション情報を取り出す
        const animations = this.gltf.animations;
        if (animations.length === 0) {
          console.error('No animations found in the glTF file.');
          resolve();
          return;
        }
        // 取り出したアニメーション情報を順番にミキサーに通してアクション化する
        this.actions = [];
        for(let i = 0; i < animations.length; ++i){
          // アクションを生成
          const action = this.mixer.clipAction(animations[i]);
          // ループ方式を設定する
          action.setLoop(THREE.LoopRepeat);
          // 再生状態にする
          action.play();
          // アクションを配列に追加
          this.actions.push(action);
        }

        // 最初のアクションのウェイトだけ 1.0 にして目に見えるようにしておく
        this.actions[0].weight = 1.0;

        resolve();
      });
    });
  }

  /**
   * マウスクリックイベントハンドラ
   * @param {MouseEvent} event
   */
  onMouseClick(event) {
    // マウス座標を正規化
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // レイキャストを設定
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 交差するオブジェクトを取得
    const intersects = this.raycaster.intersectObjects(this.objectGroup.children, true);

    // 最初に交差したオブジェクトの色を変更
    if (intersects.length > 0) {
      intersects[0].object.material.color.set(0x00ff00); // 緑色に変更
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
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // コントロールを更新
    this.controls.update();

    // レンダラーで描画
    this.renderer.render(this.scene, this.camera);
  }
}
