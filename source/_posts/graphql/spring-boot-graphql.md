---
title: Spring Boot Graphql
tags:
  - graphql
  - spring-boot-graphql
  - java-graphql
date: 2023-03-21 21:05:37
categories: graphql, spring-boot-graphql, java-graphql
---

## 环境信息

### 版本信息

```properties
java: 1.8
spring-boot: 2.7.1
spring-boot-starter-graphql: 2.7.1
```

### 配置信息

```properties
spring.graphql.graphiql.enabled=true
spring.graphql.graphiql.path=/graphiql
```

## 调用栈

- org.springframework.boot.autoconfigure.graphql.servlet.GraphQlWebMvcAutoConfiguration#graphQlRouterFunction

  详情请看[请求入口](#请求入口)

- org.springframework.graphql.data.method.InvocableHandlerMethodSupport#doInvoke

  方法执行

## 请求入口

```java
// spring-boot-auto-configure: 2.7.1

@Bean
@Order(0)
// `org.springframework.web.servlet.function.RouterFunction`是`Spring`自`5.2`版本开始支持的函数式接口,可以用来创建路由
public RouterFunction<ServerResponse> graphQlRouterFunction(GraphQlHttpHandler httpHandler,
    GraphQlSource graphQlSource, GraphQlProperties properties) {
  String path = properties.getPath();
  logger.info(LogMessage.format("GraphQL endpoint HTTP POST %s", path));
  RouterFunctions.Builder builder = RouterFunctions.route();
  // 不允许get请求
  // 不亏是spring boot,拒绝请求都写得那么标准
  builder = builder.GET(path, this::onlyAllowPost);
  // post请求处理
  builder = builder.POST(path, RequestPredicates.contentType(SUPPORTED_MEDIA_TYPES)
      .and(RequestPredicates.accept(SUPPORTED_MEDIA_TYPES)), httpHandler::handleRequest);
  // 如果启用graphiql(应该和websocket有关)就启用该get请求
  if (properties.getGraphiql().isEnabled()) {
    GraphiQlHandler graphiQLHandler = new GraphiQlHandler(path, properties.getWebsocket().getPath());
    builder = builder.GET(properties.getGraphiql().getPath(), graphiQLHandler::handleRequest);
  }
  // 输出schema
  if (properties.getSchema().getPrinter().isEnabled()) {
    SchemaHandler schemaHandler = new SchemaHandler(graphQlSource);
    builder = builder.GET(path + "/schema", schemaHandler::handleRequest);
  }
  return builder.build();
}
```

`org.springframework.boot.autoconfigure.graphql.servlet.GraphQlWebMvcAutoConfiguration#graphQlRouterFunction`有三个入参: 

- `GraphQlHttpHandler httpHandler`

  `graphql` `post`请求处理类,详情见[GraphQlHttpHandler](#GraphQlHttpHandler)

- `GraphQlSource graphQlSource`

  `graphql` 元数据,详情见[GraphQlSource](#GraphQlSource)

- `GraphQlProperties properties`

  `graphql` 配置数据

### GraphQlHttpHandler

- 通过`org.springframework.boot.autoconfigure.graphql.servlet.GraphQlWebMvcAutoConfiguration#graphQlHttpHandler`注入

  - 所需入参`WebGraphQlHandler`通过`org.springframework.boot.autoconfigure.graphql.servlet.GraphQlWebMvcAutoConfiguration#webGraphQlHandler`注入

    - 所需入参`ExecutionGraphQlService`通过`org.springframework.boot.autoconfigure.graphql.GraphQlAutoConfiguration#executionGraphQlService`注入

### GraphQlSource

- 对应的真实类型: `org.springframework.graphql.execution.AbstractGraphQlSourceBuilder.FixedGraphQlSource`

  `FixedGraphQlSource`中存在两个非常重要的类`graphql.GraphQL`与`graphql.schema.GraphQLSchema`

- `GraphQlSource`主要用于请求`/schema`时输出所有`schema`文本也就是`GraphQLSchema`的信息

- 通过`org.springframework.boot.autoconfigure.graphql.GraphQlAutoConfiguration#graphQlSource`注入