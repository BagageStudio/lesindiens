precision highp float;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform float uDark;
uniform float uOpacity;
uniform float uTransparency;
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
    
    vec4 final=texture2D(tMap,uv);
    
    final.a=uOpacity;
    
    gl_FragColor=final;
    
}