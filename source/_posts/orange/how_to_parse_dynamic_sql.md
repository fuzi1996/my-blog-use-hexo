---
title: Orange是如何解析动态SQL的
tags:
  - orange
date: 2022-06-15 21:09:28
categories: orange
---

[orange](https://github.com/freakchick/orange)是一个动态sql引擎，类似mybatis的功能，解析带标签的动态sql，生成?占位符的sql和?对应的参数列表

## 解析过程

![orange解析动态sql过程.drawio.png](/assets/images/orange/orange解析动态sql过程.drawio.png)