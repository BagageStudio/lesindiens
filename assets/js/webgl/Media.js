import { Texture, Program, Mesh } from 'ogl';

import { gsap } from 'gsap';

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

const lerp = (start, end, ease) => {
    return start + (end - start) * ease;
};

export class Media {
    constructor({ geometry, gl, image, index, length, renderer, scene, screen, viewport }) {
        this.hoverValue = 0;
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
                uDark: { value: 0 },
                uTransparency: { value: 0 },
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

    computeDepth() {}

    computeDark(horizontalPos) {
        // We substract half the width to have the zero starts on the left of the plane

        return clamp(horizontalPos, 0, 1);
    }

    computeTransparency(horizontalPos) {
        const transparencyThreshold = this.viewport.width * 0.005;

        let transparency = clamp(horizontalPos, -transparencyThreshold, 1);

        transparency = transparency < 0 ? (Math.abs(transparency) * 1) / transparencyThreshold : 0;

        return transparency;
    }

    update(scroll, direction) {
        if (this.plane.isHit) {
            gsap.to(this, {
                duration: 0.6,
                hoverValue: 0.15
            });
        } else {
            gsap.to(this, {
                duration: 0.6,
                hoverValue: 0
            });
        }

        this.plane.position.x = this.x - scroll.current - this.extra;

        const planeOffset = this.plane.scale.x / 2;
        const viewportOffset = this.viewport.width / 2;
        const horizontalHalf = viewportOffset - this.gridPadding - this.columnWidth - this.columnPadding;

        // We substract half the width to have the zero starts on the left of the plane
        const horizontalPos = map(this.plane.position.x - planeOffset, -horizontalHalf, horizontalHalf, 0, 1);

        const depth = horizontalPos * -10;
        const dark = this.computeDark(horizontalPos);
        const transparency = this.computeTransparency(horizontalPos);

        this.plane.position.z = depth;

        this.plane.program.uniforms.uDark.value = dark;
        this.plane.program.uniforms.uTransparency.value = transparency;
        this.plane.program.uniforms.uSpeed.value = this.hoverValue + scroll.speed.current;

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

        this.scale = this.screen.width / 3000;

        this.plane.scale.y = (this.viewport.height * (800 * this.scale)) / this.screen.height;
        this.plane.scale.x = (this.viewport.width * (800 * this.scale)) / this.screen.width;

        this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

        this.padding = -3;

        this.width = this.plane.scale.x + this.padding;

        this.widthTotal = this.width * this.length;

        this.gridPadding = 50 * (this.viewport.width / this.screen.width);
        this.columnPadding = 10 * (this.viewport.width / this.screen.width);

        this.columnWidth = (this.viewport.width - this.gridPadding * 2) / 12;

        // To start the placement at the left of the screen instead of the center
        const offset =
            this.viewport.width / 2 - this.plane.scale.x / 2 - this.gridPadding - this.columnWidth - this.columnPadding;

        this.x = this.width * this.index - offset;
    }
}
