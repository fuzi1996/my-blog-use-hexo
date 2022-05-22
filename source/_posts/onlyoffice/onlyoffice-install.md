---
title: OnlyOffice的安装
tags:
  - OnlyOffice
date: 2022-05-21 20:13:17
categories: OnlyOffice
---

## 说明

OnlyOffice的安装分为使用OnlyOffice官方安装包和自行从源码编译安装两种

## 安装

### 使用官方二进制包安装

**使用官方二进制包安装一切都使用默认配置,例如`postgresql`和`rabbitmq`的连接地址等**

**文档展示的是在Ubuntu上安装OnlyOffice**

[官方文档](https://helpcenter.onlyoffice.com/installation/docs-community-install-ubuntu.aspx)

- 1.系统要求

```txt
CPU dual core 2 GHz or better
RAM 2 GB or more
HDD at least 40 GB of free space
Additional requirements at least 4 GB of swap
OS 64-bit Debian, Ubuntu or other compatible distribution with kernel version 3.13 or later
Additional requirements
  PostgreSQL: version 12.9 or later
  NGINX: version 1.3.13 or later
  libstdc++6: version 4.8.4 or later
  RabbitMQ
```

- 2.安装依赖

```bash
sudo apt-get install postgresql
sudo apt-get install rabbitmq-server
sudo apt-get install nginx-extras
```

- 3.数据库初始化

```bash
sudo -i -u postgres psql -c "CREATE DATABASE onlyoffice;"
sudo -i -u postgres psql -c "CREATE USER onlyoffice WITH password 'onlyoffice';"
sudo -i -u postgres psql -c "GRANT ALL privileges ON DATABASE onlyoffice TO onlyoffice;"
```

初始化数据库,数据库初始化文件在`/server/schema/postgresql/createdb.sql`

- 4.安装`OnlyOffice`

```bash
# Add GPG key:
mkdir -p ~/.gnupg
chmod 700 ~/.gnupg
gpg --no-default-keyring --keyring gnupg-ring:/tmp/onlyoffice.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys CB2DE8E5
chmod 644 /tmp/onlyoffice.gpg
sudo chown root:root /tmp/onlyoffice.gpg
sudo mv /tmp/onlyoffice.gpg /etc/apt/trusted.gpg.d/

# Add ONLYOFFICE Docs repository:
echo "deb https://download.onlyoffice.com/repo/debian squeeze main" | sudo tee /etc/apt/sources.list.d/onlyoffice.list

# install
sudo apt-get update
sudo apt-get install ttf-mscorefonts-installer
# 在安装onlyoffice-documentserver时会要求输入数据库密码
sudo apt-get install onlyoffice-documentserver
```

**由于这里都在使用默认的配置,所以安装后OnlyOffice应该就在后台正常运行,访问本机80端口就可以看到OnlyOffice**

- 5.管理

`OnlyOffice`使用`supervisorctl`作为进程管理

```bash
# 查看supervisorctl管理的进程状态,以ds:开头的都是OnlyOffice的后台进程
sudo supervisorctl status
```

可以通过`supervisorctl`来开启或关闭`OnlyOffice`的后台进程


**安装后,OnlyOffice就会自动在后台运行**

### 自行编译安装

关于编译的部分,在[从源码编译OnlyOffice](/2022/05/20/onlyoffice/compile-onlyoffice)这里不再赘述

`OnlyOffice`编译后,会在`/build_tools/out`下看到最终编译产物

以下是启动步骤:

- 1.安装好必要的软件

- 2.安装依赖

  **具体配置省略,与使用官方二进制包安装一致**
  - postgresql
    - 初始数据库 
  - rabbitmq-server

- 3.启动
  
  - 启动`FileConverter`

  参考脚本:
  ```bash
  #!/bin/bash
  cd /build_tools/out/linux_64/onlyoffice/documentserver/server/FileConverter
  # NODE_ENV指定当前环境为development-linux,这样就会读取`development-linux.json`作为`default.json`的补充
  # NODE_CONFIG指定运行时的一些具体的配置数据,比如这里就指定了rabbitmq与postgresql的数据,需要自行修改
  LD_LIBRARY_PATH=$PWD/bin NODE_ENV=development-linux NODE_CONFIG_DIR=$PWD/../Common/config  NODE_CONFIG='{"rabbitmq": {"url": "amqp://guest:guest@192.168.0.2:5672"},"services": {"CoAuthoring": {"sql": {"type": "postgres","dbHost": "192.168.0.2","dbPort": 5432,"dbName": "onlyoffice","dbUser": "onlyoffice","dbPass": "onlyoffice"},"redis": {"host": "192.168.0.2"}}}}' nohup ./converter > nohup.out 2>&1 &
  ```

  - 启动`DocService`

  ```bash
  #!/bin/bash
  cd /build_tools/out/linux_64/onlyoffice/documentserver/server/DocService
  # NODE_ENV指定当前环境为development-linux,这样就会读取`development-linux.json`作为`default.json`的补充
  # NODE_CONFIG指定运行时的一些具体的配置数据,比如这里就指定了rabbitmq与postgresql的数据,需要自行修改
  LD_LIBRARY_PATH=$PWD/bin NODE_ENV=development-linux NODE_CONFIG_DIR=$PWD/../Common/config NODE_CONFIG='{"rabbitmq": {"url": "amqp://guest:guest@192.168.0.2:5672"},"services": {"CoAuthoring": {"sql": {"type": "postgres","dbHost": "192.168.0.2","dbPort": 5432,"dbName": "onlyoffice","dbUser": "onlyoffice","dbPass": "onlyoffice"},"redis": {"host": "192.168.0.2"}}}}' nohup ./docservice > nohup.out 2>&1 &
  ```

  - 启动示例
  
  ```bash
  #!/bin/bash
  cd /build_tools/out/linux_64/onlyoffice/documentserver-example

  # 如果files文件夹不存在,就创建一个
  if [ ! -d "files" ]; then
      mkdir files
  fi

  # 指定DocService的地址,这里需要修改ip地址
  NODE_CONFIG='{"server":{"siteUrl":"http://192.168.234.128:8000/"}}' nohup ./example > nohup.out 2>&1 &
  ```

以上启动完成后,访问`http://你的ip:3000`就可以看到示例页面了
