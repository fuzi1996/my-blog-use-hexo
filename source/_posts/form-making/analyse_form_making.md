---
title: 开源项目vue-form-making分析
tags:
  - vue-form-making
  - 表单设计器
date: 2021-09-11 08:54:11
categories: vue-form-making
---

[vue-form-making](https://github.com/GavinZhuLei/vue-form-making)是基于 vue2 和 element-ui 实现的可视化表单设计器。
其分为开源版本与收费版本。本文仅分析他的开源版本。分析版本为:`1.2.10`

![界面预览](/assets/images/vue-form-making/界面预览.png)

## 界面结构

[![表单设计器界面结构.drawio.png](/assets/images/vue-form-making/表单设计器界面结构.drawio.png)](/assets/drawio/vue-form-making/表单设计器界面结构.drawio)

## 名称与文件路径关系

| 名称         | 对应文件路径                     |
| ------------ | -------------------------------- |
| Container    | /src/components/Container.vue    |
| WidgetConfig | /src/components/WidgetConfig.vue |
| FormConfig   | /src/components/FormConfig.vue   |
| WidgetForm   | /src/components/WidgetForm.vue   |
| WidgetFormItem   | /src/components/WidgetFormItem.vue   |
| GenerateForm   | /src/components/GenerateForm.vue   |
| GenerateFormItem   | /src/components/GenerateFormItem.vue   |

## 各文件功能分析

[![表单设计器各文件功能.drawio.png](/assets/images/vue-form-making/表单设计器各文件功能.drawio.png)](/assets/drawio/vue-form-making/表单设计器各文件功能.drawio)

## 渲染时各文件功能

1. 即时预览时

[![表单设计器即时预览时各文件功能.drawio.png](/assets/images/vue-form-making/表单设计器即时预览时各文件功能.drawio.png)](/assets/drawio/vue-form-making/表单设计器即时预览时各文件功能.drawio)

`WidgetFormItem`为即时预览时组件最终渲染器。

2. 渲染时

[![表单设计器界面渲染时各文件功能.drawio.png](/assets/images/vue-form-making/表单设计器界面渲染时各文件功能.drawio.png)](/assets/drawio/vue-form-making/表单设计器界面渲染时各文件功能.drawio)

`GenerateFormItem`为渲染时组件最终渲染器。

## 渲染后数据改变流程

### 内部组件

[![表单设计器界面渲染时数据改变流程.drawio.png](/assets/images/vue-form-making/表单设计器界面渲染时数据改变流程.drawio.png)](/assets/drawio/vue-form-making/表单设计器界面渲染时数据改变流程.drawio)

1. `GenerateFormItem`中组件的数据`dataModel`发生改变,通过`update:models`修改上层组件的`models`数据,通过`input-change`事件触发`GenerateForm`的`onInputChange`方法
2. `GenerateForm`的`onInputChange`方法中通过`on-change`方法对外暴露组件数据改变事件

### 外部组件

引入`GenerateForm`使用`value` props 传入外部数据,`GenerateForm`与`GenerateFormItem`中通过`props`一层层向下传递，每一层通过`watch`监听数据