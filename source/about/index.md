---
layout: page
# title: 关于我
# date: 2019-03-03 15:38:27
# tags:
---
<!-- <div class=""><button class="print-page">打印</button></div> -->
# 刘燕
---
* 性别：男&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年龄：28 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：18200397969 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;邮箱： liu-yaner@foxmail.com
* 目标职位：前端开发工程师

### 教育信息
| 时间 |  学校  | 专业 | 学历 |
| :---- |  :----  | :---- | :---- |
| 2011.09~2015.06 |  西华大学  | 电⼦子商务 | 全日制本科 |

### 主要技能
* 主要技术栈：react/typescript/nodejs
* 熟悉 javascript/typescript，并有使用typescript 开发⼤型项⽬经验
* 熟练使⽤react/less/react-router/mobx等技术栈开发项⽬
* 熟练使⽤webpack，postcss等⼯具搭建项⽬脚⼿手架
* 熟练使⽤nodejs，使⽤koa框架开发node应⽤
* 了解RPC调用，有使⽤thrift 经验; 熟悉常⽤的shell命令
* 有electron项目开发经验
* 有react-native开发经验

### 工作经历
| 期间 |  公司  | 职位 | 
| :---- |  :----  | :---- |
| 2017.08 ~ 至今 |  美团  | 前端开发工程师 |
| 2015.07~2017.07 |  去哪儿网  | 前端开发工程师 |

##### 美团（2017.08 ~ 至今）
* 负责餐饮生态开通支付的UI SDK开发，多个项目接入，使用webpack+typescript+react+mobx 搭建的脚手架。
* 负责收银软件管理端（PC管家、管家App）开发与维护，需求评审排期等，主要技术栈react、typescript、node；前后端分离，node通过thrift调用后端接口。
* 开发移动端react/react-native UI组件库，核心开发之一。
* 使用electron技术开发windows版收银机，设计打包、静默更新等。
* 开发下一代收银系统PC/h5 端。
* 开发基于云函数的灰度代理服务。

##### 去哪儿（2015.07~2017.07）
* 负责去哪儿网客户端民宿频道开发、维护，包括app端与touch端。app端使用了react-native技术，混杂有hybrid页面，以前的客户端民宿频道完全是hybrid的，后来全部以react-native重构。
* 开发内部数据统计分析系统（后端代码基本上用Node，当然包括了多种技术，比如redis、kafka、zookeeper、web soket、bash、mysql、elastic search等），该系统是基于前端埋点的数据统计分析系统，由多个子系统构成，每个系统都有参与开发与设计。我主要开发了用于离线分析的定时任务模块(基于node-schedule，主进程管理任务，子进程跑任务)；以及前端UI展现（包括用户端与管理端）。
* 自定义数据报表系统。该系统可以让用户指定数据源（DB、http interface等），通过一系列的配置生成数据报表。
* 拉新助手app，使用公司内部出品的hybrid框架对拉新助手进行了重构。

### 其它信息
* <i class="fa fa-fw fa-github"></i>GitHub&nbsp;: https://github.com/liuzheng644607
* <i class="fa fa-fw fa-globe"></i>Blog&nbsp;&nbsp;&nbsp;&nbsp;: https://www.lyan.me/demo-entry
* <i class="fa fa-fw fa-globe"></i>简 书&nbsp;&nbsp;&nbsp;: http://www.jianshu.com/u/4d71fefa7a45

<!-- <script>
  var btn = document.querySelector('.print-page');
  btn && btn.onclick = function() {
    if (typeof window.print === 'function') {
      window.print();
    } else {
      alert('windows请使用 ctrl + p，mac请使用 command+p 打印')
    }
  }
</script> -->
<style>
    .print-page {
      float: right;
      line-height: 1;
      font-size: 12px;
    }
    .container .main-inner {
      margin-top: 0;
    }
    @media print {
      .container .main-inner {
        margin-top: 0;
      }
      .header, .comments, .footer, .gt-container {
        display: none;
      }
      .comments {
        margin: 0;
      }
      .main-inner hr {
        display: block;
        height: 1px;
        border-top: 2px dashed #ddd;
        /* border-image: repeating-linear-gradient(-45deg, #fff, #fff 4px, transparent 4px, transparent 8px); */
      }
    }
    .main-inner th {
      border-bottom: 0
    }
</style>