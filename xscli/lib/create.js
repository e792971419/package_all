/*
 * @Author: your name
 * @LastEditors: xiasong
 * @Date: 2021-01-25 15:18:41
 * @LastEditTime: 2021-01-25 15:48:51
 * @Description: description
 * @FilePath: \package_all\xscli\lib\create.js
 */

const ora = require("ora"); // 用于进程的一个显示
const chalk = require("chalk"); // 在终端显示不同颜色的字
const logSymbols = require("log-symbols"); // 为日志提供着色的符号(类似下载成功 √)
const download = require("download-git-repo"); // 用于下载 git 上的模板
const { spawnSync } = require("child_process"); // 这是nodejs自带的一个包，用于开启子线程，非常强大



// test 测试

// const chalk = require("chalk");
// const logSymbols = require("log-symbols");
// const ora = require("ora");

// console.log(chalk.green("demo"));
// console.log(chalk.blue("demo"));

// console.log(logSymbols.success, chalk.yellow("bingo"));

// const spinner = ora("Downloading...");
// spinner.start();
// spinner.fail();
// spinner.succeed();

// const inquirer = require("inquirer");

// getInquirer().then((res) => {
//   console.log(res);
// });

// function getInquirer() {
//   return inquirer.prompt([
//     {
//       name: "projectName",
//       message: "project name",
//       default: "project",
//     },
//     {
//       name: "projectVersion",
//       message: "项目版本号",
//       default: "1.0.0",
//     },
//   ]);
// }
