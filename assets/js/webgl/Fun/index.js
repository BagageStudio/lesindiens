import { distance } from '../../utils';
import fxaa from '../shaders/fxaa.glsl';
import { Media } from './Media';
import { Renderer, Camera, Transform, Plane, Vec2, Post } from '~/assets/js/ogl/index';

const DELAY_BETWEEN_IMAGES = 0;
const DISTANCE_BETWEEN_IMAGES = 0.45;

class GL {
    async init({ dom, sizeElement, images }) {
        this.dom = dom;
        this.domRect = dom.getBoundingClientRect();
        this.sizeElement = sizeElement;

        this.disabled = false;

        this.previousTime = 0;
        this.deltaTime = 0;
        this.timeSinceLastImage = DELAY_BETWEEN_IMAGES;
        this.lastImagePos = null;

        this.medias = [];
        this.textures = [];
        this.currentTexture = 0;

        this.mousePos = {
            x: 0,
            y: 0
        };
        this.lastMouse = new Vec2();
        this.mouseVelocity = new Vec2();
        this.mouseVelocitySpeed = 0;
        this.mouse = new Vec2();

        this.scrolling = false;
        this.scrollEnded = true;
        this.hovering = false;

        this.touchMoveTicking = false;

        this.onResizeEvent = this.onResize.bind(this);
        this.onMouseLeaveEvent = this.onMouseLeave.bind(this);
        this.onTouchMoveEvent = this.onTouchMove.bind(this);

        this.resolution = { value: new Vec2() };

        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.createGeometry();
        this.createFXAA();

        this.onResize();

        window.requestAnimationFrame(this.update.bind(this));

        await this.loadImages(images);

        this.addEventListeners();
    }

    createFXAA() {
        this.post = new Post(this.gl);
        // this.fxaa = this.post.addPass({
        //     fragment: fxaa,
        //     uniforms: {
        //         uResolution: this.resolution
        //     }
        // });
    }

    onTouchMove(e) {
        if (!this.touchMoveTicking) {
            requestAnimationFrame(() => {
                this.touchMoveUpdate(e);
            });
        }
        this.touchMoveTicking = true;
    }

    touchMoveUpdate(e) {
        this.touchMoveTicking = false;

        if (!this.hovering) this.hovering = true;
        const domRect = this.dom.getBoundingClientRect();

        this.mousePos = {
            y: e.y - domRect.top - this.domRect.height / 2,
            x: e.x - this.domRect.width / 2
        };

        const aspect = this.gl.canvas.width / this.gl.canvas.height;

        const sceneX = ((aspect * this.mousePos.x) / this.domRect.width) * 2;
        const sceneY = (this.mousePos.y / -this.domRect.height) * 2;

        this.lastMouse.copy(this.mouse);
        this.mouse.set(sceneX, sceneY);

        if (this.lastImagePos === null) {
            this.addImage();
            return;
        }

        const distanceToLastImage = distance(this.lastImagePos, this.mouse);
        if (this.hovering && distanceToLastImage >= DISTANCE_BETWEEN_IMAGES) {
            this.timeSinceLastImage = 0;
            this.addImage();
        }
    }

    onMouseLeave(event) {
        this.hovering = false;
    }

    createRenderer() {
        this.renderer = new Renderer({ alpha: true });

        this.gl = this.renderer.gl;

        this.gl.clearColor(0, 0, 0, 0);

        this.dom.appendChild(this.gl.canvas);
    }

    createCamera() {
        const aspect = this.gl.canvas.width / this.gl.canvas.height;
        this.camera = new Camera(this.gl, {
            left: -1 * aspect,
            right: 1 * aspect,
            top: 1,
            bottom: -1
        });
        this.camera.position.z = 60;
    }

    createScene() {
        this.scene = new Transform();
    }

    createGeometry() {
        this.planeGeometry = new Plane(this.gl);
    }

    computePlaneSize() {
        return {
            height: 0.5,
            width: 0.5
        };
    }

    onResize() {
        this.screen = {
            height: window.innerHeight,
            width: window.innerWidth
        };
        this.domRect = this.dom.getBoundingClientRect();

        this.renderer.setSize(this.domRect.width, this.domRect.height);

        const aspect = this.gl.canvas.width / this.gl.canvas.height;

        this.camera.orthographic({
            left: -1 * aspect,
            right: 1 * aspect,
            top: 1,
            bottom: -1
        });

        this.resolution.value.set(this.gl.canvas.width, this.gl.canvas.height);
        this.post.resize();
    }

    getClampedInertia(value) {
        const maxInertia = 0.2;

        if (value >= 0) {
            return Math.min(value, maxInertia);
        } else {
            return Math.max(value, -maxInertia);
        }
    }

    addImage() {
        const { height: planeHeight, width: planeWidth } = this.computePlaneSize();
        const { x, y } = this.mouse;
        this.lastImagePos = { x, y };

        this.mouseVelocity.copy(this.mouse).sub(this.lastMouse);

        const inertia = {
            x: this.getClampedInertia(this.mouseVelocity.x),
            y: this.getClampedInertia(this.mouseVelocity.y)
        };

        const texture = this.textures[this.currentTexture];
        this.currentTexture = this.currentTexture === this.textures.length - 1 ? 0 : this.currentTexture + 1;

        const index = this.medias.length;

        const media = new Media({
            geometry: this.planeGeometry,
            gl: this.gl,
            scene: this.scene,
            screen: this.screen,
            height: planeHeight,
            width: planeWidth,
            texture,
            y,
            x,
            index,
            inertia
        });

        this.medias.push(media);
    }

    removeMedia(index) {
        this.medias.splice(index, 1);
        this.medias.forEach((media, index) => media.updateIndex(index));
    }

    async loadImages(images) {
        const promises = [];
        this.textures = images.map(img => {
            const image = new Image();

            image.crossOrigin = 'Anonymous';
            image.src = img.image;
            const loadPromise = new Promise((resolve, reject) => {
                image.onload = _ => {
                    const { naturalWidth, naturalHeight } = image;
                    resolve({
                        image,
                        naturalWidth,
                        naturalHeight
                    });
                };
            });
            promises.push(loadPromise);
        });
        this.textures = await Promise.all(promises);
    }

    update(now) {
        // convert to seconds
        now *= 0.001;

        this.deltaTime = now - this.previousTime;
        this.previousTime = now;

        if (this.medias) {
            this.medias.forEach(media => media.update());
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
        this.sizeElement.addEventListener('mouseleave', this.onMouseLeaveEvent);
    }

    removeEventListeners() {
        window.removeEventListener('resize', this.onResizeEvent);

        this.sizeElement.removeEventListener('mousemove', this.onTouchMoveEvent);
        this.sizeElement.removeEventListener('touchmove', this.onTouchMoveEvent);
        this.sizeElement.removeEventListener('mouseleave', this.onMouseLeaveEvent);
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

export const FunGL = new GL();
