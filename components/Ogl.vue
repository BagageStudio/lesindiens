<template>
    <div ref="glWrapper" class="gl-wrapper" />
</template>
<script>
import {
    Renderer,
    Camera,
    Transform,
    Program,
    Mesh,
    Plane,
    Sphere,
    Box,
    Cylinder,
    Orbit,
    Mat4
} from '~/assets/js/ogl/index';
export default {
    data() {
        return {
            gl: null,
            renderer: null,
            camera: null,
            plane: null,
            cylinder: null,
            sphere: null,
            cube: null,
            controls: null,
            vertex: /* glsl */ `
            precision highp float;
            precision highp int;
            attribute vec3 position;
            attribute vec3 normal;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform mat3 normalMatrix;
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,

            fragment: /* glsl */ `
            precision highp float;
            precision highp int;
            varying vec3 vNormal;
            void main() {
                vec3 normal = normalize(vNormal);
                float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
                gl_FragColor.rgb = vec3(0.2, 0.8, 1.0) + lighting * 0.2;
                gl_FragColor.a = 1.0;
            }
        `
        };
    },
    mounted() {
        this.initGL();
    },
    methods: {
        initGL() {
            this.renderer = new Renderer({ dpr: 2 });
            this.gl = this.renderer.gl;
            this.$refs.glWrapper.appendChild(this.gl.canvas);
            this.gl.clearColor(1, 1, 1, 1);

            const camera = new Camera(this.gl, { fov: 35 });
            this.camera = new Camera(this.gl, { fov: 35 });
            console.log(camera, this.camera);

            // camera.position.set(0, 1, 7);
            this.camera.position.y = 1;
            this.camera.position.z = 7;
            this.controls = new Orbit(this.camera);

            this.resize();

            this.scene = new Transform();

            const planeGeometry = new Plane(this.gl);
            const sphereGeometry = new Sphere(this.gl);
            const cubeGeometry = new Box(this.gl);
            const cylinderGeometry = new Cylinder(this.gl);

            const program = new Program(this.gl, {
                vertex: this.vertex,
                fragment: this.fragment,

                // Don't cull faces so that plane is double sided - default is gl.BACK
                cullFace: null
            });

            this.plane = new Mesh(this.gl, { geometry: planeGeometry, program });
            this.plane.position.set(0, 1.3, 0);
            this.plane.setParent(this.scene);

            this.sphere = new Mesh(this.gl, { geometry: sphereGeometry, program });
            this.sphere.position.set(1.3, 0, 0);
            this.sphere.setParent(this.scene);

            this.cube = new Mesh(this.gl, { geometry: cubeGeometry, program });
            this.cube.position.set(0, -1.3, 0);
            this.cube.setParent(this.scene);

            this.cylinder = new Mesh(this.gl, { geometry: cylinderGeometry, program });
            this.cylinder.position.set(-1.3, 0, 0);
            this.cylinder.setParent(this.scene);

            requestAnimationFrame(this.update);
        },
        update() {
            requestAnimationFrame(this.update);
            this.controls.update();

            this.plane.rotation.y -= 0.02;
            this.sphere.rotation.y -= 0.03;
            this.cube.rotation.y -= 0.04;
            this.cylinder.rotation.y -= 0.02;

            this.renderer.render({ scene: this.scene, camera: this.camera });
        },
        resize() {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            console.log(this.camera.projectionMatrix);
            this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });
        }
    }
};
</script>
