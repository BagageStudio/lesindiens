precision highp float;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform float uHorizontalPos;
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

    vec4 backgroundColor = vec4(0.063,0.063,0.067, 1.);

    vec4 final = mix(texture2D(tMap, uv), backgroundColor, uHorizontalPos);

    gl_FragColor = final;

}