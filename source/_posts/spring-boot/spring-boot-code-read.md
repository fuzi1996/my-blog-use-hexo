---
title: Spring Boot源码阅读环境搭建
tags:
  - spring-boot
  - 源码阅读
  - 环境搭建
date: 2022-04-21 19:24:34
categories: spring-boot
---

**基于SpringBoot 2.3.9.RELEASE 版本**

## 前期准备

如果希望搭建SpringBoot源码阅读环境,必须科学上网,不要相信使用国内源下载依赖,阿里的源会有问题

## 流程

1. 克隆代码,切换到`2.3.9.release`分支,导入IDE

2. 这里如果下载依赖正常,通常还是会报错的,需要注释掉源码中的两处

- `settings.gradle`中注释掉'io.spring.ge.conventions'
  ```groovy
    plugins {
      id "com.gradle.enterprise" version "3.5.2"
      // id "io.spring.ge.conventions" version "0.0.7"
    }
  ```

- `buildSrc`下`build.gradle`中注释掉`io.spring.javaformat`
  ```groovy
  plugins {
    id "java-gradle-plugin"
    //id "io.spring.javaformat" version "${javaFormatVersion}"
    id "checkstyle"
  }
  ```
## 补充说明

一般下载完依赖，注释掉格式化等插件就可以直接在IDE中运行`spring-boot-tests`下的测试用例了
但我选择在源码根目录下新建`spring-boot-test`模块然后新建一个正常的SpringBoot程序,只不过引用的是源码中的依赖
我使用的版本是`v2.3.9.release`版,使用`gradle`做依赖管理,下面是`build.gradle`示例

```groovy
plugins {
    id 'java'
    id "org.springframework.boot.conventions"
}

description = "Spring Boot Test test"

dependencies {
    implementation(project(":spring-boot-project:spring-boot-starters:spring-boot-starter-web"))

    testImplementation(project(":spring-boot-project:spring-boot-starters:spring-boot-starter-test"))
}
```



