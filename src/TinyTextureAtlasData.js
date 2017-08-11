import {default as dragonBones} from '../libs/dragonBones';
import {default as TinyTextureData} from './TinyTextureData';
const {BaseObject, TextureAtlasData} = dragonBones;
/**
 * @language zh_CN
 * Tiny 贴图集数据。
 *
 * @class TinyTextureAtlasData
 * @extends {dragonBones.TextureAtlasData}
 * @memberof Tiny.DragonBones
 * @constructor
 * @version DragonBones 3.0
 */
class TinyTextureAtlasData extends TextureAtlasData {
  /**
   * toString
   */
  static toString() {
    return '[class TinyTextureAtlasData]';
  }

  /**
   * @constructor
   */
  constructor() {
    super();
    /**
     * @property texture
     * @default null
     * @type {dragonBones.BaseTexture}
     */
    this.texture = null;
  }

  /**
   * @private
   */
  _onClear() {
    super._onClear();

    if (this.texture) {
      //this.texture.dispose();
    }

    this.texture = null;
  }

  /**
   * 生成一个Tiny.DragonBones.TinyTextureData对象
   * @method Tiny.DragonBones.TinyTextureAtlasData#generateTexture
   * @return {Tiny.DragonBones.TinyTextureData}
   */
  generateTexture() {
    return BaseObject.borrowObject(TinyTextureData);
  }
}

export default TinyTextureAtlasData;
