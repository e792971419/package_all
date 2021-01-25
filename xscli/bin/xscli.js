#!/usr/bin/env node

"use strict";

const { Color } = require("chalk");
/*
 * @Author: your name
 * @LastEditors: xiasong
 * @Date: 2021-01-25 14:41:42
 * @LastEditTime: 2021-01-25 17:27:17
 * @Description: description
 * @FilePath: \package_all\xscli\bin\xscli.js
 */

// test
//console.log(1);

const chalk = require("chalk");
// inquirer https://www.npmjs.com/package/inquirer
const inquirer = require("inquirer");
// commander https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md
const program = require("commander");

const copyCreate = require("../utils/create");

const question = [
  {
    name: "conf" /* key */,
    type: "confirm" /* 确认 */,
    message: "是否创建新的项目？" /* 提示 */,
  },
  {
    name: "name",
    message: "请输入项目名称？",
    when: (res) => Boolean(res.conf) /* 是否进行 */,
  },
  {
    name: "author",
    message: "请输入作者？",
    when: (res) => Boolean(res.conf),
  },
  {
    type: "list" /* 选择框 */,
    message: "请选择公共管理状态？",
    name: "state",
    choices: ["mobx", "redux"] /* 选项*/,
    filter: function (val) {
      /* 过滤 */
      return val.toLowerCase();
    },
    when: (res) => Boolean(res.conf),
  },
];

program.version(`version is ${require("../package.json").version}`);

// program.command("create").action(() => {
//   require("../lib/create");
// });

program.option("-s, --small", "small pizza size");

program
  .command("create")
  .description("create a project")
  .action(() => {
    chalk.green("欢迎使用xscli");
    inquirer.prompt(question).then((answer) => {
      console.log(answer);
    });
  });

program
  .command("copy")
  .description("copy chosen template")
  .action(() => {
    chalk.blue("复制选中的模板");
    inquirer.create().then((res) => {
      if (res.conf) {
        copyCreate(res);
      }
    });
  });

program.parse(process.argv);

const options = program.opts();

if (options.small) console.log(chalk.blue("option is small"));
