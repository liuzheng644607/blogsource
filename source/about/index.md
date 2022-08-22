---
layout: page
# title: 关于我
# date: 2019-03-03 15:38:27
# tags:
---

<button id="btn-print" class="btn-print">打印</button>

# 刘燕
---
* 性别：男&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年龄：<span id="my-age"></span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：18200397969 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;邮箱： liu-yaner@foxmail.com
* 目标职位：前端

### 教育信息
| 时间 |  学校  | 专业 | 学历 |
| :---- |  :----  | :---- | :---- |
| 2011.09~2015.06 |  西华大学  | 电⼦子商务 | 全日制本科 |

### 主要技能
* 主要技术栈：react/typescript/nodejs
* 熟悉 javascript/typescript，并有使用typescript 开发⼤型项⽬经验
* 熟练使⽤react/webpack/typescript/node等技术栈开发项⽬
* 有electron项目开发经验
* 有react-native开发经验
* 有低代码平台开发经验

### 工作经历
| 期间 |  公司  | 职位 | 
| :---- |  :----  | :---- |
| 2021.06 ~ 今      |  树根互联 | 高级前端开发工程师
| 2017.08 ~ 2021.06 |  美团  | 高级前端开发工程师 |
| 2015.07 ~ 2017.07 |  去哪儿网  | 前端开发工程师 |

##### 树根互联（2021.06 至今）
* 负责根云平台低代码平台开发
  - 低代码编辑器核心设计开发，负责低代码产品包括应用搭建（aPaaS）、集成流（iPaaS）的开发设计，参与了整个低代码平台从设计态、运行时等核心环节，整个平台使用ts/react/node/webpack 技术栈。
* 主导PC组件库、移动端（h5）组件库开发，服务平台多个项目。
* 负责前端研发流程、CI CD等工作，负责多个前端公共lib开发（后端接口定义转ts类型定义、多主题打包工具等）

##### 美团（2017.08 ~ 2021.06)
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
---
### 其它信息
* <i class="fa fa-fw fa-github"></i>GitHub&nbsp;: https://github.com/liuzheng644607
* <i class="fa fa-fw fa-globe"></i>Blog&nbsp;&nbsp;&nbsp;&nbsp;: https://www.lyan.me/demo-entry
* <i class="fa fa-fw fa-globe"></i>简 书&nbsp;&nbsp;&nbsp;: http://www.jianshu.com/u/4d71fefa7a45

<img src="/assets/myqrcode.png" style="margin: 30px auto 0 auto" />

<div id="mask-text" class="mask-text">From: https://www.lyan.me</div>

<style>
    .mask-text {
      font-size: 12px;
      margin-top: 24px;
      opacity: 0;
      width: 100%;
      text-align: center;
    }
    .btn-print {
      float: right;
      line-height: 1;
      font-size: 12px;
      margin-top: 16px;
    }
    .container .main-inner {
      margin-top: 0;
    }

    @page {
      /* size: 210mm 290mm​; */
    }

    @media print {
      .container .main-inner {
        margin-top: 0;
      }
      .btn-print {
        display: none;
      }
      .mask-text {
        opacity: 1;
      }
      h1 {
        margin-top: 0;
      }
      .header, .comments, .footer, .gt-container {
        display: none;
      }
      aside {
        opacity: 0;
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

<script>
(function() {
  function genMask() {
    var maskText = document.getElementById('mask-text');
    var myAge = document.getElementById('my-age');
    var fn = function() {
      if (maskText) {
        
        maskText.innerText = 'From: ' + location.href + ' 日期:' + new Date();
      }

      if (myAge) {
        myAge.innerText = new Date().getFullYear() - 1992;
      }

      setTimeout(fn, 3000);
    }

    fn();
    
  }
  function bindPrint() {
    var btn = document.getElementById('btn-print');
    if (!btn) return;
    btn.onclick = function() {
      if (typeof window.print === 'function') {
        window.print();
      } else {
        alert('windows请使用 ctrl + p，mac请使用 command+p 打印')
      }
    }
  }
  genMask();
  bindPrint();
})();





</script>