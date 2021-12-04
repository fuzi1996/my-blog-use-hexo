---
title: DatabaseMetaData学习
tags:
  - jdbc
  - DatabaseMetaData
date: 2021-12-04 12:23:03
categories: jdbc
---

## DatabaseMetaData接口
- 获取数据源信息
- 确定数据源是否支持某一特性或功能
- 获取数据源的限制
- 确定数据源包含哪些SQL对象以及这些对象的属性
- 获取数据源对事务的支持

```java
  DatabaseMetaData metaData = connection.getMetaData();
  pringln(metaData.getURL(),"获取数据库URL");
  pringln(metaData.getUserName(),"获取数据库已知的用户");
  pringln(metaData.getDatabaseProductName(),"获取数据库产品名");
  pringln(metaData.getDatabaseProductVersion(),"获取数据库产品版本");
  pringln(metaData.getDriverMajorVersion(),"获取驱动主版本");
  pringln(metaData.getDriverMinorVersion(),"获取驱动副版本");
  pringln(metaData.getSchemaTerm(),"获取数据库供应商用于Schema的首选术语");
  pringln(metaData.getCatalogTerm(),"获取数据库供应商用于Catalog的首选术语");
  pringln(metaData.getProcedureTerm(),"获取数据库供应商用于Procedure的首选术语");
  pringln(metaData.nullsAreSortedHigh(),"获取null值是否高排序");
  pringln(metaData.nullsAreSortedLow(),"获取null值是否低排序");
  pringln(metaData.usesLocalFiles(),"获取数据库是否将表存储在本地文件中");
  pringln(metaData.usesLocalFilePerTable(),"获取数据库是否为每个表使用一个文件");
  pringln(metaData.getSQLKeywords(),"获取数据库SQL关键字");
  pringln(metaData.supportsAlterTableWithDropColumn(),"检索此数据源是否支持带有删除列的ALTER TABLE语句");
  pringln(metaData.supportsBatchUpdates(),"检索此数据源是否支持批量更新");
  pringln(metaData.supportsTableCorrelationNames(),"检索此数据源是否支持表相关名称");
  pringln(metaData.supportsPositionedDelete(),"检索此数据源是否支持定位的DELETE语句");
  pringln(metaData.supportsFullOuterJoins(),"检索此数据源是否支持完整地嵌套外部连接");
  pringln(metaData.supportsStoredProcedures(),"检索此数据源是否存储过程");
  pringln(metaData.supportsMixedCaseQuotedIdentifiers(),"检索此数据源是否将用双引号引起来的大小写混合的SQL标识符视为区分大小写，并以混合大小写方式存储它们");
  pringln(metaData.supportsANSI92EntryLevelSQL(),"检索此数据源是否支持ANSI92入门级SQL语法");
  pringln(metaData.supportsCoreSQLGrammar(),"检索此数据源是否支持ODBC核心SQL语法");
  pringln(metaData.getMaxRowSize(),"获取最大行数");
  pringln(metaData.getMaxStatementLength(),"获取此数据库在SQL语句中允许的最大字符数");
  pringln(metaData.getMaxTablesInSelect(),"获取此数据库在SELECT语句中允许的最大表数");
  pringln(metaData.getMaxConnections(),"获取此数据库支持的最大连接数");
  pringln(metaData.getMaxCharLiteralLength(),"获取数据库支持的字符串字面量长度");
  pringln(metaData.getMaxColumnsInTable(),"获取数据库表中允许的最大列数");
  //pringln(metaData.getSchemas(),"获取Schema信息");//返回ResultSet
  //pringln(metaData.getCatalogs(),"获取Catalog信息");//返回ResultSet
  //pringln(metaData.getTables(catalog, schemaPattern,tableNamePattern, types),"获取表信息");
  //pringln(metaData.getPrimaryKeys(catalog,schema,table),"获取主键信息");//返回ResultSet
  //pringln(metaData.getProcedures(catalog,schemaPattern,procedureNamePattern),"获取存储过程信息");//返回ResultSet
  //pringln(metaData.getProcedureColumns(catalog,schemaPattern,procedureNamePattern,columnNamePattern),"获取给定类别的存储过程参数和结果列的信息");//返回ResultSet
  //pringln(metaData.getUDTs(catalog, schemaPattern,tableNamePattern, types),"获取用户自定义数据类型");//返回ResultSet
  //pringln(metaData.getFunctions(catalog,schemaPattern,functionNamePattern),"获取函数信息");//返回ResultSet
  //pringln(metaData.getFunctionColumns(catalog,schemaPattern,functionNamePattern,columnNamePattern),"获取给定类别的函数参数和结果列的信息");//返回ResultSet
  //pringln(metaData.supportsTransactionIsolationLevel(level),"是否支持某一事务隔离级别");
  pringln(metaData.supportsTransactions(),"是否支持事务");
  pringln(metaData.getDefaultTransactionIsolation(),"获取默认的事务隔离级别");
  pringln(metaData.supportsMultipleTransactions(),"是否支持同时开启多个事务");
```

## 参考

1. MyBatis 3源码深度解析／江荣波