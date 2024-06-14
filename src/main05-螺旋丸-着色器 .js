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
camera.position.set(0, 400, 600);
// 将相机添加到场景当中
scene.add(camera);

// 设置背景颜色为白色
scene.background = new THREE.Color(0x000000);

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
// const gridHelper = new THREE.GridHelper(1000, 1000);
// gridHelper.material.opacity = 0.3;
// gridHelper.material.transparent = true;
// scene.add(gridHelper);
// 载入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./public/texture/狗狗.png");
//螺旋丸参数
const luoxuanwan = {
  dingdian: 20000,//10000个顶点
  radius: 100,//螺旋丸半径
  branch: 4,//3条棱

}
//创建顶点对象
const geometry = new THREE.BufferGeometry();
//创建一个顶点数组
const vertices = new Float32Array(luoxuanwan.dingdian * 3)
//赋值
for (let i = 0; i < luoxuanwan.dingdian; i++) {
  //当前半径
  let currentBranch = Math.random() * luoxuanwan.radius
  //每条棱的粗或细
  let chuX = Math.pow(Math.random() * 6 - 3, 3) * (luoxuanwan.radius - currentBranch) / luoxuanwan.radius;
  let chuY = Math.pow(Math.random() * 6 - 3, 3) * (luoxuanwan.radius - currentBranch) / luoxuanwan.radius;
  let chuZ = Math.pow(Math.random() * 6 - 3, 3) * (luoxuanwan.radius - currentBranch) / luoxuanwan.radius;
  const currentIndex = i * 3
  let angle = (Math.PI * 2 / luoxuanwan.branch) * (i % luoxuanwan.branch)
  vertices[currentIndex] = Math.sin(angle) * currentBranch + chuX
  vertices[currentIndex + 1] = 0 + chuY
  vertices[currentIndex + 2] = Math.cos(angle) * currentBranch + chuZ

}

console.log(vertices)
//设置顶点位置
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// 设置点材质
// const pointsMaterial = new THREE.PointsMaterial();
// pointsMaterial.size = 0.1;
// pointsMaterial.color.set(0xffffff);//关闭深度缓存
// pointsMaterial.depthWrite = false;
// //开启混合模式的叠加颜色算法
// pointsMaterial.blending = THREE.AdditiveBlending;
const pointsMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  // blending: THREE.AdditiveBlending,
  uniforms: {

    utexture: { value: texture },
    time: {
      value: 0
    }
  },
  //顶点着色器
  vertexShader: `
  uniform float time;
          void main(){
              vec4 modelPosition=modelMatrix * vec4( position, 1.0 ) ;
              //获取当前点与原点的夹角
              float angle =atan(modelPosition.x, modelPosition.z);
              //获取当前点到原点的距离
              float juli=length(modelPosition.xz*32.0);
              //根据juli获取需要旋转的角度(越远角度越小)
              float setAngle=1.0/juli*time*300.0;
              //累加每次需要移动的角度来达到旋转的效果
              angle+=setAngle ;
              //赋值旋转后的坐标
              modelPosition.x+=sin(angle)*juli;
              modelPosition.z+=cos(angle)*juli;
              vec4 viewmodel= viewMatrix *modelPosition;
              gl_PointSize=-400.0/viewmodel.z *10.0;
              gl_Position = projectionMatrix *viewmodel;
          }
      `,
  //片元着色器
  fragmentShader: `
    uniform sampler2D utexture;
          void main(){
            vec4 image= texture2D(utexture,gl_PointCoord);
              gl_FragColor =vec4(gl_PointCoord,1.0,image.r);
          }
    `

});
const points = new THREE.Points(geometry, pointsMaterial);
points.name = "points";
// points.position.y = 80
scene.add(points);







const gui = new GUI()
const objFun = {
  pointsStart: () => {


  }
}
gui.add(objFun, 'pointsStart')




// 设置时钟
const clock = new THREE.Clock();
// 自定以一个函数
function render () {
  let time = clock.getElapsedTime();
  // let delta = clock.getDelta();
  pointsMaterial.uniforms.time.value = time
  renderer.render(scene, camera);
  //做到无限渲染
  requestAnimationFrame(render);
}
render();
