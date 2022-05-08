---
title: Spring Boot自动装配
tags:
  - spring-boot
  - 自动装配原理
date: 2022-04-21 21:24:34
categories: spring-boot
---

本文使用的spring-boot版本:

```xml
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>2.5.4</version>
```

https://zhuanlan.zhihu.com/p/85926886

https://blog.csdn.net/woshilijiuyi/article/details/82219585

## @SpringBootApplication

SpringBoot主注解

## @ComponentScan

- value/basePackages：指定多个包名进行扫描
- basePackageClasses：对指定的类和接口所属的包进行扫
- nameGenerator：为扫描到的bean自动命名
- scopeResolver：指定扫描bean的范围
- scopedProxy：指定代理是否应该被扫描
- resourcePattern：控制可用于扫描的类文件
- useDefaultFilters：是否开启对@Component，@Repository，@Service，@Controller的类进行检测
- includeFilters：指定扫描的过滤器
- excludeFilters：指定不扫描的过滤器
- lazyInit：是否对注册扫描的bean设置为懒加载

## @SpringBootConfiguration

对Configuration注解的一个封装

## @EnableAutoConfiguration

利用@Import注解，将所有符合自动装配条件的bean注入到IOC容器中

Spring会把这个方法返回的类的全限定名数组里的所有的类都注入到IOC容器中
org.springframework.boot.autoconfigure.AutoConfigurationImportSelector#selectImports

## @Important
https://mp.weixin.qq.com/s?__biz=MzU5MDgzOTYzMw==&mid=2247484613&idx=1&sn=374f1c3cc601bd86caaff29a8bb76d7d&scene=21#wechat_redirect

## @Conditional
https://mp.weixin.qq.com/s?__biz=MzU5MDgzOTYzMw==&mid=2247483899&idx=2&sn=519a126880ce8db327b912bd9d8853d1&scene=21#wechat_redirect


