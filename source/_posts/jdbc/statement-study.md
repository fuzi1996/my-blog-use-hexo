---
title: Statement 学习
tags:
  - jdbc
  - Statement
date: 2021-12-04 11:28:37
categories: jdbc
---

## Statement接口

- 使用Statement对象执行完SQL后也需要关闭

## PreparedStatement接口

- 在Statement接口的基础上增加了参数占位符功能,可以为占位符设置值
- PreparedStatement的实例表示可以被预编译的SQL语句，执行一次后，后续多次执行时效率会比较高
- 参数占位符的位置（从1开始）
- PreparedStatement对象设置的参数在执行后不能被重置，需要显式地调用clearParameters()方法清除先前设置的值，再为参数重新设置值即可


## CallableStatement接口

- 继承自PreparedStatement，在此基础上增加了调用存储过程以及检索存储过程调用结果的方法
- 使用setXXX()方法为参数占位符设置值时，下标必须从1开始

## 参考

1. MyBatis 3源码深度解析／江荣波