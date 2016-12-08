/**
 * Created by Jaeger on 2016/12/8.
 */
goTop = function (btnId) {
    var winW = document.documentElement.clientWidth;
    if (winW <= 768) {
        return;
    }

    var compatMode = document.compatMode,
        isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1,
        scrollEle = compatMode === "BackCompat" || isChrome ? document.body : document.documentElement,
        toTopImg = document.getElementById(btnId),
        rate = 0.8,
        timeGap = 20;

    //返回顶部图标的点击响应
    toTopImg.onclick = function () {
        var moveInterval = setInterval(moveScroll, timeGap);

        function moveScroll() {
            var scrollTop = scrollEle.scrollTop;
            if (scrollTop === 0) {
                clearInterval(moveInterval);
                return;
            }
            scrollEle.scrollTop = scrollTop * rate;
        }
    };

    //滚动时判断是否显示返回顶部图标
    window.onscroll = function () {
        var display = toTopImg.style.display;
        if (scrollEle.scrollTop > 200) {
            if (display !== "block") {
                toTopImg.style.display = "block";
            }
        } else {
            if (display !== "none") {
                toTopImg.style.display = "none";
            }
        }
    };
};