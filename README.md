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
│       └── user.transformer.ts
└── tsconfig.json
```
我们会发现常见的代码都会存放于 /src 目录下，由于 ts 的特殊性，在服务器上会通过打包构建为 *.js 文件存放于 /dist 目录。将源文件和编译后文件分开是我们最开始的初衷。
### 4.快速开发引导
想要快速上手 zonetk，除了需要了解一些基础的东西：

虽然可以直接用 js 的语法书写，但是你最好了解 TypeScript，这里有个 [快速介绍](https://midwayjs.org/midway/ts_start.html)。
尽可能使用面向对象的思想来编码，它的经久不衰是有道理的，使用 class 机制能够方便的融入我们的新特性。
了解 zonetk 的依赖注入体系，以及常用的装饰器，这里做了 [依赖注入的介绍](https://midwayjs.org/midway/ioc.html)。
## 功能介绍
## 依赖注入