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
            renderer: null,
            gl: null,
            camera: null,
            scene: null,
            screen: {},
            viewport: {}
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.createRenderer();
            this.createCamera();
            this.createScene();

            this.onResize();

            this.update();

            this.addEventListeners();
        },
        createRenderer() {
            this.renderer = new Renderer();

            this.gl = this.renderer.gl;
            this.gl.clearColor(0.79607843137, 0.79215686274, 0.74117647058, 1);

            this.$refs.glWrapper.appendChild(this.gl.canvas);
        },
        createCamera() {
            this.camera = new Camera(this.gl);
            this.camera.fov = 45;
            this.camera.position.z = 20;
        },
        createScene() {
            this.scene = new Transform();
        },
        onResize() {
            this.screen = {
                height: window.innerHeight,
                width: window.innerWidth
            };

            this.renderer.setSize(this.screen.width, this.screen.height);

            this.camera.perspective({
                aspect: this.gl.canvas.width / this.gl.canvas.height
            });

            const fov = this.camera.fov * (Math.PI / 180);
            const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
            const width = height * this.camera.aspect;

            this.viewport = {
                height,
                width
            };
        },
        update() {
            this.renderer.render({
                scene: this.scene,
                camera: this.camera
            });

            window.requestAnimationFrame(this.update.bind(this));
        },
        addEventListeners() {
            window.addEventListener('resize', this.onResize.bind(this));

            window.addEventListener('mousewheel', this.onWheel.bind(this));
            window.addEventListener('wheel', this.onWheel.bind(this));

            window.addEventListener('mousedown', this.onTouchDown.bind(this));
            window.addEventListener('mousemove', this.onTouchMove.bind(this));
            window.addEventListener('mouseup', this.onTouchUp.bind(this));

            window.addEventListener('touchstart', this.onTouchDown.bind(this));
            window.addEventListener('touchmove', this.onTouchMove.bind(this));
            window.addEventListener('touchend', this.onTouchUp.bind(this));
        },
        onTouchDown(event) {},
        onTouchMove(event) {},
        onTouchUp(event) {},
        onWheel(event) {}
    }
};
</script>
