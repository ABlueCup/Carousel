使用说明:
方法carouselBanner挂载在jQuery的原型上，jQuery的实例可以直接调用
1，HTML结构必须, 最外层的section的class可以修改，里面的标签的class不能修改。
```html
    <section class="carouselContainer">
        <ul class="wrapper bannerBox">
        </ul>
        <ul class="focusBox">

        </ul>
        <a href="javascript:;" class="arrow arrowLeft"></a>
        <a href="javascript:;" class="arrow arrowRight"></a>
    </section>
```
2, css中必须的样式
```css
.focusBox li.current{
    //必须有，但是样式内容可以修改
}
```
3，js中的初始化,包含了一些列的操作，其中
```js
bindHTML(images); //数据绑定，必须的
changeLi(0); // 下标的初始化
autoPlay(); // 自动播放
$arrowRight.on('click', nextBanner); // 点击下一张
$arrowLeft.on('click', previousBanner); // 点击上一张
$bannerContainer.on('mouseenter',function(){ // 鼠标移入和移除
    clearInterval(autoTimer);
}).on('mouseleave',function(){
    autoPlay();
});
$focusLi.on('click', function(){ // 下标的点击
    clearInterval(autoTimer);
    step = $(this).index();
    changeBanner(step);
    autoPlay();
});
```
