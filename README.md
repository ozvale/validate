# validate
* Html attribute mark + javascript.Easy to use.<br/>
* Supports multi validations  <br/>
* Supports add global validators<br/>
* Supports add temporary validators<br/>
* Based on jquery. <br/>

##Example：
html:
```html
<form>
   <input type="text" validator="notEmpty;maxLength(10)"/>
   <input type="text" validator="number"/>
</form>
```
javascript:
```javascript
//initialize
$('form').validate();
//before submit
if($('form').isValid()){
//do sth.
}
```
## jQuery.fn..

###  validate(options)
initiate a form under validating. 
* validators <br/>
{validatorKey :validator}.you can get 'validator' description below.
* triggers <br/>
events that input triggers.default is 'blur keyup'.
* validatorAttrName
input tag attribute name. default is 'validator'.you can change to another words if you already defined a 'validator' attibute.

###  boolean isValid()
the form validation is pass or not.

## validator
this is a default validator definition.you can choose some of attributes or methods to overwrite ,usually we only define 'patten' and 'validate',those are necessary.
```javascript
	Validation.defaultValidator = {
		// match regExp.like /notEmpty/.
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

##Static Attributes
####$validate.validators
global validators.including notEmpty,maxLength(length),number,email,celphone...

##Static Methods
###$validation.putValidator(options)
add or overwrite global validators.
####options
{validatorKey:validator,...}




