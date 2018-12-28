
var renderer;
function initRender() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.antialias = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  //告诉渲染器需要阴影效果
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);
}

var camera;
function initCamera() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 15);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

var scene;
function initScene() {
  scene = new THREE.Scene();
}

//初始化dat.GUI简化试验流程
var gui;
function initGui() {
  //声明一个保存需求修改的相关数据的对象
  gui = {
  };
  var datGui = new dat.GUI();
  //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
}

var pointLight;
function initLight() {
  var pointGeo = new THREE.SphereBufferGeometry(0.2, 16, 8);
  var pointMat = new THREE.MeshStandardMaterial({
    emissive: 0xffffee,
    emissiveIntensity: 1,
    color: 0x000000
  });
  pointLight = new THREE.PointLight();
  pointLight.position.set(0, 8, 0);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024 * 4;
  pointLight.shadow.mapSize.height = 1024 * 4;

  pointLight.add(new THREE.Mesh(pointGeo, pointMat));

  var ambientLight = new THREE.AmbientLight(0x222222);

  scene.add(ambientLight);
  scene.add(pointLight)
}


var floor;
var floorMat = new THREE.MeshStandardMaterial({
  roughness: 0.8,
  color: 0xffffff,
  metalness: 0.2,
  bumpScale: 0.0005
});
var textureLoader = new THREE.TextureLoader();

function initFloor() {
  textureLoader.load(require("assets/hardwood2_diffuse.jpg"), function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 10;
    map.repeat.set(10, 24);
    floorMat.map = map;
    floorMat.needsUpdate = true;
  });

  var floorGeometry = new THREE.PlaneBufferGeometry(50, 50);
  var floorMesh = new THREE.Mesh(floorGeometry, floorMat);
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = - Math.PI / 2.0;
  scene.add(floorMesh);
}

var wallMat = new THREE.MeshBasicMaterial();
function initWalls() {
  var wallGeo = new THREE.BoxBufferGeometry(15, 6, 0.1);
  wallMat = createMat("assets/wall.jpg", {
    MatType: THREE.MeshLambertMaterial,
    anisotropy: 10,
    repeat: {
      x: 4,
      y: 1,
    }
  })
  var wall1Mesh = new THREE.Mesh(wallGeo, wallMat);
  wall1Mesh.receiveShadow = true;
  wall1Mesh.castShadow = true;
  wall1Mesh.position.set(0, 2, -7.5);

  var wall2Mesh = wall1Mesh.clone();
  wall2Mesh.rotation.y = - Math.PI / 2.0;
  wall2Mesh.translateZ(7.5);
  wall2Mesh.translateX(7.5);

  var wall3Mesh = wall2Mesh.clone();

  wall3Mesh.translateZ(-15);


  scene.add(wall1Mesh)
  scene.add(wall2Mesh)
  scene.add(wall3Mesh)

}

function initTable() {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('models/');


  mtlLoader.setTexturePath('assets/');
  mtlLoader.load('table.mtl', function (materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    //设置当前加载的纹理
    objLoader.setMaterials(materials);
    objLoader.setPath('models/');
    objLoader.load('table.obj', function (object) {


      // 加载完obj文件是一个场景组，遍历它的子元素，赋值纹理并且更新面和点的发现了

      var material = new THREE.MeshStandardMaterial({ color: 0xA0522D });
      material.needsUpdate = true;
      object.children.forEach((child, index) => {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
        // child.material.color = { r: 1, g: 1, b: 1 }
      })



      // //将模型缩放并添加到场景当中
      object.scale.multiplyScalar(.02);;
      object.position.set(1, 0, 4);


      scene.add(object);

    })
  });
}

function initDollar() {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('models/');


  mtlLoader.setTexturePath('assets/');
  mtlLoader.load('dollar.mtl', function (materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    //设置当前加载的纹理
    objLoader.setMaterials(materials);
    objLoader.setPath('models/');
    objLoader.load('dollar.obj', function (object) {
      // 加载完obj文件是一个场景组，遍历它的子元素，赋值纹理并且更新面和点的发现了

      var material = createMat("assets/dollar.jpg", {
        MatType: THREE.MeshLambertMaterial,
        anisotropy: 2,
        repeat: {
          x: 1,
          y: 1,
        }
      })
      material.needsUpdate = true;
      object.children.forEach((child, index) => {
        child.castShadow = true;
        child.receiveShadow = true;
      })

      object.children[0].material = material;
      // object.children[1].material = new THREE.MeshStandardMaterial({ color: 0xF9E79F });



      // //将模型缩放并添加到场景当中
      object.scale.multiplyScalar(.01);;
      object.position.set(-1, 1.56, 4);

      for (let i = 0; i < 5; i++) {
        var moneny2 = object.clone();
        moneny2.position.y += 0.06 * (i + 1);
        scene.add(moneny2);
      }

      scene.add(object);


    })
  });
}

function initPanda() {
  var Geometry = new THREE.BoxBufferGeometry(2, 2, 0.05);
  var Mat = createMat("assets/ha.jpg", {
    MatType: THREE.MeshStandardMaterial,
    anisotropy: 10,
    repeat: {
      x: 1,
      y: 1,
    }
  })
  var floorMesh = new THREE.Mesh(Geometry, Mat);
  floorMesh.receiveShadow = true;
  floorMesh.position.set(0, 3, -7.4)
  scene.add(floorMesh);
}

function initModel() {
  var helper = new THREE.AxesHelper(10);
  scene.add(helper);

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('models/bed/');


  mtlLoader.setTexturePath('models/bed/texture/');
  mtlLoader.load('bed.mtl', function (material) {
    material.preload();
    var objLoader = new THREE.OBJLoader();
    //设置当前加载的纹理
    console.log(material)
    objLoader.setMaterials(material);
    objLoader.setPath('models/bed/');
    objLoader.load('bed.obj', function (object) {

      // 加载完obj文件是一个场景组，遍历它的子元素，赋值纹理并且更新面和点的发现了

      var textures = [
        "M303-02",
        "M209-06b",
        "M209-06b",
        "M209-06b", "M209-06b", "M209-06b",
        "M303-02", "M303-01", "M303-01", "M303-01", "M303-02"
      ]
      object.children.forEach((child, index) => {
        child.material = createMat(`models/bed/texture/${textures[index]}.jpg`);
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.color = { r: 1, g: 1, b: 1 }
      })



      // //将模型缩放并添加到场景当中
      object.scale.multiplyScalar(.002);;
      object.position.set(-3, 0, -3);

      var newBed = object.clone();
      newBed.position.set(3, 0, -3);

      scene.add(object);
      scene.add(newBed);
    })
  });
}

// //初始化性能插件
// var stats;
// function initStats() {
//   stats = new Stats();
//   document.body.appendChild(stats.dom);
// }

//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
var controls;
function initControls() {

  controls = new OrbitControls(camera, renderer.domElement);

  // 如果使用animate方法时，将此函数删除
  //controls.addEventListener( 'change', render );
  // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableDamping = true;
  //动态阻尼系数 就是鼠标拖拽旋转灵敏度
  //controls.dampingFactor = 0.25;
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

function createMat(url, options = {
  anisotropy: 10,
  MatType: THREE.MeshLambertMaterial,
  repeat: {
    x: 2,
    y: 2,
  }
}) {
  var map = textureLoader.load(url);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = options.anisotropy;
  map.repeat.set(options.repeat.x, options.repeat.y);

  var material = new options.MatType();
  material.map = map;
  material.needsUpdate = true;

  return material;
}

function render() {

  renderer.render(scene, camera);
}

//窗口变动触发的函数
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  render();
  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
  //更新控制器
  render();

  // //更新性能插件
  // stats.update();

  controls.update();

  requestAnimationFrame(animate);
}

function draw() {
  initGui();
  initRender();
  initScene();
  initCamera();
  initLight();
  initFloor();
  initWalls();
  initTable();
  initPanda();
  initDollar();
  initModel();
  initControls();

  animate();
  window.onresize = onWindowResize;
}

window.onload = draw;

console.log(__dirname)
