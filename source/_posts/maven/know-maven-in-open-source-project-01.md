---
title: 从开源项目看Maven配置(01) -- dbapi
tags:
  - Maven
date: 2022-03-26 11:36:50
categories: Maven
---

## 背景

本文将介绍开源项目[DBApi](https://gitee.com/freakchicken/db-api)的Maven配置,通过学习它的配置进而学习Maven知识

## 项目介绍

**这里并没有使用原仓库进行分析,而是使用了其他人fork的分支,该分支修复了一些jar包冲突[https://gitee.com/kensan/db-api/tree/feature%2Ffix_version_conflicts](https://gitee.com/kensan/db-api/tree/feature%2Ffix_version_conflicts)**

### 简介

DBApi提供零代码开发api服务，只需编写sql，就可以生成http api服务。支持api动态创建，多数据源连接，动态添加数据源，兼容多种数据库。 适用于BI报表、数据可视化大屏的后端接口快速开发

### pom结构

- dbapi
 - dbapi-ui
 - dbapi-common
 - dbapi-plugin
 - dbapi-service
 - dbapi-controller
 - dbapi-standalone
 - dbapi-cluster-apiServer
 - dbapi-cluster-manager
 - dbapi-cluster-gateway
 - dbapi-assembly

## 各模块pom配置

### dbapi根pom

#### properties

1. 根pom中使用`properties`声明了一些jar包的版本,搭配`dependencyManagement`便可以控制其子模块中引用的jar包版本

2. `properties`中版本的定义使用的是`groupId`+`artifactId`,这样就可以避免属性被覆盖的问题,详情可以查看[Maven properties覆盖](https://blog.csdn.net/vtopqx/article/details/79034835)

#### profiles

1. 使用`profiles`定义了两种模式,每种模式引入的子模块`module`不同,这样仅需切换`profile`就能满足不同场景下打包的需求

2. 参考文章:[Maven - Profile](https://www.jianshu.com/p/6e0ed7b341e6)

#### dependencyManagement

1. 多模块管理时控制jar包版本,解决jar包冲突

2. 配合`properties`可以方便的调整jar包版本

3. 参考文章[Maven中dependencyManagement作用说明](https://blog.csdn.net/vtopqx/article/details/79034835)

#### build

##### plugins

使用的插件maven-compiler-plugin,maven-clean-plugin,versions-maven-plugin,maven-source-plugin,maven-gpg-plugin详见[maven插件介绍](/2022/03/26/maven/maven-plugins-introduction)中对应插件的介绍

#### developers

开发者信息

```xml
  <!-- https://maven.apache.org/pom.html#Developers -->
  <developers>
    <developer>
      <name>freakchicken</name>
      <email>jiangqiang110@126.com</email>
      <url>https://gitee.com/freakchicken/db-api</url>
    </developer>
  </developers>
```

#### scm

软件管理方面

```xml
  <!-- https://maven.apache.org/pom.html#Developers -->
  <scm>
    <url>https://gitee.com/freakchicken/db-api.git</url>
    <connection>scm:git:https://gitee.com/freakchicken/db-api.git</connection>
    <developerConnection>scm:git:https://gitee.com/freakchicken/db-api.git</developerConnection>
  </scm>
```

#### licenses

版权信息

```xml
  <!-- https://maven.apache.org/pom.html#Licenses -->
  <licenses>
    <license>
      <name>The Apache Software License, Version 2.0</name>
      <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
      <distribution>repo</distribution>
    </license>
  </licenses>
```

#### distributionManagement

分发

```xml
  <distributionManagement>
      <snapshotRepository>
          <id>ossrh</id>
          <url>https://s01.oss.sonatype.org/content/repositories/snapshots</url>
      </snapshotRepository>
      <repository>
          <id>ossrh</id>
          <url>https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/</url>
      </repository>
  </distributionManagement>
```

**以下将着重介绍各子模块对maven插件的使用**

### dbapi-assembly

这里有必要介绍下dbapi打包后的产物的目录结构,运行`mvn package`后,会在项目根目录生成一个`dist`文件夹。`dist`文件夹中会包含一个`tar.gz`文件，解压该文件可得到一个以下结构的文件夹

![dist文件结构](/assets/images/maven/dbapi-target-file.png)

其中
`/bin/`中为shell脚本,对应`dbapi-assembly`下的`bin`目录
`/conf/`中为配置文件
`/docs/`中为文档,对应`dbapi-assembly`下的`docs`目录
`/lib/`中为使用的jar包
`/sql/`中为初始脚本,对应`dbapi-assembly`下的`sql`目录

这里重点介绍`maven-assembly-plugin`插件([maven插件介绍](/2022/03/26/maven/maven-plugins-introduction#maven-assembly-plugin))中`binary.xml`文件

#### UsingComponentDescriptors

```xml
<assembly xmlns="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.0 http://maven.apache.org/xsd/assembly-1.1.0.xsd">
    <!-- 指定 id 的话，目标文件则是 {artifactId}-{id}.{format} -->
    <id>bin</id>
    <formats>
        <format>tar.gz</format>
    </formats>
    <includeBaseDirectory>true</includeBaseDirectory>
    <baseDirectory>DBApi-${project.version}</baseDirectory>
    <!-- 用来定制工程依赖 jar 包的打包方式 -->
    <dependencySets>
        <dependencySet>
            <useProjectArtifact>true</useProjectArtifact>
            <outputDirectory>lib</outputDirectory>
            <excludes>
                <!--  排除assembly自身打的jar包-->
                <exclude>com.gitee.freakchicken.dbapi:dbapi-assembly</exclude>
            </excludes>
            <!--            <unpack>false</unpack>-->
        </dependencySet>
    </dependencySets>
    <fileSets>
        <fileSet>
            <!-- 把`dbapi-assembly`模块下`bin`目录的所有以`.sh`结尾的文件输出到压缩包的`bin`目录下 -->
            <directory>${project.basedir}/bin</directory>
            <outputDirectory>bin</outputDirectory>
            <lineEnding>unix</lineEnding>
            <!-- 指定文件属性，使用八进制表达，分别为(User)(Group)(Other)所属属性，默认为 0644 -->
            <fileMode>744</fileMode>
            <includes>
                <include>*.sh</include>
            </includes>
        </fileSet>
        <fileSet>
            <!-- 把`dbapi-assembly`模块下`bin`目录的`install_config.conf`文件输出到压缩包的`conf`目录下 -->
            <directory>${project.basedir}/bin</directory>
            <outputDirectory>conf</outputDirectory>
            <lineEnding>unix</lineEnding>
            <fileMode>744</fileMode>
            <includes>
                <include>install_config.conf</include>
            </includes>
        </fileSet>
        <fileSet>
            <!-- 把`dbapi-assembly`模块下`bin`目录的所有以`.bat`结尾的文件输出到压缩包的`bin`目录下 -->
            <directory>${project.basedir}/bin</directory>
            <outputDirectory>bin</outputDirectory>
            <!--            <lineEnding>windows</lineEnding>-->
            <includes>
                <include>*.bat</include>
            </includes>
        </fileSet>
        <fileSet>
            <!-- 把`dbapi-assembly`模块下`docs`目录的所有以`.md`结尾的文件输出到压缩包的`docs`目录下 -->
            <directory>${project.basedir}/docs</directory>
            <outputDirectory>docs</outputDirectory>
            <includes>
                <include>*.md</include>
            </includes>
        </fileSet>
        <fileSet>
            <!-- 把dbapi根目录下的所有以`.md`结尾的文件输出到压缩包的`docs`目录下 -->
            <directory>${project.basedir}/../</directory>
            <outputDirectory>docs</outputDirectory>
            <includes>
                <include>*.md</include>
            </includes>
        </fileSet>
        <fileSet>
            <!-- 把`dbapi-assembly`模块下`sql`目录的所有以`.sql`结尾的文件输出到压缩包的`sql`目录下 -->
            <directory>${project.basedir}/sql</directory>
            <outputDirectory>sql</outputDirectory>
            <lineEnding>unix</lineEnding>
            <fileMode>644</fileMode>
            <includes>
                <include>*.sql</include>
            </includes>
        </fileSet>
        <!-- 以下就是把各个模块下的resources下的配置文件输出到压缩包conf目录下-->
        <fileSet>
            <directory>${project.parent.basedir}/dbapi-standalone/src/main/resources</directory>
            <outputDirectory>conf</outputDirectory>
            <!--            不要设置文件编码格式之类的，否则sqlite数据库文件会损坏-->
            <!--            <lineEnding>unix</lineEnding>-->
            <!--            <fileMode>644</fileMode>-->
            <includes>
                <include>*.properties</include>
                <include>*.xml</include>
                <include>*.db</include>
                <include>*.yml</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.parent.basedir}/dbapi-service/src/main/resources</directory>
            <outputDirectory>conf</outputDirectory>
            <includes>
                <include>*.properties</include>
                <include>*.xml</include>
                <include>*.db</include>
                <include>*.yml</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.parent.basedir}/dbapi-cluster-gateway/src/main/resources</directory>
            <outputDirectory>conf</outputDirectory>
            <includes>
                <include>*.properties</include>
                <include>*.xml</include>
                <include>*.db</include>
                <include>*.yml</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.parent.basedir}/dbapi-cluster-manager/src/main/resources</directory>
            <outputDirectory>conf</outputDirectory>
            <includes>
                <include>*.properties</include>
                <include>*.xml</include>
                <include>*.db</include>
                <include>*.yml</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.parent.basedir}/dbapi-cluster-apiServer/src/main/resources</directory>
            <outputDirectory>conf</outputDirectory>
            <includes>
                <include>*.properties</include>
                <include>*.xml</include>
                <include>*.db</include>
                <include>*.yml</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.parent.basedir}/dbapi-common/src/main/resources</directory>
            <outputDirectory>conf</outputDirectory>
            <includes>
                <include>*.properties</include>
                <include>*.xml</include>
                <include>*.db</include>
                <include>*.yml</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.parent.basedir}/dbapi-plugin/src/main/resources</directory>
            <outputDirectory>conf</outputDirectory>
            <includes>
                <include>*.properties</include>
                <include>*.xml</include>
                <include>*.db</include>
                <include>*.yml</include>
            </includes>
        </fileSet>


    </fileSets>
</assembly>
```

#### 参考

1. 参考[Using Component Descriptors](https://maven.apache.org/plugins/maven-assembly-plugin/examples/single/using-components.html)

2. 参考[maven-assembly-plugin 入门指南](https://www.jianshu.com/p/14bcb17b99e0)

3. [使用Maven的assembly插件实现自定义打包](https://blog.51cto.com/u_15047484/2560349)

### dbapi-controller

观察dbapi打包后产物,解压后没有在lib中发现前端产物因此就可以推测前端产物一定是放在某个jar包的静态资源路径下,果然在dbapi-controller jar包中的static路径下发现了静态产物

这里主要介绍一下`dbapi-controller`模块下几个插件的使用

#### maven-clean-plugin

介绍[maven-clean-plugin插件介绍](/2022/03/26/maven/maven-plugins-introduction#maven-clean-plugin)

示例:

```xml
    <!--  mvn clean 命令执行的时候删除static文件夹-->
    <plugin>
        <artifactId>maven-clean-plugin</artifactId>
        <version>3.1.0</version>
        <configuration>
            <failOnError>true</failOnError>
            <filesets>
                <fileset>
                    <directory>${basedir}/src/main/resources/static/</directory>
                    <includes>
                        <include>**/*</include>
                    </includes>
                </fileset>
            </filesets>
        </configuration>
    </plugin>
```

#### maven-jar-plugin

介绍[maven-jar-plugin插件介绍](/2022/03/26/maven/maven-plugins-introduction#maven-jar-plugin)

示例:

```xml
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <configuration>
        <excludes><!--不把配置文件打的jar包里面-->
            <exclude>**/*.xml</exclude>
            <exclude>**/*.properties</exclude>
            <exclude>**/*.db</exclude>
        </excludes>
    </configuration>
    <executions>
        <execution>
            <id>default-jar</id>
            <phase>package</phase>
            <goals>
                <goal>jar</goal>
            </goals>
        </execution>
    </executions>
  </plugin>
```

#### maven-antrun-plugin

介绍[maven-antrun-plugin插件介绍](/2022/03/26/maven/maven-plugins-introduction#maven-antrun-plugin)

示例:

```xml
  <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-antrun-plugin</artifactId>
      <version>3.0.0</version>
      <executions>
          <execution>
              <id>move-dist-to-static</id>
              <phase>validate</phase>
              <goals>
                  <goal>run</goal>
              </goals>
              <configuration>
                  <!-- 删除static文件夹内容-->
                  <target>
                      <delete>
                          <fileset dir="${basedir}/src/main/resources/static/"
                                    includes="**/*.*"/>
                      </delete>
                  </target>
                  <!--   复制dist文件夹到static文件夹-->
                  <target>
                      <copy todir="${basedir}/src/main/resources/static">
                          <fileset dir="${basedir}/../dbapi-ui/dist">
                              <include name="**/*.*"/>
                          </fileset>
                      </copy>
                  </target>
              </configuration>
          </execution>
      </executions>
  </plugin>
```


### dbapi-ui

`dbapi-ui`模块下仅关注`exec-maven-plugin`这个插件,对于`maven-antrun-plugin`的使用与`dbapi-controller`模块中一致这里不再赘述

#### exec-maven-plugin

介绍[exec-maven-plugin插件介绍](/2022/03/26/maven/maven-plugins-introduction#exec-maven-plugin)

示例:

```xml
    <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>exec-maven-plugin</artifactId>
        <version>3.0.0</version>
        <executions>
            <execution>
                <id>exec-npm-install</id>
                <phase>validate</phase>
                <goals>
                    <goal>exec</goal>
                </goals>
                <configuration>
                    <executable>npm</executable>
                    <arguments>
                        <argument>install</argument>
                    </arguments>
                    <workingDirectory>${basedir}</workingDirectory>
                </configuration>
            </execution>
            <execution>
                <id>exec-npm-run-build</id>
                <phase>validate</phase>
                <goals>
                    <goal>exec</goal>
                </goals>
                <configuration>
                    <executable>npm</executable>
                    <arguments>
                        <argument>run</argument>
                        <argument>build</argument>
                    </arguments>
                    <workingDirectory>${basedir}</workingDirectory>
                </configuration>
            </execution>
        </executions>
    </plugin>
```

**其他模块的使用大同小异,不再赘述**

## 引用

1. DBApi项目地址:[https://gitee.com/freakchicken/db-api](https://gitee.com/freakchicken/db-api)