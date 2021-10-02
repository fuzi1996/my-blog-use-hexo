---
title: 为VUE2工程添加JEST单元测试
tags:
  - vue2
  - jest Test
date: 2021-09-25 09:23:19
categories:vue2
---

现有一vue2工程(vue初始化工程,仅有`HelloWorld.vue`)，需要给它添加jest单元测试

## 添加unit-jest

使用命令

```bash
vue add unit-jest
```

给已有的工程添加单元测试

**测试**

可以观察到命令执行完成后

1. 会在`src/tests/unit`产生一个`example.spec.js`的文件,这个是测试`HelloWorld.vue`这个单VUE组件的
2. `package.json`的`devDependencies`中会添加涉及vue jest的依赖，`scripts`中会添加一个新的`test:unit`的命令

使用

```bash
npm run test:unit
```

就可以单测`HelloWorld.vue`，这个组件

## 部分特殊处理

### 针对webpack路径别名的配置

经过我的实测，`jest`单测是支持`@`路径别名的(得益于`node_modules\@vue\cli-service\lib\config\base.js`)
但是针对其他的别名，`jest`就不怎么支持了，需要我们自行配置。例如:

`vue.config.js`中配置了如下别名:

```js
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("public", resolve("public"));
  },
}
```

那么在`jest.config.js`中需要配置`moduleNameMapper`

```js
module.exports = {
  moduleNameMapper: {
    "^assets(.*)$": "<rootDir>/src/assets$1",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^public(.*)$": "<rootDir>/public$1"
  }
}
```

### 针对引入的样式文件与css模块

根据vue-test-utils官网[介绍](https://vue-test-utils.vuejs.org/guides/#detecting-styles)，当运行在jsdom上时，只能探测到内联样式

我们有以下组件:

```html
<template>
  <div class="msg" style="color:green;">
    {{msg}}
  </div>
</template>

<script>
import '@/src/css/style-msg.css'
export default {
  name: 'StyleMsg',
  props: {
    msg:{
      type:String,
      default:''
    }
  }
}
</script>
```

当单元测试的组件中有引入的css样式时，可以这么做[忽略样式配置](https://jestjs.io/docs/webpack#mocking-css-modules)

这么做是模拟了css的处理，本质还是没有引入样式

参考:

[使用 webpack](https://jestjs.io/zh-Hans/docs/webpack)
