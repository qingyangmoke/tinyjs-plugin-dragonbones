import glCore from 'pixi-gl-core';
import { default as Mesh } from '../Mesh';

const matrixIdentity = Tiny.Matrix.IDENTITY;

const MESH_VERT = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTransform;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;
}
`;

const MESH_FLAG = `
varying vec2 vTextureCoord;
uniform float alpha;
uniform vec3 tint;

uniform sampler2D uSampler;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord) * vec4(tint * alpha, alpha);
}
`;
/**
 * WebGL renderer plugin for tiling sprites
 *
 * @class
 */
export default class MeshRenderer extends Tiny.ObjectRenderer {

  /**
   * constructor for renderer
   *
   * @param {WebGLRenderer} renderer The renderer this tiling awesomeness works for.
   */
  constructor(renderer) {
    super(renderer);
    this.shader = null;
  }

  /**
   * Sets up the renderer context and necessary buffers.
   *
   * @private
   */
  onContextChange() {
    const gl = this.renderer.gl;

    this.shader = new Tiny.Shader(gl,
      MESH_VERT,
      MESH_FLAG);
  }

  /**
   * renders mesh
   *
   * @param {Mesh} mesh mesh instance
   */
  render(mesh) {
    const renderer = this.renderer;
    const gl = renderer.gl;
    const texture = mesh._texture;

    if (!texture.valid) {
      return;
    }

    let glData = mesh._glDatas[renderer.CONTEXT_UID];

    if (!glData) {
      renderer.bindVao(null);

      glData = {
        shader: this.shader,
        vertexBuffer: glCore.GLBuffer.createVertexBuffer(gl, mesh.vertices, gl.STREAM_DRAW),
        uvBuffer: glCore.GLBuffer.createVertexBuffer(gl, mesh.uvs, gl.STREAM_DRAW),
        indexBuffer: glCore.GLBuffer.createIndexBuffer(gl, mesh.indices, gl.STATIC_DRAW),
        // build the vao object that will render..
        vao: null,
        dirty: mesh.dirty,
        indexDirty: mesh.indexDirty,
      };

      // build the vao object that will render..
      glData.vao = new glCore.VertexArrayObject(gl)
        .addIndex(glData.indexBuffer)
        .addAttribute(glData.vertexBuffer, glData.shader.attributes.aVertexPosition, gl.FLOAT, false, 2 * 4, 0)
        .addAttribute(glData.uvBuffer, glData.shader.attributes.aTextureCoord, gl.FLOAT, false, 2 * 4, 0);

      mesh._glDatas[renderer.CONTEXT_UID] = glData;
    }

    renderer.bindVao(glData.vao);

    if (mesh.dirty !== glData.dirty) {
      glData.dirty = mesh.dirty;
      glData.uvBuffer.upload(mesh.uvs);
    }

    if (mesh.indexDirty !== glData.indexDirty) {
      glData.indexDirty = mesh.indexDirty;
      glData.indexBuffer.upload(mesh.indices);
    }

    glData.vertexBuffer.upload(mesh.vertices);

    renderer.bindShader(glData.shader);

    glData.shader.uniforms.uSampler = renderer.bindTexture(texture);

    renderer.state.setBlendMode(mesh.blendMode);

    if (glData.shader.uniforms.uTransform) {
      if (mesh.uploadUvTransform) {
        glData.shader.uniforms.uTransform = mesh._uvTransform.mapCoord.toArray(true);
      } else {
        glData.shader.uniforms.uTransform = matrixIdentity.toArray(true);
      }
    }
    glData.shader.uniforms.translationMatrix = mesh.worldTransform.toArray(true);
    glData.shader.uniforms.alpha = mesh.worldAlpha;
    glData.shader.uniforms.tint = mesh.tintRgb;

    const drawMode = mesh.drawMode === Mesh.DRAW_MODES.TRIANGLE_MESH ? gl.TRIANGLE_STRIP : gl.TRIANGLES;

    glData.vao.draw(drawMode, mesh.indices.length, 0);
  }
}

Tiny.WebGLRenderer.registerPlugin('mesh', MeshRenderer);
