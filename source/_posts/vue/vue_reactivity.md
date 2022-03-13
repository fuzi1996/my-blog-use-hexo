---
title: Vue2响应式与依赖收集原理
tags:
  - Vue
  - Vue2 reactivity
  - Vue 依赖收集
date: 2022-03-11 22:03:37
categories: Vue
---

## 响应式

Vue2的响应式依赖`ES5`的`Object.defineProperty`,主要使用这个API改写对象的`Getter`与`Setter`,用来依赖收集与触发更新

## 依赖收集原理

```js

// 工具函数用来判断obj是不是一个object
function isObject (obj) {
    return typeof obj === 'object'
      && !Array.isArray(obj)
      && obj !== null
      && obj !== undefined
}

// `observe`函数用来把一个普通的对象转为响应式对象
function observe (obj) {
  if (!isObject(obj)) {
    throw new TypeError()
  }

  Object.keys(obj).forEach(key => {
    let internalValue = obj[key]
    // 每一个属性都有一个独立的依赖收集器
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      get () {
        // 这里用来收集依赖
        dep.depend()
        return internalValue
      },
      set (newValue) {
        const isChanged = internalValue !== newValue
        if (isChanged) {
          internalValue = newValue
          // 如果修改了值,这里用来通知修改
          dep.notify()
        }
      }
    })
  })
}

window.Dep = class Dep {
  constructor () {
    this.subscribers = new Set()
  }

  depend () {
    if (activeUpdate) {
      // register the current active update as a subscriber
      this.subscribers.add(activeUpdate)
    }
  }

  notify () {
    // run all subscriber functions
    this.subscribers.forEach(subscriber => subscriber())
  }
}

// activeUpdate是一个运行函数
let activeUpdate

// 这只是依赖收集的简单示例，示例代码还是存在不少问题的
function autorun (update) {
  // 函数wrappedUpdate这里使用闭包,保存了update方法
  function wrappedUpdate () {
    activeUpdate = wrappedUpdate
    update()
    activeUpdate = null
  }
  wrappedUpdate()
}

```
