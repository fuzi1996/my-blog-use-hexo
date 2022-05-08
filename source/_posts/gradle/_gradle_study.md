---
title: Gradle入门
tags:
  - Gradle
date: 2022-04-18 19:39:44
categories: Gradle
---

**适用版本:6.5.1**

## Gradle基础

[Github地址](https://github.com/gradle/gradle)
[官网](https://gradle.org/)

### Gradle的基础概念

- Distribution

[Distribution](https://services.gradle.org/distributions/)

- Wrapper

```bash
gradle wrapper
```

后生成文件结构

```txt
Folder PATH listing for volume Data
Volume serial number is 1EC0-B189
D:\TEMP\GRADLEDEMO
├───.gradle
│   ├───6.5.1
│   │   ├───executionHistory
│   │   ├───fileChanges
│   │   ├───fileHashes
│   │   └───vcsMetadata-1
│   ├───buildOutputCleanup
│   ├───checksums
│   └───vcs-1
└───gradle
    └───wrapper
```

在没有安装gradle的电脑上运行

```bash
gradlew.bat help
```

就会下载对应版本gradle

- GradleUserHome

类似于`Maven`的'.m2'文件

- Daemon

为了快速启动JVM,先启动一个轻量的client JVM,然后连接daemon JVM,转发请求至daemon

gradle执行完成后,client JVM会关闭

### Groovy基础

- 动态调用与MOP

Groovy本质上是反射调用

- 闭包

{}就是函数

it代表元素

## Gradle构建

### Gradle核心模型

- Project

- Task
  最小的单元

- Lifecycle与Hook

  - Lifecycle

    1. Initialization
    2. Configuration
    3. Execution

## 插件编写

### 构建逻辑复用

### 简单插件

### script插件

### buildSrc插件

### 发布插件

## 实际插件分析

## 参考

1.[Gradle入门教程](https://www.bilibili.com/video/BV1DE411Z7nt)
2.[https://services.gradle.org/](https://services.gradle.org/)