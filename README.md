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
### 3.框架增强注入
### 4.框架扩展方法
## 部署