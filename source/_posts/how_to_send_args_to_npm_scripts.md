---
title: 怎样给npm scripts发送命令行参数
tags:
  - npm scripts
date: 2021-09-10 22:13:02
categories: npm
---

当我使用`hexo`创建一片新的文章时,需要使用命令,比如本篇文章就需要使用命令

```bash
hexo new page --path /_posts/how_to_send_args_to_npm_scripts how_to_send_args_to_npm_scripts
```

但我不想每次创建一篇新文章时都要敲这么长一串命令,而且命令中文章的标题`how_to_send_args_to_npm_scripts`是重复的
那么该怎么做呢？

## 将命令放入`package.json`中

`package.json`中`scripts`下面可以放置该命令

```js
{
  // 其他配置项忽略
  "scripts": {
    //其他命令忽略
    "new":"hexo new page --path /_posts/how_to_send_args_to_npm_scripts how_to_send_args_to_npm_scripts"
  },
  // 其他配置项忽略
}
```

但是我每次生成的文章标题都是不一样的，这该如何处理？

## 使`scripts`中命令动态化

我希望当我使用`npm run new`这个命令时,能供传入新创建的文章标题以及文件名,这就要使用命令行参数解析功能,可以将`scripts`中命令改为

```js
{
  // 其他配置项忽略
  "scripts": {
    //其他命令忽略
    //$npm_config_path $npm_config_title只在bash终端下有效
    //windows用户需要使用 %npm_config_path% %npm_config_title%
    "new":"hexo new page --path /_posts/$npm_config_path $npm_config_title"
  },
  // 其他配置项忽略
}
```

这样我只需使用`npm run new --path=how_to_send_args_to_npm_scritps --title=怎样向NPMScripts脚本发送参数`就可以生成一篇名为`how_to_send_args_to_npm_scritps.md`标题叫`怎样向NPMScripts脚本发送参数`的文章

## 进一步精简命令

可以新建以下脚本`./scripts/newPage.js`

```js
const exec = require('child_process').exec;

const args = process.argv.slice(2)


console.log('传入参数',args)

if(args.length != 2){
  return
}

const cmdStr = `hexo new page --path /_posts/${args[0]} "${args[1]}"`
exec(cmdStr, function(err,stdout,stderr){
  if(err) {
      console.log(stderr);
  } else {
      console.log(stdout);
  }
});
```

将`scripts`中`new`对应的脚本改为

```js
{
  // 其他配置项忽略
  "scripts": {
    //其他命令忽略
    "new":"node ./scripts/newPage.js"
  },
  // 其他配置项忽略
}
```

使用`npm run new how_to_send_args_to_npm_scritps 怎样向NPMScripts脚本发送参数`就可以生成一篇名为`how_to_send_args_to_npm_scritps.md`标题叫`怎样向NPMScripts脚本发送参数`的文章


## 参考

1. [npm scripts 使用指南](https://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)