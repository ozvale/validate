// form表单元素验证器
// 吴志文
(function($) {
	var Validation = function($scope, options) {
		options = options || {};
		this.$scope = $($scope);
		// validators
		this.validators = {};
		this.putValidator(Validation.validators).putValidator(options.validators);
		// triggers
		this.triggers = options.triggers || 'blur keyup';
		// 在指定元素上标记的验证器的属性名称.一般不做改动
		this.validatorAttrName = options.validatorAttrName || 'validator';
		// bind events
		var that = this;
		this.$scope.on(this.triggers, '[' + this.validatorAttrName + ']', function(event) {
			var $field = $(this);
			// 如果字段本身设置了触发事件.则以用户设置为准
			var _triggers = $field.attr('triggers');
			if (!_triggers || _triggers.split(' ').indexOf(event.type) != -1) {
				that.validateField($field);
			}
		});
	};

	// 原型方法
	Validation.prototype = {
		// 设置验证器定义
		putValidator : function(validators) {
			if (!$.isEmptyObject(validators)) {
				for ( var k in validators) {
					this.validators[k] = $.extend({}, Validation.defaultValidator, validators[k]);
				}
			}
			return this;
		},
		// 触发字段验证
		validateField : function($field) {
			var validators = this.getFieldValidators($field);
			for ( var expr in validators) {
				var v = validators[expr];
				if (v.validate($field, expr)) {
					v.success($field, expr);
				} else {
					v.fail($field, expr);
					return false;
				}
			}
			return true;
		},
		// 解析并获取指定字段的验证器
		getFieldValidators : function($field) {
			var validators = $field.data('validators');
			if (!validators) {
				validators = {};
				var exprs = $field && $field.length > 0 && $field.attr('validator') && $field.attr('validator').split(';') || [];
				for (var i = 0; i < exprs.length; i++) {
					var expr = exprs[i];
					if (expr && expr.trim() != '') {
						for ( var k in this.validators) {
							// 匹配验证器的正则表达式
							if (this.validators[k].patten.test(expr)) {
								validators[expr] = this.validators[k];
							}
						}
					}
				}
				// 设置缓存
				$field.data('validators', validators);
			}
			return validators;
		},
		// 表单整体验证
		isValid : function() {
			var that = this;
			var result = true;
			this.$scope.find('[' + this.validatorAttrName + ']').each(function(i, e) {
				if (!that.validateField($(e))) {
					result = false;
				}
			});
			return result;
		}
	}

	// 静态属性及方法
	Validation.validators = {};
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
	// 添加元素验证器。全局添加
	Validation.putValidator = function(options) {
		for ( var k in options) {
			Validation.validators[k] = $.extend({}, Validation.defaultValidator, options[k]);
		}
	};
	// 添加系统默认验证器
	Validation.putValidator({
		// 非空
		notEmpty : {
			patten : /notEmpty/,
			validate : function($field) {
				return !!$field.val();
			},
			failMessage : '字段不能为空'
		},
		email : {
			patten : /email/,
			regExp : /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
			validate : function($field) {
				return $field.val() ? this.regExp.test($field.val()) : true;
			},
			failMessage : '字段值必须是邮箱'
		},
		number : {
			patten : /number/,
			validate : function($field) {
				return $field.val() ? $.isNumeric($field.val()) : true;
			},
			failMessage : '字段值必须是数字'
		},
		maxLength : {
			patten : /maxLength\((\d+)\)/,
			validate : function($field, expr) {
				var value = $field.val();
				var maxLength = parseInt(expr.match(this.patten)[1]) * 2;
				// 区分汉字与字母和符号的长度
				var length = 0;
				for (var i = 0; i < value.length; i++) {
					if (value.charCodeAt(i) <= 126) {
						length += 1;
					} else {
						length += 2;
					}
				}
				return length <= maxLength;
			},
			fail : function($field, expr) {
				this.clear($field);
				var maxLength = parseInt(expr.match(this.patten)[1]);
				$field.addClass('validate-fail-input').after('<p class="validate-fail-message">最多只能输入' + maxLength + '个字符</p>');
			}
		},
		cellphone : {
			patten : /cellphone/,
			regExp : /^1\d{10}$/,
			validate : function($field) {
				return $field.val() ? this.regExp.test($field.val()) : true;
			},
			failMessage : '手机号码输入不正确'
		}
	});

	// 启用对指定表单的验证(监听)
	$.fn.validate = function(options) {
		if (this.length == 0) {
			return this;
		}
		// 初始化
		else {
			this.each(function(i, e) {
				var $e = $(e);
				$e.data('validation', new Validation($e, options));
			});
			return this;
		}
	};

	// 是否验证通过
	$.fn.isValid = function(options) {
		if (this.length == 0) {
			return true;
		}
		// 初始化
		else {
			var success = 0;
			this.each(function(i, e) {
				var $e = $(e);
				var validation = $e.data('validation');
				if (!validation) {
					validation = new Validation($e, options);
					$e.data('validation', validation);
				}
				validation.isValid() && success++;
			});
			return success == this.length;
		}
	}

	// 静态方法
	window.$validation = Validation;
})(jQuery);