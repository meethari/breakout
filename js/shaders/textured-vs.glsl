Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  in vec2 vertexTexCoord;
  
  out vec2 texCoord;
  out vec4 modelPosition; // passed to fragment shader

  uniform struct {
    mat4 viewProjMatrix;
  } camera;

  uniform struct {
    mat4 modelMatrix;
    vec2 boomOffset;
  } gameObject;

  

  void main(void) {

    gl_Position = vertexPosition * gameObject.modelMatrix * camera.viewProjMatrix;
    modelPosition = vertexPosition;
    texCoord = vertexTexCoord;
  }
`;