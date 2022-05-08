---
title: 编译
tags:
  - c++
  - server-programming
date: 2021-10-23 11:05:05
categories: c++
---

## 编译

```bash
g++ source.cpp  # a.out
```

**以上的编译可以分为以下四步**

### 预处理(Pre-Procession)

```bash
# -E 选项指示编译器仅对输入文件进行预处理
g++ -E source.cpp -o source.i
# or 
cpp source.cpp target.cpp
```

### 纯编译(Compiling)

```bash
# -S 选项告诉编译器产生汇编语言后停止编译
# g++产生汇编文件的缺省名是.s
g++ -S source.cpp -o preprocessed.s
# or
cpp source.cpp preprocessed.cpp
/usr/lib/gcc/x86_64-linux-gnu/9/cc1plus preprocessed.cpp
```

> c++filt 这个工具来帮助我们还原混淆符号对应的函数签名

### 汇编(Assembling)

```bash
# -c 选项告诉编译器仅把源代码转成机器语言的目标代码
g++ -c source.cpp -0 preprocessed.o
# or
as preprocessed.s -o preprocessed.o
```

> file 查看文件类型
> readelf 查看elf文件信息
> nm 展示文件中符号

### 链接(Linking)

```bash
g++ preprocessed.o
# or
ld -static preprocessed.o \
    /usr/lib/x86_64-linux-gnu/crt1.o \
    /usr/lib/x86_64-linux-gnu/crti.o \
    /usr/lib/gcc/x86_64-linux-gnu/9/crtbeginT.o \
    -L/usr/lib/gcc/x86_64-linux-gnu/9 \
    -L/usr/lib/x86_64-linux-gnu \
    -L/lib/x86_64-linux-gnu \
    -L/lib \
    -L/usr/lib \
    -lstdc++ \
    -lm \
    --start-group \
    -lgcc \
    -lgcc_eh \
    -lc \
    --end-group \
    /usr/lib/gcc/x86_64-linux-gnu/9/crtend.o \
    /usr/lib/x86_64-linux-gnu/crtn.o
```

## g++重要参数

1. -g

编译带调试信息的可执行文件

```bash
g++ -g test.cpp -o test
```

2. -O[n]

代码优化,可选参数
- -O  不做优化
- -O1 默认优化
- -O2 除O1外,进一步优化
- -O3 更进一步的优化

```bash
g++ -O2 test.cpp
```

3. -l/L

- -l紧跟着就是库名,`/lib`,`/usr/lib`,`/usr/local/lib`里直接-l库名就能链接
- -L紧跟着就是库所在目录

```bash
g++ -lglong test.cpp
g++ -L/home/temp/mytestlibfolder -lmytest  test.cpp
```

4. -I
指定头文件搜索路径,`/usr/include`可以不需要指定

```bash
g++ -I/myinclude test.cpp
```

5. -Wall
打印警告信息

```bash
g++ -Wall test.cpp
```

6. -w
关闭警告信息

```bash
g++ -w test.cpp
```

7. -std=[n]
指定c++标准

```bash
g++ -std=c++11 test.cpp
```

8. -D
定义宏

```bash
g++ -DDEBUG test.cpp
```

## 创建和使用链接库


假设我们有这么一个程序,它的作用是用来交换数字,目录结构如下:
```text
- include
  - swap.h
- main.cpp
- src
  - swap.cpp
```

### 静态库
```bash
# 生成:
# 进入src目录下
cd src
# 汇编生成swap.o文件
g++ swap.cpp -c -I../include
# 生成静态链接库
ar rs libswap.a swap.o

# 使用:
# 回到上级目录
cd ..
# 链接,生成可执行文件
g++ main.cpp -Iinclude -Lsrc -lswap -o staticmain
```

### 动态库
```bash
# 生成:
# 进入src目录下
cd src
# 汇编生成swap.o文件
g++ swap.cpp -I../include -fPIC -shared -o libswap.so
# 上面命令等价于
# g++ swap.cpp -I../include -c -fPIC
# g++ -shared -o libswap.so swap.o

# 使用:
# 回到上级目录
cd ..
# 链接,生成可执行文件
g++ main.cpp -Iinclude -Lsrc -lswap -o sharemain
```

运行动态库的程序时,指定库路径
```bash
# sharemain.so在src目录下
LD_LIBRARY_PATH=src ./sharemain
```

## 参考
1. [编译过程概览](https://liuhaohua.com/server-programming-guide/basics/procedure/)
