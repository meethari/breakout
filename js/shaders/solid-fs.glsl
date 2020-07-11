Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  in vec4 color; // received from VS via RS

  uniform struct {
    vec3 solidColor;
  } material;

  out vec4 fragmentColor;

  void main(void) {

    fragmentColor.xyz = material.solidColor;
    fragmentColor.w = 1.0;

    
  }
`;