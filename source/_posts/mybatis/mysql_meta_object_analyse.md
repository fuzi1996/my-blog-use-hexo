---
title: Mybatis MetaObject分析
tags:
  - mybatis
  - metaobject
date: 2022-07-02 13:06:59
categories: mybatis
---

`MyBatis`中的`MetaObject`是`MyBatis`中的反射工具,可以使用`MetaObject`完成获取值和设值的任务

**本文基于MyBatis 3.5.7**

## 作用

根据路径获取值和设值

```java
User user = buildUser();

MetaObject metaObject = SystemMetaObject.forObject(user);

// 查找user对象中第一个tag的创建者姓名
Object value = metaObject.getValue("tags[0].creator.name");
// Creator-0
System.out.println(value);

metaObject.setValue("tags[0].creator.name","CreatorName");

value = metaObject.getValue("tags[0].creator.name");
// CreatorName
System.out.println(value);
```

## 结构

![meta_object_struct](/assets/images/mybatis/meta_object_struct.drawio.png)

这里面最主要的就是`ObjectWrapper`,而`ObjectWrapper`主要分为以下几类

- Bean Wrapper
- Map Wrapper
- Collection Wrapper
- 自定义 Wrapper

### Bean Wrapper

`BeanWrapper`中`MetaClass`是`MyBatis`类反射工具类,使用它可以非常方便的使用`java`反射而无须担心访问权限的问题.

`BeanWrapper`本质上就是根据字符串递归利用反射使用`get`,`set`来获取值和设置值.

### Map Wrapper

逻辑与`BeanWrapper`基本一致

### Collection Wrapper

这个类非常简单，因为它的绝大多数操作都会直接抛出异常

可是当我们使用`tags[0]`时是可以取值的，这是为什么?

因为在我们使用`tags[0]`时走的是`MapWrapper`和`BeanWrapper`共同父类`BaseWrapper`的逻辑而不是`ColleactionWrapper`

### 自定义 Wrapper

- 确定自定义类

```java
class CustomObject{
  public String name;

  public CustomObject(String name){
    this.name = name;
  }
}
```

- 定义CustomObjectWrapper

```java
// 这里代码很多但是最主要的就是一个get,一个set
class CustomObjectWrapper implements ObjectWrapper{

  private CustomObject object;

  public CustomObjectWrapper(CustomObject object){
    this.object = object;
  }

  @Override
  public Object get(PropertyTokenizer prop) {
    System.out.println("get");

    if(prop.getName().equals("name")){
      return this.object.name;
    }
    return null;
  }

  @Override
  public void set(PropertyTokenizer prop, Object value) {
    System.out.println("set");
    if(prop.getName().equals("name")){
      this.object.name = (String) value;
    }
  }

  @Override
  public String findProperty(String name, boolean useCamelCaseMapping) {
    System.out.println("findProperty");
    return null;
  }

  @Override
  public String[] getGetterNames() {
    System.out.println("getGetterNames");
    return new String[0];
  }

  @Override
  public String[] getSetterNames() {
    System.out.println("getSetterNames");
    return new String[0];
  }

  @Override
  public Class<?> getSetterType(String name) {
    System.out.println("getSetterType");
    return null;
  }

  @Override
  public Class<?> getGetterType(String name) {
    System.out.println("getGetterType");
    return null;
  }

  @Override
  public boolean hasSetter(String name) {
    System.out.println("hasSetter");
    return false;
  }

  @Override
  public boolean hasGetter(String name) {
    System.out.println("hasGetter");
    return false;
  }

  @Override
  public MetaObject instantiatePropertyValue(String name, PropertyTokenizer prop, ObjectFactory objectFactory) {
    System.out.println("instantiatePropertyValue");
    return null;
  }

  @Override
  public boolean isCollection() {
    System.out.println("isCollection");
    return false;
  }

  @Override
  public void add(Object element) {
    System.out.println("element");
  }

  @Override
  public <E> void addAll(List<E> element) {
    System.out.println("addAll");
  }
}
```

- 定义CustomObjectWrapperFactory

```java
class CustomObjectWrapperFactory implements ObjectWrapperFactory{

  @Override
  public boolean hasWrapperFor(Object object) {
    return object instanceof CustomObject;
  }

  @Override
  public ObjectWrapper getWrapperFor(MetaObject metaObject, Object object) {
    return new CustomObjectWrapper((CustomObject)object);
  }
}
```

- 测试代码

```java
@Test
public void test() {
  CustomObject customObject = new CustomObject("名字");
  CustomObjectWrapperFactory customObjectWrapperFactory = new CustomObjectWrapperFactory();
  
  // ObjectFactory和DefaultReflectorFactory使用默认的
  ObjectFactory DEFAULT_OBJECT_FACTORY = new DefaultObjectFactory();
  DefaultReflectorFactory defaultReflectorFactory = new DefaultReflectorFactory();
  
  MetaObject metaObject = MetaObject.forObject(customObject,DEFAULT_OBJECT_FACTORY,customObjectWrapperFactory,defaultReflectorFactory);
  Object name = metaObject.getValue("name");
  System.out.println(name);

  metaObject.setValue("name","名称1");
  name = metaObject.getValue("name");
  System.out.println(name);
}
```

