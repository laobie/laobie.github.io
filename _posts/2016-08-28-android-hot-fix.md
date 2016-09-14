---
title: Android 热修复方案对比
category: Android
excerpt: 没有 Bug 的程序几乎是不存在的，加上 App 更新版本过程又很繁琐，热修复技术从一提出，就拥有很大的技术需求市场。同时该技术从出现之初就有了很多不同的解决方案，同一种实现原理可能还存在着多个实现方案，本文就开源的热修复方案作一些简单的分析，让有需要的开发者在选择的时候有一个大概的了解。
---

### 概述

没有 Bug 的程序几乎是不存在的，加上 App 更新版本过程又很繁琐，热修复技术从一提出，就拥有很大的技术需求市场。从去年下半年开始，热修复技术就在 Android  技术社区火了一阵子，最近阿里百川正式开启了[HotFix](https://hotfix.taobao.com/hotfix/index.htm) 产品的公测服务，这也意味着开始有平台专门提供热修复服务，让普通的开发者和一些小公司也有机会使用上热修复技术，让这项技术不再是大公司才折腾得起、用得起的。当然使用效果或者说提供的服务质量具体怎么样还有待验证。

### 热修复基本原理

热修复的基本原理并不多，目前已知可用的热修复实现的原理主要有以下几种：

1. 基于 Xposed 实现的无侵入的运行时 [AOP (Aspect-oriented Programming)](http://en.wikipedia.org/wiki/Aspect-oriented_programming)  框架，可以实现在线修复 Bug，修复粒度方法级别，但是由于对 ART 虚拟机不支持，导致其对 Android 5.0、6.0 均不支持，使用局限性太大。目前基于这一原理实现的解决方案是手淘团队开源的 [Dexposed](https://github.com/alibaba/dexposed) 项目。
2. native hook 方式，其核心部分在 JNI 层对方法进行替换，替换有问题的方法，修复粒度方法级别，无法在类中新增和删减字段，可以做到即时生效，该原理的实现方案主要是阿里团队开源的 [AndFix](https://github.com/alibaba/AndFix) 。
3. 该原理由 QQ 空间技术团队提出，使用新的 ClassLoader 加载 patch.dex，hack 默认的 ClassLoader，替换有问题的类，修复粒度类级别，一般无法做到即时生效，需要在应用下一次启动时生效。目前基于该原理实现的方案有 [Nuwa](https://github.com/jasonross/Nuwa)、[HotFix](https://github.com/dodola/HotFix)、[RocooFix](https://github.com/dodola/RocooFix) 。
4. dex 文件全量替换，基于 DexDiff 技术，对比修复前后的 dex 文件，生成 patch.dex，再根据 patch.dex 更新有问题的 dex 文件。该方案由微信团队提出：[微信Android热补丁实践演进之路](http://bugly.qq.com/bbs/forum.php?mod=viewthread&tid=1264) ，暂时还未开源。目前基于这一原理实现的开源方案只有一个：[Tinker_imitator](https://github.com/zzz40500/Tinker_imitator) 。

目前热修复的原理基本就这四种，考虑到使用的兼容性、可实现性以及可操作性，基本上能实际应用到项目中的就剩下了 2、3 两种了，至于第 4 种方式，只能等微信团队开源出比较成熟的方案，方可实际应用。

### 开源的热修复方案对比

- [Dexposed](https://github.com/alibaba/dexposed)

  -  作者：手淘团队
  -  修复粒度：方法级别
  -  实现原理：基于 Xposed 实现的无侵入的运行时 AOP 框架

   该项目明确表示对 ART 虚拟机的不支持，对于 5.1 和 6.0 系统都没法支持，因此该项目基本没有实际应用到项目的意义，毕竟现在 5.0 以上的份额也挺大了。


- [AndFix](https://github.com/alibaba/AndFix)

  - 作者：阿里技术团队
  - 修复粒度：方法级别
  - 实现原理：native hook 方式
  - 优点：运行时即可修复，修复及时
  - 缺点：
    - 只能修复方法，无法新加类和字段
    - 对部分机型不支持
    - 方法的参数类型有限制
    - 打补丁限制较多，以上的限制在打补丁时均需要注意

  目前阿里百川公测的 [阿里百川\-HotFix](https://hotfix.taobao.com/hotfix/index.htm) 服务应该就是基于 AndFix 技术，具体的使用细节可以看这篇 [阿里百川 HotFix Android 接入说明](https://baichuan.taobao.com/docs/doc.htm?spm=a3c0d.7629140.0.0.dzpp9X&treeId=234&articleId=105457&docType=1) ，可以看到其具体的限制基本和 AndFix 项目类似：

  > 4.4 HotFix 的使用中不被允许的情况
  >
  > - 暂时不支持新增方法、新增类
  > - 不支持新增 Field
  > - 不支持针对同一个方法的多次 patch，如果客户端已经有一个 patch 包在运行，则下一个 patch 不会立即生效。
  > - 三星 note3、S4、S5 的 5.0 设备以及 X8 6设备不支持（[点击查看](http://baichuan.taobao.com/docs/doc.htm?spm=a3c0d.7629140.0.0.8K3Zr9&treeId=234&articleId=105460&docType=1#s1)具体支持的机型）
  > - 参数包括：long、double、float 的方法不能被 patch
  > - 被反射调用的方法不能被 patch
  > - 使用 Annotation 的类不能 patch
  > - 参数超过 8 的方法不能被 patch
  > - 泛型参数的方法如果 patch 存在兼容性问题


- [Nuwa](https://github.com/jasonross/Nuwa)

  - 作者： [Jason Ross](https://github.com/jasonross)
  - 修复粒度：类级别
  - 实现原理：ClassLoader 方式
  - 优点：兼容性较好，补丁限制较少，类级别的可以增减少字段，补丁自动化做的很完整
  - 缺点：
    - 需要在应用重启后才能应用补丁，实现修复
    - 需要在每个类默认构造方法插入一段代码，防止类打上 **CLASS_ISPREVERIFIED** 标志，对运行效率有影响
    - 目前 issue 中反馈的兼容性问题较多，源码中确实未对各个 Android 版本做差异化处理，存在兼容性问题
    - 作者已经停止维护

  该项目在去年刚出现时应该算比较火热，但是由于存在的兼容性问题，让作者也渐渐放弃了该项目，目前来说将该方案应用到项目中是有一定风险的。

- [HotFix](https://github.com/dodola/HotFix)

  - 作者：[dodola](https://github.com/dodola)
  - 修复粒度：类级别
  - 实现原理：ClassLoader 方式

  基于 ClassLoader 方式实现，实际使用存在兼容问题，基本类似 Nuwa ，作者已弃坑，新开项目 RocooFix，该项目停止维护。

- [RocooFix](https://github.com/dodola/RocooFix)

  - 作者：[dodola](https://github.com/dodola)
  - 修复粒度：类级别
  - 实现原理：ClassLoader 方式
  - 优点：
    - 兼容性较好，源码中对各 Android 进行了差异化处理，一定程度上解决了兼容性问题
    - 实现了两种修复方式：静态修复和动态修复，分别是需要重启修复和无需重启即可修复
    - 简化了补丁制作流程
  - 缺点：
    - 需要在每个类默认构造方法插入一段代码（也叫做插桩），防止类打上 **CLASS_ISPREVERIFIED** 标志，对运行效率有影响
    - 目前就项目下的 issue 来看，还是会存在兼容性问题，对于采用了 APT 技术的项目也存在一些问题
    - 动态修复方式还有待检验，使用的是 [Legend](https://github.com/asLody/legend) 项目中的相关技术

  总体来说，该开源方案应该是算比较完整的解决方案，作者目前还在维护，对各个 Android 版本的兼容性也做了不少工作，期待作者的后续更新。

- [Tinker\_imitator](https://github.com/zzz40500/Tinker_imitator)

  - 作者：[zzz40500](https://github.com/zzz40500)
  - 修复粒度：dex 级别
  - 实现原理：dex 文件全量替换
  - 优点：基于 dex 文件全量替换的实现原理相对于 ClassLoader 方式，在性能上有很大优势
  - 缺点：
    - 该方案虽然类似微信提出的热修复解决方案，但是 patch.dex 文件的生成并不是依赖于 DexDiff 算法，而是基于 bsdiff ，所以并不是完整实现了微信提出的方案
    - 需要重启应用，下次启动时生效
    - 生成新的 dex 文件时内存占用较大

  总体来说，该方案目前还停留在 demo 状态，感觉离实际应用到项目中还需要一段时间，基于 dex 文件全量替换的方式我们更多还是期待微信团队的开源。

### 对比总结

就热修复实现的基本原理而言，目前较为成熟的也就 **native hook 方式** 和 **ClassLoader 方式**，在这两个基本原理上实现的开源方案中，AndFix 和 RocooFix 较为成熟，相关的打补丁配套解决方案也比较完备。

如果你选择 AndFix 方案，比较倾向于推荐使用阿里百川的 [HotFix](https://hotfix.taobao.com/hotfix/index.htm)  服务，希望该服务在公测之后有一个比较完整的服务方案给出，提供一个保证质量的服务。

如果你选择 RocooFix 方案，你可能需要跟进作者的更新，及时反馈相关的问题，帮助作者来完善该项目，使得其在兼容性更加提升一步，同时在配套的生成补丁和下发补丁等方案也保证简单可使用。

你也可以选择等待微信团队开源 Tinker 项目，毕竟鹅厂这套解决方案看起来很不错，在其实际应用到微信项目的基础上，开源出完整的解决方案，必将是一件有利于开发者的好事。

感谢各大公司的技术团队和开源作者们的工作，正是他们让热修复得以实现，虽然各大解决方案都不是那么完美，但是已经有很大改进了，我们期待着越来越多的公司和开发者能够加入到这一工作中来，让热修复不再 “烫” 手。

### 参考文章

- [微信Android热补丁实践演进之路](http://bugly.qq.com/bbs/forum.php?mod=viewthread&tid=1264) 
- [各大热补丁方案分析和比较](http://blog.zhaiyifan.cn/2015/11/20/HotPatchCompare/)
- [安卓App热补丁动态修复技术介绍](http://mp.weixin.qq.com/s?__biz=MzI1MTA1MzM2Nw==&mid=400118620&idx=1&sn=b4fdd5055731290eef12ad0d17f39d4a&scene=0)