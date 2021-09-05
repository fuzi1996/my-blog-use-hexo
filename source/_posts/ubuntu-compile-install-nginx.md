---
title: Ubuntu 20.04 编译安装 nginx 1.20.1
date: 2021-9-5
tags:
- nginx
categories: nginx
---

## 说明

[nginx源码下载地址](http://nginx.org/en/download.html) (nginx/Windows为二进制版本)
这里假设你已经下载了nginx的源码并已解压

## 安装编译环境

```bash
sudo apt-get update
#安装依赖：gcc、g++依赖库
sudo apt-get install build-essential libtool
#安装 pcre依赖库（http://www.pcre.org/）
sudo apt-get install libpcre3 libpcre3-dev
#安装 zlib依赖库（http://www.zlib.net）
sudo apt-get install zlib1g-dev
#安装ssl依赖库
sudo apt-get install openssl
```

## 编译安装

```bash
# 使用默认配置安装()
make check && make
```

## 为`nginx`建立软链接

```bash
# 查找nginx命令地址 无特殊配置，默认为/usr/local/nginx/sbin/nginx
whereis nginx
# 建立软链接
ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx
# 测试 有正常输出意味着nginx安装完成
nginx -V 
```

## 参考

- [Ubuntu18.04手动编译安装nginx](https://blog.csdn.net/A156348933/article/details/85335089)
- [WSL2子系统安装CentOS8及源码编译Nginx1.18+PHP7.4+MySql8.0开发环境](https://zhuanlan.zhihu.com/p/188505502)