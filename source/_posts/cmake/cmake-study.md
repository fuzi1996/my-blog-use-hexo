---
title: CMake学习
tags:
  - cmake
date: 2022-05-03 11:05:05
categories: cmake
---

# CMake

## 语法介绍

- 基本语法格式

  - 指令(参数1 参数2)

    - 参数使用括号`(`和`)`(括号)包裹
    - 参数之间使用空格或分号分隔

  - 指令是大小无关的,参数和变量是大小有关的

  - 变量使用`${}`方式取值,但是在`IF`控制语句中直接使用变量名

## 基本指令

### include_directories

向工程添加多个特定的头文件搜索路径
相当于`-I`参数

```cmake
include_directories(
  ${CMAKE_CURRENT_SOURCE_DIR}/include
  ${CMAKE_CURRENT_SOURCE_DIR}/../include
)
```

### link_directories

向工程添加多个特定的库文件搜索路径
相当于`-L`参数

```cmake
link_directories(
  ${CMAKE_CURRENT_SOURCE_DIR}/lib
  ${CMAKE_CURRENT_SOURCE_DIR}/../lib
)
```
### add_library

生成一个库文件

```cmake
add_library(
  mytest
  ${CMAKE_CURRENT_SOURCE_DIR}/mytest.cpp
)
```

### add_compile_options
添加编译选项

```cmake
add_compile_options(
  -Wall
  -Wextra
)
```

### add_executable
生成一个可执行文件

```cmake
# 其中mytest相当于target
add_executable(
  mytest
  ${CMAKE_CURRENT_SOURCE_DIR}/mytest.cpp
)
```

### target_link_libraries
添加库文件到可执行文件
相当于`-l`参数

```cmake
target_link_libraries(
  mytest
  mytestlib
)
```

### add_subdirectory

向工程添加子目录,并可以指定中间二进制和目标二进制的存放路径

```cmake
add_subdirectory(
  ${CMAKE_CURRENT_SOURCE_DIR}/subdir
  ${CMAKE_CURRENT_BINARY_DIR}/subdir
)
```

### aux_source_directory

发现指定目录下的所有源文件,并将其添加到一个变量中

```cmake
aux_source_directory(
  ${CMAKE_CURRENT_SOURCE_DIR}/subdir
  ${CMAKE_CURRENT_BINARY_DIR}/subdir
  SOURCES
)

add_executable(
  mytest
  ${SOURCES}
)
```

## 常用变量

### CMAKE_C_FLAGS 
gcc编译选项

```cmake
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -Wextra")
```

### CMAKE_CXX_FLAGS
g++编译选项

```cmake
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra")
```

### CMAKE_BUILD_TYPE
编译类型

  - Debug
  - Release
  - RelWithDebInfo
  - MinSizeRel

```cmake
set(CMAKE_BUILD_TYPE Debug)
```



