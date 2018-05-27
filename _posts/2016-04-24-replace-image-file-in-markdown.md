---
title: 自动化替换 Markdown 中的本地图片引用
category: Python
excerpt: 本文主要描述在 Markdown 写作中，通过 Python 脚本实现自动化替换引用的本地图片为图床中的外链，且对原图进行压缩(压缩前后图片显示效果差别很小)。并建立本地的图片外链数据库，优先根据文件 hash 值查询数据库中是否已存在外链。
---

>懒是第一生产力。——沃兹基苄德

我写 Markdown 有个习惯，总是将引用到的图片(截图或保存的)先压缩，然后上传到图床(云存储)上，生成外链，然后在 Markdown 中引用。因为国内的云存储服务访问速度相对 GitHub 较快，同时在使用 Markdown 源文件时，不必连同图片一起传送或移动。

因此就催生了该半自动化工具脚本（[GitHub 传送门](https://github.com/laobie/WriteMarkdownLazily)）的诞生。

实现的效果如下：

![](https://lc-qygvx1cc.cn-n1.lcfile.com/04d2ff5eadd5717d.jpg)

### 几点说明
- **图片压缩**：本文直接调用的是 [TinyPNG](https://tinypng.com/) 站点的 API，该站提供的压缩服务还是不错的，图片压缩率高，且压缩前后显示效果差别很小。对于开发者而言，该网站上相关文档也是相当齐全的。
- **图片上传**：我选择的是 [LeanCloud](https://leancloud.cn/) ，因为之前刚开始接触云存储选择了这个，后来就一直用了，国内的还可以选择七牛的云存储提供商( LeanCloud 文件存储实际用的也是七牛)，都有相关的开发文档的。
- **本地数据库存储**：脚本中会将文件的 hash 值和 url 储存到本地数据库 `ImageInfo.db` 中，避免相同问题多次压缩上传。

### 简单流程图
![](https://lc-qygvx1cc.cn-n1.lcfile.com/ffae3bc2fa108243.svg)

### 使用

1. 安装环境和依赖

   1. Python 2.7 环境，自行搜索
   2. 安装 `tinify` package，遇到问题可以看 [TinyPNG – API Reference](https://tinypng.com/developers/reference/python)：

	  ```
	  pip install --upgrade tinify
      ```
		
   3. 安装 `leancloud-sdk` package，遇到问题可以看 [LeanCloud Python Doc](https://leancloud.cn/docs/python_guide.html)：

	  ```bash
      pip install leancloud-sdk
      ```
	  or

	  ```
	  easy_install leancloud-sdk
	  ```
		
2. 填写你申请的相关 API KEY(在 `replace_image_in_md.py` 文件中填写)
	
   ```python
   TINY_API_KEY = "your_tiny_png_api_key"
   LEAN_CLOUD_API_ID = "your_lean_cloud_app_id"
   LEAN_CLOUD_API_KEY = "your_lean_cloud_api_key"
   ```
   [获取 TinyPNG api key](https://tinypng.com/developers)
	
   [获取 LeanCloud api key & id](https://leancloud.cn/)

3. 编写你的 Markdown 文件 并 引用本地图片文件，如下图所示:

   ```
   this is a image
   ![](img/monkey.jpg)
   ```

4. 使用自动化脚本:
	
   python replace_image_in_md.py your.md output.md
		
   执行完之后，本地图片的引用将会被替换成压缩后的图片的外链( url )，如下图所示：

   ```
   this is a image
   ![](https://lc-qygvx1cc.cn-n1.lcfile.com/a2ec3a2a375f8c61.jpg))
   ```

### 小技巧

如果你是 Linux 或 OS X 用户,你可以将该脚本放在一个固定的位置，然后在你的 `.bashrc` 或者 `.zshrc` 中添加类似下面的 alias：

```bash
alias lzmd="python ~/Develop/tools/lazymd/replace_image_in_md.py"
```
	
然后在你需要使用脚本的时候，在任何地方打开终端，输入 `lzmd` 即可：

```bash
lzmd your.md output.md
```

### 最后
感谢基友 [Brucezz](https://github.com/brucezz) 在开发中提供的帮助。

[项目 GitHub 地址](https://github.com/laobie/WriteMarkdownLazily)

第一次发 Python 开源项目，本身 Python 就比较菜，如果你有任何建议或意见，请在 GitHub 提 issue 或 pr，或者评论给我留言，谢谢~
