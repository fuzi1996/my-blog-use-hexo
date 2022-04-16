---
title: 类加载器的并行加载模式registerAsParallelCapable源码分析
tags:
  - java
date: 2022-04-02 19:22:28
categories: java
---

## 并行加载模式

```java
static {
  /*
    * Try to solve the classloader dead lock. See https://github.com/apache/skywalking/pull/2016
    * 为了解决ClassLoader死锁问题,开启类加载器的并行加载模式
    */
  registerAsParallelCapable();
}
```

- 在JDK 1.7之前，类加载器在加载类的时候是串行加载的，比如有100个类需要加载，那么就排队，加载完上一个再加载下一个，这样加载效率就很低, ClassLoader加载类的时候加锁的时候是用自身作为锁的，容易产生死锁

- 在JDK 1.7之后，就提供了类加载器并行能力，就是把锁的粒度变小，现在是每一个类都有一个独立的锁

## ClassLoader的registerAsParallelCapable()方法源码

```java
public abstract class ClassLoader { 
  /** 
    * 将调用该方法的类加载器注册为具备并行能力的 
    * 同时满足以下两个条件时,注册才会成功 
    * 1.调用该方法的类加载器实例还未创建 
    * 2.调用该方法的类加载器所有父类(Object类除外)都注册为具备并行能力的 
    */ 
  @CallerSensitive 
  protected static boolean registerAsParallelCapable() { 
    // 把调用该方法的Class对象转换为ClassLoader的子类 
    Class callerClass = Reflection.getCallerClass().asSubclass(ClassLoader.class); 
    // 注册为具备并行能力的 
    return ParallelLoaders.register(callerClass); 
  } 
  
  private static class ParallelLoaders {
    private ParallelLoaders() {} 
    // loaderTypes中保存了所有具备并行能力的类加载器 
    // 注意这里是WeakHashMap 可参考https://blog.csdn.net/kaka0509/article/details/73459419
    private static final Set> loaderTypes = Collections.newSetFromMap(new WeakHashMap<>()); 
    static { 
      // ClassLoader本身就是支持并行加载的 
      synchronized (loaderTypes) { 
        loaderTypes.add(ClassLoader.class); 
      } 
    } 
    static boolean register(Class c) { 
      synchronized (loaderTypes) { 
        // 当且仅当该类加载器的所有父类都具备并行能力时,该类加载器才能被注册成功 
        if (loaderTypes.contains(c.getSuperclass())) { 
          loaderTypes.add(c); 
          return true; 
        } else { 
          return false; 
        } 
      } 
    } 
    /** 
      * 判定给定的类加载器是否具备并行能力 
      */ 
    static boolean isRegistered(Class c) { 
      synchronized (loaderTypes) { 
        return loaderTypes.contains(c); 
      } 
    }
  }
}
```

## 并行加载的实现

```java
public abstract class ClassLoader {
  
    private final ConcurrentHashMap<String, Object> parallelLockMap;

    private ClassLoader(Void unused, String name, ClassLoader parent) {
        this.name = name;
        this.parent = parent;
        this.unnamedModule = new Module(this);
      	// 判断当前类加载器是否具备并行能力,如果具备则对parallelLockMap进行初始化
        if (ParallelLoaders.isRegistered(this.getClass())) {
            parallelLockMap = new ConcurrentHashMap<>();
            package2certs = new ConcurrentHashMap<>();
            assertionLock = new Object();
        } else {
            // no finer-grained lock; lock on the classloader instance
            parallelLockMap = null;
            package2certs = new Hashtable<>();
            assertionLock = this;
        }
        this.nameAndId = nameAndId(this);
    }
  
    protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
      	// 加锁,调用getClassLoadingLock方法获取类加载时的锁
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }

                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
    // 支持并行加载的关键
    // 并行加载的原理:
    // 如果当前类加载器是支持并行加载的，就把加载类时锁的粒度降低到加载的具体的某一个类上，而不是锁掉整个类加载器
    protected Object getClassLoadingLock(String className) {
      	// 默认(非并行)锁是自身
        Object lock = this;
        if (parallelLockMap != null) {
            // 并行，所就是每一个class一个对象
            Object newLock = new Object();
          	// k:要加载的类名 v:新的锁
            lock = parallelLockMap.putIfAbsent(className, newLock);
          	// 如果是第一次put,则返回newLock
            if (lock == null) {
                lock = newLock;
            }
        }
        return lock;
    }
}
```

## 参考
1. [SkyWalking8.7源码解析（一）：Agent启动流程、Agent配置加载流程、自定义类加载器AgentClassLoader、插件定义体系、插件加载](https://blog.csdn.net/qq_40378034/article/details/121882943)
