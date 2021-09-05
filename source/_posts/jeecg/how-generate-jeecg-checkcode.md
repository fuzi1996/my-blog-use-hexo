---
title: jeecg 2.4.6 如何生成验证码
date: 2021-9-5 19:33:00
tags:
- 验证码生成
- jeecg
categories: jeecg
---

## 验证码是怎么来的？

前端地址:

`src\views\user\LoginAccount.vue`

## 前台请求

- 前台请求地址：http://127.0.0.1:3000/jeecg-boot/sys/randomImage/1585981360936?_t=1585981360

- 携带参数：_t: 1585981360

- 返回参数：

```js
  {
    "success": true,
    "message": "操作成功！",
    "code": 0,
    "result": "data:image/jpg;base64,xxxx..",
    "timestamp": 1585981360953
  }
```

## 获取验证码前端

```js
handleChangeCheckCode(){
  // 缓存当前时间戳
  this.currdatetime = new Date().getTime();
  this.model.inputCode = ''
  getAction(`/sys/randomImage/${this.currdatetime}`).then(res=>{
    if(res.success){
      this.randCodeImage = res.result
      this.requestCodeSuccess=true
    }else{
      this.$message.error(res.message)
      this.requestCodeSuccess=false
    }
  }).catch(()=>{
    this.requestCodeSuccess=false
  })
}
```

我们得知，/sys/randomImages后面跟的是当前时间戳，且前台会把当前时间戳记录下来；至于_t，我猜是为了防止请求缓存，携带的随机数

由下面图片得到验证(`地址:src\utils\request.js`)

![request_js](/assets/images/jeecg/request_js.png)

## 验证码后台

![LoginController_java_randomImage](/assets/images/jeecg/LoginController_java_randomImage.png)

文件地址:

org.jeecg.modules.system.controller.LoginController#randomImage

```java
String code = RandomUtil.randomString(BASE_CHECK_CODES,4);
String lowerCaseCode = code.toLowerCase();
String realKey = MD5Util.MD5Encode(lowerCaseCode+key,"utf-8");
//存redis
redisUtil.set(realKey,lowerCaseCode,60);
//获取验证码照片
String base64 = RandImageUtil.generate(code);
res.setSuccess(true);
res.setResult(base64);
```

### 验证码照片生成RandImageUtil.generate

org.jeecg.modules.system.util.RandImageUtil#generate(java.lang.String)

```java
//RandImageUtil主要是这句产生随机验证码图片
BufferedImage image = getImageBuffer(resultCode);
```

`getImageBuffer`方法如下


```java
private static BufferedImage getImageBuffer(String resultCode){
        // 在内存中创建图象
        final BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        // 获取图形上下文
        final Graphics2D graphics = (Graphics2D) image.getGraphics();
        // 设定背景颜色
        graphics.setColor(Color.WHITE); // ---1
        // 填充矩形
        graphics.fillRect(0, 0, width, height);
        // 设定边框颜色
        // graphics.setColor(getRandColor(100, 200)); // ---2
        graphics.drawRect(0, 0, width - 1, height - 1);

        final Random random = new Random();
        // 随机产生干扰线，使图象中的认证码不易被其它程序探测到
        for (int i = 0; i < count; i++) {
            graphics.setColor(getRandColor(150, 200)); // ---3

            final int x = random.nextInt(width - lineWidth - 1) + 1; // 保证画在边框之内
            final int y = random.nextInt(height - lineWidth - 1) + 1;
            final int xl = random.nextInt(lineWidth);
            final int yl = random.nextInt(lineWidth);
            graphics.drawLine(x, y, x + xl, y + yl);
        }
        // 取随机产生的认证码
        for (int i = 0; i < resultCode.length(); i++) {
            // 将认证码显示到图象中,调用函数出来的颜色相同，可能是因为种子太接近，所以只能直接生成
            // graphics.setColor(new Color(20 + random.nextInt(130), 20 + random
            // .nextInt(130), 20 + random.nextInt(130)));
            // 设置字体颜色
            graphics.setColor(Color.BLACK);
            // 设置字体样式
            // graphics.setFont(new Font("Arial Black", Font.ITALIC, 18));
            graphics.setFont(new Font("Times New Roman", Font.BOLD, 24));
            // 设置字符，字符间距，上边距
            graphics.drawString(String.valueOf(resultCode.charAt(i)), (23 * i) + 8, 26);
        }
        // 图象生效
        graphics.dispose();
        return image;
}
```