---
title: 解决DBApi gateway 中文乱码问题
tags:
  - dbapi
  - bug修复
date: 2022-04-16 11:35:19
categories: bug修复
---

## 问题链接

[gateway中文乱码](https://gitee.com/freakchicken/db-api/issues/I51LOI)

![dbapi的gateway中文乱码问题](/assets/images/dbapi/dbapi的gateway中文乱码问题.png)

## 排查思路

### 初步分析

dbapi支持两种部署模式,一种是单机版(`standalone`模式),一种是集群版(`gateway`调`apiserver`版本).两种模式同一请求返回结果不一致，
那么一定是两种模式下存在某些差异导致中文乱码

### 环境搭建

![dbapi调用服务拓扑图](/assets/images/dbapi/dbapi调用服务拓扑图.drawio.png)

需要启动`dbapi-standalone`,`dbapi-cluster-gateway`,`dbapi-cluster-apiServer`
其中`dbapi-cluster-gateway`,`dbapi-cluster-apiServer`需要通过nacos暴露服务

### 复现

在复现的时候，我发现的确如果返回值中存在中文,单机版返回正常,访问`gateway`返回的中文乱码。
因为`gateway`最终也是调用的`apiserver`,所以我们直接调用`apiserver`，发现**apiserver返回的中文乱码**
至此我们怀疑是`apiserver`造成中文乱码问题
同时注意到单机版返回的`response`的`content-type`正常,`apiserver`返回的`response`没有`content-type`

单机版返回response示例:
![单机返回response](/assets/images/dbapi/单机返回response.png)

`apiserver`返回response示例:
![apiserver返回response](/assets/images/dbapi/apiserver返回response.png)

因此我们怀疑是**apiserver没有为response设置content-type造成中文乱码**

### 代码分析

**使用代码版本: dev分支:409a6cf2c0ec222946754d195846bb7023ca0c3b**

使用关键字`.setContentType(`搜索,代码中为返回值设置response的地方共有6处,其中我们需要关心以下两个地方:

- com.gitee.freakchicken.dbapi.basic.conf.JwtAuthenticationInterceptor
- com.gitee.freakchicken.dbapi.basic.filter.ApiIPFilter

通过`com.gitee.freakchicken.dbapi.basic.conf.MyConfig#addInterceptors`发现`JwtAuthenticationInterceptor`主要校验前端UI,因此请求进来的时候起作用只能是`ApiIPFilter`
要么是请求打到`apiserver`,请求调用的时候没有经历这个`ApiIPFilter`,要么就是请求通过这个`ApiIPFilter`设置的response content-type没有效果

通过测试,发现当直接请求`apiserver`时并没有通过`ApiIPFilter`,通过分析`apiserver`代码,在`com.gitee.freakchicken.dbapi.apiserver.DBApiApiServer`的`ComponentScan`中排除了`com.gitee.freakchicken.dbapi.basic.filter.ApiIPFilter`

同时我们发现`gateway`存在`com.gitee.freakchicken.dbapi.gateway.filter.GatewayIPFilter`,应该是作者认为`gateway`存在了ip过滤,apiserver就不应该再过滤一遍ip,但是却忽略了response设置编码这一环

### 修复

添加一个统一的请求头过滤器`com.gitee.freakchicken.dbapi.basic.filter.ApiHeaderFilter`只针对`dbapi.api.context`配置的地址,同时调整注册filter与sevlet的代码结构

分别为:
- com.gitee.freakchicken.dbapi.conf.FilterConfig
  将`ipFilter` order设置为1,`authFilter` order设置为2,`apiHeaderFilter` order设置为3(这里有坑,下面有解释)
- com.gitee.freakchicken.dbapi.conf.ServletConfig
- com.gitee.freakchicken.dbapi.apiserver.conf.FilterConfig
  将`authFilter` order设置为2,`apiHeaderFilter` order设置为3(这里有坑,下面有解释)
- com.gitee.freakchicken.dbapi.apiserver.conf.ServletConfig

### 调试

1. 发现单机模式下返回值正常,集群模式下返回值有`content-type`,但是`content-type`却不是我们设置的`utf-8`

集群模式下response
![第一次修复response](/assets/images/dbapi/第一次修复response.png)

2. 我将`com.gitee.freakchicken.dbapi.basic.filter.ApiHeaderFilter#doFilter`的代码改为
```java
String characterEncoding = response.getCharacterEncoding();
System.out.println("设置CharacterEncoding前: "+characterEncoding);
response.setCharacterEncoding("UTF-8");
characterEncoding = response.getCharacterEncoding();
System.out.println("设置CharacterEncoding后: "+characterEncoding);

String contentType = response.getContentType();
System.out.println("设置ContentType前: "+contentType);
response.setContentType("application/json; charset=utf-8");
contentType = response.getContentType();
System.out.println("设置ContentType后: "+contentType);
```
用以调试

发现`response.setContentType`与`response.setCharacterEncoding`不起作用

当请求单机版时发现输出为

```txt
设置CharacterEncoding前: utf-8
设置CharacterEncoding后: utf-8
设置ContentType前: application/json;charset=utf-8
设置ContentType后: application/json;charset=utf-8
```

当请求`apiserver`时发现输出为

```txt
设置CharacterEncoding前: ISO-8859-1
设置CharacterEncoding后: ISO-8859-1
设置ContentType前: null
设置ContentType后: application/json;charset=ISO-8859-1
```

下面就`response.setContentType`与`response.setCharacterEncoding`问题分为单机版与集群版两种模式下讨论
首先我们要注意，dbapi在两种模式下的`FilterChain`是不同的

1. 单机版FilterChain
![单机版FilterChain](/assets/images/dbapi/单机版FilterChain.png)

当请求单机版时,`apiIPFilter`在`apiHeaderFilter`之前,因此此时`apiHeaderFilter`设不设置无所谓

2. 集群版FilterChain
![集群版FilterChain](/assets/images/dbapi/集群版FilterChain.png)

当请求集群版时,`apiAuthFilter`在`apiHeaderFilter`之前,此时`apiHeaderFilter`再设置就不起作用了

通过断点调试,发现在`apiAuthFilter`的`response.getWriter()`时会`setCharacterEncoding`,而这个set的值就是`ISO-8859-1`,同时`org.apache.catalina.connector.Response`在设置完编码后会将`usingWriter`设为`true`导致下次设置就不会起作用

这告诉我们**不使用writer的时候不要提前获取response的writer,否则无法在后续filter中设置编码**,同时**设置response的编码最好放在第一个**

按照这个原则,我们再次修改代码,调试提交







