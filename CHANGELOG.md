## 0.1.9
`2017年12月28日`
1. worldclock passedTime 最小值调整为0.01 正常60帧的话是0.016666秒 = 1000/60/1000

## 0.1.8
`2017年12月28日`
1. 解决用户修改手机系统时间导致 worldclock passedTime太大的问题

## 0.1.7
`2017年12月27日`
1. 解决用户修改手机系统时间导致 _onCrossFrame 死循环的问题
## 0.1.4
`2017年12月21日`

1. 更新tinyjs-plugin-mesh 为0.0.4 Mesh 新增了 canvasDrawTimes属性

2. 给TinyArmatureDisplay增加 meshCanvasRenderDrawImageTimes属性

3. 解决mesh canvas render 渲染骨骼网格动画的时候空白间隙 gap line的问题

## 0.1.3
`2017-12-20`

1. 更新Mesh库

2. 重构demo结构

3. 增加网格动画demo

4. 增加解决Mesh Canavs Render 渲染间隙的方法


## 0.1.2

`2017-12-19` 暴露Mesh 这样可以通过全局Tiny.DragonBones.Mesh对Mesh进行访问和操作

## 0.1.1

`2017-12-18`

