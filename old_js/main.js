/**
 * Created by Oleg Ivanov on 01.07.18.
**/
$(document).ready(function(){
    let onHashChange,
        dataGP,
        listProd,
        showLoc = true;

    localStorage.setItem('goods','[]');
    navigator.geolocation.getCurrentPosition(showLocation);

    if(showLoc) {
        $('.location-body')
            .append(
                '<div id="loc" class="loc-city">Сверд. обл., г. БЕРЕЗОВСКИЙ, ул. Театральная 6</div>'
            );
    }

    setTimeout(function () {
        $('#loc').fadeIn();
    },1000);

    model.ajax('POST','/requests.php','json',undefined,function (dt) {
        if(dt.result) {
            dataGP = dt.data;
        }
        else {
            model.msgAct('Ошибка!!!',dt.reason,'error',3000)
        }
    });

    $('#carousel-tea-coffee').carousel({interval: 5000});

    let tm = setInterval(function () {
        if(dataGP != undefined) {
            clearInterval(tm);
            basket.init();
            promotional_items.init(dataGP);
            viewed_products.init();
            show_info.init();
            fillingMenu();
            fillingArticle(dataGP.articles);
            news.init(dataGP.news);
        }
    },10);

    $(window).scroll(function(){
        let val = $(this).scrollTop();
        if (val == 0) {
            // $('.scrollup').fadeOut();
            // $('.tea-navbar').css({'margin-top':30});
        }
        else {
            // $('.scrollup').fadeIn();
            // $('.tea-navbar').css({'margin-top':'0px','top':'0px'});
        }
    });
    $('.scrollup').click(function(){
        $("html, body")
            .animate({
                scrollTop: 0
            }, 500, function () {});
        return false;
    });

    $(document)
        .off('keyup')
        .on('keyup',function (e) {
            onKeyUp(e, listProd, dataGP);
        });

    $(document)
        .off('click', '.closeWin')
        .on('click', '.closeWin' ,function (e) {
            // e.stopPropagation();
            e.preventDefault();
            delFone();
        });

    function showLocation(position) {
        showLoc = false;
        $('#loc').remove();
        $('.location-body')
            .append(
                '<div id="loc" class="loc-city">Выберите город</div>'
            );

        $('.location-body-name')
            .append(
                '<div id="locTwo" class="loc-city-two">Сверд. обл., г. БЕРЕЗОВСКИЙ, ул. Театральная 6</div>'
            );

        let lng = position.coords.longitude,
            lat = position.coords.latitude,
            city = localStorage.getItem('location'),
            key = 'ZdbaNU1uGzfrAPHk9eY20MdHyI1qoNOM';//consKey: 'ZdbaNU1uGzfrAPHk9eY20MdHyI1qoNOM',  consSec: 'KrzKrHnRXMfDEXTr'
        if(city != null) {
            $('#loc').text(city);
        }
        let data = {
            location: {
                latLng: {
                    lat: lat,
                    lng: lng
                }
                },
                options: {
                    thumbMaps: false
                },
                includeNearestIntersection: true,
                includeRoadMetadata: true
            },
            url = "https://www.mapquestapi.com/geocoding/v1/address?key="+key;
        model.ajax('POST',url,'json',data,function (dt) {
            if (dt.info.statuscode == 0) {
                let mainAdr = dt.results[0],
                    newCity = mainAdr.locations[0].adminArea3;
                if(city != null) {
                    if(city != newCity) {
                        if (confirm('Ваш город ' + newCity + '')) {
                            localStorage.setItem('location', newCity);
                            $('#loc').text(newCity);
                        } else {
                            $('#loc').text(city);
                        }
                    }
                }
                else {
                    $('#loc').text(newCity);
                    localStorage.setItem('location', newCity);
                }
            }
            else {
                if(city == null) {
                    $('#loc').text('Выберите город');
                }
            }
        });
    }

    setTimeout(function () {
        const arrProm = [
            {id:1,photo:'/images/pic_04.png',text:'Скидка 10% на подарочные наборы'},
            {id:2,photo:'/images/pic_03.png',text:'100 гр. фруктового чая в ПОДАРОК при покупке двух видов чая по 150 гр'},
            {id:3,photo:'/images/pic_02.png',text:'При любой покупке в ноябре получите КУПОН на скидку'},
            {id:4,photo:'/images/pic_01.png',text:'Товары месяца'}
        ];
        $('.site-index')
            .append(
                '<div class="site-index-promos">' +
                    '<button class="btn btn-link hideWindow">' +
                        '<span class="glyphicon glyphicon-chevron-right"></span>' +
                        '<span class="title-hide-window">Акции</span>' +
                    '</button>' +
                    '<h4 class="title-promos-left">Акции</h4>' +
                    '<div class="promos-left-body"></div>' +
                '</div>'
            );
        $('.site-index-promos')
            .fadeIn();
            // .animate({
            //     'width':'315px'
            // },function () {
            //     $('.title-promos-left').show();
            //     $('.promos-left-body').fadeIn();
            //     $('.title-hide-window').hide();
            // });
        // fillPromos(arrProm);
        $(document)
            .off('click','.hideWindow')
            .on('click','.hideWindow',function () {
                let w = $('.site-index-promos').width();
                if(w > 0) {
                    $('.promos-left-body').fadeOut(function () {
                        $('.site-index-promos')
                            .animate({
                                'width':'0px'
                            }, function () {
                                $('.promos-left-body').empty();
                                $('.title-promos-left').hide();
                                $('.title-hide-window').show();
                            });
                        $('.glyphicon-remove')
                            .removeClass('glyphicon-remove')
                            .addClass('glyphicon-chevron-right');
                    });
                }
                else {
                    fillPromos(arrProm);
                    $('.title-promos-left').show();
                    $('.site-index-promos')
                        .animate({
                            'width':'315px'
                        },function() {
                            $('.promos-left-body').fadeIn();
                            $('.title-hide-window').hide();
                        });
                    $('.glyphicon-chevron-right')
                        .removeClass('glyphicon-chevron-right')
                        .addClass('glyphicon-remove');
                }
            });
    },3000);
    new WOW().init();
    $("img[class^='prettyPhoto']").prettyPhoto();

    onHashChange = function() {
        let uri = document.location.href.split('!')[1];
        routers.router(uri);
    };

    let uri = document.location.href.split('!')[1];

    $(window)
        .bind('hashchange', onHashChange); //.trigger('hashchange');

});

function draggableElement(mouseOverBlock, dragElem) {
    $(mouseOverBlock)
        .css('cursor', 'move')
        .mousedown(function () {
            $(dragElem)
                .draggable({
                    scroll: false,
                    containment: "#index"
                });
        });
    $(mouseOverBlock)
        .css('cursor', 'move')
        .mouseup(function () {
            $(dragElem)
                .draggable({
                    scroll: false,
                    containment: "#index"
                });
            $(dragElem).draggable('destroy');
        });
}

function fillPromos(arrProm) {
    arrProm.forEach(function (v,k) {
        $('.promos-left-body')
            .append(
                '<div class="promotion-block" data-prom="'+v.id+'">' +
                    '<img class="promotion-block-photo" src="'+v.photo+'" alt="img" />' +
                    '<div class="promotion-block-span">'+v.text+'</div>' +
                '</div>'
            );
    });
}

function onKeyUp(e, listProd, dataGP) {
    let rtn = true;
    e = e || window.event;
    if(e.ctrlKey && e.keyCode == 221) {
        if($('.form').length == 0) {
            $('.wrap')
                .append(
                    '<div id="block-fon"></div>' +
                    '<form action="#" method="post" class="form no-select">' +
                        '<div class="login-window">' +
                            '<button class="btn btn-link btn-sm closeWin">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +
                            '</button>' +
                            '<label for="login" class="label-login">Логин</label>' +
                            '<input type="text" name="login" class="login" id="login" autofocus value="" />' +
                            '<label for="password" class="label-password">Пароль</label>' +
                            '<input type="password" name="password" class="password" id="password" value="" /><br />' +
                            '<label>' +
                                '<button type="submit" class="entrance">Вход</button>' +
                            '</label>' +
                        '</div>'+
                    '</form>'
                );
            $('#login').focus();

            $(document)
                .off('click','.entrance')
                .on('click','.entrance', function (e) {
                    e.preventDefault();
                    checkData(rtn, listProd, dataGP);
                });
        }
    }
    else if(e.keyCode == 27) {
        if ($('.form').length != 0) {
            delFone();
            rtn = false;
        }
    }
    else if (e.keyCode == 13) {
        if($('.form').length != 0) {
            checkData(rtn, listProd, dataGP);
            rtn = false;
        }
    }
    return rtn;
}

function checkData(rtn, listProd, dataGP) {
    let attempts = [];
    if ($('#login').val() == '') {
        let lgn = $('#login');
        lgn.val('Заполните поле');
        lgn[0].style.color = '#ff0000';
        $(document)
            .off('focus', '#login')
            .on('focus', '#login', function () {
                $(this)
                    .val('')
                    .css('color', '#253243');
            });
        if ($('#password').val() == '') {
            let psw = $('#password');
            psw.prop('type','text');
            psw.val('Заполните поле');
            psw[0].style.color = '#ff0000';
            $(document)
                .off('focus', '#password')
                .on('focus', '#password', function () {
                    $(this)
                        .val('')
                        .css('color', '#253243')
                        .prop('type','password');
                });
            rtn = false;
        }
        else {
            rtn = false;
        }
    }
    else {
        if ($('#password').val() == '') {
            let psw = $('#password');
            psw.val('Заполните поле');
            psw[0].style.color = '#ff0000';
            $(document)
                .off('focus', '#password')
                .on('focus', '#password', function () {
                    $(this)
                        .val('')
                        .css('color', '#253243')
                        .prop('type','password');
                });
            rtn = false;
        }
        else {
            let param = $('meta[name=csrf-param]').prop("content"),
                token = $('meta[name=csrf-token]').prop("content"),
                data = '{"login":"' + $('#login').val() + '","password":"' + $('#password').val() + '","_csrf":"' + token + '","param":"' + param + '"}';
            model.ajax('POST', '/requests.php', 'json', JSON.parse(data), function (dt) {
                if (dt.result) {
                    model.msgAct('Ответ', 'Вход разрешён', 'success', 3000);
                    createTemplateAdminPanel(listProd, dataGP);
                }
                else {
                    attempts.push(dt.reason);
                    model.msgAct('Ответ', dt.reason, 'error', 5000);
                    if (attempts.length == 3) {
                        $('.ui-pnotify').remove();
                        model.ajax('POST', '/requests.php', 'json', JSON.parse('{"block":"block","date":"' + moment() + '"}'), function (data) {
                            if (data.result) {
                                model.msgAct('Ответ', 'Ваш IP адрес заблокирован!!!', 'info', 5000);
                            }
                            else {
                                model.msgAct('Ответ', 'Ваш IP адрес заблокирован!!!', 'error', 5000);
                            }
                        });
                    }
                }
            });
            rtn = false;
        }
    }
    return rtn;
}

function createTemplateAdminPanel(listProd,dataGP) {
    delFone();
    $('.wrap')
        .append(
            '<section id="adminPanel" class="admin-panel">' +
                '<button class="btn btn-link collapseWindow">' +
                    '<span class="glyphicon glyphicon-minus"></span>' +
                '</button>' +
                '<button class="btn btn-link closeWindow">' +
                    '<span class="glyphicon glyphicon-remove"></span>' +
                '</button>' +
                '<div class="admin-panel-head">Панель администратора</div>' +
                '<div class="admin-panel-body">' +
                    '<div class="body-list-items">' +
                        '<div class="list-item active-item" data-info="goods">Товары</div>' +
                        '<div class="list-item" data-info="groups">Группы товаров</div>' +
                        '<div class="list-item" data-info="overs">Другое</div>' +
                    '</div>' +
                    '<div class="body-goods hide-block"></div>' +
                    '<div class="body-groups hide-block"></div>' +
                    '<div class="body-overs hide-block"></div>' +
                '</div>' +
                '<div id="modalWin" class="modal fade">'+
                    '<div class="modal-dialog">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header">'+
                                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
                                '<h3 class="modal-title">Товары</h3>'+
                            '</div>'+
                            '<div class="modal-body"></div>'+
                            '<div class="modal-footer">'+
                                '<button type="button" class="btn-bsretail info left-bsretail saveGoods">Сохранить в базе</button>'+
                                '<button type="button" class="btn-bsretail info" data-dismiss="modal">Закрыть</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</section>'
        );
    setTimeout(function () {
        $('#adminPanel')
            .slideDown('slow', function () {
                $('.wrap')
                    .append(
                        '<div id="block-fon"></div>'
                    );
                $('.body-groups')
                    .append(
                        '<div class="add-group">' +
                            '<input type="text" name="name" class="name-group input" placeholder="Название группы" autocomplete="off" />' +
                            '<select name="parent" class="parent-group select">' +
                                '<option value="null">Родитель</option>' +
                            '</select>' +
                            '<button id="addGroup" class="btn btn-sm btn-info">Добавить группу</button>' +
                            '<div class="list-groups">' +
                                '<b style="color: #8a6d3b; margin-bottom: 7px">Группы товаров' +
                                    '<span class="qty-gp"></span>' +
                                '</b>' +
                                '<div class="list-groups-body"></div>' +
                            '</div>' +
                        '</div>'
                    );

                $('.body-goods')
                    .append(
                        '<form method="post" name="form" action="/products.php" id="my-awesome-dropzone" enctype="multipart/form-data">' +
                            '<div class="add-product">' +
                                '<input value="" type="text" name="product" class="name-product input input-prd" placeholder="Название продукта" />' +
                                '<input value="" type="text" name="vendor" class="vendor-code-product input input-prd" placeholder="Артикул продукта" /><br />' +
                                '<input value="" type="text" name="unit" class="unit-product input input-prd" placeholder="Ед. измерения" />' +
                                '<input value="" type="text" name="price" class="price-product input input-prd" placeholder="Цена продукта" />' +
                                '<select name="group_id" class="group-product select">' +
                                    '<option value="null">Группа товаров</option>' +
                                '</select>' +
                                '<div id="myDropZone" class="dropzone сomposition-product textarea"></div>'+
                                '<textarea class="description-product textarea" name="description" placeholder="Описание продукта"></textarea>' +
                                '<textarea class="recipe-product textarea" name="recipe" placeholder="Рецепт приготовления"></textarea>' +
                                '<button id="addProduct" class="btn btn-sm btn-info">Добавить товар</button>' +
                                '<button id="changeProduct" class="btn btn-sm btn-info" data-uuid="" type="submit">Сохранить изменения</button>' +
                                '<button id="clearFields" class="btn btn-sm btn-danger">Очистить поля</button>' +
                            '</div>' +
                            '<div class="list-product">' +
                                '<div class="list-product-head">Товары</div>' +
                                '<div class="list-product-body"></div>'+
                            // '<input type="file" class="import-data" placeholder="Импорт данных" />' +
                            //'<button id="addGroup" class="btn btn-sm btn-info">Добавить группу</button>'
                            '</div>' +
                        '</form>'
                    );
                $('.body-overs')
                    .append(
                        '<div class="add-news">' +
                            '<div class="list-news-head">Новости</div>' +
                            '<input type="text" name="name" class="name-news input" value="Запуск сайта!" placeholder="Название новости" autocomplete="off" />' +
                            '<input type="file" name="parent" class="file-news" multiple="multiple" accept="image/*" />' +
                            '<textarea class="description-news textarea" name="description" placeholder="Содержание">Мы запустили наш сайт!</textarea>' +
                            '<button id="addNews" class="btn btn-sm btn-info">Добавить новость</button>' +
                            '<div class="list-news">' +
                                '<b style="color: #8a6d3b; margin-bottom: 7px">Новости' +
                                    '<span class="qty-nw"></span>' +
                                '</b>' +
                                '<div class="list-news-body"></div>' +
                            '</div>' +
                        '</div>'
                    )
                    .append(
                        '<div class="add-article">' +
                            '<div class="list-article-head">Статьи</div>' +
                            '<input type="text" name="name" class="name-article input" placeholder="Название статьи" autocomplete="off" />' +
                            '<input type="file" name="parent" class="file-article" />' +
                            '<textarea class="description-article textarea" name="description" placeholder="Содержание"></textarea>' +
                            '<button id="addArticle" class="btn btn-sm btn-info">Добавить статью</button>' +
                            '<div class="list-article">' +
                                '<b style="color: #8a6d3b; margin-bottom: 7px">Статьи' +
                                    '<span class="qty-atc"></span>' +
                                '</b>' +
                                '<div class="list-article-body"></div>' +
                            '</div>'+
                        '</div>'
                    )
                    .append(
                        '<div class="subscription">' +
                            '<div class="list-subscription-head">Подписка на новости</div>' +
                            '<div class="list-subscription-body"></div>' +
                        '</div>'+
                        '<div class="add-data">' +
                            '<div class="import-head">Импорт товаров</div>' +
                            '<input type="file" class="import-data" placeholder="Импорт данных" />' +
                        '</div>'
                    );
                draggableElement('.admin-panel-head', '#adminPanel');
                let obj = {};
                let myDropzone = new Dropzone("div#myDropZone", {
                    url: "/products.php",
                    previewsContainer: ".сomposition-product",
                    uploadMultiple: true,
                    parallelUploads: 1,
                    autoProcessQueue: false,
                    autoDiscover: false,
                    addRemoveLinks: true,
                    maxFiles: 1,
                    maxFilesize: 1,
                    acceptedFiles: '.png, .jpg, .gif',
                    init: function() {
                        let status = true,
                        name_prod = '',
                        genUUID = '';

                        $(document)
                            .off('click','#addProduct')
                            .on('click','#addProduct', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                genUUID = model.generateUUID(8);
                                $('.input-prd').each(function () {
                                    let ths = $(this);
                                    if (ths.val() == '') {
                                        if ($('.ui-pnotify').length == 0) {
                                            model.msgAct('Пустые поля!!!', 'Все поля должны быть заполнены!!!', 'error', 5000);
                                            status = false;
                                        }
                                        ths[0].style.borderColor = '#FF0000';
                                        $(document)
                                            .off('focus', '.input')
                                            .on('focus', '.input', function () {
                                                $(this)[0].style.borderColor = '#CCCCCC';
                                            });
                                    }
                                });
                                if ($('.group-product option:selected').val() == null || $('.group-product option:selected').val() == 'null') {
                                    $('.group-product').css('border', '1px solid #FF0000');
                                    model.msgAct('Пустые поля!!!', 'Все поля должны быть заполнены!!!', 'error', 5000);
                                    status = false;
                                    $(document)
                                        .off('focus', '.group-product')
                                        .on('focus', '.group-product', function () {
                                            $('.group-product').css('border', '1px solid #cccccc');
                                            status = true;
                                        });
                                }
                                if(status) {
                                    if($('#myDropZone').hasClass('dz-started')) {
                                        myDropzone.processQueue();
                                    }
                                    else {
                                        model.msgAct('Нет фотографии','Без фотографии загрузка товара невозможна!','error',3000);
                                    }
                                }
                            });

                        $(document)
                            .off('click','#changeProduct')
                            .on('click','#changeProduct', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                genUUID = $('#changeProduct').data('uuid');
                                $('.input-prd').each(function () {
                                    let ths = $(this);
                                    if (ths.val() == '') {
                                        if ($('.ui-pnotify').length == 0) {
                                            model.msgAct('Пустые поля!!!', 'Все поля должны быть заполнены!!!', 'error', 5000);
                                            status = false;
                                        }
                                        ths[0].style.borderColor = '#FF0000';
                                        $(document)
                                            .off('focus', '.input')
                                            .on('focus', '.input', function () {
                                                $(this)[0].style.borderColor = '#CCCCCC';
                                            });
                                    }
                                });
                                if ($('.group-product option:selected').val() == null || $('.group-product option:selected').val() == 'null') {
                                    $('.group-product').css('border', '1px solid #FF0000');
                                    model.msgAct('Пустые поля!!!', 'Все поля должны быть заполнены!!!', 'error', 5000);
                                    status = false;
                                    $(document)
                                        .off('focus', '.group-product')
                                        .on('focus', '.group-product', function () {
                                            $('.group-product').css('border', '1px solid #cccccc');
                                            status = true;
                                        });
                                }
                                if(status) {
                                    if($('#myDropZone').hasClass('dz-started')) {
                                        name_prod = $(".name-product").val();
                                        $(".name-product").val(' ');
                                        myDropzone.processQueue();
                                    }
                                    else {
                                        model.msgAct('Нет фотографии','Без фотографии загрузка товара невозможна!','error',3000);
                                    }
                                }
                            });

                        this.on("addedfile", function (file) {
                            $('.dz-preview').addClass('my-dz-preview');
                            $('.dz-image').addClass('my-dz-image');
                            $('[data-dz-thumbnail]').addClass('my-dz-thumbnail')
                        });
                        this.on("sendingmultiple", function(data, xhr, formData) {
                            obj['uuid'] = genUUID;
                            obj['product'] = $(".name-product").val();
                            obj['old_name'] = name_prod;
                            obj['vendor_code'] = $(".vendor-code-product").val();
                            obj['unit'] = $(".unit-product").val();
                            obj['price'] = Number($(".price-product").val());
                            obj['group_id'] = $(".group-product option:selected").val();
                            obj['description'] = $(".description-product").val();
                            obj['recipe'] = $(".recipe-product").val();
                            obj['date'] = moment().format('DD.MM.YYYY HH:mm:ss').split(' ')[0].split('.').reverse().join('.');
                            obj['archived'] = false;
                            obj['new'] = '1';
                            formData.append("uuid", obj.uuid);
                            formData.append("product", obj.product);
                            formData.append("vendor_code", obj.vendor_code);
                            formData.append("unit", obj.unit);
                            formData.append("price", obj.price);
                            formData.append("group_id", obj.group_id);
                            formData.append("description", encodeURIComponent(obj.description));
                            formData.append("recipe", encodeURIComponent(obj.recipe));
                            formData.append("date", obj.date);
                            formData.append("archived", false);
                            formData.append("new", true);
                            formData.append("old_name", obj.old_name);
                            formData.append("promotion", false);
                        });
                        this.on("queuecomplete", function () {
                            this.removeAllFiles();
                            name_prod = '';
                        });
                    },
                    success: function(file, result) {
                        let tr,
                            stat = true;
                        try {
                            let res = JSON.parse(result);
                            // console.log(res);
                            if(res.result) {
                                model.msgAct('Данные загружены','Товар успешно сохранён!','success',1000);
                                $('#myDropZone')
                                    .empty()
                                    .removeClass('dz-started')
                                    .html('<div class="dz-default dz-message"><span>Drop files here to upload</span></div>');
                                $('.description-product')
                                    .val('');
                                $('.recipe-product')
                                    .val('');
                                $('.group-product').val('null');
                                $('.input-prd').val('');
                                stat = true;
                                obj['photos'] = res.data.path;
                                obj['upload_date'] = obj.date;
                                obj['name'] = obj.product;
                                delete obj.date;
                                delete obj.product;
                            }
                            else {
                                model.msgAct('Ошибка загрузки',res.reason,'error',3000);
                            }
                        }
                        catch (e) {
                            stat = false;
                            model.msgAct('Ошибка загрузки try catch',e,'error',3000);
                        }
                        if(stat) {
                            tr = $('<tr class="temporary-backlight"></tr>')
                                .append(
                                    returnRowTab(obj,dataGP.product_groups,'one')
                                );
                            listProd
                                .api()
                                .row
                                .add(tr)
                                .draw();
                        }
                        setTimeout(function () {
                            $('.temporary-backlight').removeClass('temporary-backlight');
                        },20000);
                    },
                    // addedfile: function() {
                    //     console.log(this);
                    // },
                    // removedfile: function() {
                    //     console.log(this);
                    // },
                    maxfilesreached: function() {
                        //console.log('Когда количество файлов достигло предела');
                        // $('#myDropZone')
                        //     .append(
                        //         ''
                        //     );
                    },
                    maxfilesexceeded: function () {
                        //console.log(this.files[4]);
                    }
                });
                $(document)
                    .off('click','.collapseWindow')
                    .on('click','.collapseWindow',function () {
                        let h = $('#adminPanel').height();
                        if(h > 28) {
                            $('.admin-panel-body')
                                .hide(function () {
                                    $('#adminPanel')
                                        .animate({
                                            'height':'30px'
                                        },function () {
                                            $('#block-fon').remove();
                                            $('#adminPanel')
                                                .css('min-width','500px')
                                                .animate({
                                                    'width':'500px'
                                                });
                                        });
                                });
                        }
                        else {
                            $('#adminPanel')
                                .css('min-width','1280px')
                                .animate({
                                    'width':'100%'
                                },function () {
                                    $('#adminPanel')
                                        .animate({
                                            'height':'798px'
                                        },function () {
                                            $('.admin-panel-body').show();
                                            $('.wrap')
                                                .append(
                                                    '<div id="block-fon"></div>'
                                                );
                                        });
                                });
                        }
                    });

                model.ajax('POST','/requests.php','json',undefined,function (dt) {
                    try {
                        if(dt.result) {
                            let gp = dt.data.product_groups,
                                pd = dt.data.products,
                                nl = dt.data.subscription;
                            $('.qty-gp').text('('+gp.length+')');
                            fillingGroups(gp);
                            fillingProducts(pd,gp);
                            fillingNewsletter(nl);
                            $(document)
                                .off('click','.grp-name')
                                .on('click','.grp-name',function (e) {
                                    e.stopPropagation();
                                    $('.grp-name').each(function () {
                                        $(this).removeClass('body-gray');
                                    });
                                    let ths = $(this);
                                    ths.addClass('body-gray');
                                    $('.name-group').val(ths.text());
                                    $('.parent-group').prop('selectedIndex', 0);
                                });
                            $(document)
                                .off('mouseenter','.grp-name')
                                .on('mouseenter','.grp-name',function () {
                                    let ths = $(this);
                                    ths[0].style.backgroundColor = '#ececec';
                                    $(document)
                                        .off('mouseleave','.grp-name')
                                        .on('mouseleave','.grp-name',function () {
                                            let ths = $(this);
                                            ths[0].style.backgroundColor = '#ffffff';
                                        });
                                });
                            $(document)
                                .off('click','.delLi')
                                .on('click','.delLi',function (e) {
                                    e.stopPropagation();
                                    let ths = $(this);
                                    ths.parent().remove();
                                    $('.qty-gp').text('('+$('.lgrp-name').length+')');
                                });
                            $(document)
                                .off('click','.add-group')
                                .on('click','.add-group',function () {
                                    $('.grp-name').each(function () {
                                        $(this).removeClass('body-gray');
                                    });
                                    $('.name-group').val('');
                                });
                            $(document)
                                .off('click','#clearFields')
                                .on('click','#clearFields',function (e) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    $('.name-product').val('');
                                    $('.vendor-code-product').val('');
                                    $('.unit-product').val('');
                                    $('.price-product').val('');
                                    $('.description-product').val('');
                                    $('.recipe-product').val('');
                                    $('.group-product').prop('selectedIndex', 0);
                                    $('#addProduct').prop('disabled',false);
                                });
                        }
                        else {
                            model.msgAct('Ответ', dt.reason, 'error', 5000);
                        }
                    }
                    catch (e) {
                        model.msgAct('Ответ', e.error, 'error', 5000);
                    }
                });

                $(document)
                    .off('click','.list-item')
                    .on('click','.list-item',function () {
                        let ths = $(this),
                            item = ths.data('info');
                        $('.list-item').each(function () {
                            $(this).removeClass('active-item');
                        });
                        ths.addClass('active-item');
                        showActiveItem(item);
                    });
            });
    }, 500);

    function returnRowTab(v,gp,add) {
        let check = '',
            ph = '<i class="glyphicon glyphicon-check" style="color: #00aa00; text-align: center" title="Фото загружено!"></i>',
            ac = '',
            date = '',
            st = '',
            nw = '';
        if(v.photos.length == 0) {
            ph = '<i class="glyphicon glyphicon-unchecked" style="color: #ff0000; text-align: center" title="Фото не загружено!"></i>';
        }
        if(v.archived) check = 'checked';
        if(v.promotion == '1') ac = 'checked';
        if(v.new == '1') nw = 'checked';
        if(v.upload_date != undefined && v.upload_date != null) {
            date = v.upload_date.split('.').reverse().join('.');
        }
        if(add == undefined) {
            st =    '<td class="name-td" data-archived="' + v.archived + '" data-code="' + v.uuid + '">' + v.name + '' +
                        '<span class="qty-td">(' + v.unit + ')</span>' +
                        '<input class="checkArh" type="checkbox" name="check" title="Пометить как архивный" ' + check + ' />' +
                    '</td>' +
                    '<td style="border-right: 1px solid #DDDDDD;width: 50px !important;position:relative;background:#fff;">'+v.vendor_code+'</td>' +
                    '<td style="border-right: 1px solid #DDDDDD;">' + returnNameGroup(v.group_id, gp) + '</td>' +
                    '<td class="body-upload">' + date + '</td>' +
                    '<td style="border-right: 1px solid #DDDDDD;">' + parseFloat(v.price).toFixed(2) + '</td>' +
                    '<td class="body-promotion" data-promotion="' + v.id + '">' +
                        '<input class="check-promotions" type="checkbox" name="prom" ' + ac + ' />' +
                    '</td>' +
                    '<td class="body-new" data-new="'+v.uuid+'">' +
                        '<input class="check-new" type="checkbox" name="new" '+nw+' />' +
                    '</td>' +
                    '<td class="body-photo">' + ph + '</td>';
        }
        else {
            st = '<td class="name-td" data-archived="' + v.archived + '" data-code="' + v.uuid + '">' + v.name + '' +
                    '<span class="qty-td">(' + v.unit + ')</span>' +
                    '<input class="checkArh" type="checkbox" name="check" title="Пометить как архивный" ' + check + ' />' +
                '</td>' +
                '<td style="border-right: 1px solid #DDDDDD;width: 50px !important;position:relative;background:#fff;">'+v.vendor_code+'</td>' +
                '<td style="border-right: 1px solid #DDDDDD;">' + returnNameGroup(v.group_id, gp) + '</td>' +
                '<td class="body-upload">' + date + '</td>' +
                '<td style="border-right: 1px solid #DDDDDD;">' + parseFloat(v.price).toFixed(2) + '</td>' +
                '<td class="body-promotion" data-promotion="' + v.id + '">' +
                    '<input class="check-promotions" type="checkbox" name="prom" ' + ac + ' />' +
                '</td>' +
                '<td class="body-new" data-new="'+v.uuid+'">' +
                    '<input class="check-new" type="checkbox" name="new" '+nw+' />' +
                '</td>' +
                '<td class="body-photo">' + ph + '</td>';
        }
        return st
    }

    function showActiveItem(item) {
        $('.hide-block').hide();
        if(item == 'goods') $('.body-goods').show();
        if(item == 'groups') $('.body-groups').show();
        if(item == 'overs') $('.body-overs').show();
    }

    function fillingNewsletter(nl) {
        $.each(nl, function (k, v) {
            let chk = 'checked';
            if(v.archived == 0) chk = '';
            $('.list-subscription-body')
                .append(
                    '<div class="subscription-div">' +
                        '<span style="position: absolute; left: 0">'+(k+1)+'.</span>' +
                            '<div class="subscription-name">'+v.email+'</div>' +
                        '<input class="subscription-checked" type="checkbox" title="В архив" '+chk+' />' +
                    '</div>'
                );
        });
    }

    function fillingProducts(pd,gp) {
        $('.list-product-body')
            .append(
                '<table id="listProd" class="display compact listProd" width="100%">' +
                    '<thead>' +
                        '<tr>' +
                            '<th style="border-right: 1px solid #DDDDDD;">Название</th>' +
                            '<th style="border-right: 1px solid #DDDDDD;width: 50px !important;">Артикул</th>' +
                            '<th style="border-right: 1px solid #DDDDDD;">Группа</th>' +
                            '<th class="header-upload">Дата загрузки</th>' +
                            '<th style="border-right: 1px solid #DDDDDD;">Цена</th>' +
                            '<th class="header-promotion">Акция</th>' +
                            '<th class="header-new">Новинка</th>' +
                            '<th class="header-photo">Фото</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody class="tab-list-prod"></tbody>' +
                '</table>'
            );
        $.each(pd, function (k, v) {
            let check = '',
                ph = '<span class="glyphicon glyphicon-check" style="color: #00aa00; text-align: center" title="Фото загружено!"></span>',
                ac = '',
                nw = '',
                date = '';
            if(v.photo == null) ph = '<span class="glyphicon glyphicon-unchecked" style="color: #ff0000; text-align: center" title="Фото не загружено!"></span>';
            if(v.archived == '1') check = 'checked';
            if(v.promotion == '1') ac = 'checked';
            if(v.new == '1') nw = 'checked';
            if(v.upload_date != undefined && v.upload_date != null) date = v.upload_date.split('.').reverse().join('.');
            $('.tab-list-prod')
                .append(
                    '<tr>' +
                        '<td class="name-td" data-archived="'+v.archived+'" data-code="'+v.uuid+'">' +
                            '<div class="name-div" title="'+v.name.split('"').join('`')+'">'+v.name+'</div>' +
                            '<span class="qty-td">('+v.unit+')</span>' +
                            '<input class="checkArh" type="checkbox" name="check" title="Пометить как архивный" '+check+' />' +
                        '</td>' +
                        '<td style="border-right: 1px solid #DDDDDD;width: 50px !important;position:relative;background:#fff;">'+v.vendor_code+'</td>' +
                        '<td style="border-right: 1px solid #DDDDDD;position:relative;background:#fff;">'+returnNameGroup(v.group_id,gp)+'</td>' +
                        '<td class="body-upload">'+date+'</td>' +
                        '<td style="border-right: 1px solid #DDDDDD;">'+parseFloat(v.price).toFixed(2)+'</td>' +
                        '<td class="body-promotion" data-promotion="'+v.uuid+'">' +
                            '<input class="check-promotions" type="checkbox" name="prom" '+ac+' />' +
                        '</td>' +
                        '<td class="body-new" data-new="'+v.uuid+'">' +
                            '<input class="check-new" type="checkbox" name="new" '+nw+' />' +
                        '</td>' +
                        '<td class="body-photo">'+ph+'</td>' +
                    '</tr>'
                );
        });
        initTab();

        $(document)
            .off('click','.checkArh')
            .on('click','.checkArh',function (e) {
                e.stopPropagation();
                let ths = $(this),
                    checked = ths.prop('checked');
                if(checked) {
                    let cd = ths.parent().data("code");
                    model.ajax('POST','/requests.php','json',{"id":''+cd+'',"archived":"1"},function (dt) {
                        try {
                            if(dt.result) model.msgAct('Ответ', 'Товар помечен как АРХИВНЫЙ!', 'info', 3000);
                            else model.msgAct('Ответ', dt.reason, 'error', 5000);
                        }
                        catch (e) {
                            model.msgAct('Ответ', e.error, 'error', 8000);
                            // console.log(e);
                        }
                    });
                }
                else {
                    let cd = ths.parent().data("code");
                    model.ajax('POST','/requests.php','json',{"id":''+cd+'',"archived":"0"},function (dt) {
                        try {
                            if(dt.result) model.msgAct('Ответ', 'Товар введён в продажу!', 'success', 3000);
                            else model.msgAct('Ответ', dt.reason, 'error', 5000);
                        }
                        catch (e) {
                            model.msgAct('Ответ', e.error, 'error', 8000);
                            // console.log(e);
                        }
                    });
                }
            });

        $(document)
            .off('click','.check-promotions')
            .on('click','.check-promotions',function (e) {
                e.stopPropagation();
                let ths = $(this),
                    checked = ths.prop('checked');
                if(checked) {
                    sendRequest(ths,'1');
                }
                else {
                    sendRequest(ths,'0');
                }
            });

        $(document)
            .off('click','.name-td')
            .on('click','.name-td',function () {
                let ths = $(this),
                    code = ths.data('code');
                model.ajax('POST','/requests.php','json',{"code":''+code+''},function (dt) {
                    try {
                        if (dt.result) {
                            let v = dt.data;
                            $('.vendor-code-product').val(v.vendor_code);
                            $('.unit-product').val(v.unit);
                            $('.name-product').val(v.name);
                            $('.price-product').val(parseFloat(Number(v.price)).toFixed(2));
                            $('.description-product').val(v.description);
                            $('.recipe-product').val(v.recipe);
                            $('.group-product').val(v.group_id);
                            $('#addProduct').prop('disabled', true);
                            $('#changeProduct').data('uuid', v.uuid);
                            setTimeout(function () {
                                // console.log($('#changeProduct').data().uuid);
                            },3000);
                        }
                    }
                    catch (e) {
                        model.msgAct('Ошибка', e.error,'error', 5000);
                        // console.log(e);
                    }
                });
            });
    }
    
    function sendRequest(ths,nm) {
        let prom = ths.parent().data("promotion");
        model.ajax('POST','/requests.php','json',{"id":''+prom+'',"promotion":''+nm+''},function (dt) {
            let str = 'НЕ акционный!';
            if(nm == '1') {
                str = 'АКЦИОННЫЙ!';
            }
            try {
                if(dt.result) model.msgAct('Ответ', 'Товар помечен как '+str, 'info', 3000); //НЕ акционный!
                else model.msgAct('Ответ', dt.reason, 'error', 5000);
            }
            catch (e) {
                model.msgAct('Ответ', e.error, 'error', 8000);
                // console.log(e);
            }
        });
    }

    function returnNameGroup(id, grp) {
        let nm = '';
        $.each(grp, function (k, v) {
            if(v.id == id) nm = v.name;
        });
        return nm;
    }

    function initTab() {
        listProd = $('#listProd').dataTable({
            "order": [[ 0, 'asc' ]],
            "scrollY": '60vh',
            "scrollCollapse": true,
            "paging": false,
            "stripeClasses": [], // удаляет классы чётное, не чётное
            "lengthMenu": [[100, 1000, 10000, -1], [100, 1000, 10000, "Все"]], // Меню количества выводимых строк
            "iDisplayLength": 10000, // количество строк
            "pagingType": "first_last_numbers", // Вид пагинации
            "language": {
                "processing": "Подождите...",
                "search": "",
                "lengthMenu": "_MENU_",
                "info": "Записи с _START_ по _END_ из _TOTAL_ записей",
                "infoEmpty": "Записи с 0 по 0 из 0 записей",
                "infoFiltered": "(выбрано из _MAX_ записей)",
                "infoPostFix": "",
                "loadingRecords": "Загрузка записей...",
                "zeroRecords": "Записи отсутствуют.",
                "emptyTable": "В таблице отсутствуют данные",
                "paginate": {
                    "first": "Пер.",
                    "previous": "Пред.",
                    "next": "След.",
                    "last": "Пос."
                }
            },
            // "bSort": false  //отмена сортировки
        });
        $('input[type="search"]')
            .addClass('tab-search')
            .prop('placeholder', 'Поиск');
    }

    function fillingGroups(gp) {
        let arr = [];
        $.each(gp, function (k, v) {
            $('.group-product')
                .append(
                    '<option class="list-groups-opt" value="'+v.id+'">'+v.name+'</option>'
                );
            if(v.parent_id == '0') {
                $('.list-groups-body')
                    .append(
                        '<div class="list-groups-li" data-ul="'+v.id+'">' +
                            '<button class="btn btn-link btn-xs delLi">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +
                            '</button>' +
                            '<div class="grp-name" title="'+v.id+'">'+v.name+'</div>' +
                        '</div>'
                    );
                $('.parent-group')
                    .append(
                        '<option class="list-groups-opt" value="'+v.id+'">'+v.name+'</option>'
                    );
            }
            else arr.push(v);
        });

        if(arr.length != 0) {
            let ar = [];
            $.each(arr, function (k, v) {
                // console.log(v.parent_id);
                if($('[data-ul="'+v.parent_id+'"]') == 0) {
                    ar.push(v);
                }
                else {
                    $('[data-ul="'+v.parent_id+'"]')
                        .append(
                            '<div class="list-groups-li" data-ul="'+v.id+'">' +
                                '<button class="btn btn-link btn-xs delLi li-del">' +
                                    '<span class="glyphicon glyphicon-remove"></span>' +
                                '</button>' +
                                '<div class="grp-name" title="'+v.id+'">'+v.name+'</div>' +
                            '</div>'
                        );
                    $('.parent-group')
                        .append(
                            '<option class="list-groups-opt" value="'+v.id+'">'+v.name+'</option>'
                        );
                }
            });
            if(ar.length != 0) {
                $.each(ar, function (k, v) {
                    if($('[data-ul="'+v.parent_id+'"]') == 0) {
                        ar.push(v);
                    }
                    else {
                        $('[data-ul="'+v.parent_id+'"]')
                            .append(
                                '<div class="list-groups-li" data-ul="'+v.id+'">' +
                                '<button class="btn btn-link btn-xs delLi li-del">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +
                                '</button>' +
                                '<div class="grp-name" title="'+v.id+'">'+v.name+'</div>' +
                                '</div>'
                            );
                        $('.parent-group')
                            .append(
                                '<option class="list-groups-opt" value="'+v.id+'">'+v.name+'</option>'
                            );
                    }
                });
            }
        }
    }

    $(document)
        .off('click','.closeWindow')
        .on('click','.closeWindow',function () {
            $('#block-fon').remove();
            $('#adminPanel').remove();
        });

    $(document)
        .off('click','#addNews')
        .on('click','#addNews',function () {
            let obj = {
                id: model.generateUUID(16),
                header_news: $('.name-news').val(),
                text: $('.description-news').val(),
                archive: '1'
            };
            // console.log(obj);
            model.ajax('POST','/requests.php','json',obj,function (dt) {
                if (dt.result) {
                    model.msgAct('Ответ', 'Новость добавлена', 'success', 3000);
                }
                else {
                    model.msgAct('Ответ', dt, 'error', 5000);
                }
            });
        });

    $(document)
        .off('click','#addArticle')
        .on('click','#addArticle',function () {
            let obj = {
                id: model.generateUUID(16),
                header_article: $('.name-article').val(),
                text: $('.description-article').val(),
                archive: '1'
            };
            model.ajax('POST','/requests.php','json',obj,function (dt) {
                if (dt.result) {
                    model.msgAct('Ответ', 'Статья добавлена', 'success', 3000);
                }
                else {
                    model.msgAct('Ответ', dt, 'error', 5000);
                }
            });
        });

    $(document)
        .off('click','#addGroup')
        .on('click','#addGroup',function () {
        let gp = $('.name-group').val(),
            parent = $('.parent-group option:selected').val();
        if (gp != '') {
            if(parent == 'null') parent = null;
            let data = {
                name: gp,
                parent: parent,
                photo: null,
                class: null
            };
            model.ajax('POST','/requests.php','json',data,function (dt) {
                if(dt.result) {
                    model.msgAct('Ответ', 'Группа добавлена', 'success', 3000);
                    $('.name-group').val('');
                    $('[data-ul="'+parent+'"]')
                        .append(
                            '<div class="list-groups-li" data-ul="'+dt.data.id+'">' +
                                '<button class="btn btn-link btn-xs delLi li-del">' +
                                    '<span class="glyphicon glyphicon-remove"></span>' +
                                '</button>' +
                                '<div class="grp-name" title="'+dt.data.id+'">'+gp+'</div>' +
                            '</div>'
                        );
                }
                else {
                    model.msgAct('Ответ', dt, 'error', 5000);
                }
            });
        }
    });

    $(document)
        .off('click','.parent-group')
        .on('click','.parent-group',function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

    $(document)
        .off('click','.name-group')
        .on('click','.name-group',function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

    $(document)
        .off('change','.import-data')
        .on('change','.import-data',function () {
            let ths = $(this),
                splittedFakePath = ths[0].value.split('\\'),
                tab = {},
                path = splittedFakePath[splittedFakePath.length - 1],
                extensionTest = path.split('.').pop();
            if (extensionTest == 'csv') {
                    // if (val.size < 10000000) {
                        $('#modalWin').modal({backdrop:'static',keyboard:true}).on('shown.bs.modal', function() {
                            let file = ths[0].files[0];
                            let reader = new FileReader;                // Загрузка объекта FileReader.
                            reader.onloadend = function (evt) {
                                //*****************   ВЫВОД ИНФЫ О ФАЙЛЕ    ***********************************
                                // let tot = evt.total;
                                // $('.modal-body').append('<strong class="catalog-file-name">' + path + ', ' + tot + ' байт.</strong>');
                                let arrayOfLines = reader.result.split('\n'), cl = '', cls= '';
                                let qtyCol = arrayOfLines[0].split(';').length;
                                let result = '<table id="table" class="display responsive nowrap compact" cellpadding="1" cellspacing="1" style="width: 100%"><thead><tr>';
                                for (let c = 0; c < qtyCol; c++) {
                                    let cls = (c == 0)?'name':(c == 1)?'unit':(c == 2)?'price':(c == 3)?'vendor':(c == 4)?'description':(c == 5)?'recipe':(c == 6)?'group':null;
                                    result += '<th class="catalog-thtd delete-th">' +
                                        '<div class="btn-group">'+cls+''+
                                            '<button href="#" id="id'+c+'" class="btn btn-link btn-sm del" data-column="'+c+'">' +
                                                '<span class="glyphicon glyphicon-trash del" aria-hidden="true"></span>' +
                                            '</button>'+
                                        '</div>' +
                                        '</th>';
                                }
                                result += '</tr></thead><tbody>';
                                for (let key in arrayOfLines) {
                                    if (arrayOfLines[key]) {
                                        let arrayOfCells = arrayOfLines[key].split(';');
                                        result += '<tr class="">';
                                        for (let key2 in arrayOfCells) {
                                            if(key2 == 4) cl = 'name-goods';
                                            result += '<td class="catalog-thtd1 '+cl+'">' + arrayOfCells[key2] + '</td>';
                                            cl = '';
                                        }
                                        result += '</tr>';
                                    }
                                }
                                result += '</tbody></table><br />';
                                $('.modal-body').append(result);
                            };
                            reader.readAsText(file, 'windows-1251');

                            setTimeout(function () {
                                tab = $('#table').DataTable( {
                                    "ordering": false,
                                    "scrollY": '500px',
                                    "scrollCollapse": true,
                                    "paging": false,
                                    "language": {
                                        "processing": "Подождите...",
                                        "search": "Поиск:",
                                        "lengthMenu": "Показать _MENU_ записей",
                                        "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
                                        "infoEmpty": "Записи с 0 до 0 из 0 записей",
                                        "infoFiltered": "(отфильтровано из _MAX_ записей)",
                                        "infoPostFix": "",
                                        "loadingRecords": "Загрузка записей...",
                                        "zeroRecords": "Записи отсутствуют.",
                                        "emptyTable": "В таблице отсутствуют данные",
                                        "paginate": {
                                            "first": "Первая",
                                            "previous": "Предыдущая",
                                            "next": "Следующая",
                                            "last": "Последняя"
                                        }
                                    }
                                });
                            }, 10);

                        });
                        $('#modalWin').modal({
                            backdrop:'static',
                            keyboard:true
                        })
                            .on('hidden.bs.modal', function() {
                                $('.import-data').val('');
                                $('.modal-body').empty();
                            });

                        $(document)
                            .off('click','.saveGoods')
                            .on('click','.saveGoods',function () {
                                $('.del').remove();
                                clickSendData();
                                $('#modalWin').modal('hide');
                                $('.modal-body').empty();
                                $('#table').DataTable().destroy();
                            });

                    // }
                    // else {
                    //     model.msgAct('Размер файла', 'Размер файла не должен превышать 10 Мб', 'error', 5000);
                    //     $('.import-data').val('');
                    // }
                }
                else {
                model.msgAct('Расширение файла', 'Расширение должно быть ".csv"', 'error', 5000);
                    $('.import-data').val('');
                }
        });

    return listProd;
}

function clickSendData() {
    let data = $('#table').tableToJSON();
        // console.log(JSON.stringify({info:data}));
    $.each(data,function (k,v) {
        v['uuid'] = model.generateUUID(8);
        v['date'] = new Date().getTime();
    });
    model.ajax("POST","/requests.php","json",{info:data},function(dt) {
        if (dt.result) {
            model.msgAct('Сохранение данных','Данные успешно сохранены!!!','success',3000);
            $('#mainUnit')
                .empty()
                .append(
                    '<section class="block css-block">' +
                        '<button class="btn btn-info persent">Расчёт процента и цены!</button>' +
                        '<div class="btn-group">' +
                            '<input id="loadFile" name="file" class="btn btn-primary" type="file" />' +
                            '<button id="saveFile" type="file" name="saveFile" class="btn btn-success">Сохранить фаил</button>' +
                            '<button id="saveFile" type="file" name="saveFile" class="btn btn-warning">Выгрузить данные</button>' +
                        '</div>' +
                    '</section>'
                );
        }
        else {
            model.msgAct('Сохранение данных',dt,'error',5000);
        }
    },false,false);
}

function getProdOnServer(data) {
    if(data.result) {
        model.msgAct('Ответ', 'Товар добавлен', 'success', 3000);
        $('.input').each(function () {
            $(this).val('');
        });
        $('#addProduct').prop('disabled', false);
    }
    else {
        model.msgAct('Ответ', data.reason, 'error', 5000);
    }
}

function getGroupsOnServer(dt) {

}

function delFone() {
    $('#block-fon').remove();
    $('.login-window').hide(function () {
        $('.form').remove();
    });
}

function fillingArticle(data) {
    data.forEach(function (v,k) {
        $('.menu-article-body')
            .append(
                '<span class="menu-news-body-article">'+v.name+'</span>'
            );
    });
}

function fillingMenu() {
    $('.first-section')
        .append(
            '<div class="menu-news">' +
                '<h5 class="title-news" style="text-align: center;">Новости</h5>'+
                '<div class="menu-news-body"></div>' +
            '</div>' +
            '<div class="menu-article">' +
                '<h5 class="title-article" style="text-align">Статьи</h5>' +
                '<div class="menu-article-body"></div>' +
            '</div>' +
            '<div class="menu-email">' +
                '<div class="menu-email-body"><h5 class="title-email" style="text-align">Подписаться на новости</h5>' +
                '<input class="input-email" type="text" name="email" /><button class="btn btn-xs btn-info btnEmail">Подписаться</button></div>' +
            '</div>'
        );
    $(document)
        .off('click','.btnEmail')
        .on('click','.btnEmail',function () {
            let em = $('.input-email').val();
            if(em != '') {
                let data = {
                    email:em,
                    archive:'0'
                };
                model.ajax('POST','/requests.php','json',data,function (dt) {
                    if(dt.result) {
                        model.msgAct('Подписка', 'Вы подписаны на новости','success',3000);
                        $('.input-email').val('');
                    }
                    else {
                        let vl = dt.reason.split(' ');
                        if(vl[0] == 'Duplicate') {
                            model.msgAct('Подписка', 'У вас уже есть подписка на новости с нашего сайта!','info',5000);
                            $('.input-email').val('');
                        }
                        else {
                            model.msgAct('Подписка', dt.reason,'error',5000);
                            $('.input-email').val('');
                        }
                    }
                });
            }
            else model.msgAct('Подписка','Вы не ввели e-mail','error',4000);
        });
    $(document)
        .off('click','.menu-li')
        .on('click','.menu-li',function (e) {
            e.stopPropagation();
            let ths = $(this),
                title = ths.find('.title-item').text(),
                id = ths.data('id');
            if($('.sub-menu').length == 0) {
                $('.second-section')
                    .append(
                        '<div class="sub-menu">' +
                            '<h4 class="title-sub-menu">'+title+'</h4>' +
                            '<button class="btn btn-link closed-window">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +
                            '</button>' +
                            '<div class="sub-menu-body"></div>' +
                        '</div>'
                    );
                $('.sub-menu').fadeIn();
            }
            else {
                $('.sub-menu')
                    .empty()
                    .append(
                        '<h4 class="title-sub-menu">'+title+'</h4>' +
                        '<button class="btn btn-link closed-window">' +
                            '<span class="glyphicon glyphicon-remove"></span>' +
                        '</button>' +
                        '<div class="sub-menu-body"></div>'
                    )
                    .fadeIn();
            }
            $('.menu-li').each(function () {
                $(this).removeClass('active-sub-menu');
            });
            $(this).addClass('active-sub-menu');
            fillMenu(id);
        });
    $(document)
        .off('click','.wrap')
        .on('click','.wrap',function () {
            clearSubMenu();
        });
    $(document)
        .off('mouseenter','.menu-li')
        .on('mouseenter','.menu-li',function () {
            // $(this)[0].style.backgroundColor = '#FFFFFF';
            // $(document).off('mouseleave','.menu-li').on('mouseleave','.menu-li',function (e) {
            //     let th = $(this);
            //     // th[0].style.backgroundColor = '#f6f6f6';
            // });
        });
    $(document)
        .off('click','#block-fon')
        .on('click','#block-fon',function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
    function fillMenu(id) {
        let token = $('meta[name=csrf-token]').prop("content"),
            obj = {
                group:  id,
                csrf:   token
            };
        model.ajax('POST','/products.php','json',obj,function (dt) {
            if (dt.result) {
                $('.sub-menu-body').empty();
                let groups = dt.data.sub_groups,
                    prod = dt.data.products,
                    arr = [];
                groups.forEach(function (v,k) {
                    if(v.parent_id == id) {
                        $('.sub-menu-body')
                            .append(
                                '<div class="block-sub-menu" data-parent="'+v.id+'">' +
                                    '<h5 class="block-sub-menu-head show-info" data-thing="group" data-code="'+v.id+'">'+v.name+'</h5>' +
                                    '<div class="block-sub-menu-body" data-group="'+v.id+'"></div>' +
                                '</div>'
                            );
                    }
                    else {
                        arr.push(v);
                    }
                });
                if(arr.length != 0) {
                    arr.forEach(function (v,k) {
                        $('[data-parent="'+v.parent_id+'"]')
                            .append(
                                '<div class="block-sub-menu" data-parent="'+v.id+'">' +
                                    '<h5 class="block-sub-menu-head show-info" data-thing="group" data-code="'+v.id+'">'+v.name+'</h5>' +
                                    '<div class="block-sub-menu-body" data-group="'+v.id+'"></div>' +
                                '</div>'
                            );
                    });

                }
                prod.forEach(function (v,k) {
                    if(v.archived == 0) {
                        $('[data-group='+v.group_id+']')
                            .append(
                                '<span' +
                                    ' class="block-sub-menu-span show-info"' +
                                    ' data-thing="product"' +
                                    ' data-code="'+v.uuid+'"' +
                                    ' title="'+v.name.split('"').join('`')+'"' +
                                '>'+v.name+'</span>'
                            );
                    }
                });
                $('.sub-menu-body').fadeIn('fast');
            }
            else {
                model.msgAct('Получение данных',dt,'error',5000);
            }
        });
    }
}

function clearSubMenu() {
    $('.sub-menu')
        .fadeOut(function () {
            $('.sub-menu').remove();
        });
    $('.menu-li').each(function () {
        $(this).removeClass('active-sub-menu');
    });
}