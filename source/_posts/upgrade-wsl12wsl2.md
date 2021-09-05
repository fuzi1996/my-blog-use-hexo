---
title: 将wsl1更新为wsl2
date: 2021-8-28 21:35:00
tags:
- wsl1
- wsl2
categories: wsl
---
安装wsl时,未注意版本,以为windows默认安装的就是2版本,今天想起配置时才发现安装的是1版本,为了使用docker,所以需要将wsl1更新为wsl2并将已安装的实例转为wsl2

以下为参照windows官方文档的操作[Install WSL & update to WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10#manual-installation-steps)

## 前提

已安装wsl1,且已安装Ubuntu-20.04版本也是wsl1

## 打开`虚拟机平台`功能

`控制面板` > `程序` > `程序和功能` > `启用或关闭Windwos功能` > 允许`虚拟机平台`功能 > 重启电脑


![enable-vm](/assets/images/enable-vm.png)

## 设置wsl默认版本

```bash
wsl --set-default-version 2
```

## 转化已有实例为wsl2

比如,我的电脑已有实例`Ubuntu-20.04`

```bash
wsl --set-version Ubuntu-20.04 2
```

等待转化完毕后执行命令`wsl -l -v`就可以看到`Ubuntu-20.04`实例当前版本已经改为`2`版本