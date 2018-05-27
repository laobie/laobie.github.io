---
title: 第一个开源控件：NineGridImageView（九宫格图片控件）
category: Android 
---

最近在公司项目重构一个类似朋友圈或微博的动态界面，其中需要显示九宫格图片，在查找一些开源库之后，发现没特别好用的，或者说满足我需求的，就一不小心造了个轮子。

这是一个自定义控件，用来显示类似微信朋友圈或微博中那样的九宫格图片，[ GitHub地址 ](https://github.com/laobie/NineGridImageView)。效果图如下所示：

![](https://lc-qygvx1cc.cn-n1.lcfile.com/ee5906c846ad3346.png)

### 更新日志

+ 1.0.2
 
   移除 Support 依赖库
   
+ 1.0.1 
	
	- bug修复：没有图片数据或者数据为0时，不显示本view；
	- 添加设置最大图片数方法；

+ 1.0.0
	
	第一次发布

### Demo App
[NineGridImageView-Demo 下载](http://fir.im/bkxn)

### 特性
+ 设置图片之间的间隔	

	`app:imgGap="4dp"` 或 `nineGridImageView.setGap(int gap);`
	
+ 设置最大图片数：

	`app:maxSize="9"` 或者 `nineGridImageView.setMaxSize(int maxSize)`

	如果最大图片数小于等于0，则没有图片数的限制。
	
+ 设置显示样式

	`app:showStyle="fill"` 或 `nineGridImageView.setShowStyle(int style);`
	
	默认样式是网格样式：`STYLE_GRID`:
	
	![](https://lc-qygvx1cc.cn-n1.lcfile.com/9cc94e97b4fce73f.png)
	
	另外一种样式是：`STYLE_FILL`:
	
	![](https://lc-qygvx1cc.cn-n1.lcfile.com/0fa728fd90d1b227.png)
	
	两者的区别见图或在Demo中体验。
	
+ 当只有一张图的时候，可以设置其显示大小，不让其显示的过小:

	`app:singleImgSize="120dp"` 或 `nineGridImageView.setSingleImgSize(int singleImgSize)`
	
	![](https://lc-qygvx1cc.cn-n1.lcfile.com/cc9ffd32722ead80.png)

### 用法

1. 首先添加依赖

   ```groovy
   compile 'com.jaeger.ninegridimageview:library:1.0.2'
   ```
	
2. 在布局文件中添加 NineGridImageView， 如下所示：
	
   ``` xml
   <com.jaeger.ninegridimageview.NineGridImageView
       xmlns:app="http://schemas.android.com/apk/res-auto"
       android:layout_height="wrap_content"
       android:layout_margin="16dp"
       android:layout_width="match_parent"
       app:imgGap="4dp"
       app:showStyle="fill"
       app:singleImgSize="120dp"/>
   ```
        
3. 为 NineGridImageView 设置 NineGridImageViewAdapter

   ``` java
   nineGridImageView.setAdapter(nineGridViewAdapter);
   ```

   下面是 `NineGridImageViewAdapter.class` 的源码:
	
   ``` java
   public abstract class NineGridImageViewAdapter<T> {

       protected abstract void onDisplayImage(Context context, ImageView imageView, T t);

       protected void onItemImageClick(Context context, int index, List<T> list) {

       }

       protected ImageView generateImageView(Context context) {
           GridImageView imageView = new GridImageView(context);
           imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
           return imageView;
       }
   }
   ```
		
   + T 是你图片的数据类型, 你可以简单的使用 String 类型也可以是你自定义的类型；
   + 你必须重写 `onDisplayImage(Context context, ImageView imageView, T t)` 方法去设置显示图片的方式, 你可以使用 Picasso、Glide 、ImageLoader 或者其他的图片加载库，你也可以给 `ImageView` 设置一个占位图；
   + 如果你需要处理图片的点击事件，你可以重写 `onItemImageClick(Context context, int index, List<T> list)` 方法，加上你自己的处理逻辑；
   + 如果你要使用自定义的 `ImageView`，你可以重写 `generateImageView(Context context)` 方法， 去生成自定的 `ImageView`。
	
   下面是一段示例代码:

   ``` java
   private NineGridImageViewAdapter<Photo> mAdapter = new NineGridImageViewAdapter<Photo>() {
       @Override
       protected void onDisplayImage(Context context, ImageView imageView, Photo photo) {
           Picasso.with(context)
               .load(photo.getSmallUrl)
               .placeholder(R.drawable.ic_default_image)
               .into(imageView);
       }
       @Override
       protected ImageView generateImageView(Context context) {
           return super.generateImageView(context);
       }
       @Override
       protected void onItemImageClick(Context context, int index, List<Photo> photoList) {
           showBigPicture(context, photoList.get(index).getBigUrl());
       }

           
   ...
   	mNineGridImageView.setAdapter(mAdapter);
   ...
   ```

4. 给 NineGridImageView 设置图片数据：

   ``` java
   nineGridImageView.setImagesData(List<T> imageDataList);
   ```

### 参考资料
- [自定义九宫格控件NineGridLayout](https://github.com/panyiho/NineGridView)
- [九宫格图片展示控件]( https://github.com/w4lle/NineGridView)
	
### 最后
第一次发布开源库，如果你有任何建议或问题，请及时联系我。如果你对本控件有优化，欢迎 fork 提 pr。

[ GitHub 传送门](https://github.com/laobie/NineGridImageView)



	
	
	 
		


