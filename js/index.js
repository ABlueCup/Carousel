let carouselRender = (function () {
    //获取要操作的对象
    let $container = $(".carouselContainer"),
        $bannerBox = $container.find(".bannerBox"),
        $focusBox = $container.find(".focusBox"),
        $focusList = $focusBox.find('li'),
        $arrowBox = $container.find(".arrow"),
        $arrowLeft = $container.find('.arrowleft'),
        $arrowRight = $container.find(".arrowRight")
        ;
    let result = null,
        str = ``,
        step = 0,
        autoTimer = undefined
        ;
    //绑定数据
    let bindHTML = function bindHTML(result) {
        let _s = ``;
        result.forEach(({ img, desc, link } = item, index) => {
            index === 0 ? _s = `<li><a href="${link}"><img src="${img}" alt="${desc}"></a></li>` : null;
            str += `<li><a href="${link}"><img src="${img}" alt="${desc}"></a></li>`;
        });
        str += _s;
        $bannerBox.css("width", `${1000 * (result.length + 1)}`);
        $bannerBox.html(str);
    }
    //切换图片
    let changeBanner = function changeBanner(index) {
        if (index < 0 | index > 4) {
            return;
        }
        $focusList.each(function () {
            $(this).css('background-color', '');
        });
        $focusList.eq(index).css('background-color', 'blue');
        if (index >= 4) {
            $focusList.eq(0).css('background-color', 'blue');
        }
        $bannerBox.stop().animate({ "left": `${-1000 * index}px` }, 500, function () {
            if (index >= 4) {
                $bannerBox.stop().animate({ "left": 0 }, 0);
            }
        });
    }
    // 自动播放
    let autoPlay = function autoPlay() {
        autoTimer = setInterval(function () {
            step++;
            changeBanner(step);
            if (step === 4) {
                step = 0;
            }
        }, 2000);
    }

    // 箭头上一个
    let previousBanner = function () {
        clearInterval(autoTimer);
        if (step === 0) {
            step = 4;
            $bannerBox.stop().animate({ "left": `${-1000 * step}px` }, 0, function () {
                step--;
                changeBanner(step);
                autoPlay();
            });
            return;
        }
        step--;
        changeBanner(step);
        autoPlay();
    }
    //箭头 下一个
    let nextBanner = function nextBanner() {
        clearInterval(autoTimer);
        // 
        step++;
        changeBanner(step);
        if (step >= 4) {
            step = 0;
        }
        autoPlay();
    }
    return {
        init: function init() {
            new Promise((resolve, reject) => {
                $.ajax('./json/banner.json', {
                    method: 'GET',
                    dataType: 'json',
                    success: function (result) {
                        resolve(result);
                    }
                })
            }).then(result => {
                return new Promise((resolve, reject) => {
                    let count = 0;
                    result.forEach(({ img } = item) => {
                        let tempImg = new Image();
                        tempImg.src = img;
                        tempImg.onload = function () {
                            count++;
                            if (count === result.length) {
                                resolve(result);
                            }
                        }
                    });
                });
            }).then(result => {
                bindHTML(result);
                $focusList.eq(step).css('background-color', 'blue');
                autoPlay();
                $arrowLeft.on('click', previousBanner);
                $arrowRight.on('click', nextBanner);
                $bannerBox.on('mouseenter', function () {
                    clearInterval(autoTimer);
                }).on('mouseleave', autoPlay);
                $focusList.on('click', function () {
                    clearInterval(autoTimer);
                    let i = $(this).index();
                    step = i;
                    changeBanner(i);
                    autoPlay();
                });
            }).finally(msg => {
                console.log(msg);
            });
        }
    }
})();
carouselRender.init();




