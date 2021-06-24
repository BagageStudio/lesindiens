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
    
    float factor=-.7;
    
    vec3 p=position;
    
    float startingSide=mix(.5,-.5,uDirectionOfRotation);
    
    // p.x=mix(startingSide,p.x,uScale);
    
    float x=p.x;
    
    // passer entre 0 -> 1 quand on est entre -1 -> 1
    x=(p.x+1.)*.5;
    // passer entre 1 -> 0 quand on est entre 0 -> 1
    // x=1.-x;
    x=mix(1.-x,x,uDirectionOfRotation);
    
    float offset=p.y*factor*x;
    
    p.y=p.y+offset*(1.-uScale);
    
    // // passer entre 1 -> 0 quand on est entre 0 -> 1
    // // if(uDirectionOfRotation>0.){
        //     //     //1
        //     //     x=1.-x;
    // // }
    // x=mix(x,1.-x,uDirectionOfRotation);
    
    // float speed=uRotation;
    
    // // Juste un facteur de mult
    // speed=speed*20.;
    
    // // On borne la speed, elle ne sera jamais plus grande que 2
    // speed=min(speed,6.);
    
    // //Applique la deformation en Z en fonction de la speed
    // p.z=-x*speed;
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}