import { default as dragonBones } from './dragonBones';
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
};
