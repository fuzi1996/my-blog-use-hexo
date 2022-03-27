---
title: maven插件介绍
tags:
  - Maven
  - Maven Plugin
date: 2022-03-26 12:02:37
categories: Maven
---

## maven-compiler-plugin

```xml
  <!-- https://maven.apache.org/plugins/maven-compiler-plugin/ -->
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
```

### 功能

编译jar包

### 示例

```xml
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
      <source>1.8</source>
      <target>1.8</target>
      <encoding>utf-8</encoding>
    </configuration>
  </plugin>
```

## maven-clean-plugin

```xml
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-clean-plugin</artifactId>
```

### 功能

执行命令mvn clean时调用的就是这个插件

### 示例

```xml
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-clean-plugin</artifactId>
    <version>3.1.0</version>
    <configuration>
      <!-- 即使清理出错构建仍将继续 -->
      <failOnError>true</failOnError>
      <filesets>
        <fileset>
          <!-- 将被删除的文件路径,因为默认是target,所以这里需要配置 -->
          <directory>${basedir}/dist</directory>
          <includes>
            <include>**/*</include>
          </includes>
        </fileset>
      </filesets>
    </configuration>
  </plugin>
```

## versions-maven-plugin

```xml
  <!-- https://www.mojohaus.org/versions-maven-plugin/ -->
  <groupId>org.codehaus.mojo</groupId>
  <artifactId>versions-maven-plugin</artifactId>
```

### 功能

批量修改版本号

### 示例

```xml
  <plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>versions-maven-plugin</artifactId>
    <version>2.7</version>
    <configuration>
      <generateBackupPoms>false</generateBackupPoms>
    </configuration>
  </plugin>
```

## maven-source-plugin

```xml
  <!-- https://maven.apache.org/plugins/maven-source-plugin/ -->
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-source-plugin</artifactId>
```

### 功能

可以在配置的Maven生命周期中为当前工程创建源码jar包

### 示例

```xml
  <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-source-plugin</artifactId>
      <version>2.2.1</version>
      <executions>
          <execution>
              <!-- 该execution的目的是在mvn打包时生成一个含有源代码的jar包 -->
              <id>attach-sources</id>
              <!-- 默认绑定的生命周期阶段是package -->
              <goals>
                  <goal>jar-no-fork</goal>
              </goals>
          </execution>
      </executions>
  </plugin>
```

## maven-jar-plugin

```xml
  <!-- https://maven.apache.org/plugins/maven-jar-plugin/ -->
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-jar-plugin</artifactId>
```

### 功能

创建jar包

### 示例

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

### 参考

1. [Maven maven-jar-plugin](https://www.jianshu.com/p/d44f713b1ec9)

## maven-antrun-plugin

```xml
  <!-- https://maven.apache.org/plugins/maven-antrun-plugin/ -->
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-antrun-plugin</artifactId>
```

### 功能

运行ant命令,文件拷贝与删除

### 示例

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

### 参考

1. [Maven 插件之 maven-antrun-plugin](https://blog.csdn.net/yanliang1/article/details/52230713)

## exec-maven-plugin

```xml
  <!-- https://www.mojohaus.org/exec-maven-plugin/ -->
  <groupId>org.codehaus.mojo</groupId>
  <artifactId>exec-maven-plugin</artifactId>
```

### 功能

执行java或命令行命令

### 示例

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

### 参考

1. [Exec Maven Plugin全面解析和使用示例](https://blog.csdn.net/bluishglc/article/details/7622286)
2. [exec-maven-plugin配置及使用](https://www.cnblogs.com/lianshan/p/7358966.html)

## maven-gpg-plugin

```xml
  <!-- https://maven.apache.org/plugins/maven-gpg-plugin/ -->
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-gpg-plugin</artifactId>
```

### 功能

使用GnuPG对项目的所有附加构件进行签名(发布时使用)

### 示例

```xml
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-gpg-plugin</artifactId>
    <version>1.0</version>
    <executions>
      <execution>
        <id>sign-artifacts</id>
        <phase>verify</phase>
        <goals>
          <goal>sign</goal>
        </goals>
      </execution>
    </executions>
  </plugin>
```

## maven-assembly-plugin

```xml
  <!-- https://maven.apache.org/plugins/maven-assembly-plugin/ -->
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-assembly-plugin</artifactId>
```

### 功能

编译jar包

### 示例

```xml
  <plugin>
    <artifactId>maven-assembly-plugin</artifactId>
    <configuration>
      <descriptors>
        <!--对应着打包配置-->
        <descriptor>binary.xml</descriptor>
      </descriptors>
      <outputDirectory>${project.parent.basedir}/dist</outputDirectory>
    </configuration>
    <executions>
      <execution>
        <id>make-assembly</id>
        <phase>package</phase>
        <goals>
          <goal>single</goal>
        </goals>
      </execution>
    </executions>
  </plugin>
```

binary.xml配置详见[Using Component Descriptors](https://maven.apache.org/plugins/maven-assembly-plugin/examples/single/using-components.html)中介绍,
示例详见[]()

### 参考

1.[Maven教程（20）— 使用 maven-assembly-plugin插件来定制化打包](https://blog.csdn.net/liupeifeng3514/article/details/79777976)