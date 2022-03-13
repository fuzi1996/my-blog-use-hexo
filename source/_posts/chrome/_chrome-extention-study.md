---
title: Chrome插件开发
tags:
  - Chrome插件
date: 2021-12-18 00:24:01
categories: Chrome插件
---

## manifest.json

```js
{
  // Required
  // 清单文件的版本
  "manifest_version": 3,
  // 插件的名称
  "name": "My Extension",
  // 插件的版本
  "version": "versionString",

  // Recommended
  "action": {...},
  "default_locale": "en",
  // 插件描述
  "description": "A plain text description",
  // 图标
  "icons": {
    "16": "img/icon.png",
		"48": "img/icon.png",
		"128": "img/icon.png"
  },

  // Optional
  "author": ...,
  "automation": ...,
  // 会一直常驻的后台JS或后台页面
  "background": {
    // Required
    "service_worker": "background.js",
    // Optional
    "type": ...
  },
  "chrome_settings_overrides": {...},
  // 覆盖浏览器默认页面
  "chrome_url_overrides": {...},
  "commands": {...},
  "content_capabilities": ...,
  // 需要直接注入页面的JS
  "content_scripts": [{...}],
  "content_security_policy": {...},
  "converted_from_user_script": ...,
  "cross_origin_embedder_policy": {"value": "require-corp"},
  "cross_origin_opener_policy": {"value": "same-origin"},
  "current_locale": ...,
  "declarative_net_request": ...,
  // devtools页面入口，注意只能指向一个HTML文件，不能是JS文件
  "devtools_page": "devtools.html",
  "differential_fingerprint": ...,
  "event_rules": [{...}],
  "externally_connectable": {
    "matches": ["*://*.example.com/*"]
  },
  "file_browser_handlers": [...],
  "file_system_provider_capabilities": {
    "configurable": true,
    "multiple_mounts": true,
    "source": "network"
  },
  // 插件主页
  "homepage_url": "https://path/to/homepage",
  "host_permissions": [...],
  "import": [{"id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}],
  "incognito": "spanning, split, or not_allowed",
  "input_components": ...,
  "key": "publicKey",
  "minimum_chrome_version": "versionString",
  "nacl_modules": [...],
  "natively_connectable": ...,
  "oauth2": ...,
  "offline_enabled": true,
  // 向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字
  "omnibox": {
    "keyword": "aString"
  },
  "optional_permissions": ["tabs"],
  // Chrome40以后的插件配置页写法，如果2个都写，新版Chrome只认后面这一个
  "options_page": "options.html",
  "options_ui": {
    "chrome_style": true,
    "page": "options.html"
  },
  // 权限申请
  "permissions": [
    "contextMenus", // 右键菜单
		"tabs", // 标签
		"notifications", // 通知
		"webRequest", // web请求
		"webRequestBlocking",
		"storage", // 插件本地存储
		"http://*/*", // 可以通过executeScript或者insertCSS访问的网站
		"https://*/*" // 可以通过executeScript或者insertCSS访问的网站
  ],
  "platforms": ...,
  "replacement_web_app": ...,
  "requirements": {...},
  "sandbox": [...],
  "short_name": "Short Name",
  "storage": {
    "managed_schema": "schema.json"
  },
  "system_indicator": ...,
  "tts_engine": {...},
  "update_url": "https://path/to/updateInfo.xml",
  "version_name": "aString",
  // 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
  "web_accessible_resources": [...]
}
```

## content-scripts

Chrome插件中向页面注入脚本的一种形式,通过配置的方式轻松向指定页面注入JS和CSS

content-scripts和原始页面共享DOM，但是不共享JS，如要访问页面JS（例如某个JS变量），只能通过injected js来实现

content-scripts不能访问绝大部分chrome.xxx.api，除了下面这4种：

```js
chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
chrome.i18n
chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
chrome.storage
```

## background

通过chrome-extension://xxx/background.html直接打开后台页，但是你打开的后台页和真正一直在后台运行的那个页面不是同一个，换句话说，你可以打开无数个background.html，但是真正在后台常驻的只有一个，而且这个你永远看不到它的界面，只能调试它的代码

### event-pages

它与background的唯一区别就是多了一个persistent参数

在被需要时加载，在空闲时被关闭，什么叫被需要时呢？比如第一次安装、插件更新、有content-script向它发送消息

## popup

点击browser_action或者page_action图标时打开的一个小窗口网页，焦点离开网页就立即关闭，一般用来做一些临时性的交互

它和background非常类似，它们之间最大的不同是生命周期的不同，popup中可以直接通过chrome.extension.getBackgroundPage()获取background的window对象

## injected-script

在content-script中通过DOM方式向页面注入inject-script

```js
// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.head.appendChild(temp);
}
// 配置文件中
{
	// 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
	"web_accessible_resources": ["js/inject.js"],
}
```


## 参考

1. [Chrome原始文档](https://developer.chrome.com/docs/extensions/mv3/manifest/)
2. [Chrome插件(扩展)开发全攻略](http://blog.haoji.me/chrome-plugin-develop.html)