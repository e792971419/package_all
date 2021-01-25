/*
 * @Author: your name
 * @LastEditors: xiasong
 * @Date: 2021-01-25 17:18:13
 * @LastEditTime: 2021-01-25 17:59:46
 * @Description: description
 * @FilePath: \package_all\xscli\utils\create.js
 */
const chalk = require("chalk");
const path = require("path");

module.exports = function (res) {
  chalk.green("-----开始构建-----");
  console.log(__dirname);
  const sourcePath = __dirname.slice(0, 3) + "template";
  chalk.blue(`当前路径: ${process.cwd()}`);
  revisePackageJson(res, sourcePath).then(() => {
    copy();
  });
};

// 处理(更新)package.json文件
function revisePackageJson(res, sourcePath) {
  return new Promise((resolve, reject) => {
    // 读文件
    fs.readFile(sourcePath + "package.json", (err, data) => {
      if (err)
        reject(() => {
          throw new Error(err);
        });

      const { author, name } = res;
      let json = data.toString(); // 将 package.json 转换为 字符串类型
      json = json.replace(/demoName/g, name.tirm()); // 将旧的项目名称 替换为新的
      json = json.replace(/demoAuthor/g, author.tirm()); // 将旧的作者名称 替换为新的
      const path = process.cwd() + "/package.json"; // process.cwd() 方法会返回 Node.js 进程的当前工作目录
      // 将修改好的文件 重新写入
      fs.writeFile(path, new Buffer(json), () => {
        chalk.green("创建文件:" + path);
        resolve();
      });
    });
  });
}

function copy(sourcePath, currentPath, cb) {}
