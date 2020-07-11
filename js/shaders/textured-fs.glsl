Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec2 texCoord; // pass this on from vertex shader

  uniform struct{
  sampler2D colorTexture;
  } material;

  uniform struct {
    mat4 modelMatrix;
    vec2 boomOffset;
  } gameObject;

  
  void main(void) {

    fragmentColor = texture(material.colorTexture, texCoord + gameObject.boomOffset);
    
  }
`;