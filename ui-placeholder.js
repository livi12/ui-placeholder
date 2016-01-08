
    /*
     *  placeholder
     *  $('select').placeholder({
     *      bLabelMode: false,           //是否使用label标签模拟占位符效果。默认为false，表示使用value模拟法。
     *      bLabelAlpha: false,          //如果使用label模拟法，其交互方式是否使用透明度切换的形式。默认为false，表示使用值显示与不显示这种交互。
     *      bLabelAcross: false',        //如果使用label模拟法，同时交互方式是透明度切换，是否让所有的浏览器都是这种效果（重置现代浏览器默认placeholder交互效果）。默认为false，表示浏览器默认使用自带placeholder交互效果。
     *      oLabelStyle: {}              //如果使用label模拟法，则创建的label元素重置的或新的样式集。
     *  });
     */

    $.fn.placeholder = function(oOptions) {
        var defaults = {
            bLabelMode: false,
            bLabelAlpha: false,
            bLabelAcross: false,
            oLabelStyle: {}
        };
        var params = $.extend({}, defaults, oOptions || {});

        //方法
        var setLabelAlpha = function(elementInput, elementLabel) {
            if (elementInput.val() === '') {
                elementLabel.css('opacity', 0.4).html(elementInput.data('placeholder'));
            } else {
                elementLabel.html('');
            }
        };

        var getPlaceholder = function(ele) {
            return $(ele).attr('placeholder');
        };

        $(this).each(function() {
            var element = $(this);
            /*是否支持placeholder 属性*/
            var supportPlaceholder = 'placeholder' in document.createElement('input');
            var myPlaceholder = getPlaceholder(this);

            // 三种情况
            // ① 没有placeholder属性值
            // ② value模拟，同时是支持placeholder属性的浏览器
            // ③ label模拟，但是无需跨浏览器兼容，同时是支持placeholder属性的浏览器

            // 1: 没有placeholder属性值
            if (!myPlaceholder || (!params.bLabelMode && supportPlaceholder) || (params.bLabelMode && !params.bLabelAcross && supportPlaceholder)) {
                return;
            }

            // 存储，因为有时会清除placeholder属性
            element.data('placeholder', myPlaceholder).parent();
            /*如果父类的position属性是static，则该为relative，否则不更改position 属性*/
            if(element.parent().css('position')=='static'){
                element.parent().css('position','relative')
            }

            // 2: label模拟
            if (params.bLabelMode) {
                var idElement = element.attr('id');

                if (!idElement) {
                    /*将随机数改为时间戳，随机数可能出现相同的值*/
                   // idElement = 'placeholder' + Math.random();
                    idElement = 'placeholder' +(new Date()).valueOf();

                    element.attr('id', idElement);
                }

                // 创建label标签，并设置其默认样式
                var elementLabel = $('<label for="'+ idElement +'"></label>').css($.extend({
                    position: 'absolute',
                    left: element.position().left,
                    top: element.position().top,
                    color: 'graytext',
                    cursor: 'text',
                    marginLeft: element.css('marginLeft'),
                    marginTop: element.css('marginTop'),
                    paddingLeft: element.css('paddingLeft'),
                    paddingTop: element.css('paddingTop'),
                    lineHeight:element.css('lineHeight'),
                    fontSize:element.css('fontSize')
                }, params.oLabelStyle)).insertBefore(element);

                // label有透明交互和label无透明交互
                if (params.bLabelAlpha) {
                    element.on({
                        'focus': function() {
                            setLabelAlpha($(this), elementLabel);
                        },
                        'input': function() {
                            setLabelAlpha($(this), elementLabel);
                        },
                        'blur': function() {
                            if (this.value === '') {
                                elementLabel.css('opacity', 1).html(myPlaceholder);
                            }
                        }
                    });

                    //IE6~8不支持input事件，需要另行绑定
                    if (!window.screenX) {
                        element.get(0).onpropertychange = function(event) {
                            event = event || window.event;
                            if (event.propertyName == 'value') {
                                setLabelAlpha(element, elementLabel);
                            };
                        }
                    }

                    // 右键事件
                    elementLabel.get(0).oncontextmenu = function() {
                        element.trigger('focus');
                        return false;
                    }
                } else {
                    element.on({
                        'focus': function() {
                            elementLabel.html('');
                        },
                        'blur': function() {
                            if ($(this).val() === '') {
                                elementLabel.html(myPlaceholder);
                            }
                        }
                    });
                }

                // 内容初始化
                if (params.bLabelAcross) {
                    element.removeAttr('placeholder');
                }

                if (element.val() === '') {
                    elementLabel.html(myPlaceholder);
                }
            } else {
                // 3: value模拟
                element.on({
                    'focus': function() {
                        if ($(this).val() === myPlaceholder ) {
                            $(this).val('');
                        }
                        $(this).css('color', '');
                    },
                    'blur': function() {
                        if ($(this).val() === '') {
                            $(this).val(myPlaceholder).css('color', 'graytext');
                        }
                    }
                });

                // 初始化
                if (element.val() === '') {
                    element.val(myPlaceholder).css('color', 'graytext');
                }
            }
        });

        return $(this);
    };