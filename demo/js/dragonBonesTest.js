/* eslint-disable */
/**
 * 解决 canvas 渲染有间隙的问题
 * 注意：请在app.run()之后调用
 * @method fixMeshCanvasRendererGap
 * @param {Tiny.Application} app
 * @param {Number} [canvasPadding=1] 默认是1 不是特殊情况请不要修改
 */
function fixMeshCanvasRendererGap(app, canvasPadding) {
  canvasPadding = typeof canvasPadding === 'undefined' ? 1 : canvasPadding;
  if (app.renderer.type === 2) {
    // 每次 参数变化的时候计算一次 不要放到getter里计算 提高性能
    const getRealCanvasPadding = function () {
      return canvasPadding * Tiny.config.dpi / app.renderer.resolution;
    };
    let realCanvasPadding = getRealCanvasPadding();
    let resolution = app.renderer.resolution;

    // inject resolution 当值发生变化的时候重新计算一下canvasPadding
    Object.defineProperty(app.renderer, 'resolution', {
      get() {
        return resolution;
      },
      set(value) {
        if (resolution !== value) {
          resolution = value;
          realCanvasPadding = getRealCanvasPadding();
        }
      }
    });
    // 全局设置canvasPadding 并设置成只读
    Object.defineProperty(Tiny.DragonBones.Mesh.prototype, 'canvasPadding', {
      get() {
        return realCanvasPadding;
      },
      set(value) {
        //只读
      }
    });
  }
}

function dragonBonesTest() {
  this.config = {
    showFPS: true, // 显示帧频
    dpi: 2, // 分辨率
    width: 320,
    height: 568,
    fixSize: !navigator.userAgent.match(/AppleWebKit.*Mobile.*/),
    renderType: 2,
    renderOptions: {
      roundPixels: true,
      backgroundColor: 0x2a3145 // 画布背景色
    }
  };
  this.armatureDisplay = null;
};

/**
 * 添加按钮
 * @param {String} name - 按钮文本
 * @param {Number} x - x坐标
 * @param {Number} y - y坐标
 * @param {Number} width - 按钮宽度
 * @param {Number} height - 按钮高度
 * @param {Number} color - 背景颜色
 * @param {Number} onClick - 点击回调
 */
dragonBonesTest.prototype.createButton = function createBox(name, x, y, width, height, color, onClick) {
  let graphics = new Tiny.Graphics();
  graphics.beginFill(color);
  graphics.drawRect(0, 0, width, height);
  graphics.bounds = new Tiny.Rectangle(0, 0, width, height);
  var rt = Tiny.RenderTexture.create(width, height);
  this.app.renderer.render(graphics, rt);

  let sprite = new Tiny.Sprite(rt);
  var title = new Tiny.Text(name, {
    fontSize: '18px',
    fill: 'white',
  });
  title.position.set(sprite.width / 2, sprite.height / 2);
  title.anchor.set(0.5, 0.5);
  sprite.addChild(title);
  sprite.position.set(x, y);

  sprite.setEventEnabled(true);

  sprite.mousedown = sprite.touchstart = function (data) {
    data.stopPropagation();
    console.log(title);
    onClick && onClick();
  };

  this.container.addChild(sprite);
  return sprite;
};

/**
 * 设置
 * @param {String} title  - 页面标题
 */
dragonBonesTest.prototype.setup = function (title, canvasPadding) {
  this.app = new Tiny.Application(this.config);

  this.container = new Tiny.Container();

  var titleSprite = new Tiny.Text(title, {
    fontSize: '18px',
    fill: 'white',
  });

  titleSprite.position.set(Tiny.WIN_SIZE.width / 2, 30);
  titleSprite.anchor.set(0.5, 0);
  this.titleSprite = titleSprite;
  this.container.addChild(titleSprite);

  this.app.run(this.container);

  if (canvasPadding && canvasPadding > 0) {
    // 在run之后调用
    fixMeshCanvasRendererGap(this.app, canvasPadding);
  }
}

/**
 * 创建骨骼动画实例
 * @param {String} resName - 资源的名字 请自动请求一下三个文件 ./resources/resName/resName._ske.json ./resources/resName/resName._txe.json ./resources/resName/resName._txe.png
 * @param {String} armatureName - armature Name
 * @param {function} onReady - 创建完成
 */
dragonBonesTest.prototype.buildArmatureDisplay = function (resName, armatureName, onReady) {
  var _this = this;
  //设置别名
  var dragonBones = Tiny.DragonBones;
  var resources;

  var dragonBones_ske_key = resName + "_dragonBonesData";
  var dragonBones_texData_key = resName + "_textureData";
  var dragonBones_tex_key = resName + "_texture";
  function initDragon(resources) {
    dragonBones.addDragonBonesData(resources[dragonBones_ske_key].data);
    dragonBones.addTextureAtlasData(resources[dragonBones_texData_key].data, resources[dragonBones_tex_key].texture);

    armatureDisplay = dragonBones.buildArmatureDisplay(armatureName);
    _this.container.addChild(armatureDisplay);
    _this.armatureDisplay = armatureDisplay;
    onReady && onReady(armatureDisplay);

  }


  // 注意：run 方法每个 Application 只能使用调用一次，再次加载资源可以用 load 方法
  const loader = new Tiny.loaders.Loader();

  loader
    .add(dragonBones_ske_key, "./resource/" + resName + "/" + resName + "_ske.json")
    .add(dragonBones_texData_key, "./resource/" + resName + "/" + resName + "_tex.json")
    .add(dragonBones_tex_key, "./resource/" + resName + "/" + resName + "_tex.png")
    .load(function (loader, resource) {

    });
  loader.on('progress', function (loader, resource) {
    console.log('url => ' + resource.url, 'name => ' + resource.name);
    console.log('progress => ', loader.progress + '%');
  });
  loader.on('complete', function (loader, resource) {
    initDragon(resource);
  });
}
