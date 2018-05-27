---
layout: post
title: 初识 CoordinatorLayout 的 Behavior
category: Android

---

CoordinatorLayout 的引入，让 View 之间的联动变得方便容易，使得 App 的界面更加灵动。本文就 CoordinatorLayout 的 Behavior 进行简单的介绍和分析。

### 1. 引入
在Android M Preview发布后，Google官方提供了一个全新的 Support Library —— **Android Design Support Library**。

其中引入一个全新的控件的 CoordinatorLayout，coordinator 是“协作者”的意思，顾名思义，这是一个可以让包含在其内部的子view互相协作的一个父布局。

如下的一个界面：
![](https://lc-qygvx1cc.cn-n1.lcfile.com/cda6d7acec7b7a2f.png)

当列表在向下滑动时，Fab(悬浮按钮，下同)隐藏，当列表上滑时，Fab再次显示出来。这就需要列表和Fab的协作。

在没有 CoordinatorLayout 之前，你需要监听列表的滑动，然后根据滑动时的值来决定Fab的动作，貌似也不是很麻烦。但是如果你的列表是放在 ViewPage 里面的某个 Fragment 里面的呢？可能就比较麻烦了。

不过在有了 CoordinatorLayout 之后，借助其 Behavior，就可以很方便地实现了。

### 2. 概述
这里是[官方文档](http://developer.android.com/reference/android/support/design/widget/CoordinatorLayout.Behavior.html)，OverView中提到：
> Interaction behavior plugin for child views of CoordinatorLayout.
>
> A Behavior implements one or more interactions that a user can take on a child view. These interactions may include drags, swipes, flings, or any other gestures.

如上文所描述的，这是一个针对CoordinatorLayout的子view之间交互的类，子view之间的交互包括拖拽，滑动等。

### 3. 构造方法
Beavior 包含两个默认的构造方法：

- 	`CoordinatorLayout.Behavior()`
	
	默认实例化 Beavior 对象的方法。
-  `CoordinatorLayout.Behavior(Context context, AttributeSet attrs)`
	
	默认在布局文件中使用的构造方法，当你xml文件中用`app:layout_behavior="com.example.SomeBehavior"`的方式使用 Behavior 的时候，该构造方法是必须实现的。
	
### 4. 主要的方法
1. `public boolean layoutDependsOn (CoordinatorLayout parent, V child, View dependency)`

	该方法由父布局 CoordinatorLayout 调用，其中的 child 即使用了该 Behavior 的 View，dependency为 CoordinatorLayout 布局的直接子 View (除 child 以外)。
	
	该方法返回 child 是否依赖于传入的 dependency，如果是 true，则父布局 CoordinatorLayout 将会：
	- 无视布局文件中的摆放顺序，child 的布局总是在 dependency 布局之后；
	- 当 dependency 的布局或者位置改变时，会调用 `onDependentViewChanged (CoordinatorLayout parent, V child, View dependency)`方法。

2. `public boolean onDependentViewChanged (CoordinatorLayout parent, V child, View dependency)`
	
	根据上面提到的，当 child 依赖某个 view 时，该 view 的位置或者布局发生变化时，会调用本方法，在本方法里面可以对 child 作相应的调整。例如 toolbar 逐渐隐藏消失时，toolbar 下面的内容 view 需要相应的上移。
		
3. 
		  

参考资料

- [Android 嵌套滑动机制（NestedScrolling）](http://segmentfault.com/a/1190000002873657)
- [Android Support Design 中 CoordinatorLayout 与 Behaviors 初探](https://segmentfault.com/a/1190000002888109)