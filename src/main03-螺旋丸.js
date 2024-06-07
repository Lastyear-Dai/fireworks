import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入变换控制器
import { TransformControls } from "three/addons/controls/TransformControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";


//1. 创建场景
const scene = new THREE.Scene()
//2. 创建相机 1角度;    2.视口宽高比;   3,近端0.1;   4.远端1000
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
// 位置
camera.position.set(0, 200, 300);
// 将相机添加到场景当中
scene.add(camera);

// 设置背景颜色为白色
scene.background = new THREE.Color(0xaaaaaa);

//初始化渲染器
const renderer = new THREE.WebGLRenderer()
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer)
//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 添加网格辅助器
const gridHelper = new THREE.GridHelper(1000, 1000);
gridHelper.material.opacity = 0.3;
gridHelper.material.transparent = true;
scene.add(gridHelper);

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

console.log(vertices)
//设置顶点位置
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// 设置点材质
const pointsMaterial = new THREE.PointsMaterial();
pointsMaterial.size = 0.1;
pointsMaterial.color.set(0xffffff);
const points = new THREE.Points(geometry, pointsMaterial);
points.name = "points";
points.position.y = 80
scene.add(points);

//创建动画混合器
const mixer = new THREE.AnimationMixer(points);

// ******************创建旋转动画剪辑********************************
//创建动画
const Angle1 = new THREE.Quaternion();
//创建四元数,以x轴为原点旋转0°
Angle1.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
const Angle2 = new THREE.Quaternion();
//创建四元数,以x轴为原点旋转180°
Angle2.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI);
const Angle3 = new THREE.Quaternion();
//创建四元数,以x轴为原点旋转360°
Angle3.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -2 * Math.PI);
//数值关键帧
const opacityKF = new THREE.NumberKeyframeTrack(
  "defaultMaterial.material.opacity",
  [0, 1, 2, 3, 4],
  [1, 0.5, 0, 0.5, 1]
);
//2个定位坐标合并成过一个数组
const finQ = Angle1
  .toArray()
  .concat(Angle2.toArray())
  .concat(Angle3.toArray())
// //  创建旋转动画帧
const rotationKF = new THREE.QuaternionKeyframeTrack(
  "points.quaternion",
  [0, 0.4, 0.8],
  finQ
);
const clip = new THREE.AnimationClip("move", 0.8, [rotationKF]);
// 创建动画动作
const action = mixer.clipAction(clip);
// 设置动画循环
action.setLoop(THREE.LoopRepeat, Infinity);
// ******************创建旋转动画剪辑********************************

// ******************创建缩放动画剪辑********************************
const rotationKF1 = new THREE.VectorKeyframeTrack(
  "points.scale",
  [0, 1, 2],
  [0.1, 0.1, 0.1, 0.5, 0.5, 0.5, 1, 1, 1]
);
const clip1 = new THREE.AnimationClip("move1", 2, [rotationKF1]);
// 创建动画动作
const action1 = mixer.clipAction(clip1);
action1.name = "move1"
// 设置动画循环
action1.setLoop(THREE.LoopOnce, 0); // 只播放一次
// 在动画结束时停止动画
action1.clampWhenFinished = true;
// ******************创建缩放动画剪辑********************************


// ******************创建位移动画剪辑********************************

const positionKF2 = new THREE.VectorKeyframeTrack(
  "points.position",
  [0, 1, 2,],//这里是时间帧每一个时间帧对应的下面的xyz坐标(三个元素为一组)
  [0, 80, 0,
    0, 120, 0,
    500, 0, 0,]//数组每三个元素为一组代表xyz坐标
);
const clip2 = new THREE.AnimationClip("move2", 2, [positionKF2]);
// 创建动画动作
const action2 = mixer.clipAction(clip2);
// 设置动画循环
action2.setLoop(THREE.LoopOnce, 0); // 只播放一次
// 在动画结束时停止动画
// action2.clampWhenFinished = true;
// 监听动画更新事件
mixer.addEventListener('finished', function (event) {
  console.log(event.action.name === 'move1');
  if (event.action.name === 'move1') {
    // 当第一个动画播放完成时，播放第二个动画
    action2.reset();
    action2.play();
  }
});

// ******************创建位移动画剪辑********************************


const gui = new GUI()
const objFun = {
  pointsStart: () => {
    action1.reset();
    action.reset();
    action.play();
    action1.play();

  }
}
gui.add(objFun, 'pointsStart')




// 设置时钟
const clock = new THREE.Clock();
// 自定以一个函数
function render () {
  // let time = clock.getElapsedTime();
  let delta = clock.getDelta();
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera);
  //做到无限渲染
  requestAnimationFrame(render);
}
render();
