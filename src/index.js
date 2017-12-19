/**
 * Tiny.js
 * @external Tiny
 * @see {@link http://tinyjs.net/}
 */

/**
 * DragonBonesJS
 * @external dragonBones
 * @see {@link https://github.com/DragonBones/DragonBonesJS}
 */

/**
 * @namespace Tiny.DragonBones
 * @memberof Tiny
 */
import { default as dragonBones } from '../libs/dragonBones';
const { BaseObject, BaseFactory, WorldClock, Armature, Animation, AnimationState, Bone } = dragonBones;

import { default as TinyArmatureDisplay } from './TinyArmatureDisplay';
import { default as TinyTextureAtlasData } from './TinyTextureAtlasData';
import { default as TinyTextureData } from './TinyTextureData';
import { default as TinySlot } from './TinySlot';
import { default as DisplayType } from './DisplayType';
import { default as BlendMode } from './BlendMode';
import { default as BoundingBoxType } from './BoundingBoxType';
import { default as TinyFactory } from './TinyFactory';

import { addDragonBonesData, addTextureAtlasData, buildArmatureDisplay } from './GloabalMethods';

import { Mesh } from 'tinyjs-plugin-mesh';

export {
  TinyArmatureDisplay,
  TinyTextureData,
  TinyTextureAtlasData,
  TinySlot,
  DisplayType,
  BlendMode,
  BoundingBoxType,
  TinyFactory,

  addDragonBonesData,
  addTextureAtlasData,
  buildArmatureDisplay,

  Bone,
  BaseObject,
  BaseFactory,
  WorldClock,
  Armature,
  Animation,
  AnimationState,

  Mesh,
};
