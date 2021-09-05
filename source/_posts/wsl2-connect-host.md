---
title: wsl2与host主机互通
date: 2021-8-28 21:35:00
tags:
- wsl2
categories: wsl
---

在我的电脑上使用的是`wsl2`,每次重启,它的本地局域网ip是会改变的,虽然`host`与`wsl`之间可以使用`localhost`访问,但是当碰到端口映射等需要具体ip时,使用`localhost`就不是很方便了
所以我希望wsl的ip可以固定下来
以下假设希望设置host主机地址为`10.88.88.1`,设置wsl实例Ubuntu-20.04的ip地址为`10.88.88.2`

## 设置host主机wsl虚拟网卡地址

```bash
# 该设置需要管理员权限
netsh interface ip add address "vEthernet (WSL)" 10.88.88.1 255.255.255.0
```

## 设置wsl实例ip地址

```bash
wsl -d Ubuntu-20.04 -u root ip addr add 10.88.88.2/24 broadcast 10.88.88.255 dev eth0 label eth0:1
```

## 计划任务

由于以上两个设置系统一旦重启就需要重新配置,所以我们可以将其加入计划任务,开机自动运行即可
需要注意计划任务需要有管理员权限