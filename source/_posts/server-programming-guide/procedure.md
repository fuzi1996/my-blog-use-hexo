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

## 预处理

```bash
g++ -E source.cpp
# or 
cpp source.cpp target.cpp
```

## 纯编译

```bash
g++ -S source.cpp -o preprocessed.s
# or
cpp source.cpp preprocessed.cpp
/usr/lib/gcc/x86_64-linux-gnu/9/cc1plus preprocessed.cpp
```

> c++filt 这个工具来帮助我们还原混淆符号对应的函数签名

## 汇编

```bash
g++ -c source.cpp -0 preprocessed.o
# or
as preprocessed.s -o preprocessed.o
```

> file 查看文件类型
> readelf 查看elf文件信息
> nm 展示文件中符号

## 链接

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

### 创建和使用静态链接库

```bash
# 编译创建 target1.0 target2.0 两个目标文件
g++ -c -o target1.0 source1.cpp
g++ -c -o target2.0 source2.cpp
# 使用ar工具合并目标文件
ar r libmylib.a target1.o target2.o
```

## 参考
1. [编译过程概览](https://liuhaohua.com/server-programming-guide/basics/procedure/)
