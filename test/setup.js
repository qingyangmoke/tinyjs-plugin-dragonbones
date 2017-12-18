// 注入测试依赖
var sinon = require('sinon');
global.sinon = sinon;

var chai = require('chai');
chai.use(require('sinon-chai'));

global.expect = chai.expect;
