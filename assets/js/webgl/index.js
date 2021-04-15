import { Renderer, Camera, Transform, Plane, Vec2, Raycast } from 'ogl';

import NormalizeWheel from 'normalize-wheel';
import { Media } from './Media';

const lerp = (start, end, ease) => {
    return start + (end - start) * ease;
};

const round = n => {
    return Math.round(n * 1000000) / 1000000;
};

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

class WebglApp {
    init({ dom }) {
        this.gridPadding = 0.85;
        this.columnPadding = 0.15;

        this.dom = dom;

        this.medias = [];

        this.scroll = {
            ease: 0.05,
            current: 0,
            target: 0,
            last: 0,
            speed: {
                ease: 0.08,
                current: 0,
                target: 0
            }
        };

        this.onCheckDebounce = debounce(this.onCheck, 200);

        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.createGeometry();
        this.createRaycast();

        this.onResize();

        this.update();

        this.addEventListeners();
    }

    createRaycast() {
        this.mouse = new Vec2();

        // Create a raycast object
        this.raycast = new Raycast(this.gl);
    }

    updateRay(e) {
        this.mouse.set(2.0 * (e.x / this.renderer.width) - 1.0, 2.0 * (1.0 - e.y / this.renderer.height) - 1.0);

        // Update the ray's origin and direction using the camera and mouse
        this.raycast.castMouse(this.camera, this.mouse);

        const meshes = this.medias.map(m => m.plane);

        // Just for the feedback in this example - reset each mesh's hit to false
        meshes.forEach(mesh => (mesh.isHit = false));

        // raycast.intersectBounds will test against the bounds of each mesh, and
        // return an array of intersected meshes in order of closest to farthest
        const hits = this.raycast.intersectBounds(meshes);

        // Can intersect with geometry if the bounds aren't enough, or if you need
        // to find out the uv or normal value at the hit point.
        // Optional arguments include backface culling `cullFace`, and `maxDistance`
        // Both useful for doing early exits to help optimise.
        // const hits = raycast.intersectMeshes(meshes, {
        //     cullFace: true,
        //     maxDistance: 10,
        //     includeUV: true,
        //     includeNormal: true,
        // });
        // if (hits.length) console.log(hits[0].hit.uv);

        // Update our feedback using this array
        // hits.forEach(mesh => (mesh.isHit = true));
        if (hits[0]) hits[0].isHit = true;
    }

    onTouchDown(event) {
        this.isDown = true;

        this.scroll.position = this.scroll.current;
        this.start = event.touches ? event.touches[0].clientX : event.clientX;
    }

    onTouchMove(event) {
        this.updateRay(event);

        if (!this.isDown) return;

        const x = event.touches ? event.touches[0].clientX : event.clientX;
        const distance = (this.start - x) * 0.015;

        this.scroll.target = this.scroll.position + distance;
    }

    onTouchUp(event) {
        this.isDown = false;

        this.onCheck();
    }

    onWheel(event) {
        const normalized = NormalizeWheel(event);
        const speed = normalized.pixelY;

        this.scroll.target += speed * 0.006;
        this.onCheckDebounce();
    }

    onCheck() {
        const { width } = this.medias[0];

        const itemIndex = Math.round(Math.abs(this.scroll.target / width));

        const item = width * itemIndex;

        if (this.scroll.target < 0) {
            this.scroll.target = -item;
        } else {
            this.scroll.target = item;
        }
    }

    createRenderer() {
        this.renderer = new Renderer();

        this.gl = this.renderer.gl;

        this.gl.clearColor(0.063, 0.063, 0.067, 1);
        // this.gl.clearColor(1, 0, 0, 1);

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
        this.scale = this.screen.width / 3000;

        const height = (this.viewport.height * 500) / this.screen.height;
        const width = (this.viewport.width * 500) / this.screen.width;
        return {
            height,
            width
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

        this.columnWidth = (this.viewport.width - this.gridPadding * 2) / 12;

        const { height: planeHeight, width: planeWidth } = this.computePlaneSize();

        if (this.medias.length) {
            this.medias.forEach(media => {
                media.onResize({
                    screen: this.screen,
                    viewport: this.viewport,
                    height: planeHeight,
                    width: planeWidth
                });
            });
            this.onCheckDebounce();
        }
    }

    addMedias(medias) {
        const { height: planeHeight, width: planeWidth } = this.computePlaneSize();

        this.medias = medias.map((image, index) => {
            const media = new Media({
                geometry: this.planeGeometry,
                gl: this.gl,
                image,
                index,
                length: medias.length,
                scene: this.scene,
                screen: this.screen,
                viewport: this.viewport,
                height: planeHeight,
                width: planeWidth
            });

            return media;
        });
    }

    update() {
        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);

        this.scroll.speed.target = round(this.scroll.current - this.scroll.last);

        this.scroll.speed.current = round(
            lerp(this.scroll.speed.current, this.scroll.speed.target, this.scroll.speed.ease)
        );

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

        // if (count < 5)
        // count += 1;
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
