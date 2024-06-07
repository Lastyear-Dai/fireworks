import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入变换控制器
import { TransformControls } from "three/addons/controls/TransformControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
//导入动画库
// 导入动画库
import gsap from "gsap";

//1. 创建场景
const scene = new THREE.Scene()
//2. 创建相机 1角度;    2.视口宽高比;   3,近端0.1;   4.远端1000
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
// 位置
camera.position.set(0, 0, 300);
// 将相机添加到场景当中
scene.add(camera);

// 设置背景颜色为白色
// scene.background = new THREE.Color(0xaaaaaa);

//初始化渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 0); // 设置背景颜色
renderer.alpha = true;
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer)
//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

/**
 * 螺旋丸****************************
 */
//螺旋丸参数
const luoxuanwan = {
  dingdian: 20000,//10000个顶点
  radius: 50,//螺旋丸半径
  branch: 3,//3条棱
}
//创建顶点对象
const geometry = new THREE.BufferGeometry();
//创建一个顶点数组
const vertices = new Float32Array(luoxuanwan.dingdian * 3)
//赋值
for (let i = 0; i < luoxuanwan.dingdian; i++) {
  //当前半径
  let currentBranch = Math.random() * luoxuanwan.radius
  const currentIndex = i * 3
  //当前角度
  let angle = Math.PI * 2 / luoxuanwan.branch * (i % luoxuanwan.branch) + currentBranch / luoxuanwan.radius
  //每条棱的粗或细
  let chuX = Math.pow(Math.random() * 6 - 3, 3) * (luoxuanwan.radius - currentBranch) / luoxuanwan.radius;
  let chuY = Math.pow(Math.random() * 6 - 3, 3) * (luoxuanwan.radius - currentBranch) / luoxuanwan.radius;
  let chuZ = Math.pow(Math.random() * 6 - 3, 3) * (luoxuanwan.radius - currentBranch) / luoxuanwan.radius;
  vertices[currentIndex] = Math.sin(angle) * currentBranch + chuX
  vertices[currentIndex + 1] = 0 + chuY
  vertices[currentIndex + 2] = Math.cos(angle) * currentBranch + chuZ
}
//设置顶点位置
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// 设置点材质
const pointsMaterial = new THREE.PointsMaterial();
pointsMaterial.size = 0.1;
pointsMaterial.color.set(0xffffff);
const points = new THREE.Points(geometry, pointsMaterial);
points.name = "points";
points.position.y = 0
points.rotation.x = Math.PI / 8;
scene.add(points);
gsap.to(points.rotation, {
  y: "-=" + Math.PI * 2, // 旋转360度
  duration: 1, // 完成一次360度旋转的时间
  ease: "none", // 使用线性缓动函数
  repeat: -1, // 无限循环
});
/**
 * 螺旋丸****************************
 */


/**
 * 雪花粒子*************************
 */
/*

创建顶点对象
1000个顶点
*/
const dingdian = 5000
//创建顶点对象
const geometry1 = new THREE.BufferGeometry();
//创建一个顶点数组
const vertices1 = new Float32Array(dingdian * 3)
//赋值
vertices1.forEach((item, index) => vertices1[index] = (Math.random() * 200 - 100))
console.log(vertices1)
//设置顶点位置
geometry1.setAttribute('position', new THREE.Float32BufferAttribute(vertices1, 3));
// 设置点材质
const pointsMaterial1 = new THREE.PointsMaterial();
pointsMaterial1.size = 4;
pointsMaterial1.color.set(0xffffff);
// 相机深度而衰减
pointsMaterial1.sizeAttenuation = true;
// 载入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./texture/雪花.png");
const texture1 = textureLoader.load("./texture/雪花-透明贴图.png");
pointsMaterial1.map = texture;
pointsMaterial1.alphaMap = texture1;
pointsMaterial1.transparent = true
//关闭深度缓存
pointsMaterial1.depthWrite = false;
//开启混合模式的叠加颜色算法
pointsMaterial1.blending = THREE.AdditiveBlending;
const points1 = new THREE.Points(geometry1, pointsMaterial1);
points1.scale.set(5, 5, 5)
scene.add(points1);
gsap.to(points1.rotation, {
  x: "+=" + Math.PI * 2,
  y: "+=" + Math.PI * 2,
  duration: 100,
  ease: "none",
  repeat: -1,
});
/**
 * 雪花粒子*************************
 */

// 鼠标的位置对象
const mouse = new THREE.Vector2();
// 监听鼠标的位置
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / window.innerWidth - 0.5;
  mouse.y = event.clientY / window.innerHeight - 0.5;
});


// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");

  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});


// 设置时钟
const clock = new THREE.Clock();
// 自定以一个函数
function render () {
  let deltaTime = clock.getDelta();
  //设置相机摇晃
  camera.position.x += (mouse.x * 50 - camera.position.x) * deltaTime * 5;
  camera.position.y += (mouse.y * 50 - camera.position.y) * deltaTime * 5;
  renderer.render(scene, camera);
  //做到无限渲染
  requestAnimationFrame(render);
}
render();
