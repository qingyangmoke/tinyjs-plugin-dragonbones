import {default as dragonBones} from '../libs/dragonBones';
import {default as BlendMode} from './BlendMode';
import {default as TinyTextureAtlasData} from './TinyTextureAtlasData';
const {BaseObject, Slot} = dragonBones;
/**
 * @language zh_CN
 * Tiny 插槽。
 *
 * @class TinySlot
 * @memberof Tiny.DragonBones
 * @version DragonBones 3.0
 */
class TinySlot extends Slot {
  /**
   * @internal
   * @private
   */
  constructor() {
    super();
    /**
     * { Tiny.DisplayObject }
     * @private
     */
    this._renderDisplay = null;
    this._updateTransform = Tiny.VERSION[0] === '3' ? this._updateTransformV3 : this._updateTransformV4;
  }

  /**
   * @private
   */
  static toString() {
    return '[class TinySlot]';
  }

  /**
   * @private
   */
  _onClear() {
    super._onClear();
    this._renderDisplay = null;
  }

  /**
   * @private
   */
  _initDisplay(value) {
  }

  /**
   * @private
   * @param {Tiny.DisplayObject} value
   */
  _disposeDisplay(value) {
    // Tiny.DisplayObject
    value.destroy();
  }

  /**
   * @private
   */
  _onUpdateDisplay() {
    this._renderDisplay = (this._display ? this._display : this._rawDisplay);// as Tiny.DisplayObject;
  }

  /**
   * @private
   */
  _addDisplay() {
    const container = this._armature.display;//as TinyArmatureDisplay;
    container.addChild(this._renderDisplay);
  }

  /**
   * @private
   * @param {any} value
   */
  _replaceDisplay(value) {
    const container = this._armature.display;// as TinyArmatureDisplay;
    const prevDisplay = value;// as Tiny.DisplayObject;
    container.addChild(this._renderDisplay);
    container.swapChildren(this._renderDisplay, prevDisplay);
    container.removeChild(prevDisplay);
  }

  /**
   * @private
   */
  _removeDisplay() {
    this._renderDisplay.parent.removeChild(this._renderDisplay);
  }

  /**
   * @private
   */
  _updateZOrder() {
    const container = this._armature.display;// as TinyArmatureDisplay;
    const index = container.getChildIndex(this._renderDisplay);
    if (index === this._zOrder) {
      return;
    }
    container.addChildAt(this._renderDisplay, this._zOrder);
  }

  /**
   * @internal
   * @private
   */
  _updateVisible() {
    this._renderDisplay.visible = this._parent.visible;
  }

  /**
   * @private
   */
  _updateBlendMode() {
    switch (this._blendMode) {
      case BlendMode.Normal:
        //this._renderDisplay as Tiny.Sprite
        this._renderDisplay.blendMode = Tiny.BLEND_MODES.NORMAL;
        break;

      case BlendMode.Add:
        this._renderDisplay.blendMode = Tiny.BLEND_MODES.ADD;
        break;

      case BlendMode.Darken:
        this._renderDisplay.blendMode = Tiny.BLEND_MODES.DARKEN;
        break;

      case BlendMode.Difference:
        this._renderDisplay.blendMode = Tiny.BLEND_MODES.DIFFERENCE;
        break;

      case BlendMode.HardLight:
        this._renderDisplay.blendMode = Tiny.BLEND_MODES.HARD_LIGHT;
        break;

      case BlendMode.Lighten:
        this._renderDisplay.blendMode = Tiny.BLEND_MODES.LIGHTEN;
        break;

      case BlendMode.Multiply:
        this._renderDisplay.blendMode = Tiny.BLEND_MODES.MULTIPLY;
        break;

      case BlendMode.Overlay:
        this._renderDisplay.blendMode = Tiny.BLEND_MODES.OVERLAY;
        break;

      case BlendMode.Screen:
        this._renderDisplay.blendMode = Tiny.BLEND_MODES.SCREEN;
        break;

      default:
        break;
    }
  }

  /**
   * @private
   */
  _updateColor() {
    this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
  }

  /**
   * @private
   */
  _updateFrame() {
    const isMeshDisplay = this._meshData && this._display === this._meshDisplay;
    let currentTextureData = this._textureData;//as TinyTextureData;

    if (this._displayIndex >= 0 && this._display && currentTextureData) {
      let currentTextureAtlasData = currentTextureData.parent; // as TinyTextureAtlasData;

      // Update replaced texture atlas.
      if (this._armature.replacedTexture && this._displayData && currentTextureAtlasData === this._displayData.texture.parent) {
        currentTextureAtlasData = this._armature._replaceTextureAtlasData; // as TinyTextureAtlasData;
        if (!currentTextureAtlasData) {
          currentTextureAtlasData = BaseObject.borrowObject(TinyTextureAtlasData);
          currentTextureAtlasData.copyFrom(currentTextureData.parent);
          currentTextureAtlasData.texture = this._armature.replacedTexture;
          this._armature._replaceTextureAtlasData = currentTextureAtlasData;
        }

        currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name);// as PixiTextureData;
      }

      const currentTextureAtlas = currentTextureAtlasData.texture;
      if (currentTextureAtlas) {
        if (!currentTextureData.texture) {
          currentTextureData.texture = new Tiny.Texture(
            currentTextureAtlas,
            currentTextureData.region, // as Tiny.Rectangle, // No need to set frame.
            currentTextureData.region, // as Tiny.Rectangle,
            new Tiny.Rectangle(0, 0, currentTextureData.region.width, currentTextureData.region.height),
            currentTextureData.rotated // as any // .d.ts bug
          );
        }

        if (isMeshDisplay) { // Mesh.
          const meshDisplay = this._renderDisplay;// as Tiny.mesh.Mesh;
          const textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : currentTextureAtlas.width;
          const textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : currentTextureAtlas.height;

          meshDisplay.uvs = new Float32Array(this._meshData.uvs);
          meshDisplay.vertices = new Float32Array(this._meshData.vertices);
          meshDisplay.indices = new Uint16Array(this._meshData.vertexIndices);

          for (let i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
            const u = meshDisplay.uvs[i];
            const v = meshDisplay.uvs[i + 1];
            meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasWidth;
            meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasHeight;
          }

          meshDisplay.texture = currentTextureData.texture;
          //meshDisplay.dirty = true; // Pixi 3.x
          meshDisplay.dirty++; // Pixi 4.x Can not support change mesh vertice count.
        } else { // Normal texture.
          const normalDisplay = this._renderDisplay;// as Tiny.Sprite;
          normalDisplay.texture = currentTextureData.texture;
        }

        this._updateVisible();
        return;
      }
    }

    if (isMeshDisplay) {
      const meshDisplay = this._renderDisplay;// as Tiny.mesh.Mesh;
      meshDisplay.texture = null;
      meshDisplay.x = 0.0;
      meshDisplay.y = 0.0;
      meshDisplay.visible = false;
    } else {
      const normalDisplay = this._renderDisplay;//as Tiny.Sprite;
      normalDisplay.texture = null;
      normalDisplay.x = 0.0;
      normalDisplay.y = 0.0;
      normalDisplay.visible = false;
    }
  }

  /**
   * @private
   */
  _updateMesh() {
    const meshDisplay = this._renderDisplay;// as Tiny.mesh.Mesh;
    const hasFFD = this._ffdVertices.length > 0;

    if (this._meshData.skinned) {
      for (let i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
        const iH = i / 2;

        const boneIndices = this._meshData.boneIndices[iH];
        const boneVertices = this._meshData.boneVertices[iH];
        const weights = this._meshData.weights[iH];

        let xG = 0.0;
        let yG = 0.0;

        for (let iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
          const bone = this._meshBones[boneIndices[iB]];
          const matrix = bone.globalTransformMatrix;
          const weight = weights[iB];

          let xL = 0.0;
          let yL = 0.0;
          if (hasFFD) {
            xL = boneVertices[iB * 2] + this._ffdVertices[iF];
            yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
          } else {
            xL = boneVertices[iB * 2];
            yL = boneVertices[iB * 2 + 1];
          }

          xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
          yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;

          iF += 2;
        }

        meshDisplay.vertices[i] = xG;
        meshDisplay.vertices[i + 1] = yG;
      }
    } else if (hasFFD) {
      const vertices = this._meshData.vertices;
      for (let i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
        const xG = vertices[i] + this._ffdVertices[i];
        const yG = vertices[i + 1] + this._ffdVertices[i + 1];
        meshDisplay.vertices[i] = xG;
        meshDisplay.vertices[i + 1] = yG;
      }
    }
  }

  /**
   *
   * @method Tiny.DragonBones.TinySlot#_updateTransform
   * @param {boolean} isSkinnedMesh
   */
  _updateTransform(isSkinnedMesh) {
    throw new Error();
  }

  /**
   * @private
   * @param {boolean} isSkinnedMesh
   */
  _updateTransformV3(isSkinnedMesh) {
    if (isSkinnedMesh) { // Identity transform.
      this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    } else {
      this.updateGlobalTransform(); // Update transform.

      const x = this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY); // Pixi pivot do not work.
      const y = this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY); // Pixi pivot do not work.
      const transform = this.global;
      this._renderDisplay.setTransform(
        x, y,
        transform.scaleX, transform.scaleY,
        transform.skewX,
        0.0, transform.skewY - transform.skewX
      );
    }
  }

  /**
   * @private
   * @param {boolean} isSkinnedMesh
   */
  _updateTransformV4(isSkinnedMesh) {
    if (isSkinnedMesh) { // Identity transform.
      this._renderDisplay.setTransform(0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    } else {
      this.updateGlobalTransform(); // Update transform.

      const transform = this.global;
      this._renderDisplay.setTransform(
        transform.x, transform.y,
        transform.scaleX, transform.scaleY,
        transform.skewX,
        0.0, transform.skewY - transform.skewX,
        this._pivotX, this._pivotY
      );
    }
  }
}

export default TinySlot;
