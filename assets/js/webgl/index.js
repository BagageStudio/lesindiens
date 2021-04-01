import { Renderer, Camera, Transform, Program, Mesh, Plane, Sphere, Box, Cylinder, Orbit, Mat4 } from 'ogl';

import NormalizeWheel from 'normalize-wheel';
import { Media } from './Media';

const lerp = (start, end, ease) => {
    return start * (1 - ease) + end * ease;
};

class WebglApp {
    init({ dom }) {
        this.dom = dom;

        this.medias = [];

        this.scroll = {
            ease: 0.1,
            current: 0,
            target: 0,
            last: 0
        };

        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.createGeometry();

        this.onResize();

        this.update();

        this.addEventListeners();
    }

    onTouchDown(event) {
        this.isDown = true;

        this.scroll.position = this.scroll.current;
        this.start = event.touches ? event.touches[0].clientX : event.clientX;
    }

    onTouchMove(event) {
        if (!this.isDown) return;

        const x = event.touches ? event.touches[0].clientX : event.clientX;
        const distance = (this.start - x) * 0.01;

        this.scroll.target = this.scroll.position + distance;
    }

    onTouchUp(event) {
        this.isDown = false;
    }

    onWheel(event) {
        const normalized = NormalizeWheel(event);
        const speed = normalized.pixelY;

        this.scroll.target += speed * 0.003;
    }

    createRenderer() {
        this.renderer = new Renderer();

        this.gl = this.renderer.gl;

        this.gl.clearColor(0.79607843137, 0.79215686274, 0.74117647058, 1);

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

        if (this.medias) {
            this.medias.forEach(media =>
                media.onResize({
                    screen: this.screen,
                    viewport: this.viewport
                })
            );
        }
    }

    addMedias(medias) {
        this.medias = medias.map((image, index) => {
            const media = new Media({
                geometry: this.planeGeometry,
                gl: this.gl,
                image,
                index,
                length: medias.length,
                scene: this.scene,
                screen: this.screen,
                viewport: this.viewport
            });

            return media;
        });
    }

    update() {
        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);

        if (this.scroll.current > this.scroll.last) {
            this.direction = 'right';
        } else {
            this.direction = 'left';
        }

        if (this.medias) {
            this.medias.forEach(media => media.update(this.scroll, this.direction));
        }

        this.scroll.last = this.scroll.current;

        this.renderer.render({
            scene: this.scene,
            camera: this.camera
        });

        window.requestAnimationFrame(this.update.bind(this));
    }

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
    }
}

export const Webgl = new WebglApp();
