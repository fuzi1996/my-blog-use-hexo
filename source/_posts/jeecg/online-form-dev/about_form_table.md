---
title: jeecg 2.4.6 Online表单开发 数据库配置+crud
tags:
  - jeecg
  - online-form
date: 2021-09-11 20:28:02
categories: jeecg
---

## 表单保存

- 请求URL:

```js
http://localhost:8080/jeecg-boot/online/cgform/api/editAll
```

- 请求方法:

PUT

- 请求参数:

```js
{
 "head": {
  "id": "3d028152d85948a8b021aa8f13088dcd",
  "tableName": "flcm_product",
  "tableType": 2,
  "tableVersion": 1,
  "tableTxt": "基金产品",
  "isCheckbox": "Y",
  "isDbSynch": "N",
  "isPage": "Y",
  "isTree": "N",
  "idSequence": null,
  "idType": "UUID",
  "queryMode": "single",
  "relationType": null,
  "subTableStr": null,
  "tabOrderNum": null,
  "treeParentIdField": null,
  "treeIdField": null,
  "treeFieldname": null,
  "formCategory": "bdfl_include",
  "formTemplate": "1",
  "themeTemplate": "normal",
  "formTemplateMobile": null,
  "extConfigJson": "{\"reportPrintShow\":0,\"reportPrintUrl\":\"\",\"joinQuery\":0,\"modelFullscreen\":0,\"modalMinWidth\":\"\"}",
  "updateBy": null,
  "updateTime": null,
  "createBy": "admin",
  "createTime": "2021-09-11 20:04:12",
  "copyType": 0,
  "copyVersion": null,
  "physicId": null,
  "hascopy": 0,
  "scroll": 1,
  "taskId": null,
  "isDesForm": "N",
  "desFormCode": ""
 },
 "fields": [
  {
   "id": "eed836ca2e974802caa1d6b98e3f4333",
   "dbFieldName": "id",
   "dbFieldTxt": "主键",
   "queryDictField": "",
   "queryDictText": "",
   "queryDefVal": "",
   "queryDictTable": "",
   "queryConfigFlag": "0",
   "mainTable": "",
   "mainField": "",
   "fieldHref": "",
   "dictField": "",
   "dictText": "",
   "fieldMustInput": "0",
   "dictTable": "",
   "fieldLength": "120",
   "fieldDefaultValue": "",
   "fieldExtendJson": "",
   "converter": "",
   "isShowForm": "0",
   "isShowList": "0",
   "sortFlag": "0",
   "isReadOnly": "1",
   "fieldShowType": "text",
   "isQuery": "0",
   "queryMode": "single",
   "dbLength": "36",
   "dbPointLength": "0",
   "dbDefaultVal": "",
   "orderNum": 1,
   "dbType": "string",
   "dbIsKey": "1",
   "dbIsNull": "0",
   "order_num": 0
  },
  // 其他字段舍弃
 ],
 "indexs": [
  {
   "id": "c92fd1cd8c8f1aaa264ee628e8b73f97",
   "indexName": "uk_code",
   "indexField": "code",
   "indexType": "unique"
  }
 ],
 "deleteFieldIds": [],
 "deleteIndexIds": []
}
```

- 后台处理

```java
# 这里应该是对实现类做了混淆
org.jeecg.modules.online.cgform.c.a#b(org.jeecg.modules.online.cgform.model.a)
```

## 数据库同步

- 请求URL:

```js
http://localhost:8080/jeecg-boot/online/cgform/api/doDbSynch/3d028152d85948a8b021aa8f13088dcd/normal
```

其中,`3d028152d85948a8b021aa8f13088dcd`是表单code,`normal`是同步方式

`normal`:普通同步,`force`:强制同步,这两个同步方式的唯一区别是是否产生`drop`语句

- 请求方法:

POST

- 请求参数:

无

- 后台处理

```java
# 这里应该是对实现类做了混淆
org.jeecg.modules.online.cgform.c.a#h
```

## 数据增加

- 请求URL:

```js
http://localhost:8080/jeecg-boot/online/cgform/api/form/3d028152d85948a8b021aa8f13088dcd?tabletype=1
```

其中,`3d028152d85948a8b021aa8f13088dcd`是表单code

- 请求方法:

POST

- 请求参数:

```js
{
  "name":"产品名称TEST#1",
  "code":"产品代码TEST#1",
  "duration":1
}
```

- 后台处理

```java
# 这里应该是对实现类做了混淆
org.jeecg.modules.online.cgform.c.a#a(java.lang.String, com.alibaba.fastjson.JSONObject, javax.servlet.http.HttpServletRequest)
```

这里其实就是根据配置生成`insert`语句

## 数据删除

- 请求URL:

```js
http://localhost:8080/jeecg-boot/online/cgform/api/form/3d028152d85948a8b021aa8f13088dcd/1436700316685357058
```

其中,`3d028152d85948a8b021aa8f13088dcd`是表单code,`1436700316685357058`是数据id

- 请求方法:

DELETE

- 请求参数:

无

- 后台处理

```java
# 这里应该是对实现类做了混淆
org.jeecg.modules.online.cgform.c.a#f
```

这里其实就是根据配置生成`delete`语句/或逻辑删除

## 数据修改

- 请求URL:

```js
http://localhost:8080/jeecg-boot/online/cgform/api/form/3d028152d85948a8b021aa8f13088dcd?tabletype=1
```

其中,`3d028152d85948a8b021aa8f13088dcd`是表单code

- 请求方法:

PUT

- 请求参数:

```js
{
  "duration":123,
  "code":"code",
  "name":"name",
  "id":"1437763464737640449"
}
```

- 后台处理

```java
# 这里应该是对实现类做了混淆
org.jeecg.modules.online.cgform.c.a#a(java.lang.String, com.alibaba.fastjson.JSONObject)
```

这里其实就是根据配置生成`update`语句

## 数据查询

- 请求URL:

```js
http://localhost:8080/jeecg-boot/online/cgform/api/form/3d028152d85948a8b021aa8f13088dcd?tabletype=1
```

其中,`3d028152d85948a8b021aa8f13088dcd`是表单code

- 请求方法:

PUT

- 请求参数:

```js
_t=1631624511&column=id&order=desc&pageNo=1&pageSize=10&superQueryMatchType=and
```

- 后台处理

```java
# 这里应该是对实现类做了混淆
org.jeecg.modules.online.cgform.c.a#a(java.lang.String, javax.servlet.http.HttpServletRequest)
```
