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
##参数
```json
{validators:{key:validator},
triggers:'',
validatorAttrName:''}
```


