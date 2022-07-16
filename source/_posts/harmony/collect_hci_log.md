---
title: HarmonyOS手机蓝牙日志
tags:
  - HarmonyOS
  - hci
  - 蓝牙
date: 2022-07-16 10:28:00
categories: HarmonyOS
---

## 环境

```txt
HarmonyOS version: 2.0.0
```

## 问题描述

已经开启了`USB调试`和`HCI 信息收集日志`功能

![开发者选项](/assets/images/harmony/collect_hci_log/dev_config.png)

在尝试获取HCI log时

使用`adb pull /data/log/bt`时提示

```shell
/data/log/bt/: 0 files pulled, 0 skipped.
```

通过`adb pull /data/log/bt/btsnoop_hci.log`获取时提示

```shell
adb: error: failed to stat remote object '/data/log/bt/btsnoop_hci.log': No such file or directory
```

但是`/etc/bluetooth/bt_stack.conf`文件内配置如下

```txt
# BtSnoop log output file
BtSnoopFileName=/data/log/bt/btsnoop_hci.log
```

也就是说日志文件的路径应该是没有问题的

尝试通过`ls /data/log/bt/` 查看目录下文件时，提示`Permission denied`，不能查看到目录

也无法通过`adb root`获取权限，那么获取HCI的日志的呢？

## 解决方案

1. `开发者选项中` -> `启用蓝牙HCI信息收集日志` 是打开的
2. 进入手机拨号界面输入：`*#*#2846579#*#*`
   依次选择`后台设置`—`AP LOG设置`—`点击打开` 保存即可

   ![step1](/assets/images/harmony/collect_hci_log/p1.png)]
   ![step2](/assets/images/harmony/collect_hci_log/p2.png)]
   ![step3](/assets/images/harmony/collect_hci_log/p3.png)]
3. 重新操作蓝牙即可观察到日志,但是注意日志文件名并不是`btsnoop_hci.log`,而是附带了日期例如`btsnoop_hci_20220716_101108.log`


## 参考

1. [请问HarmonyOS中如何获取HCI日志](https://developer.huawei.com/consumer/cn/forum/topic/0203903590526040118)
2. [华为手机抓取hci log](https://blog.csdn.net/coldrainbow/article/details/108595331)