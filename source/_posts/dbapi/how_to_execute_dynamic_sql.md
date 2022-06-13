---
title: dbapi是如何执行动态SQL的
tags:
  - dbapi
date: 2022-06-09 19:19:45
categories: dbapi
---

[dbapi](https://gitee.com/freakchicken/db-api)可以解析类似`MyBatis`形式的SQL语句

整个执行过程分为两部分:

- 1.解析SQL字符串
- 2.执行SQL

本文将着重介绍它是如何执行SQL的

对标`db-api`版本:`dfc0dac12d67e892e3ceb0b89dad773b2ab14642`

## 解析

db-api使用[orange](https://gitee.com/freakchicken/orange)解析字符串,将形如

```xml
select * from user
<where>
  name in 
  <foreach collection='list' open='(' separator=',' close=')'>
    #{item.name}
  </foreach>
</where>
```

的SQL语句解析为`SqlMeta`对象,其中`SqlMeta.sql`属性为解析后的SQL字符串,`SqlMeta.jdbcParamValues`属性为解析后的参数列表

## 执行

通过分析找到真正执行的类`com.gitee.freakchicken.dbapi.basic.servlet.APIServlet`,这个类是一个`HttpServlet`

无论是`get`请求还是`post`请求,都会调用`com.gitee.freakchicken.dbapi.basic.servlet.APIServlet#process`方法

process方法分为以下几步:

- 1.根据path获取API定义
- 2.获取相关数据库配置
- 3.从请求中获取参数
- 4.缓存
- 5.获取链接
- 6.执行sql
- 7.执行数据转换

**以上各步,一旦出现异常就会发送提醒**

这里最主要的就是第六步

### executeSql执行sql

`com.gitee.freakchicken.dbapi.basic.servlet.APIServlet#executeSql`无非是根据配置设置连接是否自动提交事务，如果不是自动提交的事务，则按照执行结果提交或返回事务

这里最主要的是调用`com.gitee.freakchicken.dbapi.basic.util.JdbcUtil#executeSql`

而在`JdbcUtil#executeSql`里主要使用`PreparedStatement`执行sql


