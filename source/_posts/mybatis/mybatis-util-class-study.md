---
title: MyBatis常用工具类学习
tags:
  - mybatis
date: 2021-12-04 18:04:28
categories: mybatis
---

## ScriptRunner
  执行SQL脚本

## SqlRunner
  执行SQL

## MetaObject
  获取和设置对象的属性值
  可以使用`SystemMetaObject.forObject(Object object)`创建

## MetaClass
  获取类相关的信息

## ObjectFactory
  用于创建对象
  List、Map、Set接口对应的实现分别为ArrayList、HashMap、HashSet
  应用:MyBatis提供的一种扩展机制，在得到映射结果之前我们需要处理一些逻辑，或者在执行该类的有参构造方法时，在传入参数之前，要对参数进行一些处理，这时我们可以通过自定义ObjectFactory来实现

## ProxyFactory
  代理工厂，主要用于创建动态代理对象
  两种实现:CglibProxyFactory和JavassistProxyFactory
  应用:ProxyFactory主要用于实现MyBatis的懒加载功能。当开启懒加载后，MyBatis创建Mapper映射结果对象后，会通过ProxyFactory创建映射结果对象的代理对象。当我们调用代理对象的Getter方法获取数据时，会执行CglibProxyFactory或JavassistProxyFactory中定义的拦截逻辑，然后执行一次额外的查询

## 参考

1. MyBatis 3源码深度解析／江荣波