import { default as dragonBones } from './dragonBones';
const { TextureData } = dragonBones;
/**
 * @private
 */
export default class TinyTextureData extends TextureData {
  static toString() {
    return '[class TinyTextureData]';
  }
  constructor() {
    super();
    /**
     * {Tiny.Texture}
     */
    this.texture = null;
  }

  _onClear() {
    super._onClear();

    if (this.texture) {
      this.texture.destroy();
    }

    this.texture = null;
  }
}
