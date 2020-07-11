Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  in vec4 vertexColor;

   uniform struct {
    mat4 modelMatrix;
  } gameObject;

  uniform struct {
    mat4 viewProjMatrix;
  } camera;


  out vec4 color; // passed to FS
  out vec4 modelPosition; // passed to fragment shader

  void main(void) {

    gl_Position = vertexPosition * gameObject.modelMatrix * camera.viewProjMatrix;
    modelPosition = vertexPosition;
    color = vertexColor;

  }
`;