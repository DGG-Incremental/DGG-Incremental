"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncPlayerGameState = void 0;

var _clickerGame = require("clicker-game");

var _PlayerGameState = _interopRequireDefault(require("./db/entity/PlayerGameState"));

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var syncSchema = _joi["default"].object({
  actions: _joi["default"].array().items(_joi["default"].object({
    action: _joi["default"].string(),
    timestamp: _joi["default"].date().greater(_joi["default"].ref("/lastSync")).less(_joi["default"].ref("/sentAt"))
  })),
  version: _joi["default"].number().integer().required().equal(_joi["default"].ref("$version")),
  lastSync: _joi["default"].date().required(),
  sentAt: _joi["default"].date().greater(_joi["default"].ref("/lastSync")).required()
});

var syncPlayerGameState =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(name, actions, syncTime, version) {
    var playerState, game, newState;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _PlayerGameState["default"].getOrCreate(name);

          case 2:
            playerState = _context.sent;

            _joi["default"].assert({
              actions: actions,
              lastSync: playerState.gameState.lastSynced,
              sentAt: syncTime,
              version: version
            }, syncSchema, {
              context: {
                version: playerState.version
              }
            });

            game = new _clickerGame.Game(playerState.gameState);
            game.state.actions = actions;
            game.validate();
            newState = game.getStateAt(syncTime);
            playerState.gameState = newState;
            playerState.version = version;
            _context.next = 12;
            return playerState.save();

          case 12:
            return _context.abrupt("return", _context.sent);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function syncPlayerGameState(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.syncPlayerGameState = syncPlayerGameState;