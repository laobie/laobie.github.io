---
title: Android App 多语言切换
category: Android
---

前段时间公司 App 需要实现多语言切换功能，接到任务后先 Google 了下，发现搜到的方法都比较老旧，很多都莫名其妙，比如什么 API 欺骗、反射、手动转换语系，感觉不应该这么复杂地实现(也可能是当时的环境下实现确实比较麻烦)。所以花了点时间研究了下，实现了应用内切换语言，且不是那么复杂。

#### 1. 实现的效果
![](https://lc-qygvx1cc.cn-n1.lcfile.com/e210b5e3d4374be1.png)

和微信类似，在设置界面打开切换语言的界面，选择语言后重启 HomeActivity，语言切换完成，下次重新打开 App ，也是用户设置的语言。

#### 2. 实现步骤

##### 1. 添加多语言文件

在不同的 value 文件夹下（例如 value 、value-en、values-zh-rTW 文件夹）添加不同语言的 `string.xml` 文件，我们的项目添加了英文、简体中文、繁体中文三种语言，如下图所示：

![](https://lc-qygvx1cc.cn-n1.lcfile.com/50e346171231a31d.png)

其中英文需要翻译，繁体如果没有专门翻译的话，可以找个简繁转换网站，直接将简体中文转成繁体中文，我用的这个网站：[在线中文简体转繁体](http://www.vifo.com.cn/fanti/)。

##### 2. 更新 Configuration 中的 locale 属性

参照 [Android 开发者官网](http://developer.android.com/reference/android/content/res/Configuration.html) 上的描述，Configuration 包含了设备的所有的配置信息，这些配置信息会影响应用获取的资源。例如 string 资源，就是根据 Configuration 的 locale 属性来判断该取哪种语言的 string 资源，默认是 value 文件夹下的。

主要代码如下：

~~~ java
Resources resources = getContext().getResources();
DisplayMetrics dm = resources.getDisplayMetrics();
Configuration config = resources.getConfiguration();
// 应用用户选择语言
config.locale = Locale.ENGLISH;
resources.updateConfiguration(config, dm);
~~~

我们用了 `Locale` 中的预设值 `Locale.ENGLISH`、`Locale.TRADITIONAL_CHINESE`和 `Locale.SIMPLIFIED_CHINESE`，如果你需要设置的语言没有预设值，你可以自己新建一个 `Locale` 对象，具体自行 Google 吧。

**注：跟随系统设置是 `Locale.getDefault()`**

##### 3. 重启 HomeActivity 

我们的 App 有个启动页 WelcomeActivity，类似微信那个小人启动页，如果从欢迎页重启，并不是一个好的体验，应该和微信的语言设置一样，直接回到 HomeActivity ,而不是从 WelcomeActivity 重新打开。实现其实也很简单，代码如下：

~~~ java
Intent intent = new Intent(this, HomeActivity.class);
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
getActivity().startActivity(intent);
~~~

正常来说这段代码应该是没问题的，但是假如你的 App 存在某个 activity 和当前设置页 activity 不在一个 task 栈内的话（比如你从某个通知页用 `FLAG_ACTIVITY_NEW_TASK ` 启动的一个 activity），就不会应用语言设置。因此可以直接杀掉当前 App 的进程，保证是“整个”重启了：

~~~ java
Intent intent = new Intent(this, HomeActivity.class);
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
startActivity(intent);
// 杀掉进程
android.os.Process.killProcess(android.os.Process.myPid());
System.exit(0);
~~~

按道理杀掉进程的两行代码任意一行即可，但是查阅相关资料，还是两个都加上吧，如果有详细了解欢迎沟通。此段代码其实参考自 [CustomActivityOnCrash](https://github.com/Ereza/CustomActivityOnCrash) 开源项目，有兴趣的可以研究下这个开源库捕捉崩溃信息，重启应用部分的代码。

##### 4. 持久化存储语言设置

按照上述三个步骤，你应该已经可以看到了改变语言的效果了，但是当你杀掉应用，重新打开，发现设置又失效了。这是因为应用重启后会读取设备默认的 *Configuration* 信息，其中和语言相关的 locale 属性也会变成默认值，也就是你在系统设置中选择的语言。

当你的应用需要由用户单独设置语言，而不是仅仅跟随系统语言，你就需要持久化存储用户的设置信息了。你可以选择数据库、或 SharedPreferences 来存储设置信息。

在应用启动时需要读取存储的设置，并应用该配置，简要代码如下：

~~~ java
public class App extends MultiDexApplication {

    @Override
    public void onCreate() {
        super.onCreate();
        ...
        
        Resources resources = App.getContext().getResources();
        DisplayMetrics dm = resources.getDisplayMetrics();
        Configuration config = resources.getConfiguration();
        config.locale = getSetLocale();
        resources.updateConfiguration(config, dm);
        
    }
    
    // 得到设置的语言信息
    private static Locale getSetLocale() {
        // 读取储存的语言设置信息
        ...
    
    }
}
~~~

##### 5. 改变系统设置的时候需要注意的问题

做完以上的步骤，我觉得应该是没问题的了，但是事实证明我还是图样。

在测试中我又发现了一个问题：当从应用中切出去，改变了系统语言的设置，当再切应用的时候，我发现语言也会变成系统语言（而我并没在应用内设置跟随系统）。

然后打断点调试，发现在设备的配置信息（也就是 Configuration ）发生变化时，会立即影响应用中的 Configuration 信息。

简单来说，上一步中，我们在 App 启动时，读取了用户的设置信息，并应用到 Configuration 的 locale 属性上，然后通过 `resources.updateConfiguration(config, dm)` 改变了应用的配置信息（ Configuration ）并生效，保证我们的应用读取的 string 资源都是用户设置语言对应的资源。在我们改变系统的语言之后，再回到我们的应用中，此时的 Configuration 的 locale 属性就会发生变化了，不再是我们刚才自己的在应用启动时设置的了，而是变成了系统的设置了。 

解决办法很简单粗暴，在切回我们的应用时，在显示的 activity 的生命周期中做一些处理就好了，因为该 activity 可能是应用中任一个，因此我们在 `BaseActivity` 的 `onCreate` 中处理下(如评论中提到的，在改变了系统设置之后，回到应用会重走 activity 的 `onCreate` ，这个需要说明下)就好了：

~~~ java
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!LanguageUtil.isSetValue()) {
            LanguageUtil.resetDefaultLanguage();
        }
        ...
    }
~~~

~~~ java 
public class LanguageUtil {
    
    ...
    
    /**
     * 是否是设置值
     *
     * @return 是否是设置值
     */
    public static boolean isSetValue() {
        Locale currentLocale = App.getContext().getResources().getConfiguration().locale;
        return currentLocale.equals(getSetLocale());
    }
}
~~~

这里我就简单说下思路，具体的代码实现自行完成。建议将语言设置相关的代码都封装在一个 `LanguageUtil` 中，便于后期的维护。

#### 3. 参考资料
- [Android 之Activity启动模式(二)之 Intent的Flag属性](http://wangkuiwu.github.io/2014/06/26/IntentFlag/)
- [在线中文简体转繁体](http://www.vifo.com.cn/fanti/)