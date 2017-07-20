/**
 * @file        Tiny.DragonBone.TinyFactory
 * @author      清扬陌客 <qingyangmoke@qq.com>
 */

import { default as dragonBones } from '../libs/dragonBones';
import { default as TinyArmatureDisplay } from './TinyArmatureDisplay';
import { default as TinyTextureAtlasData } from './TinyTextureAtlasData';
import { default as TinySlot } from './TinySlot';
import { default as DisplayType } from './DisplayType';
import { Mesh } from 'tinyjs-plugin-mesh';
const { BaseObject, BaseFactory, WorldClock, Armature } = dragonBones;

/**
 * Tiny.DragonBone.TinyFactory
 * @class TinyFactory
 * @constructor
 * @memberof Tiny.DragonBones
 * @extends {dragonBones.BaseFactory}
 * @version DragonBones 3.0
 */
class TinyFactory extends BaseFactory {
  /**
   * 创建一个工厂。 (通常只需要一个全局工厂实例)
   * @constructor
   * @param {dragonBones.DataParser} dataParser - 龙骨数据解析器，如果不设置，则使用默认解析器。
   * @version DragonBones 3.0
   */
  constructor(dataParser = null) {
    super(dataParser);

    if (!TinyFactory._eventManager) {
      TinyFactory._eventManager = new TinyArmatureDisplay();
      TinyFactory._clock = new WorldClock();
      Tiny.ticker.shared.add(TinyFactory._clockHandler, TinyFactory);
    }
  }

  /**
   *
   * @private
   * @param {number} passedTime
   * @return void
   */
  static _clockHandler(passedTime) {
    TinyFactory._clock.advanceTime(-1); // passedTime !?
  }

  /**
   * 一个可以直接使用的全局工厂实例。
   *
   * @static
   * @member {Tiny.DragonBones.TinyFactory} Tiny.DragonBones.TinyFactory#factory
   * @version DragonBones 4.7
   */
  static get factory() {
    if (!TinyFactory._factory) {
      TinyFactory._factory = new TinyFactory();
    }
    return TinyFactory._factory;
  }

  /**
   * @language zh_CN
   * 一个可以直接使用的全局 WorldClock 实例.
   *
   * @static
   * @member {dragonBones.WorldClock} Tiny.DragonBones.TinyFactory#clock
   * @version DragonBones 5.0
   */
  static get clock() {
    return TinyFactory._clock;
  }

  /**
   * @private
   * @method Tiny.DragonBones.TinyFactory#_generateTextureAtlasData
   * @param {TinyTextureAtlasData} textureAtlasData
   * @param {Tiny.BaseTexture} textureAtlas
   * @return {TinyTextureAtlasData}
   */
  _generateTextureAtlasData(textureAtlasData, textureAtlas) {
    if (textureAtlasData) {
      textureAtlasData.texture = textureAtlas;
    } else {
      textureAtlasData = BaseObject.borrowObject(TinyTextureAtlasData);
    }

    return textureAtlasData;
  }

  /**
   * @private
   * @param {BuildArmaturePackage} dataPackage -
   * @return {Armatures}
   */
  _generateArmature(dataPackage) {
    const armature = BaseObject.borrowObject(Armature);
    const armatureDisplay = new TinyArmatureDisplay();
    armatureDisplay._armature = armature;

    armature._init(
      dataPackage.armature, dataPackage.skin,
      armatureDisplay, armatureDisplay, TinyFactory._eventManager
    );

    return armature;
  }

  /**
   * @private
   * @param {BuildArmaturePackage} dataPackage -
   * @param {SkinSlotData} skinSlotData -
   * @param {BuildArmaturePackage} armature -
   * @param {Armature} armature -
   * @return {Slot}
   */
  _generateSlot(dataPackage, skinSlotData, armature) {
    const slotData = skinSlotData.slot;
    const slot = BaseObject.borrowObject(TinySlot);
    const displayList = [];

    slot._init(
      skinSlotData,
      new Tiny.Sprite(),
      new Mesh(null, null, null, null, Mesh.DRAW_MODES.TRIANGLES)
    );

    for (let i = 0, l = skinSlotData.displays.length; i < l; ++i) {
      const displayData = skinSlotData.displays[i];
      switch (displayData.type) {
        case DisplayType.Image:
          if (!displayData.texture) {
            displayData.texture = this._getTextureData(dataPackage.dataName, displayData.path);
          }

          if (dataPackage.textureAtlasName) {
            slot._textureDatas[i] = this._getTextureData(dataPackage.textureAtlasName, displayData.path);
          }

          displayList[i] = slot.rawDisplay;
          break;

        case DisplayType.Mesh:
          if (!displayData.texture) {
            displayData.texture = this._getTextureData(dataPackage.dataName, displayData.path);
          }

          if (dataPackage.textureAtlasName) {
            slot._textureDatas[i] = this._getTextureData(dataPackage.textureAtlasName, displayData.path);
          }

          if (!displayData.mesh && displayData.share) {
            displayData.mesh = skinSlotData.getMesh(displayData.share);
          }

          displayList[i] = slot.meshDisplay;
          break;

        case DisplayType.Armature:
          const childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
          if (childArmature) {
            childArmature.inheritAnimation = displayData.inheritAnimation;
            if (!childArmature.inheritAnimation) {
              const actions = slotData.actions.length > 0 ? slotData.actions : childArmature.armatureData.actions;
              if (actions.length > 0) {
                for (let i = 0, l = actions.length; i < l; ++i) {
                  childArmature._bufferAction(actions[i]);
                }
              } else {
                childArmature.animation.play();
              }
            }

            displayData.armature = childArmature.armatureData; //
          }

          displayList[i] = childArmature;
          break;

        default:
          displayList[i] = null;
          break;
      }
    }

    slot._setDisplayList(displayList);

    return slot;
  }

  /**
   * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
   *
   * @method Tiny.DragonBones.TinyFactory#buildArmatureDisplay
   * @param {string} armatureName 骨架名称。
   * @param {string} dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
   * @param {string} skinName 皮肤名称，如果未设置，则使用默认皮肤。
   * @param {string} textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
   * @return {TinyArmatureDisplay} 骨架的显示容器。
   * @see TinyArmatureDisplay
   * @version DragonBones 4.5
   */
  buildArmatureDisplay(armatureName, dragonBonesName, skinName, textureAtlasName) {
    const armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
    if (armature) {
      // armatureDisplay:TinyArmatureDisplay
      const armatureDisplay = armature.display;
      TinyFactory._clock.add(armature);

      return armatureDisplay;
    }

    return null;
  }

  /**
   * 获取带有指定贴图的显示对象。
   *
   * @method Tiny.DragonBones.TinyFactory#getTextureDisplay
   * @param {string} textureName 指定的贴图名称。
   * @param {string} dragonBonesName 指定的龙骨数据名称，如果未设置，将检索所有的龙骨数据。
   * @version DragonBones 3.0
   * @return {Tiny.Sprite}
   */
  getTextureDisplay(textureName, dragonBonesName) {
    // TinyTextureData
    const textureData = this._getTextureData(dragonBonesName, textureName);
    if (textureData) {
      if (!textureData.texture) {
        // const textureAtlasTexture = (textureData.parent as TinyTextureAtlasData).texture;
        const textureAtlasTexture = textureData.parent.texture;
        const originSize = new Tiny.Rectangle(0, 0, textureData.region.width, textureData.region.height);
        textureData.texture = new Tiny.Texture(
          textureAtlasTexture,
          textureData.region, // Tiny.Rectangle
          textureData.region, // Tiny.Rectangle
          originSize,
          textureData.rotated // as any // .d.ts bug
        );
      }

      return new Tiny.Sprite(textureData.texture);
    }

    return null;
  }

  /**
   * 获取全局声音事件管理器。
   *
   * @static
   * @member {Tiny.DragonBones.TinyArmatureDisplay} Tiny.DragonBones.TinyFactory#eventManater
   * @version DragonBones 4.5
   */
  get eventManater() {
    return TinyFactory._eventManager;
  }
}

/**
 * {TinyFactory}
 * @private
 */
TinyFactory._factory = null;
/**
 * {TinyArmatureDisplay}
 * @private
 */
TinyFactory._eventManager = null;
/**
 * {WorldClock}
 * @private
 */
TinyFactory._clock = null;

export default TinyFactory;
