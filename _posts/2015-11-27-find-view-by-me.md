---
title: 第一个插件：FindViewByMe
category: Android
---

FindViewByMe 是一个自动生成 FindViewById 代码的 IDEA/Android Studio 插件，支持 Activity、Fragment 和 ViewHolder 中的 findViewById 的代码生成。

该插件适用于 IntelliJ IDEA 和 Android Studio，以下说明以 Android Studio (简称 AS )为例。

#### 1. 下载和安装
- 主菜单依次选择 `File | Settings` ，打开设置对话框，选择 `Plugins`；
- 搜索框中输入 “findviewbyme” ,点击下面的“Browse”；

  ![](https://lc-qygvx1cc.cn-n1.lcfile.com/ed9e903a164b3de8.png)
  
- 在找到的结果中点击 “Install”，然后会提示重启 AS，重启就行了。

  ![](https://lc-qygvx1cc.cn-n1.lcfile.com/179220e48074f2e4.png)


#### 2. 基本使用
- 当你写完一个 layout 文件，在该文件编辑界面任意位置右键，发现菜单中有一个 `Find View By Me` 的选项；

![](https://lc-qygvx1cc.cn-n1.lcfile.com/4c8d9c9bc1a997b3.png)

- 点击后会出现 “FindViewByMe” 的对话框，如下所示:

![](https://lc-qygvx1cc.cn-n1.lcfile.com/fa8259e43ce35445.png)

- 在列表中勾选你需要生成代码的控件，下面就会出现对应的代码；
- 点击 “Copy Code” 按钮就可以将代码复制到剪切板了，在java文件中粘贴就行了。

#### 3. 添加 RootView
- 针对 Fragment 需要添加 rootView 这种，首先勾选 “Add RootView”；
- 然后在编辑框中输入 rootView 的名称，例 `contentView`；
- 最后点击添加，生成的代码就更新了。

#### 4. Adapter 中的 ViewHolder
- 勾选上 “Is ViewHolder” 就行了，代码就更新了；
- 这里的控件变量不再添加任何修饰符。
- 一些变量得自行去处理，这里不再赘述。

#### 5. 几点说明
- 控件变量的命名规则：变量命名是根据控件的id来的，例如 id 是 `edit_user_name` ，那么生成的变量名称就是 `editUserName`；
- 控件变量默认使用 `private` 修饰符；
- 关于添加“m”的问题，这个直接在兑换框中勾选 “Add “m”” 就行了，此时变量命名就变成`mEditUserName`。




