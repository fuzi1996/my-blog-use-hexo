---
title: mybatis执行器
tags:
  - mybatis执行器
date: 2021-11-21 13:39:58
categories: mybatis
---

MyBatis就是针对JDBC做了一层封装，关于JDBC执行流程,详见:[JDBC执行流程](/2021/10/01/jdbc/jdbc-study#JDBC执行流程)

主要涉及四部分:
- 动态代理 MapperProxy
- Sql会话 SqlSession
- mybatis执行器 Executor
- JDBC处理器 StatementHandler

MyBatis执行流程:

[![MyBatis执行流程](/assets/images/mybatis/mybatis-study/mybatis执行流程.drawio.png)](/assets/drawio/mybatis/mybatis-study/mybatis执行器.drawio)

## MyBatis执行器

[![sqlsession与excutor](/assets/images/mybatis/mybatis-study/sqlsession与excutor.drawio.png)](/assets/drawio/mybatis/mybatis-study/mybatis执行器.drawio)

## BaseExecutor

- 公共功能:
  - 一级缓存
  - 获取连接

- 方法:
  - query -> doQuery(接口)
  - update -> doUpdate(接口)
  `BaseExecutor`中`query`,`update`是具体方法，可以进行一级缓存操作，然后调用具体实现类的`doQuery`与`doUpdate`方法查询


### SimpleExecutor

`doQuery`/`doUpdate`:
  使用`SimpleExecutor`,无论执行的SQL是否一样每次都会进行预编译,每次都创建一个新的`PrepareStatement`

### ReuseExecutor

`doQuery`/`doUpdate`:
  使用`ReuseExecutor`,多次执行,若执行的SQL一样则会预编译一次

`ReuseExecutor`内部维护了一个HashMap(`statementMap`,以执行的sql为key,以`Statement`为value),如果执行的sql相同,则会命中`statementMap`中的数据,不会构建新的`PrepareStatement`,进而减少编译

### BatchExecutor

`doUpdate`:
  `BatchExecutor`只针对非查询语句(`doUpdate`)才有编译优化,若执行的sql与前一条执行的sql一致且与前一条对应的`MapperStatement`一致,才会开启编译优化
否则执行几次就会编译几次,创建新的`PrepareStatement`

