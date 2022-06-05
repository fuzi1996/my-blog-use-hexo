---
title: MyBatis SQL XML解析
tags:
  - mybatis
date: 2022-06-04 15:03:43
categories: mybatis
---

## 说明

本文仅关注MyBatis SQL XML解析(select/update/insert/delete),不关注MyBatis的其他功能,如果想了解MyBatis的其他功能,可以参考[MyBatis官网](https://www.mybatis.org/mybatis-3/zh/index.html)

## 解析过程

![MyBatis_Mapper_sql_Xml解析](/assets/images/mybatis/mybatis-study/MyBatis_Mapper_sql_Xml解析.drawio.png)

[drawio文件下载](/assets/drawio/mybatis/mybatis-study/MyBatis_Mapper_sql_Xml解析.drawio)

## 环境准备

- 1.克隆MyBatis源码

```bash
git clone https://github.com/fuzi1996/mybatis-3.git
```

**使用`3.5.7_code_read`分支**

## 测试代码介绍

测试代码位置`org.apache.ibatis.builder.XmlMapperBuilderTest#selfTest`该单元测试主要测试`mapper`中的`select`、`update`、`insert`、`delete`语句的解析
对应`xml`文件地址:`src\test\java\org\apache\ibatis\builder\SelfTestMapper.xml`,可以看到这里面只有一个`select`语句

## 解析过程

### 1.构建XMLMapperBuilder

构建`XMLMapperBuilder`需要构建`MyBatis`的全局配置对象`Configuration`,这里直接new一个`Configuration`即可

```java
Configuration configuration = new Configuration();
String resource = "org/apache/ibatis/builder/SelfTestMapper.xml";
// configuration.getSqlFragments()是mybatis中已缓存的sql片段
try (InputStream inputStream = Resources.getResourceAsStream(resource)) {
  XMLMapperBuilder builder = new XMLMapperBuilder(inputStream, configuration, resource, configuration.getSqlFragments());
}
```

### 2.XMLMapperBuilder解析(parse)

```txt
                                            --> XMLIncludeTransformer
XMLMapperBuilder --> XMLStatementBuilder --| 
                                            --> LanguageDriver --> XMLScriptBuilder
```

经过该调用链将`xml`字符串转为`SqlNode`对象,并缓存到`Configuration`中



