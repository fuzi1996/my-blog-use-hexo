---
title: Connection学习
tags:
  - jdbc
  - Connection
date: 2021-12-04 10:21:51
categories: jdbc
---

## 说明

一个Connection对象表示通过JDBC驱动与数据源建立的连接，这里的数据源可以是关系型数据库管理系统（DBMS）、文件系统(所以也可以通过Connection访问文件)或者其他通过JDBC驱动访问的数据

- 如何获取Connection对象:
  - DriverManager
  - DataSource
- Connection必须显示关闭
  Connection关闭后,由该Connection对象创建的所有Statement对象都会被关闭
- 通过isClose关闭Connection
- 为了更好的兼容性,通过isValid关闭Connection



## JDBC驱动类型

- JDBC-ODBC Bridge Driver
  利用现成的ODBC架构将JDBC调用转换为ODBC调用,并非所有功能都能直接转换并正常调用，而多层调用转换对性能也有一定的影响
- Native API Driver
  直接调用数据库提供的原生链接库或客户端,没有中间过程，访问速度通常表现良好,驱动程序与数据库和平台绑定无法达到JDBC跨平台的基本目的
- JDBC-Net Driver
  将JDBC调用转换为独立于数据库的协议，然后通过特定的中间组件或服务器转换为数据库通信协议，主要目的是获得更好的架构灵活性，通过中间服务器转换会对性能有一定影响
- Native Protocol Driver
  驱动程序把JDBC调用转换为数据库特定的网络通信协议

## java.sql.Driver接口

所有的JDBC驱动都必须实现Driver接口，而且实现类必须包含一个静态初始化代码块(调用DriverManager的registerDriver方法)注册驱动
在使用Class.forName方法加载驱动时,驱动需要提供一个无参构造方法

注册方式:
- 驱动实现类静态代码块主动注册
- 在DriverManager类初始化时，会试图加载所有jdbc.drivers属性指定的驱动类，因此可以通过指定jdbc.drivers属性来注册驱动
  ```bash
  java -Djdbc.drivers=xxx ExampleApplication
  ```
- Java的SPI机制加载驱动
  必须存在一个META-INF/services/java.sql.Driver文件，在java.sql.Driver文件中必须指定Driver接口的实现类

## Java SPI机制简介

当服务的提供者提供了一种接口的实现之后，需要在classpath下的META-INF/services目录中创建一个以服务接口命名的文件，这个文件中的内容就是这个接口具体的实现类。当其他的程序需要这个服务的时候，就可以查找这个JAR包中META-INF/services目录的配置文件，配置文件中有接口的具体实现类名，可以根据这个类名加载服务实现类，然后就可以使用该服务了

```java
  ServiceLoader<Driver> drivers = ServiceLoader.load(java.sql.Driver.class);
  for (Driver driver : drivers ) {
      System.out.println(driver.getClass().getName());
  }
```

### java.sql.DriverAction接口

JDBC驱动可以通过实现DriverAction接口来监听DriverManager类的deregisterDriver()方法的调用

### java.sql.DriverManager类

DriverManager类通过Driver接口为JDBC客户端管理一组可用的驱动实现

### javax.sql.DataSource接口

- 通过连接池提高系统性能和伸缩性
- 通过XADataSource接口支持分布式事务

DataSource接口的实现必须包含一个无参构造方法

### JNDI

为应用程序提供了一种通过网络访问远程服务的方式,例如数据库配置放在tomcat的配置中，通过JNDI获取数据库连接


## 参考

1. MyBatis 3源码深度解析／江荣波