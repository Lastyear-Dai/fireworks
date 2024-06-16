

import * as THREE from "three"

export default class fireworks {
  isPlay = true
  constructor(scene) {
    this.scene = scene
    this.color = new THREE.Color(`hsl(${Math.floor(Math.random() * 360)},100%,80%)`)
    const audio = new Audio('./audio/send.mp3')
    audio.playbackRate = 1.7;
    audio.play()
    //创建主要烟花
    this.create()
  }

  create () {
    this.geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([0, 0, 0])
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const toVertices = new Float32Array([-Math.random() * 30 + 8, Math.random() * 30 + 8, Math.random() * 30])
    this.geometry.setAttribute('toPosition', new THREE.Float32BufferAttribute(toVertices, 3));
    //创建时间
    this.clock = new THREE.Clock()
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      //关闭深度缓存
      depthWrite: true,

      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 5.0 },
        uColor: {
          value: this.color
        }
      },
      //顶点着色器
      vertexShader: `
      attribute vec3 toPosition;
      
      uniform float uTime;
      uniform float uSize;
            void main(){
            vec4 modelposition=modelMatrix * vec4( position, 1.0 ) ;
            modelposition.xyz+=toPosition*uTime*1.35;
            vec4 viewposition= viewMatrix * modelposition  ;
             gl_Position = projectionMatrix *viewposition;
             gl_PointSize=uSize;
             }
  `,
      //片元着色器
      fragmentShader: ` 
      uniform vec3 uColor;
          void main(){
          float strength=pow(1.0-distance(gl_PointCoord,vec2(0.5))*2.0,1.5) ;
        
              gl_FragColor = vec4(uColor,strength);
          }
    `
    });

    this.points = new THREE.Points(this.geometry, this.material);

    this.points.position.x = -12;
    this.points.position.z = -25;
    this.points.position.y = 2;
    this.scene.add(this.points);
    this.createBoom(toVertices)
  }
  createBoom (to) {
    this.geometryBoom = new THREE.BufferGeometry();
    const vertices = new Float32Array(100 * 3)
    const tovertices = new Float32Array(100 * 3)
    for (let i = 0; i < 100 * 3; i++) {
      let index = i * 3
      vertices[index] = to[0]
      vertices[index + 1] = to[1]
      vertices[index + 2] = to[2]

      let radius = Math.random() * 5
      tovertices[index + 0] = radius * Math.sin(2 * Math.PI * Math.random()) + radius * Math.cos(2 * Math.PI ** Math.random())
      tovertices[index + 1] = radius * Math.cos(2 * Math.PI ** Math.random()) + radius * Math.sin(2 * Math.PI ** Math.random())
      tovertices[index + 2] = radius * Math.sin(2 * Math.PI ** Math.random()) + radius * Math.cos(2 * Math.PI ** Math.random())
    }
    this.geometryBoom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.geometryBoom.setAttribute('toPosition', new THREE.Float32BufferAttribute(tovertices, 3));
    //创建时间
    this.materialBoom = new THREE.ShaderMaterial({
      transparent: true,
      //关闭深度缓存
      depthWrite: true,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0 },
        uColor: {
          value: this.color
        }
      },
      //顶点着色器
      vertexShader: `
        attribute vec3 toPosition;

        uniform float uTime;
        uniform float uSize;
              void main(){
              vec4 modelposition=modelMatrix * vec4( position, 1.0 ) ;
              modelposition.xyz+=toPosition*uTime;
              vec4 viewposition= viewMatrix * modelposition  ;
               gl_Position = projectionMatrix *viewposition;
               gl_PointSize=uSize;
               }
    `,
      //片元着色器
      fragmentShader: ` 
      uniform vec3 uColor;
            void main(){
            float strength=pow(1.0-distance(gl_PointCoord,vec2(0.5))*2.0,1.5) ;

                gl_FragColor = vec4(uColor,strength);
            }
      `
    });

    this.pointsBoom = new THREE.Points(this.geometryBoom, this.materialBoom);
    this.pointsBoom.position.x = -12;
    this.pointsBoom.position.z = -25;
    this.pointsBoom.position.y = 2;

    this.scene.add(this.pointsBoom);
  }


  updataTime () {
    const time = this.clock.getElapsedTime();
    if (time < 0.7) {
      this.material.uniforms.uTime.value = time
    }
    if (time >= 0.7 && time <= 0.8) {
      this.material.uniforms.uSize.value = 0
      this.points.geometry.dispose();
      this.points.material.dispose();
      this.points.clear()
      this.scene.remove(this.points);
    }
    if (time < 2 && time > 0.7) {
      //创建爆炸
      this.materialBoom.uniforms.uSize.value = 10.0 - (time - 0.7) * 12
      this.materialBoom.uniforms.uTime.value = (time - 0.7)
      if (this.isPlay) {
        const audio = new Audio('./audio/pow4.ogg')
        audio.play()
        this.isPlay = false
      }
    }
    if (time >= 2 && time < 2.1) {
      this.materialBoom.uniforms.uSize.value = 0
      this.pointsBoom.geometry.dispose();
      this.pointsBoom.material.dispose();
      this.pointsBoom.clear()
      this.scene.remove(this.pointsBoom);
    }
  }
} 