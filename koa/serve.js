const Koa = require("koa");

const path = require("path");

// 引入 koa-router 路由
const router = require("koa-router")();

// 引入 第三方中间件
const static = require("koa-static"); // 引入静态文件的 一个包
const bodyParser = require("koa-bodyparser"); // body 解析的包
const dayjs = require("dayjs"); // 时间格式的包
const md5 = require("md5"); // md5 加密的一个包
const session = require("koa-session"); // 储存会话级别的info
const render = require("koa-art-template"); // 渲染模板的

const staticPath = "/static";

const app = new Koa();

app.keys = ["some secret hurr"]; // koa-session 的一个签名

const CONFIG = {
  key: "koa.sess",
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: true,
};
app.use(session(CONFIG, app));

render(app, {
  root: path.join(__dirname, "views"),
  extname: ".html",
  debug: process.env.NODE_ENV !== "production",
});

/**
 * 什么是Koa的中间件
 * 通俗的讲：中间件就是匹配路由之前或者匹配路由完成做的一系列的操作，我们就可以把它叫做中间件
 *
 * 中间件的功能包括
 *  1.执行任何代码
 *  2.修改请求和响应对象。
 *  3.终结请求-响应循环。
 *  4.调用堆栈中的下一个中间件。
 *
 * 如果我的get、post回调函数中，没有next参数，那么就匹配上第一个路由，就不会往下匹配了。如果想往下匹配的话，那么需要写next()
 *
 * Koa应用可使用如下几种中间件：
 *  1.应用级中间件
 *  2.路由级中间件
 *  3.错误处理中间件
 *  4.第三方中间件
 * */

/* 1. 应用级中间件 */

app.use(async (ctx, next) => {
  console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  await next(); // 当前路由匹配完后 继续向下匹配
});

/* 4. 第三方中间件 */
/**
 * 访问文本，例如js，css，png，jpg，gif
 * 访问静态目录
 * 找不到资源，抛出404错误
 * koa-static主要是用于访问静态资源
 * */
app.use(static(path.join(__dirname, staticPath)));

/* 简单模拟一个登录的 */
// app.use(async (ctx, next) => {
//   if (ctx.url === "/" && ctx.method === "GET") {
//     // 当GET请求时候返回表单页面
//     let html = `
//       <h1>koa2 request post demo</h1>
//       <form method="POST" action="/">
//         <p>userName</p>
//         <input name="userName" /><br/>
//         <p>nickName</p>
//         <input name="nickName" /><br/>
//         <p>email</p>
//         <input name="email" /><br/>
//         <button type="submit">submit</button>
//       </form>
//     `;
//     ctx.body = html;
//   } else if (ctx.url === "/" && ctx.method === "POST") {
//     // 当POST请求的时候，解析POST表单里的数据，并显示出来
//     let postData = await parsePostData(ctx);
//     // ctx.session.usename = postData.userName;S
//     ctx.body = postData;
//   } else {
//     next();
//   }
// });

// 解析上下文里node原生请求的POST参数
function parsePostData(ctx) {
  // console.log(ctx);
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener("data", (data) => {
        postdata += data;
      });
      ctx.req.addListener("end", function () {
        let parseData = parseQueryStr(postdata);
        resolve(parseData);
      });
    } catch (err) {
      reject(err);
    }
  });
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr(queryStr) {
  let queryData = {};
  let queryStrList = queryStr.split("&");
  for (let [index, queryStr] of queryStrList.entries()) {
    let itemList = queryStr.split("=");
    queryData[itemList[0]] = decodeURIComponent(itemList[1]);
  }
  return queryData;
}

/* 路由使用 start */
/* 2. 路由中间件 */
router.get("/", async (ctx, next) => {
  const pw = "12345";

  ctx.body = `hello koa--${md5(pw)}`;

  // ctx.cookies.set("demo", "11", { maxAge: 60 * 1000 });
  ctx.session.demo2 = "2222";
  await next();
});

// router.post("/", async (ctx, next) => {
//   ctx.body = ctx;
// });

router.get("/test", async (ctx, next) => {
  // console.log(ctx.cookies.get("demo"));
  console.log(ctx.session.demo2);
  ctx.body = "test";
  await next();
});

router.get("/news", async (ctx, next) => {
  ctx.body = "news";
  let url = ctx.url;
  let request = ctx.request;

  let req_query = request.query;
  let req_querystring = request.req_querystring;

  let ctx_query = ctx.query;
  let ctx_quertstring = ctx.req_querystring;

  ctx.body = {
    url,
    req_query,
    req_querystring,
    ctx_query,
    ctx_quertstring,
  };

  await next();

  // console.log(ctx);
});

router.get("/good/:aid", async (ctx, next) => {
  console.log(ctx.params);
  console.log(ctx);
  ctx.body = "good";
  await next();
});

router.get("/html", async (ctx, next) => {
  let curObj = {
    title: "art-template",
    list: [1, 2, 3],
    flag: 1,
    value: "<h2>1111</h2>",
  };
  await ctx.render("index", {
    data: curObj,
  });

  await next();
});

app.use(router.routes()); // 启动路由
/* 作用： 当请求出错时的处理逻辑
   这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,
   所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头 
*/
app.use(router.allowedMethods());
/* 路由使用 end */

/* 3. 错误处理中间件 */
app.use(async (ctx, next) => {
  next();
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = "这是一个404页面";
  }
});

app.use(bodyParser());

app.listen(3000, () => {
  console.log("app serve at port 3000");
});
