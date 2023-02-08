---
title: ElFormItem使用v-if导致校验异常问题
tags:
  - vue
  - element-ui
date: 2022-12-18 12:51:46
categories:
---

## 环境信息

```txt
vue: `2.6.14`
element-ui: `2.15.12`
```

## 问题描述

当使用`v-if`控制多个`ElFormItem`显隐时，表单校验不生效。

不生效体现在两点:

- 1.使用`elform.validate`显式调用无效
- 2.`blur/change`无法触发的校验

这里有几个关键:

- 使用`v-if`控制
- 多个`ElFormItem`
- 先展示的是不进行校验的`ElFormItem`
- 不进行校验的`ElFormItem`数量多余进行校验的`ElFormItem`

## 原因

### 使用`elform.validate`显式调用无效

先展示的`ElFormItem`不带`prop`导致`mounted`阶段没有向`ElForm`注册自身示例.

`v-if`组件缓存,导致显式调用`elForm.validate`找不到后面展示的`ElFormItem`示例

针对这个问题直接在`el-form-item`标签上添加`prop`即可解决

### `blur/change`无法触发的校验

`v-if`组件缓存,导致复用了先前展示的`ElFormItem`实例,而由于先前展示的`ElFormItem`是非必填的,
所以复用的实例并没有绑定`el.form.blur`与`el.form.change`事件(`ElFormItem`的`addValidateEvents`方法),进而导致`blur/change`无法触发的校验

针对这个问题直接在`el-form-item`标签上添加`key`即可解决

## 示例

```
<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
  >
    <!-- <el-form-item
      label="活动名称2"
      prop="name2"
      key="name2"
      v-if="show2"
    >
      <el-input v-model="ruleForm.name2" />
    </el-form-item>
    <el-form-item
      label="活动名称5"
      prop="name5"
      key="name5"
      v-if="show2"
    >
      <el-input v-model="ruleForm.name5" />
    </el-form-item> -->
    <el-form-item
      label="活动名称2"
      prop="name2"
      v-if="show2"
    >
      <el-input v-model="ruleForm.name2" />
    </el-form-item>
    <el-form-item
      label="活动名称5"
      prop="name5"
      v-if="show2"
    >
      <el-input v-model="ruleForm.name5" />
    </el-form-item>
    <el-form-item
      label="活动名称3"
      prop="name3"
      v-if="show34"
    >
      <el-input v-model="ruleForm.name3" />
    </el-form-item>
    <el-form-item
      label="活动名称4"
      prop="name4"
      v-if="show34"
    >
      <el-input v-model="ruleForm.name4" />
    </el-form-item>
    <el-button
      type="primary"
      @click="show2=!show2;show34=!show34"
    >
      SHOW2-SHOW34
    </el-button>
    <el-button
      type="primary"
      @click="submitForm('ruleForm')"
    >
      提交
    </el-button>
    <el-button @click="resetForm('ruleForm')">
      重置
    </el-button>
  </el-form>
</template>

<script>
export default {
  name: 'Root',
  data () {
    return {
      show2: true,
      show34: false,
      ruleForm: {
        name1: '',
        name2: '',
        name3: '',
        name4: ''
      },
      rules: {
        name3: [
          { required: true, message: '请输入活动名称3', trigger: 'blur' }
        ],
        name4: [
          { required: true, message: '请输入活动名称4', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.ruleForm = { ...this.$options.data().ruleForm }
      this.$refs[formName].resetFields()
    }
  }
}
</script>
```