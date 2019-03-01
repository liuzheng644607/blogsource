---
layout: post
title: 使用shell命令从请求日志中分析pv、uv
date: 2019-01-01 11:05:58
tags: [shell, 日志分析]
---

> 在日常工作中，我们经常要统计用户的访问量。
对于pv、uv的统计方式有很多，一般就是前端主动埋点，然后去相关的系统里面查看。
但有时候，前端可能忘记埋点，或者一些其它原因，导致拿不到pv、uv。这个时候，我们可以通过用户的请求日志中来分析出pv、uv。

#准备
假如我们有如下日志，其中***user_id***为用户唯一id，那么就可以通过这个字段来统计UV。其实我们的需求就是匹配出每行日志中的user_id值，然后进行排序，去重，就可以拿到数量了。最简单的办法是通过正则匹配，在这篇文章里我们另辟蹊径。

<!-- more -->
**⚠️注意：如果生产环境日志量比较大，可以先把日志下载到本地再进行分析，避免在生产环境执行命令导致线上机器卡死**
out.log
```shell
2019-01-07 23:56 +08:00: 200 'GET' '/v/1.0' 'serial=12312&version=2050006&ad=1231&poiId=162912563&poiName=%E5%9B%9B%E5%AD%A3%E5%A4%A7%E7%A2%97%E7%B2%A5&user_id=161991&source=android&role=1&f=android 'SPEND:' 0
2019-01-07 23:57 +08:00: 200 'GET' '/v/1.0' 'serial=32332&version=2050006&ad=1231&poiId=162912563&poiName=%E5%9B%9B%E5%AD%A3%E5%A4%A7%E7%A2%97%E7%B2%A5&user_id=161992&source=android&role=1&f=android 'SPEND:' 0
2019-01-07 23:58 +08:00: 200 'GET' '/v/1.0' 'serial=wrwer&version=2050006&ad=1231&poiId=162912563&poiName=%E5%9B%9B%E5%AD%A3%E5%A4%A7%E7%A2%97%E7%B2%A5&user_id=161993&source=android&role=1&f=android 'SPEND:' 0
2019-01-07 23:59 +08:00: 200 'GET' '/v/1.0' 'serial=qweeq&version=2050006&ad=1231&poiId=162912563&poiName=%E5%9B%9B%E5%AD%A3%E5%A4%A7%E7%A2%97%E7%B2%A5&user_id=161993&source=android&role=1&f=android 'SPEND:' 0
```
# Grep 命令
命令格式：grep [option] pattern file
- 第一步： 过了出out.log中对应接口的日志
代码如下，/v/1.0 是我的日志中http请求的某个path，我想统计每天还有多少用户在访问这个path
```
grep /v/1.0 out.log
```
- 第二步：从上面的结果中过滤出2019-01-07这天的数据，我们使用管道 | 符操作.
```
grep /v/1.0 out.log | grep 2019-01-07
```
# awk 命令
- 第三步：使用awk -F 将每行日志以固定的字符串分割成多段, 类似于javascript中的.split 方法。在本示例中，以***user_id=***分割，'{print $2}' 表示打印出第二段
```
grep /v/1.0 out.log | grep 2019-01-07 | awk -F "user_id=" '{print $2}'
```
结果如下
```
161991&source=android&role=1&f=android 'SPEND:' 0
161992&source=android&role=1&f=android 'SPEND:' 0
161993&source=android&role=1&f=android 'SPEND:' 0
161993&source=android&role=1&f=android 'SPEND:' 0
```
- 第四步：再使用awk -F按&符号分割日志，然后取第一个数据，也就是user_id的值。
```
grep /v/1.0 1.log | grep 2019-01-07 | awk -F "user_id=" '{print $2}' | awk -F "&" '{print $1}'
```
结果
```
161991
161992
161993
161993
```
- 最后，也就是完整的命令，进行排序、去重，统计数量。
```
grep /v/1.0 1.log | grep 2019-01-07 | awk -F "user_id=" '{print $2}' | awk -F "&" '{print $1}' | sort | uniq | wc -l
```
得到结果 3，即是我们想要的数据。