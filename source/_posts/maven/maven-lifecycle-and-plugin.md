---
title: Maven生命周期与插件
tags:
  - null
date: 2021-12-11 11:58:45
categories:
---

## maven生命周期

Maven拥有三套相互独立的生命周期，它们分别为clean、default和site。clean生命周期的目的是清理项目，default生命周期的目的是构建项目，而site生命周期的目的是建立项目站点
每个生命周期下面有不同的阶段

### clean生命周期
  clean生命周期的目的是清理项目，它包含三个阶段：
- pre-clean执行一些清理前需要完成的工作。
- clean清理上一次构建生成的文件。
- post-clean执行一些清理后需要完成的工作。

### default生命周期

- validate
- initialize
- generate-sources
- process-sources处理项目主资源文件。一般来说，是对src/main/resources目录的内容进行变量替换等工作后，复制到项目输出的主classpath目录中。
- generate-resources
- process-resources
- **compile**编译项目的主源码。一般来说，是编译src/main/java目录下的Java文件至项目输出的主classpath目录中。
- process-classes
- generate-test-sources
- process-test-sources处理项目测试资源文件。一般来说，是对src/test/resources目录的内容进行变量替换等工作后，复制到项目输出的测试classpath目录中。
- generate-test-resources
- process-test-resources
- test-compile编译项目的测试代码。一般来说，是编译src/test/java目录下的Java文件至项目输出的测试classpath目录中。
- process-test-classes
- **test**使用单元测试框架运行测试，测试代码不会被打包或部署。
- prepare-package
- **package**接受编译好的代码，打包成可发布的格式，如JAR。
- pre-integration-test
- integration-test
- post-integration-test
- verify
- **install**将包安装到Maven本地仓库，供本地其他Maven项目使用。
- **deploy**将最终的包复制到远程仓库，供其他开发人员和Maven项目使用。

### site生命周期
site生命周期的目的是建立和发布项目站点，Maven能够基于POM所包含的信息，自动生成一个友好的站点，方便团队交流和发布项目信息。该生命周期包含如下阶段：

- pre-site执行一些在生成项目站点之前需要完成的工作。
- site生成项目站点文档。
- post-site执行一些在生成项目站点之后需要完成的工作。
- site-deploy将生成的项目站点发布到服务器上。

## 插件与指令绑定

### 插件远程仓库

插件的远程仓库使用pluginRepositories和pluginRepository配置,
在POM中配置插件的时候，如果该插件是Maven的官方插件（即如果其groupId为org.apache.maven.plugins），就可以省略groupId配置

### maven插件版本
Maven在超级POM中为所有核心插件设定了版本，超级POM是所有Maven项目的父POM，所有项目都继承这个超级POM的配置，因此，即使用户不加任何配置，Maven使用核心插件的时候，它们的版本就已经确定了

### 解析插件前缀

通过配置settings.xml让Maven检查其他groupId上的插件仓库元数据

```xml
＜settings＞
  ＜pluginGroups＞
    ＜pluginGroup＞com.your.plugins＜/pluginGroup＞
  ＜/pluginGroups＞
＜/settings＞
```

### 指令绑定
用户通过命令行调用生命周期阶段的时候，对应的插件目标就会执行相应的任务

### 自定义绑定

用户还能够自己选择将某个插件目标绑定到生命周期的某个阶段上
有很多插件的目标在编写时已经定义了默认绑定阶段
当多个插件目标绑定到同一个阶段的时候，这些插件声明的先后顺序决定了目标的执行顺序

```xml
＜build＞
  ＜plugins＞
    ＜plugin＞
      ＜groupId＞org.apache.maven.plugins＜/groupId＞
      ＜artifactId＞maven-source-plugin＜/artifactId＞
      ＜version＞2.1.1＜/version＞
      ＜executions＞
        <!-- 每个execution子元素可以用来配置执行一个任务 -->
        ＜execution＞
          ＜id＞attach-sources＜/id＞
          <!-- phrase配置，将其绑定到verify生命周期阶段 -->
          ＜phase＞verify＜/phase＞
          ＜goals＞
            <!-- 通过goals配置指定要执行的插件目标 -->
            ＜goal＞jar-no-fork＜/goal＞
          ＜/goals＞
        ＜/execution＞
      ＜/executions＞
    ＜/plugin＞
  ＜/plugins＞
＜/build＞
```

```bash
# 使用maven-help-plugin查看插件详细信息，了解插件目标的默认绑定阶段
mvn help:describe -Dplugin=org.apache.maven.plugins:maven-source-plugin
# 其他命令
mvn help:describe -Dcmd=install
mvn help:describe -Dcmd=help:describe
mvn help:describe -Dplugin=org.apache.maven.plugins:maven-help-plugin
mvn help:describe -DgroupId=org.apache.maven.plugins -DartifactId=maven-help-plugin
```
### 参考

1.《Maven实战》