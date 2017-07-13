# tinyjs-plugin-dragonbones

> 骨骼动画

## 查看demo

`demo/index.html`

## 引用方法

- 推荐作为依赖使用

  - `npm install tinyjs-plugin-dragonbones --save`

- 也可以直接引用线上cdn地址，注意要使用最新的版本号，例如：

  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-dragonbones/0.0.1/index.js
  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-dragonbones/0.0.1/index.debug.js

## 示例

 参考 ./demo/index.html

## 第三方库
- [Tiny.js](http://tinyjs.net/#/docs/api)
- [DragonBonesJS](https://github.com/DragonBones/DragonBonesJS)

## 工具
- [DragonBones Pro](http://dragonbones.com/cn/index.html)

## API文档


### 创建骨骼动画

> 参考 demo/index.html

1. 首先从DragonBones Pro中导出一份骨骼动画数据

2. 将导出的Dragon_ske.json，Dragon_tex.json和Dragon_tex.png 添加到项目组中。

3. 使用Tiny.Loader模块加载资源完成后，可以创建基于DragonBones的骨骼动画。

``` javascript

 Tiny.Loader
      .add("dragonBonesData", "./resource/Dragon/Dragon_ske.json")
      .add("textureDataA", "./resource/Dragon/Dragon_tex.json")
      .add("textureA", "./resource/Dragon/Dragon_tex.png")
      .load(function ()       {
        initDragon();
      });

```

4.实例化DragonBones所需要的数据。

``` javascript


function initDragon1() {

     // 将骨骼数据添加到骨架系统中
      dragonBones.addDragonBonesData(resources["dragonBonesData"].data);
      dragonBones.addTextureAtlasData(resources["textureDataA"].data, resources["textureA"].texture);

    // 通过buildArmature方法，我们提取名称为robot的骨架,一个包含骨架数据的Tiny.Container对象。要想在舞台中看到该骨架，我们需要将其显性的添加到的舞台当中
      armatureDisplay = dragonBones.buildArmatureDisplay('Dragon');
      armatureDisplay.x = app.renderer.width * 0.5;
      armatureDisplay.y = app.renderer.height * 0.5 + 150;
      armatureDisplay.scale.set(-0.3, 0.3);

      // 播放骨骼动画 动画名字需要在在DragonBones Pro中定义   如 fall、jump、stand、walk
      // 也可以使用 armatureDisplay.animation.play("walk");
      var animationState = armatureDisplay.play('walk');

      container.addChild(armatureDisplay);
    }

```

### 多人物骨骼动画

> 参考 ./demo/multi.html

### 改变动画速度

> 有时在游戏的运行过程中，需要动态的改变动画的播放速度。对时钟的调节一般是要影响一组动画。直接调节animation中的timeScale属性即可。

``` javascript
      var animationState = armatureDisplay.play('walk');

      // 调节动画速度为1.5倍
      armatureDisplay.animation.timeScale = 1.5;

```

参考demo/timescale.html

### 动画遮罩

> 在制作拥有复杂灵活的动画角色时，可以通过DragonBones提供的动画遮罩和动画混合功能，大幅的降低设计师的动画开发工作量，从程序的角度灵活控制动画。例如一个人物上半身可以直立、弯腰、开火。下半身可以直立、下蹲、跑动。并且上下半身的动作可以灵活组合，例如角色可以站立开火、下蹲开火、跑动开火。而所有的这些动作都是由玩家的操控实时控制的。如果要设计师设计所有的这些动画，需要排列组合的制作3x3共9种动画，其中包含了大量的重复劳动，通过DragonBones的动画遮罩和动画融合的功能，设计师只需为上下半身分别设计3种动画，也就是一共6种动画，剩下的事交给程序实现就可以了。

- 动画遮罩就是只将动画的一部分呈现出来，例如下面的代码，将只播放head和body两个骨头的跑步动画，其他骨头将维持原姿势不动。

``` javascript

   var animationState = armatureDisplay.play('walk');
// 动画遮罩  就是只将动画的一部分呈现出来，例如下面的代码，将只播放head和body两个骨头的跑步动画，其他骨头将维持原姿势不动。
   animationState.addBoneMask("head");
   animationState.addBoneMask("body");

```

参考demo/bonemask.html


### 动画混合

> 动画混合是指一个骨架同时可以播放多个动画。例如下面的代码,可以让角色同时播放跑步和开火的动画。

``` javascript

//设置别名
var dragonBones = Tiny.DragonBones;

armatureDisplay.animation.fadeIn("run",0,-1,0,0,"UPPER_BODY_GROUP",dragonBones.Animation.SAME_GROUP);

armatureDisplay.animation.fadeIn("fire",0,-1,0,0,"LOWER_BODY_GROUP",dragonBones.Animation.SAME_GROUP);

```

参考demo/mixed.html
