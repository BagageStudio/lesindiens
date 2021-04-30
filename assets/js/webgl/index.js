import { Renderer, Camera, Transform, Plane, Vec2, Raycast, Post } from 'ogl';

import NormalizeWheel from 'normalize-wheel';
import { BREAKPOINTS } from '../constants';

import { debounce, lerp, round } from '../utils';
import { Media } from './Media';

import fxaa from './shaders/fxaa.glsl';

class WebglApp {
    init({ dom, sizeElement }) {
        this.dom = dom;

        this.previousTime = 0;
        this.deltaTime = 0;

        this.sizeElement = sizeElement;

        this.medias = [];

        this.scroll = {
            ease: 6.25,
            current: 0,
            target: 0,
            last: 0,
            speed: {
                ease: 10,
                current: 0,
                target: 0
            }
        };

        this.scrolling = false;

        this.resolution = { value: new Vec2() };

        this.onCheckDebounce = debounce(this.onCheck, 200);

        this.onSelected = null;
        this.onScrollChange = null;
        this.onScrollEnd = null;
        this.onScrollStart = null;
        this.showCursor = null;
        this.hideCursor = null;
        this.goToProject = null;

        this.isClicked = false;
        this.cursorOnSelected = false;

        this.selectedProject = null;

        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.createGeometry();
        this.createRaycast();
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

    createRaycast() {
        this.mouse = new Vec2();
        this.raycast = new Raycast(this.gl);
    }

    updateRay(e) {
        const meshes = this.medias.map(m => m.plane);

        // Just for the feedback in this example - reset each mesh's hit to false
        meshes.forEach(mesh => (mesh.isHit = false));

        if (this.scrolling) return;

        this.mouse.set(2.0 * (e.x / this.renderer.width) - 1.0, 2.0 * (1.0 - e.y / this.renderer.height) - 1.0);

        // Update the ray's origin and direction using the camera and mouse
        this.raycast.castMouse(this.camera, this.mouse);

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

        const updateHovered = index => {
            if (!hits[index]) {
                this.hideCursor();
                this.cursorOnSelected = false;
                this.hoveredProject = null;
                return;
            }
            if (hits[index].isTransparent) {
                updateHovered(index + 1);
            } else {
                hits[index].isHit = true;
                if (hits[index].isSelected) {
                    this.cursorOnSelected = true;
                    this.showCursor();
                } else {
                    this.hideCursor();
                    this.cursorOnSelected = false;
                }
                this.hoveredProject = hits[index];
            }
        };

        updateHovered(0);
    }

    onTouchDown(event) {
        this.isDown = true;
        this.isClicked = true;

        this.scroll.position = this.scroll.current;
        this.start = event.touches ? event.touches[0].clientX : event.clientX;
    }

    onTouchMove(event) {
        this.updateRay(event);
        this.isClicked = false;

        if (!this.isDown) return;

        if (!this.scrolling) {
            this.scrolling = true;
            this.onScrollStart();
        }

        const x = event.touches ? event.touches[0].clientX : event.clientX;
        const distance = (this.start - x) * 0.015;

        this.scroll.target = this.scroll.position + distance;
    }

    onMouseLeave(event) {
        if (this.isDown) this.onTouchUp(event);

        // Unselect current hovered project
        for (let index = 0; index < this.medias.length; index++) {
            const project = this.medias[index].plane;
            if (project.isHit) project.isHit = false;
        }
    }

    onTouchUp(event) {
        this.isDown = false;

        this.checkClick();

        this.onCheck();
    }

    selectProject(p) {
        console.log(p);
    }

    checkClick() {
        if (!this.isClicked) return;
        this.isClicked = false;
        if (this.cursorOnSelected) {
            this.goToProject(this.selectedProject);
        } else if (this.hoveredProject) {
            this.selectProject(this.hoveredProject);
        }
    }

    onWheel(event) {
        if (!this.scrolling) {
            this.scrolling = true;
            this.onScrollStart();
        }

        const normalized = NormalizeWheel(event);
        const speed = normalized.pixelY;

        this.scroll.target += speed * 0.009;
        this.onCheckDebounce();
    }

    onCheck() {
        this.scrolling = false;
        const { width } = this.medias[0];

        const itemIndex = Math.round(Math.abs(this.scroll.target / width));

        const item = width * itemIndex;

        let projectIndex;
        const index = itemIndex % this.medias.length;

        if (this.scroll.target < 0) {
            this.scroll.target = -item;
            projectIndex = index === 0 ? 0 : this.medias.length - index;
        } else {
            this.scroll.target = item;
            projectIndex = index;
        }

        this.medias.forEach(m => {
            m.plane.isSelected = false;
        });

        this.medias[projectIndex].plane.isSelected = true;
        this.onSelected(projectIndex);
        this.selectedProject = this.medias[projectIndex];
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

        this.selectedProject = this.medias[0];
    }

    update(now) {
        // convert to seconds
        now *= 0.001;

        this.deltaTime = now - this.previousTime;
        this.previousTime = now;

        this.scroll.current = round(lerp(this.scroll.current, this.scroll.target, this.scroll.ease * this.deltaTime));

        this.scroll.speed.target = round(this.scroll.current - this.scroll.last);

        this.scroll.speed.current = round(
            lerp(this.scroll.speed.current, this.scroll.speed.target, this.scroll.speed.ease * this.deltaTime)
        );

        if (this.scroll.current !== this.scroll.last) {
            this.onScrollChange(this.scroll.current, this.medias[0].widthTotal);
        } else if (this.onScrollEnd) {
            this.onScrollEnd();
        }

        if (this.scroll.current > this.scroll.last) {
            this.direction = 'right';
        } else {
            this.direction = 'left';
        }

        if (this.medias) {
            this.medias.forEach(media => media.update(this.scroll, this.direction));
        }

        this.scroll.last = this.scroll.current;

        this.post.render({
            scene: this.scene,
            camera: this.camera
        });

        window.requestAnimationFrame(this.update.bind(this));
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));

        window.addEventListener('mousewheel', this.onWheel.bind(this));
        window.addEventListener('wheel', this.onWheel.bind(this));

        this.sizeElement.addEventListener('mousedown', this.onTouchDown.bind(this));
        this.sizeElement.addEventListener('mousemove', this.onTouchMove.bind(this));
        this.sizeElement.addEventListener('mouseup', this.onTouchUp.bind(this));
        this.sizeElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));

        this.sizeElement.addEventListener('touchstart', this.onTouchDown.bind(this));
        this.sizeElement.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.sizeElement.addEventListener('touchend', this.onTouchUp.bind(this));
    }
}

export const Webgl = new WebglApp();
