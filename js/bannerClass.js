~function ($) {
    var carouselBanner = function carouselBanner(images, speed, duration) {
        //参数验证
        if (typeof images === 'undefined') {
            console.log("没有传入图片数据信息！");
            return;
        }
        if (!(images instanceof Array)) {
            console.log("数据格式应为数组的样式");
            return;
        }
        if (typeof speed === 'undefined') {
            speed = 500;
        }
        if (typeof duration === 'undefined') {
            duration = 2000;
        }
        console.log(speed, duration);

        //var _that = this; //保存操作对象      
        var $bannerContainer = this.find(".bannerBox"),
        $arrowLeft = this.find(".arrowLeft"),
        $arrowRight = this.find('.arrowRight'),
        $focusContainer = this.find('.focusBox'),
        $focusLi = null,
        containerWidth = parseFloat(this.width());
        ;
        //设置公共变量
        var count = 0, autoTimer = null, step = 0
            ;
        var bindHTML = function bindHTML(images) {
            var frg = document.createDocumentFragment();
            var frg1 = document.createDocumentFragment();
            var frg2 = document.createDocumentFragment();
            $.each(images, function (index, item) {
                var ele = document.createElement('img');
                ele.src = item['img'];
                ele.alt = item["desc"];
                var _a = document.createElement("a");
                _a.href = item["link"];
                var _i = document.createElement("li");
                _a.appendChild(ele);
                _i.appendChild(_a);
                if (index === 0) {
                    var _last = _i.cloneNode(true);
                    frg1.appendChild(_last);
                }
                frg.appendChild(_i);
                var focus = document.createElement('li');
                frg2.appendChild(focus);
            });
            $bannerContainer.width(containerWidth * (images.length + 1) + 'px');
            $bannerContainer.append(frg);
            $bannerContainer.append(frg1);
            $focusContainer.append(frg2);
            $focusLi = $focusContainer.find('li');

        }
        //focustList样式
        var changeLi = function changeLi(i){
            $focusLi.each(function(index, item){
                $(item).removeClass('current');
            });
            $focusLi.eq(i).addClass('current');
        }
        var changeBanner = function changeBanner(index) { //切换到索引为Index的图片
            if (index < 0 || index > images.length) return;

            var distance = -index * containerWidth + 'px';
            $bannerContainer.stop().animate({ 'left': distance }, speed, function () {
                changeLi(index);
                if (index >= 4) {
                    index = 0;
                    $bannerContainer.stop().animate({ 'left': 0 }, 0);
                    changeLi(index);
                }
            });
        }
        //下一张图片
        var nextBanner = function nextBanner(){
            clearInterval(autoTimer);
            step++;
            changeBanner(step);
            if (step >= images.length) {
                step = 0;
            }
            autoPlay();
        }
        //上一张图片
        var previousBanner = function previousBanner(){
            clearInterval(autoTimer);
            step--;
            if (step < 0) {
                $bannerContainer.stop().animate({ 'left': -images.length*containerWidth+'px' }, 0);
                step = 4;
                step--;
            }
            changeBanner(step);
            autoPlay();
        }
        
        //自动播放
        function autoPlay() {
            autoTimer = setInterval(function () {
                step++;
                changeBanner(step);
                if (step >= 4) {
                    step = 0;
                }
            }, duration);
        }
        $.each(images, function (index, item) {
            //验证images里面是否是对象，格式是否正确
            if (typeof item !== 'object') {
                console.log("数据格式应为[{img:'img/1.jpg', link:'...', desc:'...'}]");
                return;
            }
            var tmpImg = new Image();
            tmpImg.src = item["img"];
            $(tmpImg).on('load', function () {
                count++;
                if (count === images.length) {
                    bindHTML(images);
                    changeLi(0);
                    autoPlay();
                    $arrowRight.on('click', nextBanner);
                    $arrowLeft.on('click', previousBanner);
                    $bannerContainer.on('mouseenter',function(){
                        clearInterval(autoTimer);
                    }).on('mouseleave',function(){
                        autoPlay();
                    });
                    $focusLi.on('click', function(){
                        clearInterval(autoTimer);
                        step = $(this).index();
                        changeBanner(step);
                        autoPlay();
                    });
                }
            })
        });
    }
    $.fn.extend({ carouselBanner });
}(jQuery);