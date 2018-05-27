---
title: Android App 沉浸式状态栏解决方案
category: Android 
---

伴随着 Android 5.0 发布的 Material Design，让 Android 应用告别了以前的工程师审美，迎来了全新的界面，灵动的交互，也让越来越多的 App 开始遵从 material design 设计原则，不再是以前拿着iOS设计稿，做着Android开发。本文就其中的沉浸式状态栏这一特性，描述其兼容到4.4的实现，以及一些使用中的小细节。

**建议直接看最新的解决方案：**
 [Android 状态栏工具类（实现沉浸式状态栏/变色状态栏）](http://laobie.github.io/android/2016/03/27/statusbar-util.html)

### 前言
在4.4之前状态栏一直是黑色的，在4.4中带来了 `windowTranslucentStatus` 这一特性，因此可以实现给状态栏设置颜色，如下图所示，状态栏颜色不再是黑色，而是可以定制的颜色。

![](https://lc-qygvx1cc.cn-n1.lcfile.com/e61aeb3f3cc44354.png)

国内将状态栏变色叫做沉浸式状态栏，时间久了，叫的人多了，大家就不再深究，默认了这种叫法。

可以在知乎上看到关于这个问题的讨论：[为什么在国内会有很多用户把「透明栏」（Translucent Bars）称作 「沉浸式顶栏」？](https://www.zhihu.com/question/27040217)

### 需要解决的问题
1. 4.4及其以上都是可以实现沉浸式状态栏效果的，5.0及其以上可以直接在主题中设置颜色，或者调用 `Window` 类中的 `setStatusBarColor(int color)` 来实现，这两种方式在5.0上都比较简单，但是如何兼容到4.4呢？
2. 图片背景的页面,怎样让状态栏透明或者半透明（效果如下）？
![](https://lc-qygvx1cc.cn-n1.lcfile.com/74a963666851b9bd.png)
3. 使用 DrawerLayout 时，主界面实现沉浸状态栏同时，怎样保证抽屉视图也能延伸到状态栏（如下图所示），且兼容到4.4？
![](https://lc-qygvx1cc.cn-n1.lcfile.com/9585eb130bb180b5.png)

以上就是本文要解决的问题，下面给出解决方案。

### 解决方案

#### 1. 给状态栏设置颜色
思路是：

- 先设置状态栏透明属性；
- 给根布局加上一个和状态栏一样大小的矩形View（色块），添加到顶上；
- 然后设置根布局的 `FitsSystemWindows` 属性为 `true`,此时根布局会延伸到状态栏，处在状态栏位置的就是之前添加的色块，这样就给状态栏设置上颜色了。

代码如下：

~~~ java
    /**
     * 设置状态栏颜色
     *
     * @param activity 需要设置的activity
     * @param color    状态栏颜色值
     */
    public static void setColor(Activity activity, int color) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // 设置状态栏透明
            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            // 生成一个状态栏大小的矩形
            View statusView = createStatusView(activity, color);
            // 添加 statusView 到布局中
            ViewGroup decorView = (ViewGroup) activity.getWindow().getDecorView();
            decorView.addView(statusView);
            // 设置根布局的参数
            ViewGroup rootView = (ViewGroup) ((ViewGroup) activity.findViewById(android.R.id.content)).getChildAt(0);
            rootView.setFitsSystemWindows(true);
            rootView.setClipToPadding(true);
        }
    }
~~~

其中生成状态栏一样大小的矩形色块的代码如下：

~~~ java
    /**
     * 生成一个和状态栏大小相同的矩形条
     *
     * @param activity 需要设置的activity
     * @param color    状态栏颜色值
     * @return 状态栏矩形条
     */
    private static View createStatusView(Activity activity, int color) {
        // 获得状态栏高度
        int resourceId = activity.getResources().getIdentifier("status_bar_height", "dimen", "android");
        int statusBarHeight = activity.getResources().getDimensionPixelSize(resourceId);

        // 绘制一个和状态栏一样高的矩形
        View statusView = new View(activity);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                statusBarHeight);
        statusView.setLayoutParams(params);
        statusView.setBackgroundColor(color);
        return statusView;
    }
~~~

在 `setContentView()` 之后调用 `setColor(Activity activity, int color)` 方法即可。

#### 2. 图片作背景时，状态栏透明
这个实现比较简单，根布局背景设置为图片，然后添加状态栏透明 Flag， 然后设置根布局的 `FitsSystemWindows` 属性为 `true` 即可。代码如下：

~~~ java
    /**
     * 使状态栏透明
     * <p>
     * 适用于图片作为背景的界面,此时需要图片填充到状态栏
     *
     * @param activity 需要设置的activity
     */
    public static void setTranslucent(Activity activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // 设置状态栏透明
            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            // 设置根布局的参数
            ViewGroup rootView = (ViewGroup) ((ViewGroup) activity.findViewById(android.R.id.content)).getChildAt(0);
            rootView.setFitsSystemWindows(true);
            rootView.setClipToPadding(true);
        }
    }
~~~

同样的，在 `setContentView()` 之后调用 `setTranslucent(Activity activity)` 方法即可。

#### 3. 使用 DrawerLayout 时的特殊处理

**注意点：**

- 使用 DrawerLayout 时，此时不能再对根布局，即 DrawerLayout 进行设置，而要针对 DrawerLayout 的内容布局进行设置，即抽屉之外的另一个布局。

	如下是一个典型的 DrawerLayout 的布局，其内容布局即 `FrameLayout`,我们需要对 `FrameLayout ` 进行仿状态栏色块的添加、`FitsSystemWindows` 属性的设置。
	
~~~ xml
<?xml version="1.0" encoding="utf-8"?>

<android.support.v4.widget.DrawerLayout
    android:id="@+id/drawer_layout"
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <LinearLayout
            android:id="@+id/main"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="vertical">

            <android.support.v7.widget.Toolbar
                android:id="@+id/toolbar"
                android:layout_width="match_parent"
                android:layout_height="?attr/actionBarSize"
                android:background="@color/colorPrimary"
                app:popupTheme="@style/ThemeOverlay.AppCompat.Light"
                app:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar"/>
        </LinearLayout>
    </FrameLayout>

    <android.support.design.widget.NavigationView
        android:id="@+id/navigation"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        app:headerLayout="@layout/nav_header"
        app:menu="@menu/activity_main_drawer"/>

</android.support.v4.widget.DrawerLayout>
~~~

- 还有一个需要注意的设置抽屉布局（Drawer）的 `FitsSystemWindows` 属性为 `false`，即上面布局中的 `NavigationView`。

**解决方案**

- DrawerLayout 状态栏变色
	
	代码如下：
	
~~~ java
    /**
     * 为DrawerLayout 布局设置状态栏变色
     *
     * @param activity     需要设置的activity
     * @param drawerLayout DrawerLayout
     * @param color        状态栏颜色值
     */
    public static void setColorForDrawerLayout(Activity activity, DrawerLayout drawerLayout, int color) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            // 生成一个状态栏大小的矩形
            View statusBarView = createStatusBarView(activity, color);
            // 添加 statusBarView 到布局中
            ViewGroup contentLayout = (ViewGroup) drawerLayout.getChildAt(0);
            contentLayout.addView(statusBarView, 0);
            // 内容布局不是 LinearLayout 时,设置padding top
            if (!(contentLayout instanceof LinearLayout) && contentLayout.getChildAt(1) != null) {
                contentLayout.getChildAt(1).setPadding(0, getStatusBarHeight(activity), 0, 0);
            }
            // 设置属性
            ViewGroup drawer = (ViewGroup) drawerLayout.getChildAt(1);
            drawerLayout.setFitsSystemWindows(false);
            contentLayout.setFitsSystemWindows(false);
            contentLayout.setClipToPadding(true);
            drawer.setFitsSystemWindows(false);
        }
    }
~~~

需要注意的是，`DrawerLayout` 的布局只能包含两个直接子布局，一个是内容布局，一个是抽屉布局，结构如前面的示例布局所示，如果内容布局的根布局如果不是 `LinearLayout` 需要对其子布局设置`padding top`值，否则仿状态栏色块会被遮挡在最下面，布局内容延伸到状态栏，如下图所示：

![](https://lc-qygvx1cc.cn-n1.lcfile.com/49f7e6a7bd524179.png)

（ps：就上图中的问题，目前的解决方案感觉并不是很好，如果你有更好的解决方案，请告诉我~）

- DrawerLayout 状态栏透明

~~~ java
    /**
     * 为 DrawerLayout 布局设置状态栏透明
     *
     * @param activity     需要设置的activity
     * @param drawerLayout DrawerLayout
     */
    public static void setTranslucentForDrawerLayout(Activity activity, DrawerLayout drawerLayout) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // 设置状态栏透明
            activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            // 设置内容布局属性
            ViewGroup contentLayout = (ViewGroup) drawerLayout.getChildAt(0);
            contentLayout.setFitsSystemWindows(true);
            contentLayout.setClipToPadding(true);
            // 设置抽屉布局属性
            ViewGroup vg = (ViewGroup) drawerLayout.getChildAt(1);
            vg.setFitsSystemWindows(false);
            // 设置 DrawerLayout 属性
            drawerLayout.setFitsSystemWindows(false);
        }
    }
~~~

同样的，在 `setContentView()` 之后调用上述解决方案中的方法即可。

### 在项目中使用

以上代码我整理成了一个工具类库，放在 github 上：[laobie/StatusBarUtil](https://github.com/laobie/StatusBarUtil)

在项目中推荐这样使用，在 `BaseActivity` 中重写 `setContentView(int layoutResID)` 方法，新建一个 `setStatusBar()`方法，全局设置状态栏颜色，因为一般 App 大部分界面状态栏都是主题色。 

~~~ java

public class BaseActivity extends AppCompatActivity {

    @Override
    public void setContentView(int layoutResID) {
        super.setContentView(layoutResID);
        setStatusBar();
    }

    protected void setStatusBar() {
        StatusBarUtils.setColor(this, getResources().getColor(R.color.colorPrimary));
    }

}
~~~

当子类 Activity 的状态栏需要特殊处理时，比如设置不同的颜色，或者设置图片为背景时，重写父类的 `setStatusBar()` 方法即可，例如：

~~~ java
public class ImageStatusBarActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_image_status_bar);
        
    }

    @Override
    protected void setStatusBar() {
        StatusBarUtils.setTranslucent(this);
    }
~~~

对 DrawerLayout 布局使用时，需要注意一点，因为方法是在 `setContentView()` 之后立即调用的，所以传进来的 `DrawerLayout` 要通过 `findViewById()` 传进来。如果传入在 `setContentView()` 之后通过 `findViewById()` 得到的 `DrawerLayout`， 则会造成空指针异常。

~~~ java
 StatusBarUtils.setColorForDrawerLayout(this, (DrawerLayout) findViewById(R.id.drawer_layout), getResources()
                .getColor(R.color.colorPrimary));
~~~

### 源码和Demo下载

[laobie/StatusBarUtil 项目地址](https://github.com/laobie/StatusBarUtil)

[Demo apk 下载](http://fir.im/5mnp)

效果在前文中都有截图，就不多放了。

如文章中有疏漏的地方，请联系我或在评论里告知。



 

