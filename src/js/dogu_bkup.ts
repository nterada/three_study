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
  await app.loadBaseModel(); // loadModels に変更 @@@
  await app.load(); // ポイントスプライトの読み込み
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
    // fovy: 60,
    fovy: 40,
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
    // clearColor: 0xfcfce2,
    clearColor: 0xc9b9a8,
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



  static SPOT_LIGHT_PARAM = {
    color: 0xF067A6,
    intensity: 1,
    distance: 10,
    angle: Math.PI / 4,
    penumbra: 0.1,
    decay: 1,
    position: new THREE.Vector3(0, 10, 0), // 中央の真上に設定
    targetPosition: new THREE.Vector3(0, 0, 0), // 中央を照らすように設定
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
  spotLight;
  spotLightHelper;
  baseModel;
  texture;
  points;
  opacityDirection = 1;  // 点滅の方向（増加・減少）
  fadeSpeed = 1;  // 点滅の速さ

  /**
   * コンストラクタ
   * @constructor
   * @param {HTMLElement} wrapper - canvas 要素を append する親要素
   */
  constructor(wrapper) {
    // 初期化時に canvas を append できるようにプロパティに保持
    this.wrapper = wrapper;

    this.opacityDirection = 1;  // 点滅の方向（増加・減少）
    this.fadeSpeed = 1;  // 点滅の速さ

    // this のバインド
    this.render = this.render.bind(this);

    // ウィンドウのリサイズを検出できるようにする
    window.addEventListener('resize', () => {
      this.renderer.setSize((window.innerWidth - 400), window.innerHeight);
      this.camera.aspect = (window.innerWidth - 400) / window.innerHeight;
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
    // this.scene.fog = new THREE.Fog(
    //   ThreeApp.FOG_PARAM.color,
    //   ThreeApp.FOG_PARAM.near,
    //   ThreeApp.FOG_PARAM.far
    // );

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




      // ポイントスプライトをシーンに追加
  if (this.texture) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

      // ランダムな位置を生成
  for (let i = 0; i < 200; i++) {
    let x, y, z;
    do {
      x = (Math.random() - 0.5) * 20; // -10から10の範囲でランダム
      y = (Math.random() - 0.5) * 20; // -10から10の範囲でランダム
      z = (Math.random() - 0.5) * 20; // -10から10の範囲でランダム
    } while (Math.sqrt(x * x + y * y + z * z) < 2.0); // 半径2.0以内を避ける

    vertices.push(x, y, z);
  }


    // const vertices = new Float32Array([
    //   -1.0, -1.0, 0.0,
    //    1.0, -1.0, 0.0,
    //    1.0,  1.0, 0.0,
    //   -1.0,  1.0, 0.0,

    //       // 追加のポイント
    //  2.0,  2.0, 0.0,
    //  -2.0, -2.0, 0.0,
    //   3.0,  3.0, 0.0,
    //  -3.0, -3.0, 0.0,


    //  2.1,  2.1, 0.0,
    //  -2.1, -2.0, 0.0,
    //   3.0,  3.0, 0.0,
    //  -3.0, -3.0, 0.0,
    // ]);
    // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      // size: 1.0,
      size: 1.0,
      map: this.texture,
      transparent: true,
      opacity: 1.0,  // 初期の不透明度
    });
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }




    // // スポットライトを追加
    // this.spotLight = new THREE.SpotLight(
    //   ThreeApp.SPOT_LIGHT_PARAM.color,
    //   ThreeApp.SPOT_LIGHT_PARAM.intensity,
    //   ThreeApp.SPOT_LIGHT_PARAM.distance,
    //   // ThreeApp.SPOT_LIGHT_PARAM.angle,
    //   // ThreeApp.SPOT_LIGHT_PARAM.penumbra,
    //   ThreeApp.SPOT_LIGHT_PARAM.decay
    // );
    // this.spotLight.position.copy(ThreeApp.SPOT_LIGHT_PARAM.position);
    // this.spotLight.target.position.copy(ThreeApp.SPOT_LIGHT_PARAM.targetPosition);
    // this.scene.add(this.spotLight);
    // this.scene.add(this.spotLight.target); // ターゲットをシーンに追加

    // // スポットライトヘルパーを追加
    // this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    // this.scene.add(this.spotLightHelper);


  // 仮の地面を追加


  // const planeGeometry = new THREE.PlaneGeometry(20, 20);
  // const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // plane.rotation.x = -Math.PI / 2; // 地面を水平に設定
  // this.scene.add(plane);


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

    // 土台モデルを読み込んで表示
    this.loadBaseModel().then((model) => {
      this.baseModel = model.scene;
      this.baseModel.position.set(0, 0, 0); // 土台モデルの位置を設定
      this.scene.add(this.baseModel);

    });

    // 3Dオブジェクトを読み込み、円状に配置 @@@
    this.loadModels().then((models) => {
      const numObjects = models.length; // 読み込んだオブジェクトの数
      const radius = 3; // 円の半径
      for (let i = 0; i < numObjects; i++) {
        const model = models[i].scene;
        const mixer = models[i].mixer;
        const angle = (i / numObjects) * Math.PI * 2;
        model.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        model.scale.set(0.2, 0.2, 0.2);
        // model.rotation.y = angle + Math.PI / -6; // +30度回転させる @@@
        model.userData.mixer = mixer; // モデルにミキサーを設定



    // モデルごとの位置を微調整
    switch (i) {
      case 0:
        model.position.y += .2; // 例: モデル0のx座標を0.5増加
        // model.rotation.y += .2; // 例: モデル0のx座標を0.5増加
        model.rotation.y =  angle + Math.PI / -1;  // +30度回転させる @@@
        model.rotation.y = angle + Math.PI / -6; // +30度回転させる @@@
        // model.position.y += 0.2; // 例: モデル0のy座標を0.2増加
        break;
        case 1:
          // model.position.z -= 0; // 例: モデル1のx座標を0.3減少
          model.position.y -= -0.25;
          // model.position.z += 0.4; // 例: モデル1のz座標を0.4増加
          model.rotation.y = angle + Math.PI / 6; // +30度回転させる @@@
        break;
        case 2:
            model.position.y -= 0.25; // 例: モデル2のy座標を0.1減少
            model.rotation.y = angle + Math.PI / -6; // +30度回転させる @@@
        // model.position.y -= 0.1; // 例: モデル2のy座標を0.1減少
        // model.position.z -= 0.2; // 例: モデル2のz座標を0.2減少
        break;
        case 3:
          model.position.y -= 0.25; // 例: モデル2のy座標を0.1減少
          model.rotation.y = angle + Math.PI / -6; // +30度回転させる @@@
      // model.position.y -= 0.1; // 例: モデル2のy座標を0.1減少
      // model.position.z -= 0.2; // 例: モデル2のz座標を0.2減少
        break;
      // 他のモデルも同様に微調整
    }



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
      'assets/data/hart-3.glb',
      'assets/data/doguneko-3.glb',
      'assets/data/hart-4.glb',
      'assets/data/reforet4_2_2.glb',
      'assets/data/hart-5.glb',
      'assets/data/dogu_dammy1.glb',
      'assets/data/hart-6.glb',
      'assets/data/dogu_dammy1.glb',
      'assets/data/reforet4_2.glb',
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
   * 土台の glTF モデルを読み込む
   * @returns {Promise<{scene: THREE.Group, mixer: THREE.AnimationMixer}>}
   */
    loadBaseModel(): Promise<{scene: THREE.Group, mixer: THREE.AnimationMixer}> {
      const baseModelPath = 'assets/data/dodai-5.glb';
      const loader = new GLTFLoader();
      return new Promise<{scene: THREE.Group, mixer: THREE.AnimationMixer}>((resolve, reject) => {
        loader.load(baseModelPath, (gltf) => {
          const mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });
          resolve({scene: gltf.scene, mixer: mixer});
        }, undefined, reject);
      });
    }


    /**
 * ポイントスプライト用のテクスチャを読み込む
 * @returns {Promise<void>}
 */
load(): Promise<void> {
  return new Promise<void>((resolve) => {
    const imagePath = 'assets/img/pen_2.png';
    const loader = new THREE.TextureLoader();
    loader.load(imagePath, (texture) => {
      this.texture = texture;
      resolve();
    });
  });
}



      /**
   * ポイントスプライト用
   */
  // load() {
  //   return new Promise((resolve) => {
  //     const imagePath = './star.png';
  //     const loader = new THREE.TextureLoader();
  //     loader.load(imagePath, (texture) => {
  //       this.texture = texture;
  //       resolve();
  //     });
  //   });
  // }

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


    const mouseVector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5).unproject(this.camera);
  // オブジェクトのバウンディングボックスを拡大してヒットエリアを設定
  this.objectGroup.children.forEach((child) => {
    const box = new THREE.Box3().setFromObject(child);
    const expandedBox = box.clone().expandByScalar(50 * (box.max.x - box.min.x) / (window.innerWidth - 400));

    if (expandedBox.containsPoint(mouseVector)) {
      this.hoveredObject = child;
    }
  });
  }

  /**
   * マウスクリックイベントハンドラ
   * @param {MouseEvent} event
   */

  onMouseClick(event) {
    console.log('クリックイベント発火'); // デバッグ用ログ

    // マウス座標を正規化
    this.mouse.x = (event.clientX / (window.innerWidth - 400)) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // レイキャストを設定
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 交差するオブジェクトを取得
    const intersects = this.raycaster.intersectObjects(this.objectGroup.children, true);

    // すべての modalListItem から ._show クラスを削除
    const modalListItems = document.querySelectorAll('.modalListItem');
    modalListItems.forEach(item => item.classList.remove('_show'));

    // 最初に交差したオブジェクトの色を変更
    if (intersects.length > 0) {
      intersects[0].object.material.color.set(0x00ff00); // 緑色に変更
      console.log('クリックされました');

      // 交差したオブジェクトに対応する modalListItem に ._show クラスを付与
      const intersectedObject = intersects[0].object.parent || intersects[0].object;
      const index = this.objectGroup.children.indexOf(intersectedObject);
      console.log('交差したオブジェクト:', intersectedObject); // デバッグ用ログ
      console.log('交差したオブジェクトのインデックス:', index); // デバッグ用ログ
      if (index !== -1 && modalListItems[index]) {
        console.log('対応する modalListItem:', modalListItems[index]); // デバッグ用ログ
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

    // グループを回転させる @@@
    if (this.baseModel) {
      this.baseModel.rotation.y -= 0.001; // Y軸回転
    }

    // 前回からの経過時間（デルタ）を取得してミキサーに適用する @@@
    const delta = this.clock.getDelta();
    if (this.hoveredObject && this.hoveredObject.userData.mixer) {
      this.hoveredObject.userData.mixer.update(delta);
    }

    
    // // 点滅の計算（opacityが0と1の間で変化）
    // this.points.material.opacity += this.opacityDirection * this.fadeSpeed * delta;

    // // opacityが0または1に達したら、増減方向を反転
    // if (this.points.material.opacity >= 1.0 || this.points.material.opacity <= 0.0) {
    //   this.opacityDirection *= -1;
    // }


      // 点滅処理: opacity を増減させる
  if (this.points) {
    // 現在の opacity を取得
    let opacity = this.points.material.opacity;

    // 点滅処理 (増加または減少)
    opacity += this.opacityDirection * this.fadeSpeed * delta; 

    // opacity の範囲を 0 と 1 の間に制限
    if (opacity >= 1.0) {
      opacity = 1.0;
      this.opacityDirection = -1; // 透明度が 1 になったら減少方向に変更
    } else if (opacity <= 0.0) {
      opacity = 0.0;
      this.opacityDirection = 1; // 透明度が 0 になったら増加方向に変更
    }

    // 新しい opacity を設定
    this.points.material.opacity = opacity;
  }

    // コントロールを更新
    this.controls.update();

    // レンダラーで描画
    this.renderer.render(this.scene, this.camera);
  }
}




