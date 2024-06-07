import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'




//1. 创建场景
const scene = new THREE.Scene()
//2. 创建相机 1角度;    2.视口宽高比;   3,近端0.1;   4.远端1000
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 位置
camera.position.set(0, 0, 120);
// 将相机添加到场景当中
scene.add(camera);



//初始化渲染器
const renderer = new THREE.WebGLRenderer()
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer)
//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);


/*

创建顶点对象
1000个顶点
*/
const dingdian = 1050
//创建顶点对象
const geometry = new THREE.BufferGeometry();
//创建一个顶点数组
const vertices = new Float32Array(dingdian * 3)
//赋值
vertices.forEach((item, index) => vertices[index] = (Math.random() * 200 - 100))
console.log(vertices)
//设置顶点位置
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// 设置点材质
const pointsMaterial = new THREE.PointsMaterial();
pointsMaterial.size = 1.1;
pointsMaterial.color.set(0xffffff);
// 相机深度而衰减
pointsMaterial.sizeAttenuation = true;
// 载入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./public/texture/雪花.png");
const texture1 = textureLoader.load("./public/texture/雪花-透明贴图.png");
pointsMaterial.map = texture;
pointsMaterial.alphaMap = texture1;
pointsMaterial.transparent = true
//关闭深度缓存
pointsMaterial.depthWrite = false;
//开启混合模式的叠加颜色算法
pointsMaterial.blending = THREE.AdditiveBlending;
const points = new THREE.Points(geometry, pointsMaterial);

scene.add(points);

// 设置时钟
const clock = new THREE.Clock();
// 自定以一个函数
function render () {
  let time = clock.getElapsedTime();
  points.rotation.x = time * 0.4;
  points.rotation.y = time * 0.1;
  renderer.render(scene, camera);
  //做到无限渲染
  requestAnimationFrame(render);
}
render();
