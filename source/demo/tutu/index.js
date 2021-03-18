(function(window) {

  function getCurrentTime() {
    var req = new XMLHttpRequest();
    req.open('GET', location, false);
    req.send(null);
    var date = req.getResponseHeader('Date');
    console.log(date);
    return new Date(date || undefined);
  }
  
  function subDate(p) {
    var day = Math.floor(p / 86400);
    var h = Math.floor((p % 86400) / 3600);
    var m = Math.floor(((p % 86400) % 3600) / 60);
    var s = Math.floor(p % 60);
    return {
      day: day,
      hour: h,
      m: m,
      s: s,
    }
  }

  var app = {
    currentTime: getCurrentTime(),

    showCurrentTime: function() {
      var that = this;
      function innerLoop() {
        var time = that.currentTime;
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var dat = time.getDate();
        var hours = time.getHours();
        var mm = time.getMinutes();
        var ss = time.getSeconds();
        jsCurrentTime.innerText = '当前时间：' + year + "年" + month + "月" + dat + "日" + hours + "时" + mm + "分" + ss + "秒";
        setTimeout(innerLoop, 1000);
      }
      innerLoop();
    },

    gaokaoCutdown: function() {
      var that = this;
      function innerLoop() {
        var time = that.currentTime;
        var future = new Date(2037, 05, 07, 0, 0, 0);
        var p = (future - time) / 1000;
        var res = subDate(p);
        var day = res.day;
        var h = res.hour;
        var m = res.m;
        var s = res.s;
        djs.innerHTML = "距离刘严谨小朋友高考还有：" + day +  "日" + h + "时" + m + "分" + s + "秒";
        setTimeout(innerLoop, 1000);
      }
      innerLoop();
    },

    hasBorn: function() {
      var that = this;
      function innerLoop() {
        var time = that.currentTime;
        var future = new Date(2021, 01, 16, 16, 34, 0);
        var p = -(future - time) / 1000;
        var res = subDate(p);
        var day = res.day;
        var h = res.hour;
        var m = res.m;
        var s = res.s;
        jsBornDay.innerHTML = "刘严谨小朋友出生已经：" + day +  "日" + h + "时" + m + "分" + s + "秒";
        setTimeout(innerLoop, 1000);
      }
      innerLoop();
    },

    updateCurrentTime: function() {
      var that = this;
      function update() {
        that.currentTime = new Date(that.currentTime.getTime() + 1000);
        setTimeout(update, 1000)
      }
      setTimeout(update, 1000);
    },

    init: function() {
      this.updateCurrentTime();
      this.showCurrentTime();
      this.gaokaoCutdown();
      this.hasBorn();
    }
  }

  app.init();

})(window)