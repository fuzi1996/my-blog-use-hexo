---
title: jeecg 2.4.6 如何校验验证码
date: 2021-9-5 20:24:00
tags:
- 验证码校验
- jeecg
categories: jeecg
---
这里主要分析jeecg 2.4.6如何校验登录

## 流程

### 生成验证码

前端缓存发送生成验证码请求时时间戳currdatetime

### 后端缓存

后端将验证码小写后+时间戳 md5后作为key,小写验证码作为value存redis,缓存时长60秒

```java
//org.jeecg.modules.system.controller.LoginController#randomImage
//生成随机验证码
String code = RandomUtil.randomString(BASE_CHECK_CODES,4);
String lowerCaseCode = code.toLowerCase();
//验证码小写后+时间戳 md5后作为key
String realKey = MD5Util.MD5Encode(lowerCaseCode+key, "utf-8");
//缓存redis
redisUtil.set(realKey, lowerCaseCode, 60);
```

### 登录校验

登录地址:

http://localhost:8080/jeecg-boot/sys/login

请求参数:

```js
{
  "username":"admin",
  "password":"123456",
  // 输入的验证码
  "captcha":"UKwW",
  // 缓存时间戳
  "checkKey":1630844796721,
  "remember_me":true
}
```

输入的验证码+时间戳 md5后作为key,从redis里面获取验证码,验证码不为空且输入的验证码与redis里面获取的验证码一致，即为验证通过

```java
//org.jeecg.modules.system.controller.LoginController#login
//获取输入的验证码
String captcha = sysLoginModel.getCaptcha();
if(captcha==null){
    result.error500("验证码无效");
    return result;
}
String lowerCaseCaptcha = captcha.toLowerCase();
//输入的验证码+时间戳 md5后作为key
String realKey = MD5Util.MD5Encode(lowerCaseCaptcha+sysLoginModel.getCheckKey(), "utf-8");
//获取redis里面缓存的验证码
Object checkCode = redisUtil.get(realKey);
//当进入登录页时，有一定几率出现验证码错误 #1714
if(checkCode==null || !checkCode.toString().equals(lowerCaseCaptcha)) {
  result.error500("验证码错误");
  return result;
}
```