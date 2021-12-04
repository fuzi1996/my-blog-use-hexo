---
title: 设计模式
tags:
  - design-pattern
date: 2021-10-13 22:35:43
categories: design-pattern
---

## 门面模式(Facade Pattern)

- 简介:
  门面模式为封装的对象定义了一个**新**的接口，所有针对封装对象的操作都通过门面接口去实现

- 示例:

  - MyBatis中SqlSession与Executor
  SqlSession是门面接口，Executor是被封装的对象，所有访问执行器Excutor的操作都需要通过SqlSession定义的新接口去执行

## 模板模式(Template Pattern)

- 简介:
  一个抽象类公开定义了执行它的方法的方式/模板。它的子类可以按需要重写方法实现，但调用将以抽象类中定义的方式进行

- 示例:

  - 面向接口编程就是典型的模板模式

  - MyBatis提供了3种不同的Executor，分别为SimpleExecutor、ResueExecutor、BatchExecutor，这些Executor都继承至BaseExecutor，BaseExecutor中定义的方法的执行流程及通用的处理逻辑，具体的方法由子类来实现，是典型的模板方法模式的应用

## 享元模式(Flyweight Pattern)

- 简介:
  主要用于减少创建对象的数量，以减少内存占用和提高性能

- 示例:

  - Mybatis的Configration缓存了MappedStatement对象,当使用时直接从缓存中取出

## 装饰器模式(Decorater Pattern)

- 简介:
  创建了一个装饰类，用来包装原有的类，并在保持类方法签名完整性的前提下，提供了额外的功能
  允许向一个现有的对象添加新的功能，同时又不改变其结构

- 示例:
  - Mybatis中创建了CachingExecutor作为装饰类,包装了SimpleExecutor,ReuseExecutor和BatchExecutor,在保持方法签名不变的前提下,提供了缓存功能