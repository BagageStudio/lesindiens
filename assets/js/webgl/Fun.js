import { gsap } from 'gsap';

import { BREAKPOINTS } from '../constants';

import { debounce, lerp, round } from '../utils';
import { Media } from './Media';

import fxaa from './shaders/fxaa.glsl';
import { Renderer, Camera, Transform, Plane, Vec2, Raycast, Post } from '~/assets/js/ogl/index';

class WebglApp {
    init({ dom, sizeElement }) {
        this.dom = dom;

        this.disabled = false;

        this.previousTime = 0;
        this.deltaTime = 0;

        this.sizeElement = sizeElement;

        this.medias = [];

        this.mousePos = {
            x: 0,
            y: 0
        };

        this.scrolling = false;
        this.scrollEnded = true;

        this.onTouchMoveEvent = this.onTouchMove.bind(this);

        this.resolution = { value: new Vec2() };

        this.onCheckDebounce = debounce(this.onCheck, 200);

        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.createGeometry();
        this.createFXAA();

        this.onResize();

        window.requestAnimationFrame(this.update.bind(this));

        this.addEventListeners();
    }

    createFXAA() {
        this.post = new Post(this.gl);
        this.fxaa = this.post.addPass({
            fragment: fxaa,
            uniforms: {
                uResolution: this.resolution
            }
        });
    }

    onTouchMove(event) {
        this.updateRay(event);
        this.isClicked = false;

        if (!this.isDown) return;

        if (!this.scrolling) {
            this.scrolling = true;
            if (this.timeoutShowInfo) this.timeoutShowInfo.kill();
            this.onScrollStart();
            this.launchInfoTimeout();
        }

        const x = event.touches ? event.touches[0].clientX : event.clientX;
        const distance = (this.start - x) * 0.015;

        this.scroll.target = this.scroll.position + distance;
    }

    createRenderer() {
        this.renderer = new Renderer();

        this.gl = this.renderer.gl;

        this.gl.clearColor(0.063, 0.063, 0.067, 1);

        this.dom.appendChild(this.gl.canvas);
    }

    createCamera() {
        this.camera = new Camera(this.gl);
        this.camera.fov = 45;
        this.camera.position.z = 20;
    }

    createScene() {
        this.scene = new Transform();
    }

    createGeometry() {
        this.planeGeometry = new Plane(this.gl, {
            heightSegments: 50,
            widthSegments: 100
        });
    }

    computePlaneSize() {
        const { height: sizeFromHeight } = this.sizeElement.getBoundingClientRect();

        let sizeFromWidth = 500;

        if (this.screen.width < BREAKPOINTS.s) {
            sizeFromWidth = 280;
        } else if (this.screen.width < BREAKPOINTS.m) {
            sizeFromWidth = 300;
        } else if (this.screen.width < BREAKPOINTS.xl) {
            sizeFromWidth = 350;
        } else if (this.screen.width < BREAKPOINTS.threexl) {
            sizeFromWidth = 450;
        }

        const size = Math.min(sizeFromHeight, sizeFromWidth);

        const height = (this.viewport.height * size) / this.screen.height;
        const width = (this.viewport.width * size) / this.screen.width;

        // - half of the window height + (size of header + size of margin) + half height of .canvas-size element
        const verticalOffset = -this.screen.height / 2 + (116 + 50) + sizeFromHeight / 2;

        const halfScreenIn3DSpace = (this.viewport.height * verticalOffset) / this.screen.height;

        const y = -halfScreenIn3DSpace;

        return {
            height,
            width,
            y
        };
    }

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

        this.resolution.value.set(this.gl.canvas.width, this.gl.canvas.height);

        const { height: planeHeight, width: planeWidth, y } = this.computePlaneSize();

        if (this.medias.length) {
            this.medias.forEach(media => {
                media.onResize({
                    screen: this.screen,
                    viewport: this.viewport,
                    height: planeHeight,
                    width: planeWidth,
                    y
                });
            });
            this.onCheckDebounce();
        }

        this.post.resize();
    }

    addMedias(medias) {
        const { height: planeHeight, width: planeWidth, y } = this.computePlaneSize();

        this.medias = medias.map(({ image, id }, index) => {
            const media = new Media({
                id,
                geometry: this.planeGeometry,
                gl: this.gl,
                image,
                index,
                length: medias.length,
                scene: this.scene,
                screen: this.screen,
                viewport: this.viewport,
                height: planeHeight,
                width: planeWidth,
                y
            });

            return media;
        });
    }

    update(now) {
        // convert to seconds
        now *= 0.001;

        this.deltaTime = now - this.previousTime;
        this.previousTime = now;

        if (this.medias) {
            this.medias.forEach(media => media.update(this.scroll, this.direction));
        }

        this.post.render({
            scene: this.scene,
            camera: this.camera
        });

        if (!this.disabled) window.requestAnimationFrame(this.update.bind(this));
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResizeEvent);

        this.sizeElement.addEventListener('mousemove', this.onTouchMoveEvent);
        this.sizeElement.addEventListener('touchmove', this.onTouchMoveEvent);
    }

    removeEventListeners() {
        window.removeEventListener('resize', this.onResizeEvent);

        this.sizeElement.removeEventListener('mousemove', this.onTouchMoveEvent);
        this.sizeElement.removeEventListener('touchmove', this.onTouchMoveEvent);
    }

    disable() {
        this.disabled = true;
        this.removeEventListeners();
    }

    enable({ dom, sizeElement }) {
        this.disabled = false;

        this.dom = dom;

        this.dom.appendChild(this.gl.canvas);

        this.onResize();
        window.requestAnimationFrame(this.update.bind(this));
        this.addEventListeners();
    }
}

export const Webgl = new WebglApp();
