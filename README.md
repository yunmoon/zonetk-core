# zonetk-core zontk框架核心代码
基于koa typescript实现的快速开发框架
## 快速上手

### 1.安装zonetk-cli工具
[zonetk-cli](https://github.com/yunmoon/zonetk-cli)
```bash
npm install zonetk-cli -g
```

### 2.创建第一个项目
```bash
zonetk create --name zonetk-demo
```
### 3.目录介绍
```js
├── README.md
├── config                                        ----配置文件目录
│   └── default.js
├── ormconfig.js
├── package.json
├── dist                                          ----编译后目录
├── src                                           ----源代码目录
│   ├── controller                                ----controller目录
│   │   └── user.controller.ts
│   ├── entity                                    ----orm实体类目录
│   │   └── user.ts
│   ├── index.ts                                  ----程序入口
│   ├── lib                                       ----第三方扩展，自由定义
│   │   └── databaseLog.lib.ts
│   ├── middleware                                ----中间件目录
│   │   ├── errorHandle.middleware.ts
│   │   └── requestLog.middleware.ts
│   ├── migration                                 ----数据库迁移文件目录
│   │   └── 1564975664486-UserCreateMigration.ts
│   ├── plugin                                    ----插件目录，存放单一全局实例
│   │   └── redis.plugin.ts
│   ├── service                                   ----实体类数据库查询业务
│   │   └── user.service.ts
│   └── transformer                               ----api接口返回数据格式化工具目录
│   │    └── user.transformer.ts
│   ├── schedule                                  ----定时任务目录
│   │   └── first.schedule.ts
│   └── rpc                                       ----rpc方法目录
│   │    └── first.rpc.ts
└── tsconfig.json
```
我们会发现常见的代码都会存放于 /src 目录下，由于 ts 的特殊性，在服务器上会通过打包构建为 *.js 文件存放于 /dist 目录。将源文件和编译后文件分开是我们最开始的初衷。
### 4.快速开发引导
想要快速上手 zonetk，除了需要了解一些基础的东西：

虽然可以直接用 js 的语法书写，但是你最好了解 TypeScript，这里有个 [快速介绍](https://midwayjs.org/midway/ts_start.html)。  
尽可能使用面向对象的思想来编码，它的经久不衰是有道理的，使用 class 机制能够方便的融入我们的新特性。
了解 zonetk 的依赖注入体系，以及常用的装饰器，这里做了 [依赖注入的介绍](https://midwayjs.org/midway/ioc.html)。
## 功能介绍
### 1.TypeORM
[TypeORM](https://github.com/typeorm/typeorm) 是一个[ORM](https://en.wikipedia.org/wiki/Object-relational_mapping)框架，它可以运行在 NodeJS、Browser、Cordova、PhoneGap、Ionic、React Native、Expo 和 Electron 平台上，可以与 TypeScript 和 JavaScript (ES5,ES6,ES7,ES8)一起使用。 它的目标是始终支持最新的 JavaScript 特性并提供额外的特性以帮助你开发任何使用数据库的（不管是只有几张表的小型应用还是拥有多数据库的大型企业应用）应用程序。

不同于现有的所有其他 JavaScript ORM 框架，TypeORM 支持 Active Record 和 Data Mapper 模式，这意味着你可以以最高效的方式编写高质量的、松耦合的、可扩展的、可维护的应用程序。

TypeORM 参考了很多其他优秀 ORM 的实现, 比如 Hibernate, Doctrine 和 Entity Framework。

TypeORM 的一些特性:

- 支持 DataMapper 和 ActiveRecord (随你选择)
- 实体和列
- 数据库特性列类型
- 实体管理
- 存储库和自定义存储库
- 清晰的对象关系模型
- 关联（关系）
- 贪婪和延迟关系
- 单向的，双向的和自引用的关系
- 支持多重继承模式
- 级联
- 索引
- 事务
- 迁移和自动迁移
- 连接池
- 主从复制
- 使用多个数据库连接
- 使用多个数据库类型
- 跨数据库和跨模式查询
- 优雅的语法，灵活而强大的 QueryBuilder
- 左联接和内联接
- 使用联查查询的适当分页
- 查询缓存
- 原始结果流
- 日志
- 监听者和订阅者（钩子）
- 支持闭包表模式
- 在模型或者分离的配置文件中声明模式
- json / xml / yml / env 格式的连接配置
- 支持 MySQL / MariaDB / Postgres / SQLite / Microsoft SQL Server / Oracle / sql.js
- 支持 MongoDB NoSQL 数据库
- 可在 NodeJS / 浏览器 / Ionic / Cordova / React Native / Expo / Electron 平台上使用
- 支持 TypeScript 和 JavaScript
- 生成高性能、灵活、清晰和可维护的代码
- 遵循所有可能的最佳实践
- 命令行工具  

详细使用请[参考文档](https://github.com/typeorm/typeorm/tree/master/docs/zh_CN)
### 2.路由和控制器
zonetk 使用 koa-router 作为路由的承载者，同时在 ts 的语法上做了一些简化，我们将路由和控制器放在了一起，使用装饰器来标注路由。

由于 zonetk 采用了 IoC 自扫描机制，使得在一定程度上弱化了目录结构约定，通过装饰器的机制，可以非常方便的进行解耦，按业务逻辑拆分等。

现在可以在任意目录下创建 controller，不再限定 app/controller 目录，同理，其他装饰器也不限定。

现在可以做到比如 src/web/controller 下放 controller，也可以按业务维度分，比如 user 目录，包含跟用户相关所有的 controller/service/dao 等，对微服务或者 serverless 比较友好。
#### 路由装饰器
我们的控制器目录为 src/controller ，我们在其中编写 *.ts 文件。例如下面的 userController.controller.ts ，我们提供了一个获取用户的接口。
```js
import { provide, controller, inject, Http } from 'zonetk-core';

@provide()
@controller('/user')
export class UserController {

  @inject('userService')
  service: IUserService;

  @Http.get('/:id')
  async getUser(ctx): Promise<void> {
    const id: number = ctx.params.id;
    const user: IUserResult = await this.service.getUser({id});
    ctx.body = {success: true, message: 'OK', data: user};
  }
}
```
我们创建了 @controller 装饰器用来定义这个类为 Controller，同时，提供了方法装饰器用于标注请求的类型。
@controller 的参数为字符串 pattern，我们会将这个值传入 router.prefix(prefix) 的参数中。  
zontk 针对 web 请求，提供了和 koa-router 对应的方法装饰器，列表如下。
- @Http.get
- @Http.post
- @Http.del
- @Http.put
- @Http.patch
- @Http.options
- @Http.head
- @Http.all  

这几个装饰器用于修饰不同的异步方法，同时对应到了 koa-router 的相应的方法。和原有提供的控制器一样，每个控制器都为异步方法，参数为 koa 上下文。
#### 路由优先级
在单页应用下，经常会出现 /* 这种路由，在原本的路由文件中，我们可以通过调整代码的顺序，来使的路由的匹配顺序发生变化。而由于使用了装饰器的关系，在新的体系无法控制文件扫描和加载顺序，这就使得路由匹配的顺序不可控。

zonetk 提供了 @priority(priority: number) 装饰器，用于修饰 class，定义路由的优先级，默认的路由优先级为 0，可以设置负数让优先级降低。
```js
@provide()
@priority(-1)
@controller('/')
export class HomeController {

  @Http.get('/hello')
  async index(ctx) {
    ctx.body = 'hello';
  }

  @Http.get('/*')
  async all(ctx) {
    ctx.body = 'world';
  }
}
```
#### 路由中间件
现在可以提供一个 middleware（任意目录），比如 src/middleware/api.ts。
```ts
import { Middleware, WebMiddleware, provide,config,BaseMiddleware } from 'zonetk-core';

@provide()
export class ApiMiddleware extends BaseMiddleware implements WebMiddleware {

  @config('hello')
  helloConfig;

  resolve(): Middleware {
    return async (ctx, next) => {
      ctx.api = '222' + this.helloConfig.b;
      await next();
    };
  }

}
```
由于是 class，依旧可以使用 inject/plugin/config 等装饰器修饰。
```ts
@provide()
@controller('/', {middleware: ['homeMiddleware']})
export class My {

  @inject()
  ctx;

  @Http.get('/', {middleware: ['apiMiddleware']})
  async index() {
    this.ctx.body = this.ctx.home + this.ctx.api;
  }
}
```
在 @controller 和 @get/post 等路由装饰器上都提供了 middleware 参数。  
这里的 middleware 参数是一个数组，可以传多个字符串或者 koa middleware，如果是字符串，会从 IoC 容器中获取对应的 WebMiddleware 接口实例的 resolve 方法的结果。
由于中间件在生命周期的特殊性，会在应用请求前就被加载（绑定）到路由上，所以无法和上下文关联。

中间件类固定为单例（Singleton），所有注入的内容都为单例，包括但不限于 @config/@logger/@plugin 等。

这意味着你可以注入一个 service，但是这个 service 中无法注入 ctx 属性。

这个时候，你必须在 resolve 方法中，通过调用 ctx.requestContext.getAsync('xxx') 的方式来创建请求作用域实例，和上下文绑定。
```ts
@provide()
export class ApiMiddleware extends BaseMiddleware implements WebMiddleware {

  @inject()
  myService;  // 由于中间件实例属于单例，这个实例即使注入也无法获取到 ctx

  resolve(): Middleware {
    return async (ctx, next) => {
      // 必须通过从请求作用域中获取对象的方式，来绑定上下文
      ctx.service = await ctx.requestContext.getAsync('myService');
      await next();
    };
  }

}
```

#### 一个方法挂载多个路由
```ts
@provide()
@controller('/', {middleware: ['homeMiddleware']})
export class My {

  @inject()
  ctx;

  @Http.get('/', {middleware: ['apiMiddleware']})
  @Http.post('/api/data')
  async index() {
    this.ctx.body = this.ctx.home + (this.ctx.api || '');
  }
}
```
这样请求进来， post 和 get 拿到的结果是不一样的（get请求挂载了额外的中间件）。

### 3.框架增强注入
#### 注入插件
#### 注入配置
#### 注册定时任务
#### 注册rpc服务方法
#### 注入日志对象
### 4.框架扩展方法
## 部署