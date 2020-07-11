Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  in vec4 color; // received from VS via RS
  in vec4 modelPosition; // received from VS via RS

  uniform struct {
    vec3 color1, color2;
    float width;
  } material;

  out vec4 fragmentColor;

  void main(void) {

    float phase = modelPosition.x + modelPosition.y;
      // normalization to make sure the fringe width is width
      if (fract(phase/(material.width * 2.0 * sqrt(2.0))) > 0.5) {
        fragmentColor.xyz = material.color1.xyz;
      } else {
        fragmentColor.xyz = material.color2.xyz;
      }

      fragmentColor.w = 1.0;
    
  }
`;