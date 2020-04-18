<?php
$this->title = 'Чай, Кофе и Подарки';
?>
<div class="site-index">
    <section class="container">
        <section class="row first-block">
            <section class="col-md-3 first-section">
                <div id="menu-catalog" class="catalog">
                <?php
                    foreach ($data as $val) {
                        if($val->parent_id == 0) {
                            echo "<ul class='menu-li' data-id='{$val->id}'>
                                  <span class='{$val->photo}'></span>
                                  <span class='title-item {$val->class}'>{$val->name}</span>
                                  <span class='icon glyphicon glyphicon-menu-right btn-xs'></span></ul>";
                        }
                    }
                ?>
                </div>
            </section>
            <section class="col-md-9 second-section">
                <div id="carousel-tea-coffee" class="carousel slide">
                    <ol class="carousel-indicators">
                        <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                        <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                        <li data-target="#carousel-example-generic" data-slide-to="2"></li>
                    </ol>
                    <div class="carousel-inner" role="listbox">
                        <div class="item active">
                            <img class="item-img" src="/images/pic_05.jpg" alt="First slide">
                        </div>
                        <div class="item">
                            <img class="item-img" src="/images/pic_05.jpg" alt="First slide">
                        </div>
                        <div class="item">
                            <img class="item-img" src="/images/pic_05.jpg" alt="First slide">
                        </div>
                    </div>
                    <a class="left carousel-control" href="#carousel-tea-coffee" role="button" data-slide="prev">
                        <span class="icon-prev" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="right carousel-control" href="#carousel-tea-coffee" role="button" data-slide="next">
                        <span class="icon-next" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>

                <div id="carouselCoffee" class="carousel-coffee">
                    <div class="carousel-coffee-inner">
                        <span class="carousel-coffee-inner-text">КАК ПРАВИЛЬНО ЗАВАРИВАТЬ ЧАЙ</span>
                        <div class="carousel-coffee-inner-line">
                            <div class="div-tea black">ЧЁРНЫЙ</div>
                            <div class="div-tea green">ЗЕЛЁНЫЙ</div>
                            <div class="div-tea red">КРАСНЫЙ</div>
                            <div class="div-tea yellow">ЖЁЛТЫЙ</div>
                            <div class="div-tea white">БЕЛЫЙ</div>
                            <div class="line-tea">
                                <span class="line-tea-text">Заварки на 200 мл. воды</span>
                            </div>
                            <div class="block-tea block-tea-one">
                                <span class="block-tea-span">1 ч.ложка</span>
                                <span class="block-tea-span">3 гр.</span>
                                <span class="block-tea-span">2 гр.</span>
                                <span class="block-tea-span">4 гр.</span>
                                <span class="block-tea-span">2 ч.ложки</span>
                            </div>
                            <div class="line-tea">
                                <span class="line-tea-text-two">Температура воды</span>
                            </div>
                            <div class="block-tea block-tea-two">
                                <span class="block-tea-span">90-100 &#8451;</span>
                                <span class="block-tea-span">80 &#8451;</span>
                                <span class="block-tea-span">95-97 &#8451;</span>
                                <span class="block-tea-span">85 &#8451;</span>
                                <span class="block-tea-span">50-70 &#8451;</span>
                            </div>
                            <div class="line-tea">
                                <span class="line-tea-text-tree">Время заваривания</span>
                            </div>
                            <div class="block-tea block-tea-tree">
                                <span class="block-tea-span">4-7 мин.</span>
                                <span class="block-tea-span">5 мин.</span>
                                <span class="block-tea-span">5 мин.</span>
                                <span class="block-tea-span">8-10 мин.</span>
                                <span class="block-tea-span">5 мин.</span>
                            </div>
                        </div>


                    </div>
                </div>
            </section>
        </section>
    </section>

    <section class="container-fluid">

        <section class="row">
            <section class="col-md-12 third-section">

            </section>
        </section>

    </section>

    <section id="allProducts" class="container-fluid">

        <section class="row">
            <section class="col-md-12 all-products">

            </section>
        </section>

    </section>

    <section class="container-fluid">

        <section class="row fourth-block">
            <section class="col-md-12 fourth-section">
                <h4 class="title" style="text-align: center">Новинки</h4>
            </section>
        </section>

    </section>

    <section class="container-fluid">

        <section class="row fifth-block">
            <section class="col-md-12 fifth-section">
                <h4 class="title-viewed-products" style="text-align: center;color: #BA975F;">Новости</h4>
            </section>
        </section>

    </section>

    <section class="container-fluid last-goods">

        <section class="row">
            <section class="col-md-12 last-section"></section>
        </section>

    </section>
    
    <div class="pull-right">
        <a href="#home" class="scrollup"><i class="fa fa-angle-up fa-3x"></i></a>
    </div>
</div>