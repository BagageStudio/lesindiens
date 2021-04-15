precision highp float;
// Default uniform for previous pass is 'tMap'.
// Can change this using the 'textureUniform' property
// when adding a pass.
uniform sampler2D tMap;
uniform vec2 uResolution;
varying vec2 vUv;
vec4 fxaa(sampler2D tex,vec2 uv,vec2 resolution){
    vec2 pixel=vec2(1)/resolution;
    vec3 l=vec3(.299,.587,.114);
    float lNW=dot(texture2D(tex,uv+vec2(-1,-1)*pixel).rgb,l);
    float lNE=dot(texture2D(tex,uv+vec2(1,-1)*pixel).rgb,l);
    float lSW=dot(texture2D(tex,uv+vec2(-1,1)*pixel).rgb,l);
    float lSE=dot(texture2D(tex,uv+vec2(1,1)*pixel).rgb,l);
    float lM=dot(texture2D(tex,uv).rgb,l);
    float lMin=min(lM,min(min(lNW,lNE),min(lSW,lSE)));
    float lMax=max(lM,max(max(lNW,lNE),max(lSW,lSE)));
    
    vec2 dir=vec2(
        -((lNW+lNE)-(lSW+lSE)),
        ((lNW+lSW)-(lNE+lSE))
    );
    
    float dirReduce=max((lNW+lNE+lSW+lSE)*.03125,.0078125);
    float rcpDirMin=1./(min(abs(dir.x),abs(dir.y))+dirReduce);
    dir=min(vec2(8,8),max(vec2(-8,-8),dir*rcpDirMin))*pixel;
    
    vec3 rgbA=.5*(texture2D(tex,uv+dir*(1./3.-.5)).rgb+texture2D(tex,uv+dir*(2./3.-.5)).rgb);
    
    vec3 rgbB=rgbA*.5+.25*(texture2D(tex,uv+dir*-.5).rgb+texture2D(tex,uv+dir*.5).rgb);
    float lB=dot(rgbB,l);
    return mix(
        vec4(rgbB,1),
        vec4(rgbA,1),
        max(sign(lB-lMin),0.)*max(sign(lB-lMax),0.)
    );
}

void main(){
    vec4 raw=texture2D(tMap,vUv);
    vec4 aa=fxaa(tMap,vUv,uResolution);
    // Split screen in half to show side-by-side comparison
    gl_FragColor=aa;
    // Darken left side a tad for clarity
}