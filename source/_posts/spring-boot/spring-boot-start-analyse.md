---
title: Spring Boot启动分析
tags:
  - spring-boot
  - 启动流程分析
date: 2022-04-21 20:24:34
categories: spring-boot
---

**基于SpringBoot 2.3.9.RELEASE 版本**

## 代码示例

使用`SpringApplication.run`方法启动一个SpringBoot程序

```java
@SpringBootApplication
public class SampleTestApplication {
	public static void main(String[] args) {
		SpringApplication.run(SampleTestApplication.class, args);
	}
}
```

## 启动流程

### 前期

`org.springframework.boot.SpringApplication#run(java.lang.Class<?>, java.lang.String...)`

```java
public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
  return run(new Class<?>[] { primarySource }, args);
}
```

会把传入的`SampleTestApplication.class`包装成`Class<?>`数组,最终调用的是
`org.springframework.boot.SpringApplication#run(java.lang.Class<?>[], java.lang.String[])`

```java
public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {
  return new SpringApplication(primarySources).run(args);
}
```

所以SpringBoot启动时主类可以有多个

### 流程

#### 1. 通过`new SpringApplication(primarySources)`生成一个SpringApplication对象
  
  ##### 1.确定web应用类型 NONE,SERVLET,REACTIVE

  ```java
  // 通过判断相关类是否存在确定应用类型
  this.webApplicationType = WebApplicationType.deduceFromClasspath();
  ```
  
  ##### 2.从`META-INF/spring.factories`初始化初始化器(获取ApplicationContextInitializer对象)

  ```java
  setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
  ```

  ##### 3.从`META-INF/spring.factories`初始化监听器(获取ApplicationListener对象)
    事件那一套使用的
  
  ```java
  setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
  ```

  ##### 4. 找到主类(Main方法所在类)

  ```java
  // 这个方法比较有意思,是通过主动抛出异常的方式找到主类
  this.mainApplicationClass = deduceMainApplicationClass();
  ```

#### 2. SpringApplication的对象.run()方法执行

  ```java
  new SpringApplication(primarySources).run(args)
  ```

  ##### 1.从spring.factories中获取SpringApplicationRunListeners对象,默认会获取一个EventPublishingRunlistener,它会触发启动过程中各个阶段的事件

  ```java
  // listeners中默认会找到一个EventPublishingRunlistener
  SpringApplicationRunListeners listeners = getRunListeners(args);
  ```

  ##### 2.SpringApplicationRunListener.starting()

  ```java
  listeners.starting();
  ```

  ##### 3.创建一个Spring容器(也叫上下文,ConfigurableApplicationContext)

  ```java
  // 根据应用类型创建容器
  context = createApplicationContext();
  ```
  

  ##### 4.上下文准备(prepareContext)

  ```java
  // 方法内:
  // 5. 调用ApplicationContextInitializer的initialize方法
  // 6. 调用SpringApplicationRunListener的contextPrepared方法
  // 7. 把run方法传进来的类注入到容器中
  // 8. 调用SpringApplicationRunListener的contextLoaded方法
  prepareContext(context, environment, listeners, applicationArguments, printedBanner);
  ```

  ##### 9.刷新上下文(refreshContext)
  
  ```java
  // 会解析配置类,扫描,启动WebServer(Tomcat/Jetty/Undertow)(AutoConfigurationImportSelector,DeferredImportSelector)'
  refreshContext(context)
  ```


  ##### 9.调用ApplicationRunner和CommandLineRunner(callRunner)

  ```java
  callRunners(context, applicationArguments)
  ```

  1##### 0.SpringApplicationRunListener.running()

  ```java
  listeners.running(context)
  ```