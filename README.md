# validate
极简单的表单验证工具.
支持html属性标记.
支持多项同时验证.
内置部分验证方法.
支持自定义添加验证方法.
支持局部自定义验证方法.
##示例：
```html
*html部分
<form>
<input type="text" validator="notEmpty"/>
<input type="text" validator="number"/>
</form>
*js 部分
初始化：$('form').validate(options);
提交前：$('form').isValid();
```
##options
###validators
自定义验证器组.格式为{'名称':validator}.validator见下面的介绍.
###validator(验证器)
这是一个默认的validator对象定义.你可以仅选择其中需要改变的属性和方法进行覆盖.一般情况下你只需要定义patten和validate.
```javascript
// 元素验证器默认对象
	Validation.defaultValidator = {
		// 需要匹配的正则表达式
		patten : '',
		// 元素验证函数.需返回true或false
		validate : function($field, expr) {
			return true;
		},
		// 元素验证未通过的措施。默认为加红边框和下方提示红色文字
		fail : function($field) {
			this.clear($field);
			$field.addClass('validate-fail-input').after('<p class="validate-fail-message">' + this.failMessage + '</p>');
		},
		// 如果使用默认提示函数。则需设置此字段以设置指定提示文字
		failMessage : '',
		// 元素通过验证的措施(包括清除未通过的效果)
		success : function($field) {
			this.clear($field);
			$field.addClass('validate-success-input');
		},
		clear : function($field) {
			$field.removeClass('validate-fail-input validate-success-input');
			$field.siblings('.validate-fail-message').remove();
		}
	};
```
###triggers
验证触发事件.默认是'blur keyup'.
###validatorAttrName
在html标签上标记验证器的属性名称.默认是validator
##methods
###boolean isValid()
指定区域被标记的控件是否验证通过
##static methods
###$validation.putValidator(options)
全局添加自定义验证器
####options
{validatorKey:validator,...}




