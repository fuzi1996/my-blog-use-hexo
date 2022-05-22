---
title: issues/461问题修复
tags:
  - bug-fix
date: 2022-05-07 18:31:41
categories: bug-fix
---

## BUG链接:
[issues/461](https://github.com/ONLYOFFICE/build_tools/issues/461)

```text
[fetch & build]: boost
command: ./bootstrap.sh "--with-libraries=filesystem,system,date_time,regex"
./bootstrap.sh: 1: ./bootstrap.sh: ./tools/build/src/engine/build.sh: not found
Building Boost.Build engine with toolset ... 
Failed to build Boost.Build build engine
Consult 'bootstrap.log' for more details
Error (./bootstrap.sh): 1
Error (./make.py): 1
```

## BUG说明

就是说在编译的时候报某某文件不存在

## 解决步骤

### 1.首先BUG位置

我们根据`[fetch & build]`知道应该是在编译`boost`的时候出现了问题,但是这个`boost`在哪里我们是不知道的,
所以问题就变成了我们要确定`boost`的文件位置

通过搜索`[fetch & build]: boost`关键字找到了`build_tools/scripts/core_common/modules/boost.py`这个文件
可以确定应该就是这个文件在执行的时候出现了问题,为了更加确定,我们添加一点调试信息

```py
  if (-1 != config.option("platform").find("linux")) and not base.is_dir("../build/linux_64"):
    # 调试信息
    base.cmd('pwd')
    # 调试信息
    base.cmd("./bootstrap.sh", ["--with-libraries=filesystem,system,date_time,regex"])
    base.cmd("./b2", ["headers"])
    base.cmd("./b2", ["--clean"])
    base.cmd("./b2", ["--prefix=./../build/linux_64", "link=static", "cxxflags=-fPIC", "install"])    
    # TODO: support x86
```

`base.cmd('pwd')`是我们添加的调试信息,通过`pwd`命令确定命令的执行目录
再次运行会发现,出错信息变成了
```text
[fetch & build]: boost
command: pwd
(我的目录)/gitrepos/core/Common/3dParty/boost/boost_1_72_0
command: ./bootstrap.sh "--with-libraries=filesystem,system,date_time,regex"
./bootstrap.sh: 1: ./bootstrap.sh: ./tools/build/src/engine/build.sh: not found
Building Boost.Build engine with toolset ... 
Failed to build Boost.Build build engine
Consult 'bootstrap.log' for more details
Error (./bootstrap.sh): 1
Error (./make.py): 1
```
我们切换到`(我的目录)/gitrepos/core/Common/3dParty/boost/boost_1_72_0`这个目录发现
这个目录下确实存在一个`bootstrap.sh`的可执行文件,我们打开这个文件,搜索`/tools/build/src/engine/build.sh`
发现

```sh
my_dir=$(dirname "$0")

# Determine the toolset, if not already decided
if test "x$TOOLSET" = x; then
  guessed_toolset=`$my_dir/tools/build/src/engine/build.sh --guess-toolset`
```

所以说应该是`(我的目录)/gitrepos/core/Common/3dParty/boost/boost_1_72_0/tools/build`下缺少文件造成的这个错误

### 2.找到BUG原因

我们仔细看下`build_tools/scripts/core_common/modules/boost.py`这个文件,可以发现这么一段逻辑
```python
print("[fetch & build]: boost")

  base_dir = base.get_script_dir() + "/../../core/Common/3dParty/boost"
  old_cur = os.getcwd()
  os.chdir(base_dir)

  # download
  #url = "https://downloads.sourceforge.net/project/boost/boost/1.58.0/boost_1_58_0.7z"  
  #if not base.is_file("boost_1_58_0.7z"):
  #  base.download("https://downloads.sourceforge.net/project/boost/boost/1.58.0/boost_1_58_0.7z", "boost_1_58_0.7z")
  #if not base.is_dir("boost_1_58_0"):
  #  base.extract("boost_1_58_0.7z", "./")

  base.common_check_version("boost", "5", clean)

  if not base.is_dir("boost_1_72_0"):
    base.cmd("git", ["clone", "--recursive", "--depth=1", "https://github.com/boostorg/boost.git", "boost_1_72_0", "-b" "boost-1.72.0"])

  os.chdir("boost_1_72_0")
```
也就是说`boost_1_72_0`这个文件是通过`git clone`得来的(之前是通过下载得到的),而访问`https://github.com/boostorg/boost.git`这个地址会发现

它下面还有子模块
![boost.png](/assets/images/bug-fix/boost.png)


所以造成BUG的原因就清楚了:
`boost`由下载压缩包改为`git clone`时没有初始化`boost`本身含有的子模块造成的bug

可是我们要注意`git clone`时命令

```bash
git clone --recursive --depth=1 https://github.com/boostorg/boost.git boost_1_72_0 -b boost-1.72.0
```

`--recursive`指在clone的时候循环初始化子模块,所以这个命令是考虑到子模块的问题.

那我为什么会出现这个问题呢?

我仔细回忆了初始化的过程,回想起第一次初始化时曾因为`GFW`问题导致`git clone`,所以应该就是在初始化`boost`下的某一个子模块的时候网络出现了问题,导致后面的子模块没有正常初始化

### 3.修复

删掉`(我的目录)/gitrepos/core/Common/3dParty/boost/boost_1_72_0`这个目录,重新执行一遍编译

`FUCK GFW`
