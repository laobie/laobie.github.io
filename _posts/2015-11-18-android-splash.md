---
title: Android 启动页 (Splash) 的实现
category: Android
---

App 启动页 (Splash)，最经典的莫过于微信的启动页了。不过启动页是个好的设计还是不好的设计呢？本文不讨论这个问题，仅从一个开发者的角度来讲解下Android应用启动页的实现，以及一些需要注意的地方。

### 基本实现
先显示一个界面，停留1~2s，然后跳转到另一个界面。
这里有个延时跳转，可以用 Timer、Handler 实现，我这里用 Handler 来实现。

#### 1. 添加 `SplashActivity`
首先假设 App 打开的第一个界面为 `MainActivity`，新建一个 `SplashActivity`，在 `AndroidManifest` 中将 `SplashActivity` 设置为启动后第一个打开的页面：

~~~xml
<activity
      	android:name=".activity.SplashActivity"
      	android:label="@string/app_name"
      	android:theme="@style/AppTheme.NoActionBar.FullScreen">
      	<intent-filter>
            	 	<action android:name="android.intent.action.MAIN" />
            	 	<category android:name="android.intent.category.LAUNCHER" />
      	</intent-filter>
</activity>
~~~
        
  这里只是将 `MainActivity` 的 `intent-filter` 参数剪切给 `SplashActivity`，此时你打开 App 第一个显示的就是 `SplashActivity` 了。

#### 2. 添加跳转
跳转是用 Handler 的 `postDelayed()` 方法来设置延时来实现的，在 `SplashActivity` 的 `onCreate()` 方法中添加一下的代码，就可以实现在1500毫秒后跳转到 `MainActivity` 了。
这里需要注意的是 `Handler` 是引用自 `android.os.Handler`，import 的时候不要搞错了。

~~~java
Handler handler = new Handler();
handler.postDelayed(new Runnable() {
       @Override
       public void run() {
            Intent intent = new Intent(SplashActivity.this, MainActivity.class);
            startActivity(intent);
            finish();
        }
}, 1500);
~~~

`postDelayed(Runnable r, long delayMillis)` 方法就是设置在设定的时间后执行 `Runnable` 中的 `run()`，`delayMillis` 单位是毫秒。

### 注意的问题
以上两步操作基本实现了启动页的基本功能，不过还是有一些小的问题需要注意的。

#### 1. 只显示一次启动页（ App 没被 kill 的情况下）
微信打开之后，按下返回键回到桌面，再打开微信，并不会再看到启动页（除非你手动清了微信的后台或者被系统 kill 了），这个是怎么实现的呢？

其实很简单，只需要重写一下 `MainActivity` 的 `onBackPressed()` 方法就行。

~~~java
@Override
public void onBackPressed() {
    // super.onBackPressed(); 	不要调用父类的方法
    Intent intent = new Intent(Intent.ACTION_MAIN);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.addCategory(Intent.CATEGORY_HOME);
    startActivity(intent);
}
~~~

以上就实现了和微信一样的效果。

#### 2. 全屏页面切换到非全屏页面的问题
由于启动页一般是全屏显示的，而主页则不是，因此从全屏切换到非全屏就存在一个卡顿的问题，这个问题我之前在 CSDN 上写过一篇解决办法，这里就直接贴地址了:
[Android 全屏界面切换到非全屏界面的问题](http://blog.csdn.net/u013011318/article/details/48296869)。

暂时就写这么多，需要 demo 的话可以看我最新开源的项目[听雨](https://github.com/laobie/ListenRain)。




