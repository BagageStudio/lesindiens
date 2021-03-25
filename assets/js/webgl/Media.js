import { Texture, Program, Mesh } from 'ogl';

// import fragment from './shaders/fragment';
// import vertex from './shaders/vertex';

const fragment = `
    precision highp float;

    uniform vec2 uImageSizes;
    uniform vec2 uPlaneSizes;
    uniform sampler2D tMap;

    varying vec2 vUv;

    void main(){
        vec2 ratio=vec2(
            min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.),
            min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.)
        );
        
        vec2 uv=vec2(
            vUv.x*ratio.x+(1.-ratio.x)*.5,
            vUv.y*ratio.y+(1.-ratio.y)*.5
        );
        
        gl_FragColor.rgb = texture2D(tMap, uv).rgb;
        gl_FragColor.a = 1.0;
    }
`;
const vertex = `
    precision highp float;

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;

    void main(){
        vUv=uv;
        
        vec3 p=position;
        
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    }
`;

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
                uViewportSizes: { value: [this.viewport.width, this.viewport.height] }
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

        this.plane.scale.y = (this.viewport.height * (700 * this.scale)) / this.screen.height;
        this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;

        this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

        this.padding = 2;

        this.width = this.plane.scale.x + this.padding;

        this.widthTotal = this.width * this.length;

        this.x = this.width * this.index;
    }
}
