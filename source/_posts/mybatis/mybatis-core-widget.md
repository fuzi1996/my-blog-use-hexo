---
title: MyBatis核心组件
tags:
  - mybatis
date: 2021-12-04 19:08:06
categories: mybatis
---

## Configuration
  MyBatis的主配置信息

## MappedStatement
  Mapper中的SQL配置信息

## SqlSession
  面向用户操作的api
  SqlSession是Executor组件的外观，目的是为用户提供更友好的数据库操作接口，这是设计模式中外观(门面)模式的典型应用

## Executor
  执行器

## StatementHandler
  封装了JDBC Statement的操作

## ParameterHandler
  当MyBatis框架使用的Statement类型为CallableStatement和PreparedStatement时，ParameterHandler用于为Statement对象参数占位符设置值

## ResultSetHandler
  封装了对JDBC中的ResultSet对象操作

## TypeHandler
  Mybatis类型处理器

## 参考

1. MyBatis 3源码深度解析／江荣波