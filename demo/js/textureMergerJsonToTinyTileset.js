/* eslint-disable  */
/**
 * @清扬陌客
 * textureMerger 格式的文件转换成tiny tileset 文件格式
 * @param {JSON} data - textureMerger 导出的json文件
 * @param {number} w - texture png图片宽度
 * @param {number} h - texture png图片高度
 */
function textureMergerJsonToTinyTileset(data, w, h) {
  var tilesetData = {
    'meta': {
      'image': data.file,
      'size': { 'w': w, 'h': h },
      'scale': '1'
    },
    'frames': {}
  };

  for (var key in data.frames) {
    var d = data.frames[key];
    tilesetData.frames[key] = {
      "frame": { "x": d.x, "y": d.y, "w": d.w, "h": d.h },
      "rotated": false,
      "trimmed": d.offX > 0 && d.offY > 0,
      "spriteSourceSize": { "x": d.offX, "y": d.offY, "w": d.sourceW, "h": d.sourceH },
      "sourceSize": { "w": d.sourceW, "h": d.sourceH }
    }
  }
  return tilesetData;
}
