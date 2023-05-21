/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/frontend/index.js":
/*!*******************************!*\
  !*** ./src/frontend/index.js ***!
  \*******************************/
/***/ (() => {

eval("var app = new PIXI.Application({\n  width: 1480,\n  height: 320\n});\ndocument.body.appendChild(app.view);\nfunction addCircle(x, y) {\n  var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;\n  var circle = PIXI.Sprite.from('assets/circle.png');\n  circle.anchor.set(0.5);\n  circle.x = app.view.width * x;\n  circle.y = app.view.height * y;\n  circle.scale.set(scale);\n  app.stage.addChild(circle);\n}\nvar panel = PIXI.Sprite.from('assets/panel.png');\npanel.anchor.set(0.5);\npanel.x = app.view.width * 0.25;\npanel.y = app.view.height * 0.5;\napp.stage.addChild(panel);\naddCircle(0.03, 0.5);\naddCircle(0.55, 0.5);\naddCircle(0.73, 0.5);\naddCircle(0.86, 0.25, 0.5);\naddCircle(0.86, 0.75, 0.5);\naddCircle(0.95, 0.25, 0.5);\naddCircle(0.95, 0.75, 0.5);\n\n//# sourceURL=webpack://desk-hud/./src/frontend/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/frontend/index.js"]();
/******/ 	
/******/ })()
;