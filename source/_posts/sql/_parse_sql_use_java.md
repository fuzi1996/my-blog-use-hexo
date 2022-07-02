---
title: 使用java解析SQL
tags:
  - sql
date: 2022-06-19 14:49:57
categories: sql
---

有这样一个需求: 希望能够解析sql，获取sql执行结果的列信息,比如列名、列别名、列类型、所属表名、所属表别名。

这里介绍两种方式，一种是执行sql获取元数据，另一种是使用`Jsqlparser`解析sql。

## 环境说明

这里主要使用mysql数据库，版本:`5.7.19`

## 预编译sql获取元数据

这一步主要使用`Connection`预编译待执行的`sql`，然后获取元数据。
要求sql可直接执行，不需要加入参数。

```java
String sql = "select tc.id tcid,tp.id tpid from test_child tc,test_parent tp";
PreparedStatement preparedStatement = connection.prepareStatement(sql);
ResultSetMetaData metaData = preparedStatement.getMetaData();

int columnCount = metaData.getColumnCount();
for (int i = 1; i < columnCount+1; i++) {
    String tableName = metaData.getTableName(i);
    String catalogName = metaData.getCatalogName(i);
    String schemaName = metaData.getSchemaName(i);
    String columnLabel = metaData.getColumnLabel(i);
    String columnName = metaData.getColumnName(i);
    String columnTypeName = metaData.getColumnTypeName(i);
    String columnClassName = metaData.getColumnClassName(i);


    System.out.println(String.format("tableName: %s, " +
            "catalogName: %s, " +
            "schemaName: %s, " +
            "columnLabel: %s, " +
            "columnName: %s, " +
            "columnTypeName: %s, " +
            "columnClassName: %s",
            tableName,catalogName,schemaName,columnLabel,columnName,columnTypeName,columnClassName));
}

// 如果是mysql
if(metaData.isWrapperFor(com.mysql.cj.jdbc.result.ResultSetMetaData.class)){
  com.mysql.cj.jdbc.result.ResultSetMetaData mysqlMetaData = metaData.unwrap(com.mysql.cj.jdbc.result.ResultSetMetaData.class);
  System.out.println("---------- printMysqlResultSetMetaData ----------");
  Field[] fields = mysqlMetaData.getFields();
  for (int i = 0; i < fields.length; i++) {
      Field field = fields[i];
      String databaseName = field.getDatabaseName();
      String tableName = field.getTableName();
      String originalTableName = field.getOriginalTableName();
      String fullName = field.getFullName();
      String name = field.getName();
      String originalName = field.getOriginalName();
      String columnLabel = field.getColumnLabel();

      System.out.println(String.format("databaseName: %s, " +
                      "tableName: %s, " +
                      "originalTableName: %s, " +
                      "fullName: %s, " +
                      "name: %s, " +
                      "originalName: %s, " +
                      "columnLabel: %s",
              databaseName,tableName,originalTableName,fullName,name,originalName,columnLabel));
  }
}

```


## 使用Jsqlparser解析sql

这里不直接使用`Jsqlparser`,主要使用`Druid`构建sql的AST树，然后结合数据库元数据表获取结果列信息。

略
