---
layout: post
title: nginx配置https
date: 2019-03-20 16:34:18
tags: [nginx, https]
---

我的服务器使用的系统是CentOS 6，因此直接使用yum安装nginx，其它系统以及版本可能有所差异。
## 使用yum安装nginx
step1, 先要安装nginx的yum源
### 设置源
```
rpm -ivh http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm
```
执行完上面的命令后，我们使用命令`yum info nginx`查看一下Nginx 软件包信息.
<!--more-->

```
[root@host nginx]# yum info nginx
已加载插件：fastestmirror
Loading mirror speeds from cached hostfile
 * base: repos.lax.quadranet.com
 * elrepo-kernel: repos.lax-noc.com
 * extras: mirror.fileplanet.com
 * updates: mirror.scalabledns.com
已安装的软件包
Name        : nginx
Arch        : i686
Version     : 1.14.2
Release     : 1.el6.ngx
Size        : 2.5 M
Repo        : installed
From repo   : nginx
Summary     : High performance web server
URL         : http://nginx.org/
License     : 2-clause BSD-like license
Description : nginx [engine x] is an HTTP and reverse proxy server, as well as
            : a mail proxy server.

可安装的软件包
Name        : nginx
Arch        : i386
Version     : 1.12.2
Release     : 1.el6.ngx
Size        : 967 k
Repo        : nginx
Summary     : High performance web server
URL         : http://nginx.org/
License     : 2-clause BSD-like license
Description : nginx [engine x] is an HTTP and reverse proxy server, as well as
            : a mail proxy server.
```
###  安装
step2, 安装nginx, 使用命令`yum install nginx`安装，等待安装完成。
```
yum install nginx
```
 检查nginx 版本`nginx -v`
```shell
[root@host nginx]# nginx -v
nginx version: nginx/1.14.2
```
这个时候我们发现nginx已经安装成功了。

### 查看nginx配置
使用yum安装的nginx， 默认配置文件放在` /etc/nginx/nginx.conf` ，使用命令`nginx -t` 可以拿到配置文件的存放路径；这个命令用于测试配置文件语法是否准确无误。
```
[root@host nginx]# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```
使用vim查看配置内容如下：
```
.......
.......
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;
    include /etc/nginx/conf.d/*.conf;
}
```
看最后一行`include /etc/nginx/conf.d/*.conf;` 便知nginx include 了`./conf.d/` 下面的所有配置文件，因此我们也可以将配置文件放在`./conf.d/` 目录下。

## 配置https站点
在配置Https 之前，我们需要准备好购买的SSL证书文件，我使用的是阿里云提供的免费证书。
1、将证书文件传到服务器，我使用的是`scp`命令将证书拷贝到服务器的`/etc/nginx/ssl_certs/`目录下面。现在该目录下有两个文件，`xxx.pem` 和 `xxx.key`。

2、在创建配置文件`/etc/nginx/conf.d/`目录下创建 `xxx.conf` 文件
```
touch /etc/nginx/conf.d/draw.lyan.me.conf
```
将如下配置copy到配置文件中
```
server {
    listen       443 ssl;
    server_name  draw.lyan.me;
    ssl_certificate      /etc/nginx/ssl_certs/draw.lyan.me.pem;
    ssl_certificate_key  /etc/nginx/ssl_certs/draw.lyan.me.key;
    #ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;
    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
}

server {
    listen 80;
    server_name draw.lyan.me; # 你的域名
    # 强制跳转https
    rewrite ^(.*) https://$server_name$1 permanent;
}
```

最后重启 nginx, 使用 `service nginx restart` 命令重启。
```
[root@host conf.d]# service nginx restart
Stopping nginx:                                            [  OK  ]
Starting nginx:                                            [  OK  ]
```
访问 [https://draw.lyan.me](https://draw.lyan.me) ，(PS: 我的服务器配置了dns解析)，即可发现https已经生效
![image.png](https://upload-images.jianshu.io/upload_images/188895-eaa4b72f3333439e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
