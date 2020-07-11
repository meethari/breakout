"use strict";
/* exported CircleGeometry */
class CircleGeometry {

  generateVertices(sectorCount) {
    // sectorCount = number of points on inner circle and outer circle

    var vertexList = [];

    const r1 = 0.0, r2 = 1;
    const increment = 2 * Math.PI / sectorCount;

    for (var i = 0; i < sectorCount; i++) {
      const phi = i * increment;
      vertexList.push(r1 * Math.cos(phi), r1 * Math.sin(phi), 0.5)
    }

    for (var i = 0; i < sectorCount; i++) {
      const phi = i * increment;
      vertexList.push(r2 * Math.cos(phi), r2 * Math.sin(phi), 0.5)
    }

    return vertexList;

  }

  generateTriangles(sectorCount) {
    var triangleList = [];

    for (var i = 0; i < sectorCount - 1; i++) {
      triangleList.push(i, i + 1, i + sectorCount);
      triangleList.push(i + 1, i + sectorCount + 1, i + sectorCount);
    }

    // last sector
    triangleList.push(sectorCount - 1, 0, 2 * sectorCount -1);
    triangleList.push(0,  sectorCount, 2 * sectorCount -1);

    return triangleList;


  }

  generateColors(sectorCount) {
    var colors = [];
    for (var i = 0; i < 2 * sectorCount; i++) {
      colors.push(0, 0, 0);
    }
    return colors;
  }


  constructor(gl) {

    this.sectorCount = 50;
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(this.generateVertices(this.sectorCount)),
      gl.STATIC_DRAW);
    
    // create buffer for coloring vertices
    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(this.generateColors(this.sectorCount)),
      gl.STATIC_DRAW);

    // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.generateTriangles(this.sectorCount)),
      gl.STATIC_DRAW);

    // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
    this.inputLayout = gl.createVertexArray();
    gl.bindVertexArray(this.inputLayout);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,
      3, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,
      3, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    gl.bindVertexArray(null);
  }

  draw() {
    const gl = this.gl;

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  

    gl.drawElements(gl.TRIANGLES, 3 * this.sectorCount * 2, gl.UNSIGNED_SHORT, 0);
  }
}
