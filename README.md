#乐课ui-placeholder的插件的使用

[修改后的示例](http://192.168.20.21/static/widget/ui-placeholder/)
[乐课的示例在360ie模式下查看](http://192.168.20.21/static/widget/ui-placeholder/leke.html)

##原理
该插件通过扩展jquery的方法，添加了placeholder方法，该方法可以传四个值，下面对其传值进行解释说明。

###html，给元素添加placeholder属性即可
```html
<input type="text" placeholder="文本框">
```

###javascript的调用,需要先引用jquery.js和ui-placeholder.js插件
```javascript
<script type="text/javascript">
	$('input').placeholder({
		bLabelMode: true,
	    bLabelAlpha: true,
	    bLabelAcross: true,
	    oLabelStyle: {
	        cursor: 'text',
	        lineHeight:'1.6'
	    }
	});
</script>
```

###参数说明
placeholder 插件提供两种方法仿写placeholder属性，一种是value值，一种是添加label，使label的文本到达placerholder的展示效果。

####value模拟placeholder属性
将bLabelMode设置为false,默认为false，既可以不用设置该属性，其他属性设置无效
	采用value方法设置placeholder属性设置，若浏览器支持默认的placeholder属性，则采用浏览器的默认设置，否则仿写改属性**弊端**当输入的文本值与placeholder的值相同时，会把文本值当成设置的placeholder值进行清空

```javascript
	$('input').placeholder({
		bLabelMode: false
	});
```

####使用label标签仿写placeholder属性
将bLabelMode设置为true,如果浏览器支持placeholder属性，按照如下设置下会按照浏览器的默认设置渲染。不支持的添加label标签仿placeholder效果。

```javascript
	$('input').placeholder({
		bLabelMode: true,
	    bLabelAcross: false
	});
```


####如下设置会忽略移除元素上的placeholder属性，通过label标签来仿写placeholder效果
```javascript
<script type="text/javascript">
	$('input').placeholder({
		bLabelMode: true,
	    bLabelAcross: true
	});
</script>
```

####bLabelAlpha 和oLabelStyle的说明
这两个参数只有在bLabelMode设置为true时才有作用。
`bLabelAlpha`设置的placeholder属性的透明度
`oLabelStyle`设置label标签的样式属性，可以复写改样式到达所需要的效果,根据需要添加或者修改下列样式属性

```javascript
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
```


### 说明：
ui-placeholder 对乐课网中的placeholder.js插件中存在的问题进行了修正。具体修正代码如下

**修改父元素的position属性**
乐课中的代码：

```javascript
 	// 存储，因为有时会清除placeholder属性
    element.data('placeholder', myPlaceholder).parent().css('position','relative');

```
修正后的代码：

```javascript
 	// 存储，因为有时会清除placeholder属性
    element.data('placeholder', myPlaceholder).parent();
    /*如果父类的position属性是static，则该为relative，否则不更改position 属性*/
    if(element.parent().css('position')=='static'){
        element.parent().css('position','relative')
    }

```

#####如果添加placeholder的元素没有id，给该元素添加id,改为时间戳，去重
乐课中的代码：

```javascript
 	if (!idElement) {
        idElement = 'placeholder' + Math.random();
        element.attr('id', idElement);
    }

```
修正后的代码：

```javascript
 	if (!idElement) {
        /*将随机数改为时间戳，随机数可能出现相同的值*/
       // idElement = 'placeholder' + Math.random();
        idElement = 'placeholder' +(new Date()).valueOf();

        element.attr('id', idElement);
    }
```

修改创建label标签时，设置默认样式的属性值，更改了`lineHeight`的值，增加了`fontSize`的值
乐课中的代码：

```javascript
 	position: 'absolute',
    left: element.position().left,
    top: element.position().top,
    color: 'graytext',
    cursor: 'text',
    marginLeft: element.css('marginLeft'),
    marginTop: element.css('marginTop'),
    paddingLeft: element.css('paddingLeft'),
    paddingTop: element.css('paddingTop'),
    lineHeight: '1.3'
```
修正后的代码：

```javascript
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
```
