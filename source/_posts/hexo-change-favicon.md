---
title: 如何改变Hexo无主题的favicon
date: 2021-8-28
tags:
- hexo
- favicon
categories: hexo
---
找了半天也没发现修改`_config.yml`里面配置改变默认favicon的方法

## 操作

把要使用的ico图标命名为`favicon.png`放在`source`文件夹下,重启`hexo`服务器

## 原理

通过分析发现,`hexo generate`生成的`public`文件夹下的`index.html`引入的是`favicon.png`,而我们放在`source`文件夹下的`favicon.png`会被认为是网站的`favicon`