import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

// 导入变换控制器
import { TransformControls } from "three/addons/controls/TransformControls.js";

//1. 创建场景
const scene = new THREE.Scene()
//2. 创建相机 1角度;    2.视口宽高比;   3,近端0.1;   4.远端1000
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 位置
camera.position.set(0, 0, 10);
// 将相机添加到场景当中
scene.add(camera);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 添加网格辅助器
const gridHelper = new THREE.GridHelper(50, 50);
gridHelper.material.opacity = 0.3;
gridHelper.material.transparent = true;
scene.add(gridHelper);

//初始化渲染器
const renderer = new THREE.WebGLRenderer()
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer)
//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
const obj = {
  addobj: () => {
    console.log('点击了')
    //添加物体
    // 创建几何体
    const jiheti = new THREE.BoxGeometry(1, 1, 1);
    //设置材质
    const chaijzi = new THREE.MeshBasicMaterial({ color: 0Xffff00 });
    // 根据几何体和材质创建物体
    const cube = new THREE.Mesh(jiheti, chaijzi);
    cube.position.x = Math.random() * 10
    // 将几何体添加到场景中
    scene.add(cube);
    tControls.attach(cube);
  }
}

// 创建GUI
const gui = new GUI();
gui.add(obj, 'addobj')
// 创建变换控制器
let tControls = new TransformControls(camera, renderer.domElement);
tControls.addEventListener("change", render);
// 监听拖动事件，当拖动物体时候，禁用轨道控制器
tControls.addEventListener("dragging-changed", function (event) {
  controls.enabled = !event.value;
});
tControls.addEventListener("change", () => {
  console.log(111)
});
scene.add(tControls);

// 自定以一个函数
function render () {
  renderer.render(scene, camera);
  //做到无限渲染
  requestAnimationFrame(render);
}
render();
