/*
 * @Author: your name
 * @LastEditors: xiasong
 * @Date: 2021-01-20 17:22:48
 * @LastEditTime: 2021-01-20 17:52:55
 * @Description: description
 * @FilePath: \package_all\koa\src\demo.js
 */

const Koa = require("koa");

const router = require("koa-router")();

const session = require("koa-session");

const app = new Koa();

app.keys = ["some secret hurr"]; // koa-session 的一个签名

const CONFIG = {
  key: "koa.sess",
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};

app.use(session(CONFIG, app));

router.get("/", async (ctx, next) => {
  ctx.cookies.set("name", "1111", { maxAge: 60 * 1000 * 24 });
  ctx.body = "1111";
  ctx.session.demo2 = "1";
  await next();
});

router.get("/test", async (ctx, next) => {
  const name = ctx.cookies.get("name");
  ctx.body = name;
  console.log(ctx.session.demo2);
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3001, () => {
  console.log("serve at localhost:3001");
});
