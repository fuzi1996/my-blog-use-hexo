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
