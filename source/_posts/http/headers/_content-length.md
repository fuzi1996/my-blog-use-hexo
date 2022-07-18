---
title: 文件下载未配置Content-Length带来的问题
tags:
  - Content-Length
date: 2022-07-17 13:24:52
categories: HTTP
---

## 环境

```
spring-boot: 2.7.1
tomcat: 9.0.64
```

## 问题描述

下载zip时,有的文件下载正常,有的则无法下载。具体表现为

- 浏览器下载有的成功，有的失败

  ![浏览器一直等待](/assets/images/http/headers/content-length/download1.png)
  ![浏览器报网络异常](/assets/images/http/headers/content-length/download2.png)

- post请求,有的请求成功,有的提示`Error: aborted`
  
  ![error-aborted](/assets/images/http/headers/content-length/error-aborted.png)

- curl请求虽然都能下载文件,但是之前出问题的请求有额外的提示
  
  ```shell
  ❯ curl --location --request POST 'http://127.0.0.1:8080/test' --header 'Content-Type: application/json' --data-raw '{\"filePath\":\"classpath:./test.zip\"}' --output "temp2.zip"
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  100 53570    0 53535  100    35  1089k    729 --:--:-- --:--:-- --:--:-- 1089k
  curl: (18) transfer closed with outstanding read data remaining
  ```

显然，只有`curl`提供了有用的信息

这里有一个问题: 为什么文件下载会失败？

这个是因为文件下载的`Response`返回头`Header`里面没有设置`Content-Length`导致,如果设置了`Content-Length`那么请求就会正常

这里还会存在一个问题: 为什么有的请求正常，有的请求不正常？

通过观察发现，不正常的请求，下载的文件都比较大。具体来说就是：当下载超过了一定的字节数的文件时，请求就会失败？

这里我们主要研究这个问题

## 研究步骤

### Wireshark抓包

通过wireshark抓包发现,当文件字节数小于8192(8*1024)字节时下载正常,当文件字节数大于该值时下载异常。

- [正常的包](/assets/other/http/headers/content-length/8192.pcapng)
- [异常的包](/assets/other/http/headers/content-length/8193.pcapng)

通过对比它们的tcp流发现有以下两处不同

- 1. 正常的返回头中`Content-Length`为`application/json`,异常的返回头中`Content-Length`为`application/octet-stream`

  ![diff1](/assets/other/http/headers/content-length/wireshark-package-diff.png)

- 2. 正常的数据流最后含有返回值结构并含有结束标志`0\r\n`,异常的数据流仅包含二进制数据

  ![diff1](/assets/other/http/headers/content-length/wireshark-package-diff.png)

### 初步推断

Tomcat里有一个缓冲区默认是8192大小，当下载时首次写入的数据流小于这个字节时，可以继续往里面写数据
当当下载时首次写入的数据流大于这个字节时,就不可以了

## 参考

1.[content-length](https://www.rfc-editor.org/rfc/rfc9110.html#name-content-length)
2.[web服务Content-Length、Transfer-Encoding与flush方法](https://juejin.cn/post/6960581319944306719)

```txt
curl --location --request POST 'http://127.0.0.1:8080/test' --header 'Content-Type: application/json' --data-raw '{\"filePath\":\"classpath:./1147.zip\"}' --output "temp1.zip"

curl --location --request POST 'http://127.0.0.1:8080/test' --header 'Content-Type: application/json' --data-raw '{\"filePath\":\"classpath:./53535.zip\"}' --output "temp2.zip"


curl --location --request POST 'http://127.0.0.1:8080/test' --header 'Content-Type: application/json' --data-raw '{\"filePath\":\"classpath:./53535.zip\",\"hasLength\":true}' --output "temp2.zip"
```