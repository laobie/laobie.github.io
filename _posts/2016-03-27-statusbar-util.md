---
title: StatusBarUtil 状态栏工具类（实现沉浸式状态栏/变色状态栏）
category: Android 
---

这是一个为Android App 设置状态栏的工具类， 可以在4.4及其以上系统中实现 沉浸式状态栏/状态栏变色，支持设置状态栏透明度，满足你司设计师的各种要求(雾)。

在此之前我写过一篇[Android App 沉浸式状态栏解决方案](http://laobie.github.io/android/2016/02/15/status-bar-demo.html)，后来我司设计师说默认的透明度太深了，让我改浅一点，然后在想了一些办法之后给解决了。本着不重复造轮子的原则，索性整理成一个工具类，方便需要的开发者。

[项目 GitHub 地址](https://github.com/laobie/StatusBarUtil)

### Sample 下载
[下载 StatusBarUtil-Demo](http://fir.im/5mnp)


### 特性

1. 设置状态栏颜色

   ```java
   StatusBarUtil.setColor(Activity activity, int color)
   ```

   ![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_color.png)

2. 设置状态栏半透明

   ```java
   StatusBarUtil.setTranslucent(Activity activity, int statusBarAlpha)
   ```

   ![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_translucnet.png)
   ​
   ​

3. 设置状态栏全透明

   ```java
   StatusBarUtil.setTransparent(Activity activity)
   ```

   ![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_transparent.png)

4. 为包含 `DrawerLayout` 的界面设置状态栏颜色（也可以设置半透明和全透明）

   ```java
   StatusBarUtil.setColorForDrawerLayout(Activity activity, DrawerLayout drawerLayout, int color)
   ```

   ![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_color_for_drawer_layout.png)

5. 为使用 ImageView 作为头部的界面设置状态栏透明

   ```java
   StatusBarUtil.setTranslucentForImageView(Activity activity, int statusBarAlpha, View needOffsetView)
   ```

   ![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_for_image_view_page.png)

6. 在 Fragment 中使用

   ![](https://lc-qygvx1cc.cn-n1.lcfile.com/f79b11ecae3b6043.gif)

7. 为滑动返回界面设置状态栏颜色

   推荐配合 [bingoogolapple/BGASwipeBackLayout\-Android: Android Activity 滑动返回](https://github.com/bingoogolapple/BGASwipeBackLayout-Android) 这个库一起使用。

   ```java
   StatusBarUtil.setColorForSwipeBack(Activity activity, @ColorInt int color, int statusBarAlpha)
   ```

   ![](https://raw.githubusercontent.com/laobie/StatusBarUtil/master/img/set_color_for_swipe_back_page.png)

8. 通过传入 `statusBarAlpha` 参数，可以改变状态栏的透明度值，默认值是112。


### 使用

1. 在 build.gradle 文件中添加依赖, StatusBarUtil 已经发布在 JCenter:

   ```groovy
   compile 'com.jaeger.statusbarutil:library:1.4.0'
   ```

2. 在 `setContentView()` 之后调用你需要的方法，例如:

   ```java
   setContentView(R.layout.main_activity);
   ...
   StatusBarUtil.setColor(MainActivity.this, mColor);
   ```

3. 如果你在一个包含 `DrawerLayout` 的界面中使用, 你需要在布局文件中为 `DrawerLayout` 添加 `android:fitsSystemWindows="true"` 属性:

   ```xml
   <android.support.v4.widget.DrawerLayout
       xmlns:android="http://schemas.android.com/apk/res/android"
       xmlns:app="http://schemas.android.com/apk/res-auto"
       android:id="@+id/drawer_layout"
       android:layout_width="match_parent"
       android:layout_height="match_parent"
       android:fitsSystemWindows="true">

       ...

   </android.support.v4.widget.DrawerLayout>
   ```

4. 滑动返回界面设置状态栏颜色：

   建议配合 [bingoogolapple/BGASwipeBackLayout\-Android: Android Activity 滑动返回](https://github.com/bingoogolapple/BGASwipeBackLayout-Android) 库一起使用。

   ```java
   StatusBarUtil.setColorForSwipeBack(Activity activity, @ColorInt int color, int statusBarAlpha)
   ```

5. 当你设置了 `statusBarAlpha` 值时，该值需要在 0 ~ 255 之间

6. 在 Fragment 中的使用可以参照 [UseInFragmentActivity.java](https://github.com/laobie/StatusBarUtil/blob/master/sample/src/main/java/com/jaeger/statusbarutil/UseInFragmentActivity.java) 来实现

### 更新日志

- 1.4.0

  - 修改拼写错误

- 1.3.6

  - bug fix 

- 1.3.5
  - 添加 `hideFakeStatusBarView` 方法来隐藏假的状态栏 View


- 1.3.4
- 1.3.3
  - 修复 `setColorForSwipeBack` 方法和 `CoordinatorLayout` 一起使用的 bug


- 1.3.2 
  - 修复 bug

+  1.3.1

   - bug 修复

+  1.3.0

   - 完善 setColor 逻辑，避免潜在的问题

+  1.2.8

   - 修复 `setColorDiff` 方法中的一个 bug

+  1.2.7

   - 新增 `setColorForSwipeBack` 方法，支持滑动返回，目前支持的滑动返回库有：

     - [r0adkll/Slidr](https://github.com/r0adkll/Slidr)   
     - [bingoogolapple/BGASwipeBackLayout](https://github.com/bingoogolapple/BGASwipeBackLayout-Android)

+  1.2.6

   - 升级 support 包到 24.2.1 版本

+  1.2.5

   - 添加 `@ColorInt` 注解，现在如果传入 `R.color.xx`，就会提示使用错误
   - 修复 DrawerLayout 内容布局设置 paddding 失效的 bug

+  1.2.4

   - 修复 `setTranslucentForImageViewInFragment()` 方法的一个 bug

+  1.2.3

   - 修复 `setTranslucentForImageView` ，现在支持传 null 作为 needOffsetView 的值

   - 新增当 fragment 头部是 ImageView 时设置透明状态栏的方法

     ``` java
     setTranslucentForImageViewInFragment(Activity activity, View needOffsetView)
     setTransparentForImageViewInFragment(Activity activity, View needOffsetView)
     ```

   - 修复根布局是 CoordinatorLayout 时设置状态栏全透明和半透明的 bug

     ``` java
     setTranslucentForCoordinatorLayout(Activity activity, int statusBarAlpha)
     ```


- 1.2.0

    支持为使用 ImageView 作为头部的界面设置状态栏透明

- 1.1.1

    修复部分 4.4 上的 bug

- 1.1.0

    修复 bug

### 最后
如果你有任何建议或问题，请及时联系我。如果你对这个工具类有优化，欢迎 fork 提 pr。

[传送门 GitHub 地址](https://github.com/laobie/StatusBarUtil)

