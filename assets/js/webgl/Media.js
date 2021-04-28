import { Texture, Program, Mesh } from 'ogl';

import { gsap } from 'gsap';

import { clamp, map } from '../utils';
import { BREAKPOINTS } from '../constants';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

export class Media {
    constructor({ geometry, gl, image, index, length, renderer, scene, screen, viewport, width, height, id, y }) {
        this.id = id;
        this.hoverValue = 0;
        this.extra = 0;

        this.y = y;

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

        this.onResize({ width, height });
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

        if (this.index === 0) this.plane.isSelected = true;

        this.plane.setParent(this.scene);
    }

    computeDark(horizontalPos) {
        // We substract half the width to have the zero starts on the left of the plane

        return clamp(horizontalPos, 0, 1);
    }

    computeTransparency(horizontalPos) {
        const offset = this.gridPadding + this.columnWidth + this.columnPadding;
        const transparencyThreshold = (offset / this.viewport.width) * 1.4;

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
        const horizontalHalf = viewportOffset - this.gridOffset;

        // We substract half the width to have the zero starts on the left of the plane
        const horizontalPos = map(this.plane.position.x - planeOffset, -horizontalHalf, horizontalHalf, 0, 1);

        const depth = horizontalPos * -10;
        const dark = this.computeDark(horizontalPos);
        const transparency = this.computeTransparency(horizontalPos);

        if (transparency > 0.5 && !this.plane.isTransparent) this.plane.isTransparent = true;
        if (transparency < 0.1 && this.plane.isTransparent) this.plane.isTransparent = false;

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

    onResize({ screen, viewport, width, height, y } = {}) {
        this.extra = 0;

        if (y) this.y = y;

        if (screen) {
            this.screen = screen;
        }

        if (viewport) {
            this.viewport = viewport;
            this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
        }

        this.plane.scale.y = height;
        this.plane.scale.x = width;

        this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

        this.padding = -3;

        this.width = this.plane.scale.x + this.padding;

        this.widthTotal = this.width * this.length;

        const gridPadding = this.screen.width < BREAKPOINTS.xl ? 20 : 50;

        this.gridPadding = gridPadding * (this.viewport.width / this.screen.width);
        this.columnPadding = 10 * (this.viewport.width / this.screen.width);

        this.columnWidth = (this.viewport.width - this.gridPadding * 2) / 12;

        if (this.screen.width < BREAKPOINTS.xl) {
            this.gridOffset = this.gridPadding + this.columnPadding;
        } else {
            this.gridOffset = this.gridPadding + this.columnWidth + this.columnPadding;
        }

        // To start the placement at the left of the screen instead of the center
        const offset = this.viewport.width / 2 - this.plane.scale.x / 2 - this.gridOffset;

        this.x = this.width * this.index - offset;

        this.plane.position.y = this.y;
    }
}
