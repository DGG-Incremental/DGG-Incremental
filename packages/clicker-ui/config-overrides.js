var path = require("path");
var fs = require("fs");
const { override, addDecoratorsLegacy, babelInclude, disableEsLint, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = function (config, env) {
  return Object.assign(
    config,
    override(
      disableEsLint(),
      // fixBabelImports('antd-mobile', {
      //     libraryDirectory: 'es',
      //     libraryName: 'antd-mobile',
      //     style: true
      // }),
      // fixBabelImports('antd', {
      //     libraryDirectory: 'es',
      //     libraryName: 'antd',
      //     style: true
      // }),
      addLessLoader({
        javascriptEnabled: true,
        // modifyVars: {
        //     'primary-color': '#fff418',
        // },
      }),
      addDecoratorsLegacy(),
      /*Make sure Babel compiles the stuff in the common folder*/
      babelInclude([
        path.resolve("src"), // don't forget this
        path.resolve("../clicker-game"),
      ])
    )(config, env)
  );
};
