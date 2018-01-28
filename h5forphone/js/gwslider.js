
var gwslider = {
   touch: isSupportTouch(),
   targets: [],
   init: function (tar, page) {
      try {
         var has = false;
         for (var idx in this.targets) {
            if (this.targets[idx].target == tar) {
               has = true; break;
            }
         }
         if (!has) {
            this.targets.push({ target: tar, index: 0, page: page });
            tar.addEventListener('touchstart', this.touchstart, false);
         }
      } catch (e) {
         alert(e);
      }
   },
   touchstart: function (event) {
      try {
         var touch = event.targetTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
         gwslider.getdata(event.target).startPos = { x: touch.pageX, y: touch.pageY, time: +new Date }; //取第一个touch的坐标值
         gwslider.getdata(event.target).isScrolling = 0; //这个参数判断是垂直滚动还是水平滚动
         event.target.addEventListener('touchmove', gwslider.touchmove, false);
         event.target.addEventListener('touchend', gwslider.touchend, false);
      } catch (e) {
         alert(e);
      }
   },
   touchend: function (event) {
      var startPos = gwslider.getdata(event.target).startPos;
      var endPos = gwslider.getdata(event.target).endPos;
      var duration = +new Date - startPos.time; //滑动的持续时间
      var page = gwslider.getdata(event.target).page;
      if (gwslider.getdata(event.target).isScrolling === 0) { //当为水平滚动时
         //    this.icon[this.index].className = '';
         if (Number(duration) > 10) {
            //判断是左移还是右移，当偏移量大于10时执行
            if (endPos.x > 10) {
               if (page) {
                  page({ index: -1, duration: duration });
               } else
                  //if (this.index !== 0) this.index -= 1;
                  alert("左右");
            } else if (endPos.x < -10) {
               //if (this.index !== this.icon.length - 1) this.index += 1;
               if (page) {
                  page({ index: 1, duration: duration });
               } else
                  alert("右左");
            }
         }
         //    this.icon[this.index].className = 'curr';
         //    this.slider.className = 'cnt f-anim';
         //    this.slider.style.left = -this.index * 600 + 'px';
      }
      //解绑事件
      event.target.removeEventListener('touchmove', gwslider.touchmove, false);
      event.target.removeEventListener('touchend', gwslider.touchend, false);
   },
   touchmove: function (event) {
      if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
      var touch = event.targetTouches[0];
      try {
         var startPos = gwslider.getdata(event.target).startPos;
         gwslider.getdata(event.target).endPos = { x: touch.pageX - startPos.x, y: touch.pageY - startPos.y };
         endPos = gwslider.getdata(event.target).endPos;
         gwslider.getdata(event.target).isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
         if (gwslider.getdata(event.target).isScrolling === 0) {
            event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
            //this.slider.className = 'cnt';
            //this.slider.style.left = -this.index * 600 + endPos.x + 'px';
         }
      } catch (e) {
         alert(e);
      }
   }, getdata: function (tar) {
      for (var idx in gwslider.targets) {
         if (gwslider.targets[idx].target == tar || isChild(gwslider.targets[idx].target, tar)) {
            return gwslider.targets[idx];
         }
      }
      alert(gwslider.targets.length);
      return null;
   }
}
function isSupportTouch() {
   try {
      supportsTouch = false;
      if ('ontouchstart' in window || 'ontouchstart' in document) {
         //iOS & android
         supportsTouch = true;
      } else if (window.navigator.msPointerEnabled) {
         //Win8
         supportsTouch = true;
      }
      //alert(supportsTouch);
      return supportsTouch;
   } catch (e) {
      alert(e);
   }
}
function isChild(p, c) {
   if (c.parentNode == null) {
      return false;
   }
   else if (c.parentNode == p) {
      return true;
   } else {
      return isChild(p, c.parentNode);
   }
}