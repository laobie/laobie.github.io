---
title: Android 编码规范
category: Android
---

在开发中，遵循良好的编码规范，不仅仅可以提高代码的可读性，减小出错的可能性，同时也降低与其他开发者交流的成本，易于他人的维护与协作。
本文简单总结了 Android 开发中的一些代码规范，供开发者参考。

	
### 基本要求
 - 除了注释，代码中不出现中文
 - 每个类写上必要的注释，类的说明，作者，联系方式
 - 方法加上必要的注释说明，方便以后维护
 
### 包管理
1. base: 存放基础类的包，里面的类以 `Base` 为前缀，例如 `BaseActivity`；
2. activity: 存放 activity 的包，每个 activity 命名以Activity结尾，例如 `MainActivity`;
3. fragment: 存放 fragment的包，每个 fragment 命名以 Fragment 结尾，例如 `ChatFragment`;
4. receiver: 存放 receiver 的包；
5. service: 存放 service 的包；
6. adapter: 存放 adapter 的包，每个 adapter 命名以 Adapter 结尾，例如 `EventItemAdapter`;
7. common: 存放一些公共常量，例如后端接口、`SharedPreferenceKey`、`IntentExtra` 等;
8. utils: 存放工具类的包，比如常见的工具类：`LogUtils`、`DateUtils`；
9. entity: 存放实体类的包；
10. widget: 存放自定义View的包；

以上是一些常见的包，但不局限于此，视项目的具体情况而定。
	
### 命名
**大驼峰命名 (UpperCamelCase) ：每个单词的第一个字母都大写。**

**小驼峰命名 (lowerCamelCase) ：除第一个单词以外，每一个单词的第一个字母大写。**

 
**命名的基本原则:**

-  尽可能地使用统一的命名规范；
-  不使用汉语拼音；
-  除了常见的英文缩写，尽量少地使用缩写；

##### 1. 包命名 
   - 小写字母，参见上文包管理；
   - 连续的单词直接连接起来，不使用下划线； 
   
##### 2. Java 类命名
   - 大驼峰命名 `UserListAdapter`；
   - 除常见的缩写单词以外，不使用缩写，缩写的单词每个字母都大写 `RequesURLList`；
   - 公共的工具类建议以 `Utils`、 `Manager` 为后缀，如 `LogUtils`；
   - 接口命名遵循以上原则，以 `able` 或 `ible` 为后缀；

##### 3. 变量命名
- 成员变量命名
   - 小驼峰命名；
   - 不推荐使用谷歌的前面加 m 的编码风格（如果使用团队中使用 m ，则统一使用）；
-  常量命名
   - 单词每个字母均大写；
   - 单词之间下划线连接；
-  控件变量命名
   - 小驼峰命名；
   - 建议使用 `控件缩写+逻辑名称` 格式，例如 `tvPostTitle`、`etUserName`；
   - 对应的控件的 id 的命名`控件缩写_逻辑名称`，单词均小写，用下划线连接，例如：`tv_post_title`、`et_user_name`；
   - 常见的控件缩写如下：

|	控件        |    缩写	   |
|:----------:|:------------:|
|  Linearlayout  |  ll         |
|  RelativeLayout|  rl         |
|  TextView      |  tv         |
|  EditText      |  et         |
|  Button        |  btn     	|	
|  ImageView     |  iv         |
|  CheckBox      |  chb         |
|  ListView      |  lv         |
|  GridView      |  gv         |
|  RadioButton   |  rb         |

##### 4. 方法命名
- 小驼峰命名；
- Getter 和 Setter 方法，推荐使用自动生成的，写起来也很方便。注意，bool 类型的变量 Getter 方法写成 `isTrue` 这种；
- 方法名应当保证见名知义的原则，尽量不使用 `or` 或者 `and` ，遵循 “do one thing” 原则；

##### 5. 布局文件命名
- activity、fragment 布局文件名以对应的类别名称为前缀，逻辑名称放在其后，以下划线连接，例如 `activity_home`、`fragment_chat_list`，方便查找；
- ListView、GridView 的 item 布局文件建议以 `list_item`、`gird_item`为前缀，加上对应的逻辑名称，例如 `list_item_post`、`grid_item_photo`；
- Dialog的布局文件以 `dialog` 为前缀，逻辑名称放在其后，下划线连接，例如 `dialog_warnning`;
- 包含项布局命名以 `include` 开头，在加上对应的逻辑名称，例如 `include_foot`
- 控件的 id 命名参见控件变量命名；
   
##### 6. 资源命名
- 图标资源以 `ic` 为前缀，例如 `ic_chat` ，指聊天图标；
- 背景图片以 `bg` 为前缀，例如 `bg_login` ，指的是登录页的背景图；
- 按钮图片以 `btn` 为前缀，例如 `btn_login `，指的是登录按钮的图片，不过这只有一种状态，需要加上状态的可以在后面添加，例如 `btn_login_pressed` ，表示登录按钮按下的图片；
- 当使用 shape 和 selector 文件为背景或者按钮时，命名参照以上说明；

### 参考资料

本文参考了：

- [最佳实践之Android代码规范](http://www.androidchina.net/2141.html)
- [Android研发规范](http://blog.csdn.net/wwj_748/article/details/42347283)



推荐阅读：

- [Google 的 Java 编程风格指南](http://codecloud.net/google-java-style-5975.html)

暂时写到这，后面再完善。：）


