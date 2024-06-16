import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import fireworks from './class/烟花'
// 导入变换控制器
import { TransformControls } from "three/addons/controls/TransformControls.js";
//导入gltf载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
//导入水面
import { Water } from 'three/addons/objects/Water2.js';
//1. 创建场景
const scene = new THREE.Scene()
//2. 创建相机 1角度;    2.视口宽高比;   3,近端0.1;   4.远端1000
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 位置
camera.position.set(0, 30, 50);
// 将相机添加到场景当中
scene.add(camera);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

//初始化渲染器
const renderer = new THREE.WebGLRenderer()
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer)
//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)


//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


//加载hdr环境图
const rgbeloader = new RGBELoader()
//资源较大，使用异步加载
rgbeloader.loadAsync('./texture/kloppenheim_02_puresky_4k.hdr').then((texture) => {
  //给场景添加背景贴图
  scene.background = texture
  // scene.environment = texture;
  //给场景的背景贴图进行映射.使贴图贴满整个场景
  texture.mapping = THREE.EquirectangularReflectionMapping
})
//环境光,周围亮度
const light = new THREE.DirectionalLight(0xffffff, 0.5)
//将灯光加入场景
scene.add(light)
// 创建一个加载器
const loader = new GLTFLoader();
//创建圆平面
var circleBufferGeometry = new THREE.CircleBufferGeometry(1024, 100);
//创建水面纹理并导入圆平面
const water = new Water(circleBufferGeometry, {
  //纹理的宽
  texturewidth: 1024,
  //纹理的高3
  textureHeight: 1024,
  // 水面颜色
  color: 0xf0f0f0,
  // 水面流动的方向
  flowDirection: new THREE.Vector2(1, 1),
  //水波大小
  scale: 2,
});
water.rotation.x = -Math.PI / 2
water.position.y = 0.1;
scene.add(water);
// 加载glb模型
loader.load(
  './model/house/newyears_min.glb',
  function (gltf) {
    // 加载成功后的回调函数
    const model = gltf.scene;
    model.children[0].children[0].children[0].material.onBeforeCompile = (shader, renderer) => {
      // console.log(shader.fragmentShader)
      console.log(shader.vertexShader)
      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>
        `,
        `//需要修改的内容
        `)

    }
    scene.add(model);
  },
  function (xhr) {
    // 加载过程中的回调函数
    // console.log((xhr.loaded / xhr.total * 100) + '% 已加载');
  },
  function (error) {
    // 加载失败时的回调函数
    console.error('模型加载失败', error);
  }
);


const fireworkarr = []
renderer.toneMapping = THREE.CineonToneMapping
renderer.toneMappingExposure = 0.1
// 自定以一个函数
function render () {
  renderer.render(scene, camera);
  controls.update(); // 更新控制器
  fireworkarr.forEach(item => item.updataTime())
  //做到无限渲染
  requestAnimationFrame(render);
}
render();
renderer.domElement.addEventListener('click', () => {
  fireworkarr.push(new fireworks(scene))
})