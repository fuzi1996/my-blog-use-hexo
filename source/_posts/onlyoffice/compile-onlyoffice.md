---
title: 从源码编译OnlyOffice
tags:
  - OnlyOffice
date: 2022-05-20 19:47:01
categories: OnlyOffice
---

## 环境要求

```txt
系统: Ubuntu 14.04
网络: 必须科学上网
```

**为什么要求科学上网?**
OnlyOffice源码存放在github上,且编译时会从google服务器下载v8相关资源,所以必须科学上网

## 说明

- 锚定`build_tools`git版本:`be06b3c2c8df1559d2198d3c7e186a9d5913799f`

- `/build_tools`路径指的是OnlyOffice编译工具仓库clone后的本地地址

- `OnlyOffice`连接数限制在build_tools同级目录`/server/Common/sources/contants.js`
  
  ```javascript
  // 改为9999就可以无限连接数
  exports.LICENSE_CONNECTIONS = 20;
  ```


## Linux下源码编译步骤

- 1.build_tools工具下载

```bash
git clone https://github.com/ONLYOFFICE/build_tools.git
```

- 2.相关资源预下载

  - `node`环境准备
    
    这里不再介绍如何安装`node`,但有以下几点需要注意:
    
    - `node`版本必须大于`10.20`
    
    - 如果想使用国内的`npm`镜像,例如淘宝的`npm`镜像,我在尝试的时候发现一些包不能正确安装,因此最好是科学上网,不使用镜像
    
    - 每一次编译的时候,`build_tools`都会尝试全局安装`grunt-cli`和`pkg`这两个包,因此可以提前安装好,然后修改`build_tools`源码,避免每次都安装
      
      - `npm`安装`grunt-cli`和`pkg`
      
      ```bash
      npm install -g grunt-cli
      npm install -g pkg
      ```
      - 修改`\build_tools\tools\linux\deps.py`中源码,注释掉以下两行
      
      ```python
      # base.cmd("sudo", ["npm", "install", "-g", "grunt-cli"])
      # base.cmd("sudo", ["npm", "install", "-g", "pkg"])
      ```

  - `java`环境准备

    这里不再介绍具体的`java`安装,但须注意以下几点:
    
    - `java`版本仅支持`11`,`1.8`
    
    - 编译的时候每次都会尝试全局安装`open-jdk`,如果`java`环境已经配置好,可以修改`\build_tools\tools\linux\deps.py`中源码,注释掉以下几行

    ```python
    # java_error = base.cmd("sudo", ["apt-get", "-y", "install", "openjdk-11-jdk"], True)
    # if (0 != java_error):
    #   java_error = base.cmd("sudo", ["apt-get", "-y", "install", "openjdk-8-jdk"], True)
    # if (0 != java_error):
    #   base.cmd("sudo", ["apt-get", "-y", "install", "software-properties-common"])
    #   base.cmd("sudo", ["add-apt-repository", "-y", "ppa:openjdk-r/ppa"])
    #   base.cmd("sudo", ["apt-get", "update"])
    #   base.cmd("sudo", ["apt-get", "-y", "install", "openjdk-8-jdk"])
    #   base.cmd("sudo", ["update-alternatives", "--config", "java"])
    #   base.cmd("sudo", ["update-alternatives", "--config", "javac"])
    ```

  - `qt`环境准备

    `qt`版本:`5.9.9`

    - 下载
    下载镜像:[https://mirrors.tuna.tsinghua.edu.cn/qt/archive/qt/5.9/5.9.9/](https://mirrors.tuna.tsinghua.edu.cn/qt/archive/qt/5.9/5.9.9/)

    具体下载地址:[https://mirrors.tuna.tsinghua.edu.cn/qt/archive/qt/5.9/5.9.9/single/qt-everywhere-opensource-src-5.9.9.tar.xz](https://mirrors.tuna.tsinghua.edu.cn/qt/archive/qt/5.9/5.9.9/single/qt-everywhere-opensource-src-5.9.9.tar.xz)

    - 重命名
    下载后将文件名改为`qt_source_5.9.9.tar.xz`并放置在`/build_tools/tools/linux`文件夹下

    - 解压
    解压`/build_tools/tools/linux/qt_source_5.9.9.tar.xz`到`/build_tools/tools/linux/qt-everywhere-opensource-src-5.9.9`文件加下
    


  **为什么需要资源预下载**
  如果不预下载一些资源,会在编译时自动下载.但是编译时下载的资源很慢,碰上网络波动,极易造成编译失败

- 3.编译

进入`/build_tools/tools/linux`目录下

```bash
./automate.py server
```

编译完成后,可以在`/build_tools/out`下看到最终编译产物

初始编译通过后,如果不需要更新`OnlyOffice`的代码,需要修改`/build_tools/tools/linux/automate.py`

```python
build_tools_params = ["--branch", branch, 
                      "--module", modules, 
                      # 这里需要把1改为0,这样后面就不会更新仓库
                      "--update", "0",
                      "--qt-dir", os.getcwd() + "/qt_build/Qt-5.9.9"] + params
```

- 4.编译字体与主题

第3步,编译产物`/build_tools/out`下没有字体与主题资源,所以还需要生成字体与主题

```bash
#!/bin/bash
cd /build_tools/out/linux_64/onlyoffice/documentserver

# 如果fonts文件夹不存在
if [ ! -d "fonts" ]; then
    mkdir fonts
fi
# 在/build_tools/out/linux_64/onlyoffice/documentserver/fonts下生成字体
LD_LIBRARY_PATH=${PWD}/server/FileConverter/bin server/tools/allfontsgen \
  --input="${PWD}/core-fonts" \
  --allfonts-web="${PWD}/sdkjs/common/AllFonts.js" \
  --allfonts="${PWD}/server/FileConverter/bin/AllFonts.js" \
  --images="${PWD}/sdkjs/common/Images" \
  --selection="${PWD}/server/FileConverter/bin/font_selection.bin" \
  --output-web='fonts' \
  --use-system="true"

# 生成主题
cd /build_tools/out/linux_64/onlyoffice/documentserver
LD_LIBRARY_PATH=${PWD}/server/FileConverter/bin server/tools/allthemesgen \
  --converter-dir="${PWD}/server/FileConverter/bin"\
  --src="${PWD}/sdkjs/slide/themes"\
  --output="${PWD}/sdkjs/common/Images"
```