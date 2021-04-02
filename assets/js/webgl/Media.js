import { Texture, Program, Mesh } from 'ogl';

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

function map(num, min1, max1, min2, max2, round = false) {
    const num1 = (num - min1) / (max1 - min1);
    const num2 = num1 * (max2 - min2) + min2;

    if (round) return Math.round(num2);

    return num2;
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

export class Media {
    constructor({ geometry, gl, image, index, length, renderer, scene, screen, viewport }) {
        this.extra = 0;

        this.geometry = geometry;
        this.gl = gl;
        this.image = image;

        this.index = index;
        this.length = length;
        this.scene = scene;

        this.screen = screen;
        this.viewport = viewport;

        this.createShader();
        this.createMesh();

        this.onResize();
    }

    createShader() {
        const texture = new Texture(this.gl, {
            generateMipmaps: false
        });

        this.program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                tMap: { value: texture },
                uPlaneSizes: { value: [0, 0] },
                uImageSizes: { value: [0, 0] },
                uHorizontalPos: { value: 0 },
                uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
                uSpeed: { value: 0 },
                uTime: { value: 0 }
            },
            transparent: true
        });

        const image = new Image();

        image.crossOrigin = 'Anonymous';
        image.src = this.image;
        image.onload = _ => {
            texture.image = image;

            this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
        };
    }

    createMesh() {
        this.plane = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        });

        this.plane.setParent(this.scene);
    }

    update(scroll, direction) {
        this.plane.position.x = this.x - scroll.current * 1.5 - this.extra;

        const planeOffset = this.plane.scale.x / 2;
        const viewportOffset = this.viewport.width / 2;

        const horizontalHalf = viewportOffset;

        const fullHorizontal = horizontalHalf * 2;

        const unclampedHorizontalPos = (this.plane.position.x + horizontalHalf) / fullHorizontal;
        const horizontalPos = clamp(unclampedHorizontalPos, 0, 1);

        // 1 - horizontalPos is to reverse to horizontalPos value

        this.plane.position.z = (1 - horizontalPos) * 10;

        this.plane.program.uniforms.uHorizontalPos.value = horizontalPos;
        this.plane.program.uniforms.uSpeed.value = scroll.speed.current;

        this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
        this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

        if (direction === 'right' && this.isBefore) {
            this.extra -= this.widthTotal;

            this.isBefore = false;
            this.isAfter = false;
        }

        if (direction === 'left' && this.isAfter) {
            this.extra += this.widthTotal;

            this.isBefore = false;
            this.isAfter = false;
        }
    }

    onResize({ screen, viewport } = {}) {
        if (screen) {
            this.screen = screen;
        }

        if (viewport) {
            this.viewport = viewport;

            this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
        }

        this.scale = this.screen.height / 1500;

        this.plane.scale.y = (this.viewport.height * (400 * this.scale)) / this.screen.height;
        this.plane.scale.x = (this.viewport.width * (400 * this.scale)) / this.screen.width;

        this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

        this.padding = -1;

        this.width = this.plane.scale.x + this.padding;

        this.widthTotal = this.width * this.length;

        this.x = this.width * this.index;
    }
}
