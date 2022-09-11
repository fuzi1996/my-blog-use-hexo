---
title: BAT命令行过长处理
tags:
  - dbapi
  - bat
date: 2022-09-11 10:47:16
categories: dbapi
---

## 背景

DBApi最新版并没有提供bat启动脚本,我在添加启动脚本时发现启动时容易出现命令行过长错误,本文就记录了该问题的处理

## 处理方式

### Jar Manifest

该方式是把启动参数写入`MANIFEST.INF`中,并打包在一个jar包内,然后使用`java -jar xxx.jar`启动

```batch
@echo off

@REM ---------------------------------------------------------------------------
@REM Start script for the DBApi
@REM usage: dbapi.bat [-rebuild:if libs change]
@REM ---------------------------------------------------------------------------

setlocal enabledelayedexpansion

@REM get CURRENT_DIR
set CURRENT_DIR=%~dp0

cd "%CURRENT_DIR%.."

@REM set param
set DBAPI_HOME=%cd%
set DBAPI_CONF_HOME=file:/%DBAPI_HOME%\conf\
set DBAPI_LIB_HOME=%DBAPI_HOME%\lib
set DBAPI_MAIN_CLASS=com.gitee.freakchicken.dbapi.DBApiStandalone
set DBAPI_TEMP_PATH=%temp%\dbapi
set DBAPI_MANIFEST_FILE_PARENT_PATH=%DBAPI_TEMP_PATH%\META-INF
set DBAPI_MANIFEST_FILE_PATH=%DBAPI_MANIFEST_FILE_PARENT_PATH%\MANIFEST.MF
set DBAPI_START_JAR_PATH=%DBAPI_TEMP_PATH%\DBApi-start.jar
set DBAPI_EXCLUDE_JAR_NAMES=spring-boot-starter-webflux;spring-webflux;spring-cloud-gateway-server;spring-cloud-starter-gateway
set DBAPI_RE_BUILD_START_JAR_FLAG=%1


if not exist %DBAPI_MANIFEST_FILE_PARENT_PATH% md %DBAPI_MANIFEST_FILE_PARENT_PATH%

@REM if exist %DBAPI_MANIFEST_FILE_PATH% (
@REM   del /f /q %DBAPI_MANIFEST_FILE_PATH%
@REM )

if exist %DBAPI_START_JAR_PATH% (
  if "%DBAPI_RE_BUILD_START_JAR_FLAG%"=="-rebuild" (
    call:rebuild_start_jar
  )
) else (
  call:rebuild_start_jar
)

java -jar %DBAPI_START_JAR_PATH%

:rebuild_start_jar
SETLOCAL
@REM set "DBAPI_JAR_PATH=%DBAPI_CONF_HOME%"
echo Manifest-Version: 1.0 > %DBAPI_MANIFEST_FILE_PATH%
echo Created-By: DBApi >> %DBAPI_MANIFEST_FILE_PATH%
echo Main-Class: %DBAPI_MAIN_CLASS% >> %DBAPI_MANIFEST_FILE_PATH%
echo Class-Path: %DBAPI_CONF_HOME% >> %DBAPI_MANIFEST_FILE_PATH%

set "DBAPI_JAR_PATH=%DBAPI_CONF_HOME%"
for /R %DBAPI_LIB_HOME% %%f in (*.jar) do (
  set file_path=%%f
  echo handle !file_path!
  if defined file_path (
    set result=0
    call:exclude_jar %%f result
    if !result!==0 (
      (echo  file:/%%f ) >> %DBAPI_MANIFEST_FILE_PATH%
    )
  )
)

jar -cvfm %DBAPI_START_JAR_PATH% %DBAPI_MANIFEST_FILE_PATH%
ENDLOCAL
goto:eof

:exclude_jar
SETLOCAL
set result=0
set jar_path=%1
if defined jar_path (
  for %%i in (%DBAPI_EXCLUDE_JAR_NAMES%) do (
    set result=0
    call:is_str_same_as !jar_path! %%i result
    @REM echo jar_path=!jar_path! str=%%i result=%result%
    if !result!==1 (
      goto break
    )
  )
) else (
  ENDLOCAL & goto:eof
)
:break
ENDLOCAL&set %~2=%result%
goto:eof


:is_str_same_as
SETLOCAL
set result=0
set str=%1
set regexp=.*%2.*
if defined str (
  echo %str%|findstr /r /c:"%regexp%" >nul && (
    set result=1
  ) || (
    set result=0
  )
  @REM echo str=%str% regexp=%regexp% result=%result%
) else (
  ENDLOCAL & goto:eof
)
ENDLOCAL&set %~3=%result%
goto:eof
```

### classpath file

这种启动方式来自于IDEA的`Shorten Command Line`,不过在`JDK 9`及以上版本被废除

代码位置:`com.intellij.rt.execution.CommandLineWrapper`

主要就是通过`System.setProperty`预先设置一些变量,然后通过反射调用主启动类的main方法启动

### @argfile 方式

`Java 9+`支持的启动方式,来源于IDEA


