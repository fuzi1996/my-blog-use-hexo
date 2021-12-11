---
title: Maven远程仓库配置与依赖
tags:
  - Maven
date: 2021-12-04 22:31:59
categories: Maven
---

## 不常用的命令

- mvn help

```bash
# 显示配置信息
mvn help:system
```

- mvn dependency

```bash
# 显示依赖
mvn dependency:tree
mvn dependency:list
# 依赖分析
mvn dependency:analyse
```

## 配置文件区别
  - `$M2_HOME/conf/settings.xml`是全局配置
  - `～/.m2/settings.xml`是用户配置

## 远程仓库配置

```xml
＜project＞
  ＜repositories＞
    ＜repository＞
      ＜id＞jboss＜/id＞
      ＜name＞JBoss Repository＜/name＞
      ＜url＞http://repository.jboss.com/maven2/＜/url＞
      ＜releases＞
        <!-- 发布版本下载支持 -->
        ＜enabled＞true＜/enabled＞
        <!-- 远程仓库检查更新的频率,never—从不检查更新；always—每次构建都检查更新；interval:X—每隔X分钟检查一次更新（X为任意整数）；daily，表示Maven每天检查一次 -->
        ＜updatePolicy＞daily＜/updatePolicy＞
        <!-- Maven检查检验和文件的策略,warn时，Maven会在执行构建时输出警告信息;fail—Maven遇到校验和错误就让构建失败；ignore—使Maven完全忽略校验和错误 -->
        ＜checksumPolicy＞ignore＜/checksumPolicy＞
      ＜/releases＞
      ＜snapshots＞
        <!-- 快照版本的下载支持 -->
        ＜enabled＞false＜/enabled＞
        ＜updatePolicy＞daily＜/updatePolicy＞
        ＜checksumPolicy＞ignore＜/checksumPolicy＞
      ＜/snapshots＞
      ＜layout＞default＜/layout＞
    ＜/repository＞
  ＜/repositories＞
＜/project＞
```
### 远程仓库认证

```xml
＜settings＞
  ＜servers＞
    ＜server＞
      ＜id＞my-proj＜/id＞
      ＜username＞repo-user＜/username＞
      ＜password＞repo-pwd＜/password＞
    ＜/server＞
  ＜/servers＞
＜/settings＞
```
settings.xml中server元素的id必须与POM中需要认证的repository元素的id完全一致，正是这个id将认证信息与仓库配置联系在了一起

### 部署至远程仓库

```xml
＜project＞
  ＜distributionManagement＞
    ＜repository＞
      ＜id＞proj-releases＜/id＞
      ＜name＞Proj Release Repository＜/name＞
      ＜url＞http://192.168.1.100/content/repositories/proj-releases＜/url＞
    ＜/repository＞
    ＜snapshotRepository＞
      ＜id＞proj-snapshots＜/id＞
      ＜name＞Proj Snapshot Repository＜/name＞
      ＜url＞http://192.168.1.100/content/repositories/proj-snapshots＜/url＞
    ＜/snapshotRepository＞
  ＜/distributionManagement＞
＜/project＞
```
distributionManagement:
repository和snapshotRepository子元素，前者表示发布版本构件的仓库，后者表示快照版本的仓库。关于发布版本和快照版本

### maven镜像

```xml
＜settings＞
  ＜mirrors＞
    ＜mirror＞
      ＜id＞maven.net.cn＜/id＞
      ＜name＞one of the central mirrors in China＜/name＞
      ＜url＞http://maven.net.cn/content/groups/public/＜/url＞
      ＜mirrorOf＞central＜/mirrorOf＞
    ＜/mirror＞
  ＜/mirrors＞
＜/settings＞
```
- ＜mirrorOf＞的值为central，表示该配置为中央仓库的镜像，任何对于中央仓库的请求都会转至该镜像
- ＜mirrorOf＞*＜/mirrorOf＞：匹配所有远程仓库。
- ＜mirrorOf＞external：*＜/mirrorOf＞：匹配所有远程仓库，使用localhost的除外，使用file://协议的除外。也就是说，匹配所有不在本机上的远程仓库。
- ＜mirrorOf＞repo1，repo2＜/mirrorOf＞：匹配仓库repo1和repo2，使用逗号分隔多个远程仓库。
- ＜mirrorOf＞*，！repo1＜/mirrorOf＞：匹配所有远程仓库，repo1除外，使用感叹号将仓库从匹配中排除

## 依赖范围

- compile: 默认,对于编译，运行，测试三种classpath都有效
  例如：spring-core，在程序编译，运行，测试都有效果

- test: 编译测试代码和运行测试代码才需要
  例如: junit

- provided: 以提供依赖,对于编译,测试有效，运行无效
  例如: sevelet-api

- runtime: 运行时依赖,运行测试有效,编译无效
  例如: jdbc驱动程序
  `runtime`不会造成依赖继承,
  > Setting dependency to runtime ensure that there isn't an accidental dependency on the code, and also keeps the dependency from being transitive. So that, for example, if module A has a runtime dependency on library X, and module B depends on module A, it does not inherit the dependency on library X. Using "provided" or "compile" would cause B to depend on X.

- system: 与`provided`一致,但需使用`systemPath`指定引用包路径

- import: 导入依赖范围

### 传递性依赖和依赖范围

假设A依赖于B,B依赖于C，我们说A对于B是第一直接依赖，B对于C是第二直接依赖，A对于C是传递性依赖

- 当第二直接依赖的范围是compile的时候，传递性依赖的范围与第一直接依赖的范围一致；
- 当第二直接依赖的范围是test的时候，依赖不会得以传递；
- 当第二直接依赖的范围是provided的时候，只传递第一直接依赖范围也为provided的依赖，且传递性依赖的范围同样为provided；
- 当第二直接依赖的范围是runtime的时候，传递性依赖的范围与第一直接依赖的范围一致，但compile例外，此时传递性依赖的范围为runtime

### 依赖调解

当一个项目同时经过不同的路径依赖于同一个组件时，会选择其深度最短的对应组件进行依赖。当深度一样的时候Maven会根据申明的依赖顺序来进行选择，先申明的会被作为依赖包

### 可选依赖

<optional>可选依赖不会被传递,例如框架引用的数据库驱动,如果使用了可选依赖,不会被传递到使用该框架的项目上

### 参考

1.《Maven实战》