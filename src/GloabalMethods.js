/**!
 * @author 清扬陌客<qingyangmoke@qq.com>
 * 增加一些静态方法 简化操作
 */
import { default as TinyFactory } from './TinyFactory';
const factory = TinyFactory.factory;
/**
 *
 * @param {Object} dragonBonesData
 * @param {Object} textureAtlasData
 * @param {Tiny.BaseTexture} texture
 */
export function addDragonBonesData(dragonBonesData) {
  return factory.parseDragonBonesData(dragonBonesData);
}
/**
 *
 * @param {Object} dragonBonesData
 * @param {Object} textureAtlasData
 * @param {Tiny.BaseTexture} texture
 */
export function addTextureAtlasData(textureAtlasData, texture) {
  return factory.parseTextureAtlasData(textureAtlasData, texture);
}

/**
* @language zh_CN
* 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
* @param {string} armatureName 骨架名称。
* @param {string} dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
* @param {string} skinName 皮肤名称，如果未设置，则使用默认皮肤。
* @param {string} textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
* @returns {TinyArmatureDisplay} 骨架的显示容器。
* @see TinyArmatureDisplay
* @version DragonBones 4.5
*/
export function buildArmatureDisplay(armatureName, dragonBonesName, skinName, textureAtlasName) {
  return factory.buildArmatureDisplay(armatureName, dragonBonesName, skinName, textureAtlasName);
}
