---
title: 内网穿透工具 frp 介绍
date: 2021-9-5
tags:
- 内网穿透
- frp
categories: frp
---

## 1.下载

去它的[release页面](https://github.com/fatedier/frp/releases)下载对应系统的版本

## 2.配置与安装

服务端使用frps*文件,客户端使用frpc*文件,frps和frpc分别对应服务端和客户端的你主程序,.ini则分别是他们的对应配置文件,主要的配置见[参考链接1](#参考1),[参考链接2](#参考2),任选其1即可.

## 3.后台运行

### 3.1 nohup

使用nohup可以让你的程序在此次连接结束后依旧运行,远程服务器的时候可以使用
例如

```bash

nohup ./frpc -c ./frpc.ini

```

### 3.2 以服务的方式运行

#### 3.2.1 支持systemctl的方式

新版本解压后可以看到有systemd这个文件夹,里面是已经写好的服务文件,这里以`frpc.service`为例配置为客户端开机重启的服务

- 首先

你需要把`frpc.service`文件中的`ExecStart`和`ExecReload`替换你自己的程序路径

- 其次

把`frpc.service`文件放到系统服务对应的位置,ubuntu 16.04放在`/lib/systemd/system/`下,CentOS 7放在`/usr/lib/systemd/system/`下

- 最后

```bash

# 使用service或者systemctl启动服务
service frpc start|reload|stop|status
systemctl frpc start|reload|stop|status

# 开机时启动一个服务
systemctl enabl frpc
# 开机时禁用一个服务
systemctl disable frpc
#查看服务是否开机启动
systemctl is-enabled frpc

```


#### 3.2.2 支持services方式

如果你的系统版本比较老,比如RedHat 6.8,这类系统不支持systemctl启动服务,那么你就需要手写一个脚本来启动服务,并把这个服务放在`/etc/init.d`目录下,
参考脚本,以frpc为例,这个脚本是我以sshd为基础改的:

```bash

#!/bin/bash
#chkconfig 2345 99 01
# frpc
#
# description: frpc is a niwangchuantou tool
#
# processname: frpc
# config: /etc/frp/frpc.ini

### BEGIN INIT INFO
# Provides: frpc
# Required-Start: $all
# Required-Stop: $all
# Default-Start: 2 3 4 5
# Default-Stop: 0 6
# Short-Description: Start up the frpc server daemon
# Description:      frpc is a neiwangchuantou tool 
### END INIT INFO

# source function library
. /etc/rc.d/init.d/functions

RETVAL=0
prog="frpc"

# Some functions to make the below more readable
FRPC=/usr/bin/frpc
INI_FILE=/etc/frp/frpc.ini

start()
{
	$FRPC -c $INI_FILE
}

stop()
{
	killall $prog 2>/dev/null
}

reload()
{
	$FRPC reload -c $INI_FILE
}

restart() {
	stop
	start
}

case "$1" in
	start)
		start &
		;;
	stop)
		stop &
		;;
	restart)
		restart &
		;;
	reload)
		reload &
		;;
	*)
		echo $"Usage: $0 {start|stop|restart|reload}"
		RETVAL=2
esac
exit $RETVAL

```

#### 配置

```bash
赋予脚本执行权限
chmod +x frpc.service
使用前加入chkconfig管理列表
chkconfig --add frpc
```

#### 使用:

```bash

#脚本中已经自动为开机启动
service frpc start|reload|restart|stop

```

## 参考链接

### frp参考链接

#### 参考1

[frp内网穿透](https://www.jianshu.com/p/a621556fc07b)

#### 参考2

[使用frp实现内网穿透](https://www.jianshu.com/p/e8e26bcc6fe6)

#### 参考3

[Frp后台自动启动的几个方法](https://blog.csdn.net/x7418520/article/details/81077652)

#### 参考4

[FRP局域网穿透＋linux自动监控服务运行](https://www.jianshu.com/p/1640620a5da5)

### linux 配置服务参考连接

[centos6添加系统服务](https://blog.csdn.net/qq_25969499/article/details/86133796)
[CentOS6自定义服务控制脚本](https://blog.csdn.net/qq_27754983/article/details/74520077)
[Centos7 服务 service 设置命令 systemctl 用法](https://www.cnblogs.com/devilmaycry812839668/p/8481760.html)

### 以下是frp的github ReadMe

[英文版](https://github.com/fatedier/frp)
[中文版](https://github.com/fatedier/frp/blob/master/README_zh.md#%E5%BC%80%E5%8F%91%E7%8A%B6%E6%80%81)