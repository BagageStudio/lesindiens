precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uRotation;
uniform float uScale;
uniform float uDirectionOfRotation;
uniform float uHorizontalPos;

varying vec2 vUv;

void main(){
    vUv=uv;
    
    // float factor=.3;
    float factor=-.7;
    
    vec3 p=position;
    
    float x=p.x;
    
    x=(p.x+1.)*.5;
    x=mix(1.-x,x,uDirectionOfRotation);
    
    // x=mix(x,1.-x,uDirectionOfRotation);
    
    float offset=p.y*factor*x;
    p.y=p.y+offset*(1.-uScale);
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}