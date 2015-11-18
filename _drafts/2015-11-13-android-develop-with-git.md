---
layout: post
title: Git在Android开发中的使用
category: Android

---

作为程序猿，应该都很熟悉世界上最大的同性交友网站Github。与这个网站相关联的就是Git这个版本控制系统。本文简单介绍在Android开发中git的使用。


### 基本操作
1. 配置信息
        
        // 全局配置
		git config --global user.name your_name
		git config --global user.email your_email
		
		//单独为某个项目配置，进入到该项目目录后
		git config user.name your_name
		git config user.email your_email

2. 查看配置信息

	进入你的项目目录，运行（后面都是在该目录下操作，不再赘述）：
	
		git config --list
		
	如果你为项目单独配置了用户和邮箱，则会显示两次`user.name`和`user.email`，第一次显示的为全局配置，第二次显示的则是该项目使用的配置。
	
3. 初始化

		git init

4. 添加文件
		
		// 添加文件,多个文件以空格隔开 
		git add <file_name> <file_name_1>
		// 添加当前目录包含的全部文件
		git add .

5. 提交变动

		// <commit_info> 为提交描述
		git commit -m "<commit_info>"
	
	
		
		
		
### 各种删除、修改和回退
1. 更改配置信息
    
    	// 修改修改配置信息
    	// 直接再次运行配置的命令即可
    	
    	// 删除某个项目下单独配置的用户和邮箱
    	git config --unset user.name
    	git config --unset user.email
    	
2.  
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
		
	