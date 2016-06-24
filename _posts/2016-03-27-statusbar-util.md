---
layout: post
title: Android 状态栏工具类（实现沉浸式状态栏/变色状态栏）
category: Android 
---

这是一个为Android App 设置状态栏的工具类， 可以在4.4及其以上系统中实现 沉浸式状态栏/状态栏变色，支持设置状态栏透明度，满足你司设计师的各种要求(雾)。

在此之前我写过一篇[Android App 沉浸式状态栏解决方案](http://laobie.github.io/android/2016/02/15/status-bar-demo.html)，后来我司设计师说默认的透明度太深了，让我改浅一点，然后在想了一些办法之后给解决了。本着不重复造轮子的原则，索性整理成一个工具类，方便需要的开发者。

[项目 GitHub 地址](https://github.com/laobie/StatusBarUtil)

### Sample 下载
[下载 StatusBarUtil-Demo](http://fir.im/5mnp)

### 特性

##### 1. 设置状态栏颜色
	
~~~java
StatusBarUtil.setColor(Activity activity, int color)
~~~

  ![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_color.png)

##### 2. 设置状态栏半透明

~~~java
StatusBarUtil.setTranslucent(Activity activity, int statusBarAlpha)
~~~
	
![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_translucnet.png)
	
##### 3. 设置状态栏全透明

~~~java
StatusBarUtil.setTransparent(Activity activity)
~~~
	
![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_transparent.png)
  
##### 4. 为包含 `DrawerLayout` 的界面设置状态栏颜色（也可以设置半透明和全透明）

~~~java
StatusBarUtil.setColorForDrawerLayout(Activity activity, DrawerLayout drawerLayout, int color)
~~~

![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_color_for_drawer_layout.png)
  
##### 5. 通过传入 `statusBarAlpha` 参数，可以改变状态栏的透明度值，默认值是112。
  

### 使用

##### 1. 在 build.gradle 文件中添加依赖, StatusBarUtil 已经发布在 JCenter:

~~~groovy
compile 'com.jaeger.statusbaruitl:library:1.1.1'
~~~

##### 2. 在 `setContentView()` 之后调用你需要的方法，例如:

~~~java
setContentView(R.layout.main_activity);
...
StatusBarUtil.setColor(MainActivity.this, mColor);
~~~

##### 3. 如果你在一个包含 `DrawerLayout` 的界面中使用, 你需要在布局文件中为 `DrawerLayout` 添加 `android:fitsSystemWindows="true"` 属性:

~~~xml
<android.support.v4.widget.DrawerLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/drawer_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fitsSystemWindows="true">

    ...

</android.support.v4.widget.DrawerLayout>
~~~

##### 4. 当你设置了 `statusBarAlpha` 值时，该值需要在 0 ~ 255 之间

### 最后
如果你有任何建议或问题，请及时联系我。如果你对这个工具类有优化，欢迎 fork 提 pr。

[传送门 GitHub 地址](https://github.com/laobie/StatusBarUtil)

