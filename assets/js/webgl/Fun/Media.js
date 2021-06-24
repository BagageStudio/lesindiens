import { Texture, Program, Mesh } from 'ogl';

import { gsap } from 'gsap';

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import { FunGL } from './index';

const TIME_TO_APPEAR = 0.8;
const TIME_TO_DISAPPEAR = 1;

export class Media {
    constructor({ geometry, gl, texture, inertia, index, scene, screen, viewport, width, height, id, y, x }) {
        this.screen = screen;
        this.viewport = viewport;
        this.gl = gl;

        this.scene = scene;
        this.geometry = geometry;

        this.width = 0;
        this.finalWidth = width;
        this.height = height;

        this.index = index;
        this.y = y;
        this.x = x;
        this.inertia = inertia;

        this.texture = texture;

        this.opacity = 1;
        this.scale = 0;

        this.rotation = -0.2;
        // 0 ou 1
        this.directionOfRotation = (Math.sign(this.inertia.x) + 1) * 0.5;

        this.createShader();
        this.createMesh();

        this.onResize();

        const tl = gsap.timeline({
            onComplete: () => {
                FunGL.removeMedia(this.index);
            }
        });

        tl.to(
            this,
            {
                ease: 'expo.out',
                opacity: 1,
                width: this.finalWidth,
                scale: 1,
                duration: TIME_TO_APPEAR
            },
            'start'
        )
            .to(this, {
                opacity: 0,
                duration: TIME_TO_DISAPPEAR
            })
            .to(
                this.plane.position,
                {
                    x: this.plane.position.x + this.inertia.x,
                    y: this.plane.position.y + this.inertia.y,
                    duration: TIME_TO_APPEAR + TIME_TO_DISAPPEAR
                },
                'start'
            );
    }

    createShader() {
        const texture = new Texture(this.gl, {
            generateMipmaps: false
        });
        texture.image = this.texture.image;

        this.program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                tMap: { value: texture },
                uPlaneSizes: { value: [0, 0] },
                uImageSizes: { value: [this.texture.naturalWidth, this.texture.naturalHeight] },
                uRotation: { value: this.rotation },
                uDirectionOfRotation: { value: this.directionOfRotation },
                uTransparency: { value: 0 },
                uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
                uOpacity: { value: 1 },
                uScale: { value: 0 },
                uTime: { value: 0 }
            },
            transparent: true
        });
    }

    createMesh() {
        this.plane = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        });

        this.plane.setParent(this.scene);
    }

    updateIndex(index) {
        this.index = index;
        this.plane.position.z = this.index * 0.001;
    }

    update() {
        this.plane.scale.x = this.width;
        // this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
        this.plane.program.uniforms.uOpacity.value = this.opacity;
        this.plane.program.uniforms.uScale.value = this.scale;
        this.plane.program.uniforms.uRotation.value = this.rotation;
    }

    onResize({ screen, viewport, width, height, y, x } = {}) {
        if (y) this.y = y;
        if (x) this.x = x;
        if (width) this.width = width;
        if (height) this.height = height;

        this.plane.position.x = this.x;
        this.plane.position.y = this.y;
        this.plane.position.z = this.index * 0.001;

        if (screen) {
            this.screen = screen;
        }

        if (viewport) {
            this.viewport = viewport;
            this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
        }

        this.plane.scale.y = this.height;
        this.plane.scale.x = this.width;

        this.plane.program.uniforms.uPlaneSizes.value = [this.finalWidth, this.height];
    }
}
