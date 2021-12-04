---
title: JDBC事务学习
tags:
  - jdbc
  - 事务
date: 2021-12-04 12:48:34
categories: jdbc
---

## 自动提交

启用自动提交后，会在每个SQL语句执行完毕后自动提交事务

## 事务隔离级别

{% post_link db/transaction 事务隔离级别 %}

## 保存点

一旦设置保存点，事务就可以回滚到保存点，而不影响保存点之前的操作

DatabaseMetaData接口提供了supportsSavepoints()方法，用于判断JDBC驱动是否支持保存点

Connection接口中提供了setSavepoint()方法用于在当前事务中设置保存点，如果setSavepoint()方法在事务外调用，则调用该方法后会在setSavepoint()方法调用处开启一个新的事务。setSavepoint()方法的返回值是一个Savepoint对象，该对象可作为Connection对象rollback()方法的参数，用于回滚到对应的保存点

Connection对象中提供了一个releaseSavepoint()方法，接收一个Savepoint对象作为参数，用于释放当前事务中的保存点

事务中创建的所有保存点在事务提交或完成回滚之后会自动释放，事务回滚到某一保存点后，该保存点之后创建的保存点会自动释放

## 参考

1. MyBatis 3源码深度解析／江荣波
