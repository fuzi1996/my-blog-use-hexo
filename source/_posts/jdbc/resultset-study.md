---
title: ResultSet学习
tags:
  - jdbc
  - ResultSet
date: 2021-12-04 11:58:50
categories: jdbc
---

## ResultSet类型

- 主要体现:
  - 游标可操作的方式
  - ResultSet对象的修改对数据库的影响

- 类型:
  - TYPE_FORWARD_ONLY
    ResultSet不可滚动，游标只能向前移动，从第一行到最后一行，不允许向后移动
  
  - TYPE_SCROLL_INSENSITIVE
    ResultSet是可滚动的，它的游标可以相对于当前位置向前或向后移动，也可以移动到绝对位置
    ResultSet没有关闭时，ResultSet对象的修改不会影响对应的数据库中的记录
  
  - TYPE_SCROLL_SENSITIVE
    ResultSet是可滚动的，它的游标可以相对于当前位置向前或向后移动，也可以移动到绝对位置
    ResultSet没有关闭时，对ResultSet对象的修改会直接影响数据库中的记录

- 判断
  - DatabaseMetaData接口中提供了一个supportsResultSetType()方法，用于判断数据库驱动是否支持某种类型的ResultSet对象
  - 当Statement对象执行时，产生的ResultSet对象可以通过ResultSet对象的getType()方法确定它的类型

## ResultSet并行性

- 类型
  - CONCUR_READ_ONLY
    为ResultSet对象设置这种属性后，只能从ResulSet对象中读取数据，但是不能更新ResultSet对象中的数据

  - CONCUR_UPDATABLE
    该属性表明，既可以从ResulSet对象中读取数据，又能更新ResultSet中的数据

- 判断
  - DatabaseMetaData接口中提供了一个supportsResultSetConcurrency()方法，用于判断JDBC驱动是否支持某一级别的并行性
  - 在应用程序中，可以调用ResultSet对象的getConcurrency()方法获取ResultSet的并行性级别

## ResultSet可保持性

ResultSet对象的holdability属性使得应用程序能够在Connection对象的commit()方法调用后控制ResultSet对象是否关闭

- 类型:
  - HOLD_CURSORS_OVER_COMMIT
    当调用Connection对象的commit()方法时，不关闭当前事务创建的ResultSet对象。
  
  - CLOSE_CURSORS_AT_COMMIT
    当前事务创建的ResultSet对象在事务提交后会被关闭，对一些应用程序来说，这样能够提升系统性能。

- 判断
  - DatabaseMetaData接口中提供了getResultSetHoldability()方法用于获取JDBC驱动的默认可保持性
  - 应用程序可以调用ResultSet对象的getHoldability()方法获取ResultSet的可保持性

## 属性设置

ResultSet的类型、并行性和可保持性等属性可以在调用Connection对象的createStatement()、prepareStatement()或prepareCall()方法创建Statement对象时设置

## ResultSet游标

ResultSet对象中维护了一个游标，游标指向当前数据行
当ResultSet对象第一次创建时，游标指向数据的第一行

## 关闭ResultSet对象

- ResultSet对象在下面两种情况下会显式地关闭：
  - 调用ResultSet对象的close()方法
  - 创建ResultSet对象的Statement或者Connection对象被显式地关闭

- 在下面两种情况下ResultSet对象会被隐式地关闭：
  - 相关联的Statement对象重复执行时
  - 可保持性为CLOSE_CURSORS_AT_COMMIT的ResultSet对象在当前事务提交后会被关闭


## 参考

1. MyBatis 3源码深度解析／江荣波

