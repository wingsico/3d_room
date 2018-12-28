if (module.hot) {
  // 实现热更新
  module.hot.accept();
}

/**
 * 注入
 */
require('./lib/ThreeBSP.js')
require('imports-loader?THREE=three!three/examples/js/loaders/GLTFLoader');
require('imports-loader?THREE=three!three/examples/js/modifiers/SubdivisionModifier');

var renderer; // 渲染器
var camera; // 相机
var scene; // 场景
var hemiLight;
var dirLight; // 方向光源
var controls; // 控制器


// 初始化渲染器
function initRender() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.antialias = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  document.body.appendChild(renderer.domElement);
}

// 初始化相机
function initCamera() {
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(0, 0, 250);
}

// 初始化场景
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL(0.6, 0, 1);
  scene.fog = new THREE.Fog(scene.background, 1, 5000);
}

// 初始化光源
function initLight() {
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);
  // hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  // scene.add(hemiLightHelper);


  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(- 1, 1.75, 1);
  dirLight.position.multiplyScalar(30);
  scene.add(dirLight);

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  var d = 50;
  dirLight.shadow.camera.left = - d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = - d;
  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = - 0.0001;

  // dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
  // scene.add(dirLightHeper);
}

// 初始化地面
function initGround() {
  var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
  var groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });

  groundMat.color.setHSL(0.095, 1, 0.75);

  var ground = new THREE.Mesh(groundGeo, groundMat);

  ground.rotation.x = - Math.PI / 2;
  ground.position.y = - 33;
  scene.add(ground);
  ground.receiveShadow = true;
}

// 初始化天空
function initSky() {
  var vertexShader = document.getElementById('vertexShader').textContent;
  var fragmentShader = document.getElementById('fragmentShader').textContent;
  var uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 33 },
    exponent: { value: 0.6 }
  };
  uniforms.topColor.value.copy(hemiLight.color);
  scene.fog.color.copy(uniforms.bottomColor.value);
  var skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15);
  var skyMat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide });
  var sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);
}

// 监听窗口变化
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// 初始化交互式空间
function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  // controls.addEventListener('change', render);
  // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableDamping = true;
  //动态阻尼系数 就是鼠标拖拽旋转灵敏度
  // controls.dampingFactor = 0.25;
  //是否可以缩放
  controls.enableZoom = true;
  //是否自动旋转
  controls.autoRotate = false;
  //设置相机距离原点的最远距离
  controls.minDistance = 1;
  //设置相机距离原点的最远距离
  controls.maxDistance = 200;
  //是否开启右键拖拽
  controls.enablePan = true;
}


// render方法
function render() {
  renderer.render(scene, camera);
}

// 动画方法
function animate() {
  requestAnimationFrame(animate);
  render();
  controls.update();
}

// 辅助线
function initAxisHelper() {
  var axisHelper = new THREE.AxesHelper(500);
  scene.add(axisHelper);
}


// 全局初始化方法
function init() {
  initRender();
  initScene();
  initCamera();
  initLight();
  initGround();
  initControls();
  initAxisHelper();
  initSky();
  initModels();

  animate();
  window.addEventListener('resize', onWindowResize);
}

init();

function initModels() {
  generateRoom();
  //generateFloor();generateDesk();generateBed();
}





function createSomething(klass, args) {
  var F = function (klass, args) {
    return klass.apply(this, args);
  };

  F.prototype = klass.prototype;
  return new F(klass, args);
};


/**
 * 物体
 */

function generateRoom() {
  var loader = new THREE.GLTFLoader();

  loader.load('model/room2/scene.gltf', function (gltf) {
    gltf.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 3);

    gltf.scene.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    })

    scene.add(gltf.scene);

  }, undefined, function (error) {

    console.error(error);

  });
}

function generateFloor() {
  var material = new THREE.MeshLambertMaterial({ color: 0xffffff })
  var Ms = [material, material, material, material, material, material]

  var g1 = new THREE.BoxBufferGeometry(48, 32, 2);
  var cMs1 = [...Ms];
  cMs1[4] = new THREE.MeshLambertMaterial({ color: 0xe1434a });
  var material1 = new THREE.MeshFaceMaterial(cMs1);
  var mesh1 = new THREE.Mesh(g1, material1);

  var g2 = new THREE.BoxBufferGeometry(2, 32, 36);
  var cMs2 = [...Ms];
  cMs2[1] = new THREE.MeshLambertMaterial({ color: 0xe1434a });
  var mesh2 = new THREE.Mesh(g2, cMs2);

  var g4 = new THREE.BoxBufferGeometry(2, 16, 16);
  var cMs4 = [...Ms];
  var mesh4 = new THREE.Mesh(g4, cMs4);


  var g3 = new THREE.BoxBufferGeometry(48, 2, 36);
  var cMs3 = [...Ms];
  var texture = new THREE.TextureLoader().load('model/texture/floor.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 10;
  texture.repeat.set(5, 5);
  cMs3[2] = new THREE.MeshBasicMaterial({ map: texture });
  var material3 = new THREE.MeshFaceMaterial(cMs3);
  var mesh3 = new THREE.Mesh(g3, material3);

  mesh1.position.set(-24, 16, 0);
  mesh2.position.set(-1, 16, 17);
  mesh3.position.set(-24, 1, 17);
  mesh4.position.set(-1, 16, 17);

  var mesh2BSP = new ThreeBSP(mesh2);
  var mesh4BSP = new ThreeBSP(mesh4);

  var resultBSP = mesh2BSP.subtract(mesh4BSP);
  var result = resultBSP.toMesh();
  result.geometry.computeFaceNormals();
  result.geometry.computeVertexNormals();

  var group = new THREE.Group();
  group.add(mesh1, result, mesh3 );
  group.traverse(object => {
    object.receiveShadow = true;
    object.castShadow = true;
  })
  scene.add(group);
}


function generateDesk() {
  var material = new THREE.MeshLambertMaterial({ color: 0xdb9a6b });
  var g1 = new THREE.BoxBufferGeometry(1, 8, 1);
  var mesh1 = new THREE.Mesh(g1, material);
  mesh1.position.set(-5, 5, 3);

  var mesh2 = mesh1.clone();
  mesh2.translateX(-15);

  var mesh3 = mesh1.clone();
  mesh3.translateZ(8);

  var mesh4 = mesh3.clone();
  mesh3.translateX(-15);

  var g2 = new THREE.BoxBufferGeometry(18, 1, 10);
  var mesh5 = new THREE.Mesh(g2, material);
  mesh5.position.set(-12.5, 9, 7);

  var group = new THREE.Group();

  group.add(mesh1, mesh2, mesh3, mesh4, mesh5);
  group.traverse(object => {
    object.receiveShadow = true;
    object.castShadow = true;
  })

  scene.add(group);
}

function generateBed() {
  var material = new THREE.MeshLambertMaterial({ color: 0x784628 });
  var g1 = new THREE.BoxBufferGeometry(30, 3, 14);
  var mesh1 = new THREE.Mesh(g1, material);

  mesh1.position.set(-17, 3.5, 28);


  var g2 = new THREE.BoxBufferGeometry(3, 8, 14);

  mesh2 = new THREE.Mesh(g2, material);
  mesh2.position.set(-3.5, 7, 28);

  var material1 = new THREE.MeshLambertMaterial({ color: 0xc1e3f1 });
  var materials = new Array(6).fill(material1, 0, 6);
  var geometriesParam = { type: 'BoxGeometry', args: [25, 2, 12.5, 6, 2, 8, materials] };
  var modifier = new THREE.SubdivisionModifier(3);
  var geometry = createSomething(THREE[geometriesParam.type], geometriesParam.args);
  var smooth = modifier.modify(geometry);

  var mesh3 = new THREE.Mesh(smooth, material1);

  mesh3.position.set(-18, 6, 28)

  var materials = new Array(6).fill(material1, 0, 6);
  var geometriesParam = { type: 'BoxGeometry', args: [6, 1.5, 3, 1, 1, 1.2, materials] };
  var modifier = new THREE.SubdivisionModifier(3);
  var geometry = createSomething(THREE[geometriesParam.type], geometriesParam.args);
  var smooth = modifier.modify(geometry);

  var mesh4 = new THREE.Mesh(smooth, material1);

  mesh4.position.set(-8, 7.5, 30)
  mesh4.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

  var mesh5 = mesh4.clone();
  mesh5.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 5);
  mesh5.translateX(3);
  mesh5.rotateZ(-Math.PI / 7);
  mesh5.translateY(.3);

  var group = new THREE.Group();

  group.add(mesh1, mesh2, mesh3, mesh4, mesh5);
  group.traverse(object => {
    object.receiveShadow = true;
    object.castShadow = true;
  })

  scene.add(group);
}


function generateDoor() {

}
