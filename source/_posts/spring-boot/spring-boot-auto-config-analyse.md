---
title: Spring Boot自动装配
tags:
  - spring-boot
  - 自动装配原理
date: 2022-04-21 21:24:34
categories: spring-boot
---

**基于SpringBoot 2.3.9.RELEASE 版本**

1. 先扫描得到配置类
2. org.springframework.boot.autoconfigure.AutoConfigurationImportSelector#selectImports 得到自动配置类
  AutoConfigurationImportSelector实现了DeferredImportSelector接口,DeferredImportSelector就保证一定在配置类全部解析完成后才调用selectImports方法