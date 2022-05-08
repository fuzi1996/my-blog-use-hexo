---
title: Bean条件注入
tags:
  - spring-boot
  - Bean条件注入
date: 2022-05-06 20:58:21
categories: spring-boot
---

- IHandler
```java
public interface IHandler {
    String handle(String param);
}
```
  - AHandlerImpl
  ```java
  @Slf4j
  @Component
  public class AHandlerImpl implements IHandler {
      @Override
      public String handle(String param) {
          log.info("exec A");
          return "A";
      }
  }
  ```
  - BHandlerImpl
  ```java
  @Slf4j
  @Component
  public class BHandlerImpl implements IHandler {
      @Override
      public String handle(String param) {
          log.info("exec B");
          return "B";
      }
  }
  ```

controller使用到IHandler
```java
@Autowired
private IHandler handler;
```

1. Bean重复问题
此时会报错,因为Spring不知道controller需要的`IHandler`是`AHandlerImpl`与`BHandlerImpl`中哪一个
这时候只需要在`AHandlerImpl`与`BHandlerImpl`上随便选择一个加上`@Primary`注解即可解决报错问题

2. 在某种条件下实现Bean注入

- 有了`BHandlerImpl`就注入`BHandlerImpl`,否则就注入默认的`AHandlerImpl`
在`AHandlerImpl`上添加`@ConditionalOnMissingBean`注解,例如:
```java
@Component
@ConditionalOnMissingBean(IHandler.class) // 只要存在实现IHandler接口的Bean,AHandlerImpl就不会注入进去
public class AHandlerImpl implements IHandler {
}
```

