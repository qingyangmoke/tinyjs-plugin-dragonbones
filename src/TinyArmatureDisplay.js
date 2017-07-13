import { default as TinyFactory } from './TinyFactory';
import { default as BoundingBoxType } from './BoundingBoxType';

/**
 * @inheritDoc
 */
export default class TinyArmatureDisplay extends Tiny.Container {
  /**
   * @internal
   * @private
   */
  constructor() {
    super();
    this._armature = null;
    /**
     * {Tiny.Sprite}
     * @internal
     * @private
     */
    this._debugDrawer = null;
  }
  /**
   * @private
   */
  _onClear() {
    if (this._debugDrawer) {
      this._debugDrawer.destroy(true);
    }

    this._armature = null;
    this._debugDrawer = null;

    this.destroy();
  }
  /**
   * @private
   * @param {EventStringType} type
   * @param {EventObject} eventObject
   */
  _dispatchEvent(type, eventObject) {
    this.emit(type, eventObject);
  }
  /**
   * @private
   * @param {boolean} isEnabled -
   */
  _debugDraw(isEnabled) {
    if (!this._debugDrawer) {
      this._debugDrawer = new Tiny.Sprite();
      const boneDrawer = new Tiny.Graphics();
      this._debugDrawer.addChild(boneDrawer);
    }

    if (isEnabled) {
      this.addChild(this._debugDrawer);
      // Tiny.Graphics
      const boneDrawer = this._debugDrawer.getChildAt(0);
      boneDrawer.clear();

      const bones = this._armature.getBones();
      for (let i = 0, l = bones.length; i < l; ++i) {
        const bone = bones[i];
        const boneLength = bone.boneData.length;
        const startX = bone.globalTransformMatrix.tx;
        const startY = bone.globalTransformMatrix.ty;
        const endX = startX + bone.globalTransformMatrix.a * boneLength;
        const endY = startY + bone.globalTransformMatrix.b * boneLength;

        boneDrawer.lineStyle(2, bone.ik ? 0xFF0000 : 0x00FFFF, 0.7);
        boneDrawer.moveTo(startX, startY);
        boneDrawer.lineTo(endX, endY);
        boneDrawer.lineStyle(0, 0, 0);
        boneDrawer.beginFill(0x00FFFF, 0.7);
        boneDrawer.drawCircle(startX, startY, 3);
        boneDrawer.endFill();
      }

      const slots = this._armature.getSlots();
      for (let i = 0, l = slots.length; i < l; ++i) {
        const slot = slots[i];
        const boundingBoxData = slot.boundingBoxData;

        if (boundingBoxData) {
          //as Tiny.Graphics
          let child = this._debugDrawer.getChildByName(slot.name);
          if (!child) {
            child = new Tiny.Graphics();
            child.name = slot.name;
            this._debugDrawer.addChild(child);
          }

          child.clear();
          child.beginFill(0xFF00FF, 0.3);

          switch (boundingBoxData.type) {
            case BoundingBoxType.Rectangle:
              child.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
              break;
            case BoundingBoxType.Ellipse:
              child.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
              break;
            case BoundingBoxType.Polygon:
              const vertices = boundingBoxData.vertices;
              for (let i = 0, l = boundingBoxData.vertices.length; i < l; i += 2) {
                if (i === 0) {
                  child.moveTo(vertices[i], vertices[i + 1]);
                } else {
                  child.lineTo(vertices[i], vertices[i + 1]);
                }
              }
              break;

            default:
              break;
          }

          child.endFill();

          slot._updateTransformAndMatrix();
          slot.updateGlobalTransform();

          const transform = slot.global;
          child.setTransform(
            transform.x, transform.y,
            transform.scaleX, transform.scaleY,
            transform.skewX,
            0.0, transform.skewY - transform.skewX,
            slot._pivotX, slot._pivotY
          );
        } else {
          const child = this._debugDrawer.getChildByName(slot.name);
          if (child) {
            this._debugDrawer.removeChild(child);
          }
        }
      }
    } else if (this._debugDrawer && this._debugDrawer.parent === this) {
      this.removeChild(this._debugDrawer);
    }
  }

  /**
   * @inheritDoc
   * @param {EventStringType} type -
   */
  hasEvent(type) {
    return this.listeners(type, true);
  }

  /**
   *
   * @param {EventStringType} type
   * @param {(event: EventObject) => void} listener
   * @param {any} target
   */
  addEvent(type, listener, target) {
    this.addListener(type, listener, target);
  }

  /**
   *
   * @param {EventStringType} type
   * @param {(event: EventObject) => void} listener
   * @param {any} target
   */
  removeEvent(type, listener, target) {
    this.removeListener(type, listener, target);
  }

  /**
   * @inheritDoc
   */
  dispose(disposeProxy) {
    if (this._armature) {
      this._armature.dispose();
      this._armature = null;
    }
  }

  /**
   * @inheritDoc
   * @return {dragonBones.Armature}
   */
  get armature() {
    return this._armature;
  }

  /**
   * @inheritDoc
   * @return {dragonBones.Animation}
   */
  get animation() {
    return this._armature.animation;
  }

  /**
   * 增加调试模式快捷方式
   */
  get debugDraw() {
    return this.armature.debugDraw;
  }

  set debugDraw(value) {
    this.armature.debugDraw = value;
  }

  /**
   * 增加播放动画快捷方式 参考dragonBones.Animation
   * @param animationName 动画数据名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。
   * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
   * @returns 对应的动画状态。
   * @see dragonBones.AnimationState
   * @version DragonBones 3.0
   */
  play(animationName = null, playTimes = -1) {
    return this.animation.play(animationName, playTimes);
  }

  /**
   * @deprecated
   * @param {boolean} on
   * @see dragonBones.Armature#clock
   * @see dragonBones.TinyFactory#clock
   * @see dragonBones.Animation#timescale
   * @see dragonBones.Animation#stop()
   */
  // advanceTimeBySelf(on) {
  //   if (on) {
  //     this._armature.clock = TinyFactory.clock;
  //   } else {
  //     this._armature.clock = null;
  //   }
  // }
}
