---
title: mUrl：自动生成 Markdown 格式的链接
category: Chrome Extension
excerpt: mUrl 是一个 Chrome 插件，打开一个网页，然后点插件，此时 Markdown 格式的链接就复制到剪切板上了，直接粘贴到 Markdown 文件中即可。
---

因为懒，花了半个下午时间开发了一个 Chrome 插件，第一次接触这方面东西，写个博客记录下开发过程。

### 需求来源

写 Markdown 的时候可能都有这样一个需求：

我们需要插入一个文章链接，格式为 Markdown 的格式，例如这样的一个链接：

[http://jaeger.itscoder.com](http://jaeger.itscoder.com/)

访问之后，假如我们需要将这个地址直接插入到 Markdown 中，格式如下：

````markdown
[写代码的猴子](http://jaeger.itscoder.com)
````

在没一个方便的工具之前，我们只能通过两次复制来解决：

- 复制对应的 url：`http://jaeger.itscoder.com/`
- 复制该 url 对应的标题：写代码的猴子

这样的重复性工作对于开发者来说，一点都不酷。因此就催生了 mUrl 插件的诞生。

### 插件成果

![](http://ac-QYgvX1CC.clouddn.com/d93799d12d3dfe2f.png)

- 源码地址：[laobie/mUrl: a chrome extension: get website url for markdown writer](https://github.com/laobie/mUrl)

- Chrome 商店地址：[mUrl \- Chrome Web Store](https://chrome.google.com/webstore/detail/murl/nmhkegedgpbbkcicjgcnbjebdjedljgl?utm_source=chrome-ntp-icon)

- 使用方法：

  - 在 Chrome 应用商店添加插件 mUrl；

  - 将 mUrl 放置到地址栏右边，如下所示：

    ![](http://ac-QYgvX1CC.clouddn.com/a74423d1aadad5c3.jpg)

  - 打开一个网页，然后点这个插件，此时 Markdown 格式的链接就已经复制到剪切板上了，直接粘贴到 Markdown 文件中即可

### 开发过程

[Getting Started: Building a Chrome Extension](https://developer.chrome.com/extensions/getstarted)

这是官方提供的 Chrome 插件的教程，跟着教程来的话你就可以创建一个你自己的插件，不过官方的例子由于墙的原因，我并没有成功开发出来（伟大的 GFW）。

接下来就以 mUrl 项目为例，讲解下如何开发一个 Chrome 插件。

0. **准备工作**
   - 一个文本编辑器
   - Chrome 浏览器


1. **项目结构**

   新建一个项目文件夹，我这里创建了一个 `mUrl` 的文件夹，该文件夹为插件的根目录，里面包含以下文件：

   - `manifest.json` 项目配置文件，包含一些插件的基本信息

   - `murl_icon.png` 插件图标文件

   - `popup.html` 插件启动时显示的窗体布局

   - `popup.js` 执行相关逻辑的 JavaScript 脚本

   接下来就对这些文件的作用和具体开发过程进行讲解。

2. **manifest.json**

   ```json
   {
     "manifest_version": 2,

     "name": "mUrl",
     "description": "This extension get url for Markdown writer",
     "version": "0.1",

     "browser_action": {
       "default_icon": "murl_icon.png",
       "default_popup": "popup.html",
       "default_title":"Get Url For Markdown writer"
     },
     "icons": {
       "16":"asset/murl_16.png",
       "48":"asset/murl_48.png",
       "128": "asset/murl_128.png"
     },
     "permissions": [
       "activeTab"
     ]
   }
   ```

   这是一个 JSON 格式的文件，其中：

   - `manifest_version`:  一般默认是 2，不用改动
   - `name`: 插件的名称，会显示在 Chrome 商店中
   - `description`: 插件描述
   - `version`: 插件版本号，升级的时候需要更新
   - `browser_action`:  和浏览器相关的

     - `default_icon`: 显示在地址栏上的图标，19 * 19 的 png 格式的图片

     - `default_popup`: 一个 HTML 文件，点击插件式弹出来的界面

     - `default_title`: 鼠标移动到图标上显示的提示
   - `icons`: 图标，对应的数字对应图标的大小，这几个尺寸的图标不是必须的，但是为了保证图标显示正常，建议添加这几个尺寸的图标。
   - `permissions`: 插件需要的权限，例如读取网页内容的权限，mUrl 只需要获取到当前 tab 的信息，所以只需要添加一个权限。

3. **murl_icon.png** 

   插件的图标文件，在 `manifest.json` 使用 `default_icon` 定义的，大小是 19 * 19，格式为 png 的图片。

4. **popup.html** 

   ```html
   <!doctype html>
   <html>
   <head>
       <title>Copy Url For Markdown</title>
       <style>
           body {
               font-family: "Segoe UI", "Lucida Grande", Tahoma, sans-serif;
               font-size: 100%;
           }
       </style>
       <script src="popup.js"></script>
       <script src="clipboard.js"></script>
   </head>
   <body>

   <small id="msg_text"></small>
   <input id="md_format_url" value="test">
   <button class="btn" id="btn_copy" data-clipboard-target="#md_format_url">copy</button>

   </body>
   </html>
   ```

   就是一个简单的 HTML 文件，其中需要指定下需要使用的 **JavaScript** 文件，比如 mUrl 使用了:

   - popup.js

   - clipboard.js

   这两个文件，就通过以下进行了声明：

   ```html
   <script src="popup.js"></script>
   <script src="clipboard.js"></script>
   ```

   这里需要注意的是，在官方给的 [popup\.html](view-source:https://developer.chrome.com/extensions/examples/tutorials/getstarted/popup.html) 中有这样的一段注释：

   > JavaScript and HTML must be in separate files: see our Content Security Policy documentation for details and explanation.

   出于安全性的考虑， JavaScript 文件必须和 HTML 文件分开，而不能为了方便直接在 HTML 文件中执行 JavaScript 脚本。

   在 `body` 中我放置了三个元素：

   - small: 用来显示复制结果的信息

   - input: 输入框，用来填写 Markdown 格式的链接文本

     因为需要复制到剪切板，我使用了一个 [zenorocha/clipboard\.js](https://github.com/zenorocha/clipboard.js) 这个项目中的 js 代码，需要从一个元素中复制文本，因此只能添加一个输入框，给输入框设置文本内容，然后复制。

   - button: 一个按钮，用来复制上面的输入框中的文本，后面使用 JavaScript 自动点击这个按钮，实际上也不需要手动去复制。需要注意到还给 button 添加了一个 `data-clipboard-target` 属性，这是使用 `clipboard.js` 需要设置的属性，在点这个按钮的时候，自动取上面提到 input 输入框的内容，复制到剪贴板。

5. **popup.js**

   在讲解 popup.js 内容之前，先说一下开发时遇到的一个问题：

   因为需要在点击插件时自动将得到的 Markdown 格式的链接复制到剪贴板上，对于我这个 JavaScript 还没入门的新手来说并不是那么容易，好在通过 Google 搜索了一圈之后，找到了 [zenorocha/clipboard\.js](https://github.com/zenorocha/clipboard.js)  这项目，解决了这个问题。关于这个项目的具体使用细节可以阅读项目的 README，本文不再赘述。

   ```javascript
   function getCurrentTabInfo(callback) {
       var queryInfo = {
           active: true,
           currentWindow: true
       };

       chrome.tabs.query(queryInfo, function (tabs) {
           var tab = tabs[0];
           callback(tab.title, tab.url);
       });
   }

   document.addEventListener('DOMContentLoaded', function () {
       getCurrentTabInfo(function (title, url) {
           var msgText = document.getElementById("msg_text");
           msgText.style.display = "none";
           var inputText = document.getElementById("md_format_url");
           var copyBtn = document.getElementById("btn_copy");
           var clipboard = new Clipboard('.btn');
           clipboard.on('success', function (e) {
               console.log(e);
               inputText.style.display = "none";
               copyBtn.style.display = "none";
               msgText.textContent = "success";
               msgText.style.display = "block";
           });
           clipboard.on('error', function (e) {
               console.log(e);
               alert(e);
           });
         	// 替换标题中的特殊字符，例如“[]()”等
           title = title.replace(/[|\\`*_{}\[\]()#+\-.!]/g, '\\$&');
         	// 拼接 Markdown 格式的链接字符串
           inputText.value = "[" + title + "](" + url + ")";
           copyBtn.click();
       });
   });
   ```

   popup.js 的代码应该也不难理解：

   -  `getCurrentTabInfo()` 函数：获取到当期激活的 Tab 的 url 和 title 信息，后面拼接链接需要使用。

   -  `document.addEventListener('DOMContentLoaded', function () {}`

        添加页面加载监听，页面加载时，调用 `getCurrentTabInfo()` 函数，获得当前 Tab 的标题和 url：

      - 先获取到之前添加的三个原色，并进行显示和隐藏的设置

      - 创建一个 Clipboard 对象，用来复制格式化之后的链接

      - 设置复制成功和出错的监听，在复制成功时，将 输入框 和 按钮 隐藏，只显示 『success』文本，复制出错时则弹一个对话框。

      - 在拼接 Markdown 格式的链接字符串之前，先对标题中的特殊字符进行了替换，例如 ”[“、”]” 等。

      - 自动点击 **复制** 按钮，将文本复制到剪切板，复制成功，就会响应上面设置 **复制成功** 的监听事件。

6. 因为项目使用到了 `clipboard.js` ，所以需要将该 JavaScript 文件也放置到项目文件夹中。


至此，整个项目基本搞定了，接下来就是运行测试了。

### 运行和发布

1. 运行

   - 在 Chrome 中打开：[chrome://extensions/](chrome://extensions/)

   - 打开开发者模式，选择项目文件夹，加载插件

     ![](http://ac-QYgvX1CC.clouddn.com/0a56fe81d8cbdf25.jpg)

   - 上一步没报错的话，插件就加载成功了，这是你就可以点击插件图标测试下功能是否正常了。

   - 注意到 **加载已解压的扩展程序** 右边有一个 **打包扩展程序** 的按钮，点击这个：

     ![](http://ac-QYgvX1CC.clouddn.com/df023de5b50d4617.jpg)

     私有密钥文件第一次可以不选，在第一次打包之后就会自动生成一个 .gem 后缀的私有密钥文件，下次更新插件时需要选择这个密钥文件。

     打包会生成一个 .crx 格式的文件，这个就是插件的安装文件，发送给其他人，安装上之后就可以使用该插件了。

2. 发布到 Chrome 应用商店

   在 [Developer Dashboard \- Chrome Web Store](https://chrome.google.com/webstore/developer/dashboard?utm_source=chrome-ntp-icon) 按照步骤先注册一个开发者帐号，需要支付 $5 ，如果你没 VISA 的信用卡之类的，可能就比较麻烦了。

   注册好开发者帐号后，[Upload \- Developer Dashboard](https://chrome.google.com/webstore/developer/update?utm_source=chrome-ntp-icon&publisherId=g03303820154321143420) 在这个页面按照下面的说明，上传项目的源文件，填写上相关的信息，就可以了，页面上说明很齐全，这里不多讲解了。

   发布到 Chrome 应用商店之后，别人就可以直接从商店下载安装你开发的插件了。

   ​

最后，再提一下 mUrl 的插件源码地址：[laobie/mUrl](https://github.com/laobie/mUrl)，欢迎提 PR 和建议。


### 参考资料

- [Chrome插件（Extensions）开发攻略 \- guogangj \- 博客园](http://www.cnblogs.com/guogangj/p/3235703.html)

- [纯JavaScript实现的复制剪切库–clipboard\.js \| Specs' Blog\-就爱PHP](http://9iphp.com/web/javascript/js-copy-library-clipboard-js.html)

- [Getting Started: Building a Chrome Extension \- Google Chrome](https://developer.chrome.com/extensions/getstarted)

- [ku/CreateLink: Make Link alternative to chrome](https://github.com/ku/CreateLink)
