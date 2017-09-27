---
title: GitHub Page 博客自定义域名添加 HTTPS 支持
category: Web
excerpt: 2015 年底，不少互联网公司已经实现了全站 HTTPS 了，如今已经 2017 年了，作为一个开发者，个人博客还没加锁的，不免有点惭愧。最近博客改版，在家打开博客欣赏的时候，发现被糊了一堆牛皮癣，就花了点时间给本站上了 HTTPS。 
---

2015 年底，不少互联网公司已经实现了全站 HTTPS 了，如今已经 2017 年了，作为一个开发者，个人博客还没加锁的，不免有点惭愧。最近博客改版，在家打开博客欣赏的时候，发现被糊了一堆牛皮癣，就花了点时间给本站上了 HTTPS。 

### 为什么要上 HTTPS

关于 HTTPS 就不多介绍了，感兴趣的可以去看下知乎这个问题 [为什么 2015 年底各大网站都纷纷用起了 HTTPS？ \- 知乎](https://www.zhihu.com/question/40371841) 里面提到最多的就是运营商流量劫持，插入牛皮癣广告。

下图就是我在家欣赏本站的截图:
![](/img/postimg/blog_with_ad.jpeg)

全是治疗脱发的广告，干他大爷的长城宽带 😒

我以为就是一时劫持，就没在意了。过了几天，再看看，还是一堆牛皮癣，我就怒了，是时候上 HTTPS 了。

### 上 HTTPS 教程

搞小程序那会接触了下 HTTPS，那会了解到的 SSL 证书都是需要花钱买的，前阵子看到 [Certbot](https://certbot.eff.org/) 的介绍，才知道 [Let's Encrypt](https://letsencrypt.org/) 有提供免费证书的服务：

> Let's Encrypt 是一个于2015年三季度推出的数字证书认证机构，将通过旨在消除当前手动创建和安装证书的复杂过程的自动化流程，为安全网站提供免费的SSL/TLS证书。

但是 Certbot 适用于博客放在自己主机上的，本站是基于 GitHub 搭建的，因此没法使用 Certbot 服务。如果是直接使用 `username.github.io` 这样的域名的话，是默认就支持了 HTTPS 的, 直接访问 `https://username.github.io` 即可，自定义域名就需要自己折腾一下了。

整个过程也是比较简单的，10 分钟就可以给你的博客加个锁。

这里使用 [Netlify](https://www.netlify.com/) 提供的服务来完成我们操作。

1. 注册一个 Netlify 帐号，地址 [Netlify App](https://app.netlify.com/signup) 选择用 GitHub 注册就好了。

2. 添加一个新的站点
    ![](/img/postimg/netlify_add_site.jpg)

3. 配置站点，简单来说就是添加你的博客仓库地址，然后把博客的构建放在 Netlify 上，按照步骤来即可。
    ![](/img/postimg/netify_select_repo.jpg)

    在最后的 Deploy 步骤中，提示你 Published deploy 就说明好了，直接访问链接，就可以看到你的博客了。
    ![](/img/postimg/deploy_result.jpg)

4. 点 Back to Deploys 返回到设置页面，在 `Site Details` 中可以点击 `Change site name`，修改成一个简短点的名字，我这里取名叫 `jaeger`，然后就可以通过 [https://jaeger.netlify.com/](https://jaeger.netlify.com/) 来访问博客了。

5. 设置自己的域名
    在 `Domain management` 中设置自己的域名，我这里设置成 `jaeger.itscoder.com`。
     ![](/img/postimg/domin_setting.jpg)

6. 在自己的域名管理中设置 DNS 解析，itsCoder 组织的域名使用的是阿里云，在域名管理里面设置如下的域名解析规则：

    ![](/img/postimg/set_domain_dns.png)

7. 回到 Netlify ，还是在 `Domain management` 中，找到 HTTPS，依次设置如下两个即可，稍等片刻之后，你就发现你的站点加上了小锁了。整个世界都美好了。
  ![](/img/postimg/netlify_https_setting.jpg)

### 最后 

欣赏下成果，完美。
    
![](/img/postimg/laobie_blog.jpg)



最后再问候下劫持流量插广告的垃圾运营商。

![](/img/postimg/fuck_ad.jpg)



















