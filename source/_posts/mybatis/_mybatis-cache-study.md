---
title: mybatis缓存学习
tags:
  - mybatis缓存
date: 2021-11-03 23:45:04
categories: mybatis
---

## MyBatis缓存

[![mybatis缓存](/assets/images/mybatis/mybatis-study/mybatis缓存.png)](/assets/drawio/mybatis/mybatis-study/mybatis缓存.drawio)

### 一级缓存

#### 缓存命中条件

- 运行时参数相关
1. sql与参数必须一致
2. MapperStatementId必须一致
3. SqlSession必须一致
4. 分页设置必须一致

为什么会存在1，2，4条,是因为一级缓存(`PerpetualCache`)在`BaseExecutor`中是以`CacheKey`作为`key`键的,这里的`CacheKey`它的创建在`org.apache.ibatis.executor.BaseExecutor#createCacheKey`

- 操作配置相关

1. 未手动清空缓存(提交,回滚)
2. 未调用同mapper下的update方法
3. 未下调缓存作用域级别(保持SqlSession级别)
4. 未配置(flushCache=true)

#### 缓存失效

1. Spring集成时,未开启事务,导致每次执行SQL都需要创建新的`SqlSession`,导致一级缓存(`BaseExecutor`)无法缓存数据

### 二级缓存

## MyBatis执行过程总结

## 问题

1. 文件结构如图

![mybatis-demo文件结构](/assets/images/mybatis/demo-folder-struct.png)

其中mybatis 配置文件`mybatis-config.xml`中mapper配置如下:

```xml
<mappers>
    <mapper resource="org/example/student/mapper/studentMapper.xml"/>
</mappers>
```

但是报错:

```java
java.lang.ExceptionInInitializerError
 at org.example.sqlsession.factory.SqlSessionFactoryTest.testBuildSqlSessionFactory(SqlSessionFactoryTest.java:12)
 at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
 at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
 at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
 at java.lang.reflect.Method.invoke(Method.java:498)
 at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:47)
 at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
 at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:44)
 at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
 at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:271)
 at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:70)
 at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:50)
 at org.junit.runners.ParentRunner$3.run(ParentRunner.java:238)
 at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:63)
 at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:236)
 at org.junit.runners.ParentRunner.access$000(ParentRunner.java:53)
 at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:229)
 at org.junit.runners.ParentRunner.run(ParentRunner.java:309)
 at org.junit.runner.JUnitCore.run(JUnitCore.java:160)
 at com.intellij.junit4.JUnit4IdeaTestRunner.startRunnerWithArgs(JUnit4IdeaTestRunner.java:69)
 at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:33)
 at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:221)
 at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:54)
Caused by: org.apache.ibatis.exceptions.PersistenceException: 
### Error building SqlSession.
### The error may exist in org/example/student/mapper/studentMapper.xml
### Cause: org.apache.ibatis.builder.BuilderException: Error parsing SQL Mapper Configuration. Cause: java.io.IOException: Could not find resource org/example/student/mapper/studentMapper.xml
 at org.apache.ibatis.exceptions.ExceptionFactory.wrapException(ExceptionFactory.java:30)
 at org.apache.ibatis.session.SqlSessionFactoryBuilder.build(SqlSessionFactoryBuilder.java:80)
 at org.apache.ibatis.session.SqlSessionFactoryBuilder.build(SqlSessionFactoryBuilder.java:64)
 at org.example.student.util.SqlSessionUtil.<clinit>(SqlSessionUtil.java:22)
```

解决:
观察编译后的`target/classes/org/example/student/mapper`目录下没有xml文件,所以需要告诉maven打包时附带资源文件，在`pom.xml`中添加

```xml
<build>
  <resources>
    <resource>
      <directory>src/main/resources</directory>
      <includes>
        <include>**/*.properties</include>
        <include>**/*.xml</include>
      </includes>
    </resource>
    <resource>
      <directory>src/main/java</directory>
      <includes>
        <include>**/*.xml</include>
      </includes>
    </resource>
  </resources>
</build>
```

## 参考

1.[MyBatis源码解析大合集](https://www.bilibili.com/video/BV1Tp4y1X7FM)
2.[JDBC学习](/2021/10/01/jdbc/jdbc-study)
