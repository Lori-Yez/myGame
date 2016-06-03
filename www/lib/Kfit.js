/*=============================================================================
 * KFIT 金证基金网上交易系统 V3.0
 * Copyright(c) 1998-2012 SZKingdom Co. Ltd.
 * All right reserved.
 *-----------------------------------------------------------------------------
 * 基金网上交易公用单元
 *
 * 修改历史：
 *----------------------------------------------------------------------------
 * 修改时间                                              修改人            修改内容
 * 2012-03-01 00:00 river   创建
 *============================================================================*/
/**
 * 表单验证器，支持一下参数:
 * {boolean} debug: 是否启用调试模式,默认: false
 * {callback} submitHandler: function(form). 有效表单提交的回调函数,可以用该回调函数在表单提交前作其他处理,默认表的的submit
 *          $(".selector").validate({
 *              submitHandler: function(form) {
 *                  // TODO 其它操作
 *                  form.submit();
 *              }
 *          });
 * {callback} invalidHandler: function(form, validator).无效表单提交的回调函数
 * {selector} ignore: 验证表单时,忽略元素的选择器,默认: ":hidden"
 * {object} rules: 通过Key/value对定义元素验证规则,Key为元素名称(或checkboxes/radio组名), value为由rule/parameter对或普通字符串组成的对象.
 *                 可以和class/attribute/metadata定义的规则组合使用. 每个规则可以指定一个depends属性，以便在某些条件下使用. 默认取classes, attributes, metadata
 *       $(".selector").validate({                 $(".selector").validate({
 *           rules: {                                  rules: {
 *               // 被转换为{required:true}                contact: {
 *               name: "required",                             required: true,
 *               // 符合规则                                   email: {
 *               email: {                                          depends: function(element) {
 *                   required: true,                                   return $("#contactform_email:checked")
 *                   email: true                                   }
 *               }                                             }
 *           }                                             }
 *       })                                        }})
 * {object} messages: 已Key/value对自定义错误提示信息. Key为元素名称; value为显示的信息,可以是一个字符串,也可以是一个回调函数,
 *          如果是回调函数则以验证规则的参数为第一入参，验证的元素为第二入参，并返回一个字符串.
 *      $(".selector").validate({
 *          rules: {
 *              name: "required",
 *              email: {required: true, email: true}
 *          },
 *          messages: {
 *              name: "Please specify your name",
 *              email: {
 *                  required: "We need your email address to contact you",
 *                  email: "Your email address must be in the format of name@domain.com"
 *              }
 *          }
 *      })
 * {objct} groups: 指定错误信息分组，每个分组的分组名为对象属性名，元素名称列表（以逗号分隔）为属性值.可用errorPlacement参数控制分钟显示的位置.
 *      $("#myform").validate({
 *          groups: {username: "fname,lname"},
 *          errorPlacement: function(error, element) {
 *              (element.attr("name") == "fname" || element.attr("name") == "lname") ? error.insertAfter("#lastname") : error.insertAfter(element);
 *          }
 *       })
 * {boolean} onsubmit: 在表单提交时验证数据.
 * {callback} onfocusin: 元素(除checkboxes/radio)的onfocusin处理事件,在该处理事件中验证数据.
 * {callback} onfocusout: 元素(除checkboxes/radio)的onfocusout处理事件,在该处理事件中验证数据.
 * {callback} onkeyup: 元素的onkeyup处理事件中验证数据. ,在该处理事件中验证数据.
 * {callback} onclick: checkboxes和radio按钮的onclick处理事件,在该处理事件中验证数据.
 * {boolean} focusInvalid: 为true时，在表单提交失败后，通过validator.focusInvalid()设置元素焦点，顺序：最后获得焦点的元素，第一个无效元素. 默认：true.
 * {boolean} focusCleanup: 为true时，当无效元素获得焦点时，清除元素的errorClass样式,隐藏所有错误提示，该参数避免与 focusInvalid 组合使用.
 * {string} meta:In case you use metadata for other plugins, too, you want to wrap your validation rules into their own object that can be specified via this option.
 * {string} errorClass: 无效元素外观显示类名,默认: "error"
 * {string} validClass: 有效元素外观显示类名,默认: "valid"
 * {string} errorElement: 用指定的元素创建提示标签. 默认为："label"
 * {string} wrapper: 用指定的元素包装错误提示标签. Useful in combination with errorLabelContainer to create a list of error messages.
 * {selector} errorLabelContainer: 验证时，显示或隐藏设置的匹配元素.
 * {selector} errorContainer: 验证时，显示或隐藏设置的匹配元素
 *          $("#myform").validate({
 *              errorContainer: "#messageBox1, #messageBox2",
 *              errorLabelContainer: "#messageBox1 ul",
 *              wrapper: "li", debug:true,
 *              submitHandler: function() { alert("Submitted!") }
 *          })
 * {callback} showErrors: function(errorMap, errorList).自定义消息显示处理过程. 第一个参数为错误映射对象(key/value),第二个参数为错误数组, 该函数在验证器的上下文中被调用,参数中仅包含当前已验证的元素的信息.默认: None.
 * {callback} errorPlacement: function($label, $element).自定义创建的显示标签的放置位置,第一个参数为显示标签的jQuery对象,第二个参数为无效元素的jQuery对象,默认显示标签放在无效元素的后面:$label.insertAfter(nElement)
 * {string|callback} success:如果该参数被指定,则在有效元素后面显示提示信息;如果该参数为字符串,则作为样式类名添加到显示标签,如果为函数则被调用,入参为显示标签的jQuery对象,可以在函数中为显示标签设置提示信息,如“OK”
 * {callback} highlight:function(nElement, sErrorClass, sValidClass),突出显示无效元素,默认添加errorClass样式类到无效元素
 * {callback} unhighlight:function(nElement, sErrorClass, sValidClass),highlight的反向执行,使突出显示的无效元素改为有效元素
 *          $(".selector").validate({
 *              highlight: function(nElement, sErrorClass, sValidClass) {
 *                  $(nElement).addClass(sErrorClass).removeClass(sValidClass);
 *                  $(nElement.form).find("label[for=" + nElement.id + "]").addClass(sErrorClass);
 *              },
 *              unhighlight: function(nElement, sErrorClass, sValidClass) {
 *                  $(nElement).removeClass(sErrorClass).addClass(sValidClass);
 *                  $(nElement.form).find("label[for=" + nElement.id + "]").removeClass(sErrorClass);
 *              }
 *          });
 * {boolean} ignoreTitle:获取提示信息时,是否从元素的title属性中获:false-获取,true-不获取,默认:false
 */
(function ($) {
    $.extend($.fn, {
        /**
         * 创建验证器,并初始化数据;该函数由jQuery表单对象调用,
         * 如:$("#test1").validate();
         * @param options 验证器参数
         * @returns 验证器
         */
        validate: function (options) {
            // 如果没选择jQuery表单对象则不再向下执行
            if (!this.length) {
                // 输出错误信息到控制台
                options && options.debug && window.console && console.warn("没有选择表单对象,无法验证！");
                return "";
            }

            // 检查该表单是否已创建验证器,如果已创建验则直接返回已创建验的验证器
            var validator = $.data(this[0], 'validator');
            if (validator) {
                return validator;
            }

            // 如果是HTML5.则添加novalidate标签
            try {
                this.attr('novalidate', 'novalidate');
            } catch (e) {
            }
            // 创建验证器
            validator = new $.validator(options, this[0]);
            // 表单的验证器创建后,被保存在该表单上
            $.data(this[0], 'validator', validator);
            // 设置表单提交验证
            if (validator.settings.onsubmit) {
                var inputsAndButtons = this.find("input, button");
                // allow suppresing validation by adding a cancel class to the submit button
                inputsAndButtons.filter(".cancel").click(function () {
                    validator.cancelSubmit = true;
                });

                // when a submitHandler is used, capture the submitting button
                if (validator.settings.submitHandler) {
                    inputsAndButtons.filter(":submit").click(function () {
                        validator.submitButton = this;
                    });
                }

                // 设置表单提交处理事件
                this.submit(function (event) {
                    if (validator.settings.debug) {
                        event.preventDefault();// 阻止表单提交
                    }
                    function handle() {
                        if (validator.settings.submitHandler) {
                            var hidden = null;
                            if (validator.submitButton) {
                                // insert a hidden input as a replacement for the missing submit button
                                hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call(validator, validator.currentForm);
                            if (validator.submitButton) {
                                // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }

                    // prevent submit for invalid forms or custom submit handlers
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    // 执行表单验证检查
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }

            return validator;
        },

        /**
         * 检查表单或所有选择的元素是否有效
         * @return {boolean} 是否成功
         */
        valid: function () {
            if ($(this[0]).is('form')) {
                return this.validate().form();
            } else {
                var valid = true;
                var validator = $(this[0].form).validate();
                this.each(function () {
                    valid &= validator.checkElement(this);
                });
                return valid;
            }
        },

        /**
         * 移除匹配元素的属性
         * @param {string} sAttributes 以空格分隔的属性列表
         * @return 返回移除的属性对象
         */
        removeAttrs: function (sAttributes) {
            var result = {}, $element = this;
            $.each(sAttributes.split(/\s/), function (index, sValue) {
                result[sValue] = $element.attr(sValue);
                $element.removeAttr(sValue);
            });
            return result;
        },

        /**
         * 设置/获取当前元素(this)的验证规则
         * @param {string} sCommand "add"和"remove"
         * @params {string|object} rule 验证规则字符串和验证规则对象
         * @returns 当前元素的验证规则
         */
        rules: function (sCommand, rule) {
            var nElement = this[0];  // 当前DOM元素

            if (sCommand) {
                var settings = $.data(nElement.form, 'validator').settings;
                var staticRules = settings.rules;
                var existingRules = $.validator.getStaticRules(nElement);
                switch (sCommand) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(rule));
                        staticRules[nElement.name] = existingRules;
                        // 如果rule是验证规则对象
                        if (rule.messages) {
                            settings.messages[nElement.name] = $.extend(settings.messages[nElement.name], rule.messages);
                        }
                        break;
                    case "remove":
                        if (!rule) {
                            delete staticRules[nElement.name];
                            return existingRules;
                        }
                        var filtered = {};
                        $.each(rule.split(/\s/), function (iIndex, sMethod) {
                            filtered[sMethod] = existingRules[sMethod];
                            delete existingRules[sMethod];
                        });
                        return filtered;
                }
            }

            var oRules = $.validator.normalizeRules(
                $.extend({},
                    //$.validator.getMetaDataRules(nElement),
                    $.validator.getClassRules(nElement),
                    $.validator.getAttributeRules(nElement),
                    $.validator.getStaticRules(nElement)
                ), nElement);

            // 如果该元素要求必须输入,则oRules对象中required属性要在第一位置
            if (oRules.required) {
                var param = oRules.required;
                delete oRules.required;
                oRules = $.extend({required: param}, oRules);
            }
            return oRules;
        }
    });

    // 自定义选择器
    $.extend($.expr[":"], {
        blank: function (a) {
            return !$.trim("" + a.value);
        },
        filled: function (a) {
            return !!$.trim("" + a.value);
        },
        unchecked: function (a) {
            return !a.checked;
        }
    });

    /**
     * 验证器构造函数
     * @param {object} options 验证器参数
     * @param {$object} form 待验证的表单
     */
    $.validator = function (options, form) {
        // 默认参数与传入的参数合并存放在settings中
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };

    $.validator.format = function (source, params) {
        if (arguments.length == 1)
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [ params ];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    };

    /* 定义验证器defaults属性(包含验证器默认的属性和方法),
     * 在创建验证器时,该属性被合并到验证器的settings属性中。*/
    $.extend($.validator, {
        defaults: {
            messages: {},
            groups: {}, // 将表单元素验证后显示提示信息进行分组显示,每个分组提示信息显示在同一个提示元素(label)中
            rules: {}, //
            errorClass: "error", // 验证元素失败后,该元素的显示的外观类名
            validClass: "valid", // 验证元素成功后,该元素的显示的外观类名
            errorElement: "label", // 验证元素失败后,提示信息显示的元素
            focusInvalid: true,
            errorContainer: $([]), // jQuery对象
            errorLabelContainer: $([]), // jQuery对象,如果设置,则验证失败后提示信息标签显示在该元素内
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            showErrDlg: false, // 是否显示错误对话框
            showErrStyle: "tips", // showErrMsg为true,显示错误格  td;tips
            showErrMsg: true, // 是否显示错误信息
            fields: {}, // 字段名称,{field:"字段名"},显示对话框时使用
            // 输入元素获取焦点时处理事件
            onfocusin: function (nElement, oEvent) {
                this.lastActive = nElement;
                // 获得焦点时,如果输入有效则隐藏错误标签移除错误类
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    this.settings.unhighlight && this.settings.unhighlight.call(this, nElement, this.settings.errorClass, this.settings.validClass);
                    this.addWrapper(this.getErrorLabel(nElement)).hide();
                    this.hideAllErrors();
                }
                if (this.settings.showErrStyle == 'tips') {
                    $(this.lastActive).poshytip('destroy');
                }
            },
            // 输入元素焦点离开处理事件
            onfocusout: function (nElement, oEvent) {
                var $element = $(nElement);
                if ($element.attr('lastcheck') == 'true') {
                    return;
                }

                //判断是否只显示最后验证元素错误
                if (this.settings.singleError || this.settings.showErrStyle == 'tips') {
                    this.hideAllErrors();
                }
                // modify by ljy 20120705 验证失败和检测附加属性，不知什么用，暂时先去掉
                // fireEvent: "focusout",      // 验证触发事件 focusout,keyup
                if (!this.checkable(nElement)) {// && (nElement.name in this.submitted || !this.optional(nElement))){
                    this.checkElement(nElement, oEvent);
                }
            },
            // 输入元素键盘处理事件
            onkeyup: function (nElement, oEvent) {
                if (nElement == this.lastActive) {
                    this.checkElement(nElement, oEvent);
                }
            },
            // 输入元素单击处理事件
            onclick: function (nElement, oEvent) {
                // click on selects, radiobuttons and checkboxes
                if (nElement.name in this.submitted) {
                    this.checkElement(nElement, oEvent);
                } else if (nElement.parentNode.name in this.submitted) {
                    this.checkElement(nElement.parentNode, oEvent);
                }
            },

            /**
             * 该函数在验证失败时调用,用于改变元素显示外观(移除成功样式,显示失败样式)
             * @param nElement DOM元素
             * @param sErrorClass 失败时的显示外观
             * @param sValidClass 成功时的显示外观
             */
            highlight: function (nElement, sErrorClass, sValidClass) {
                if (nElement.type === 'radio') {
                    this.findByName(nElement.name).addClass(sErrorClass).removeClass(sValidClass);
                } else {
                    $(nElement).addClass(sErrorClass).removeClass(sValidClass);
                }
            },

            /**
             * 与highlight执行相反的过程(移除失败样式,显示成功样式)
             * @param nElement DOM元素
             * @param sErrorClass 失败时的显示外观
             * @param sValidClass 成功时的显示外观
             */
            unhighlight: function (nElement, sErrorClass, sValidClass) {
                if (nElement.type === 'radio') {
                    this.findByName(nElement.name).removeClass(sErrorClass).addClass(sValidClass);
                } else {
                    $(nElement).removeClass(sErrorClass).addClass(sValidClass);
                }
            }
        },

        /**
         * 设置验证器默认参数,以key/value形式提供
         * @param {object} settings 参数(key/value形式)
         */
        setDefaults: function (settings) {
            $.extend($.validator.defaults, settings);
        },

        /**
         * 存放每个验证方法验证失败后的提示消息
         */
        messages: {
            required: "必须输入",
            email: "格式不正确",
            url: "格式不正确",
            tel: "格式不正确",
            mobile: "格式不正确",
            date: "请输入有效的日期,格式:yyyy-mm-dd",
            dateint: "请输入有效的日期,格式:yyyymmdd",
            integer: "请输入有效的整型数字",
            number: "请输入有效的数字",
            digits: "仅能输入数字",
            postalcode: "格式不正确",
            idcard: "格式不正确",
            equalto: "请输入与上面相同的数据.",
            chinese: "请输入正确户名信息",
            maxlength: $.validator.format("输入的数据长度必须小于等于 {0} 个字符"),
            minlength: $.validator.format("输入的数据长度必须大于等于 {0} 个字符"),
            rangelength: $.validator.format("输入的数据长度必须在 {0} ～ {1} 个字符之间"),
            range: $.validator.format("输入的数据必须在{0} ～ {1}之间"),
            max: $.validator.format("输入的数据必须小于等于{0}."),
            min: $.validator.format("输入的数据必须大于等于{0}.")
        },

        autoCreateRanges: false, // 是否将min和max转换为range,minlength和maxlength转换为rangelength

        /**
         * 验证器的原型对象,定义了验证器包含的属性和方法
         */
        prototype: {
            // 初始化验证器
            init: function () {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer && this.labelContainer.length || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};    // 保存验证失败的元素,$.extend(this.submitted, this.errorMap);
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};      // 保存验证失败的元素,格式:元素名称 = true/失败提示信息($.extend({}, this.errorMap);)
                this.reset();
                // 处理表单元素验证提示分组显示
                var groups = (this.groups = {});
                $.each(this.settings.groups, function (key/*属性名*/, value/*属性值*/) {
                    $.each(value.split(","), function (index, name) {
                        groups[name] = key;    // 以元素名=分组名存放
                    });
                });

                // 处理自定义元素验证规则
                var rules = this.settings.rules;
                $.each(rules, function (key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });

                // 表单元素的验证处理过程,该过程被关联到表单元素的focusin focusout keyup click事件上
                function delegate(event) {
                    var validator = $.data(this[0].form, "validator");
                    var eventType = "on" + event.type.replace(/^validate/, "");
                    var fnEvent = validator.settings[eventType];
                    fnEvent && fnEvent.call(validator, this[0], event);
                }

                // 为表单元素添加事件(focusin、focusout、keyup)处理过程(delegate)
                // radio、checkbox、select、option元素额外添加click事件
                $(this.currentForm)
                    .validateDelegate("[type='text'], [type='password'], [type='file'], " +
                        "select, textarea, [type='number'], [type='integer'] [type='search'] , " +
                        "[type='tel'], [type='url'], [type='date'], [type='dateint'], [type='email'], [type='datetime'], " +
                        "[type='month'], [type='week'], [type='time'], [type='datetime-local'], " +
                        "[type='range'], [type='color']", "focusin focusout keyup", delegate)
                    .validateDelegate("[type='radio'], [type='checkbox'], select, option",
                        "click", delegate);

                // 设置表单验证失败后的处理事件,在form和stopRequest函数中触发该事件
                if (this.settings.invalidHandler) {
                    $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
                }
            },

            /**
             * 验证当前表单输入
             * @returns 成功返回true,否则返回false
             */
            form: function () {
                this.prepareForm();
                // 检查所有输入元素
                for (var i = 0, aElements = (this.currentElements = this.getFormElements()); aElements[i]; i++) {
                    this.check(aElements[i]);
                }

                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                // 有验证失败元素则触发表单invalid-form事件
                var bValid = this.valid();
                if (!bValid) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                }
                this.showErrors();
                return bValid;
            },

            /**
             * 验证表单中的一个元素是否有效
             * @param {dom} nElement
             */
            checkElement: function (nElement, event) {
                nElement = this.validationTargetFor(this.clean(nElement));
                this.lastElement = nElement;
                this.prepareElement(nElement);
                this.currentElements = $(nElement);
                var result = this.check(nElement, event);

                if (result) {
                    delete this.invalid[nElement.name];
                } else {
                    this.invalid[nElement.name] = true;
                }
                if (!this.numberOfInvalids()) {
                    // Hide error containers on last error
                    this.toHide = this.toHide.add(this.containers);
                }
                this.showErrors();
                return result;
            },

            /**
             * 显示验证失败的错误信息
             * @param {object} oErrors 可选,格式:元素名称 = 错误信息
             */
            showErrors: function (oErrors) {
                if (oErrors) {
                    // 添加错误信息项到 list 和 map中
                    $.extend(this.errorMap, oErrors);
                    this.errorList = [];
                    for (var sElementName in oErrors) {
                        this.errorList.push({
                            message: oErrors[sElementName],
                            element: this.findByName(sElementName)[0]
                        });
                    }
                    // 从 successList 中移除($.grep(array, callback, [invert]):使用过滤函数过滤数组元素)
                    this.successList = $.grep(this.successList, function (nEelement) {
                        return !(nEelement.name in oErrors);
                    });
                }
                // 如果有自定义的显示错误提示的函数(settings.showErrors)则调用自定义,否则调用默认的
                this.settings.showErrors
                    ? this.settings.showErrors.call(this, this.errorMap, this.errorList)
                    : this.defaultShowErrors();
            },

            resetForm: function () {
                if ($.fn.resetForm) {
                    $(this.currentForm).resetForm();
                }
                this.submitted = {};
                this.lastElement = null;
                this.prepareForm();
                this.hideErrors();
                this.getFormElements().removeClass(this.settings.errorClass);
            },

            numberOfInvalids: function () {
                return this.objectLength(this.invalid);
            },

            objectLength: function (obj) {
                var count = 0;
                for (var i in obj) {
                    count++;
                }
                return count;
            },

            hideErrors: function () {
                if (this.settings.showErrStyle == 'tips')
                    this.hideAllErrors();
                else
                    this.addWrapper(this.toHide).hide();
            },

            hideAllErrors: function () {
                if (this.settings.showErrStyle == 'tips') {
                    for (var i = 0, aElements = (this.currentElements = this.getFormElements()); aElements[i]; i++)
                        $(aElements[i]).poshytip('destroy');
                } else {
                    for (var i = 0, aElements = (this.currentElements = this.getFormElements()); aElements[i]; i++) {
                        this.addWrapper(this.getErrorLabel(aElements[i])).hide();
                    }
                }
            },
            valid: function () {
                var sErr = "";
                //大成客户要求，页面提示不弹框提示，只显示在输入框后面即可
                if(this.settings.showErrDlg)this.settings.showErrDlg = false;
                if (this.settings.showErrDlg) {
                    var s;
                    for (s in this.errorMap)
                        sErr += this.getFieldName(s) + this.errorMap[s] + "<br/>";
                    if (sErr != "")
                        KDlg.info(sErr);
                }
                return this.size() == 0;
            },

            getFieldName: function (sField) {
                return this.settings.fields[sField] || sField;
            },

            size: function () {
                return this.errorList.length;
            },

            focusInvalid: function () {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
                            .filter(":visible")
                            .focus()
                            .trigger("focusin");    // 手动触发focusin事件
                    } catch (e) {
                        // ignore IE throwing errors when focusing hidden elements
                    }
                }
            },

            findLastActive: function () {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList,function (n) {
                    return n.element.name == lastActive.name;
                }).length == 1 && lastActive;
            },

            /**
             * 获取当前表单的输入元素并返回,返回的输入元素中,仅包含
             * input、select、textarea等元素,且去除无效的[disabled]、
             * 提交按钮[:submit]、 重置按钮[:reset]、图像[:image]和
             * this.settings.ignore属性中指定的元素;同名元素仅返回该
             * 名称的第一个元素,如:单选按钮组[radio],仅返回第一个单
             * 选按钮
             * @return jQery对象数组
             */
            getFormElements: function () {
                var validator = this;
                var rulesCache = {};    // 存放当

                // 选择表单中所有有效输入元素
                return $(this.currentForm)
                    .find("input, select, textarea")// 全部输入元素
                    .not(":submit, :reset, :image, [disabled]")// 去除提交、重置、图片和无效的
                    .not(this.settings.ignore)// 去除忽略的
                    .filter(function () {
                        // 如果没设置元素的name属性,则在控制台输入调试信息
                        !this.name && validator.settings.debug && window.console && console.error("%o 没有设置 name 属性", this);

                        // 仅选择同名元素的第一个,如radio按钮
                        if (this.name in rulesCache || !validator.objectLength($(this).rules()))
                            return false;

                        rulesCache[this.name] = true;
                        return true;
                    });
            },

            clean: function (selector) {
                return $(selector)[0];
            },

            /**
             * 获取当前所有错误标签,并返回(jQuery对象数组)
             */
            getErrorLabels: function () {
                return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext);
            },

            /**
             * 清空当前验证信息
             */
            reset: function () {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([]);
            },

            /**
             * 准备验证表单
             */
            prepareForm: function () {
                this.reset();
                this.toHide = this.getErrorLabels().add(this.containers);
            },

            /**
             * 准备验证元素
             */
            prepareElement: function (nElement) {
                this.reset();
                this.toHide = this.getErrorLabel(nElement);
            },

            /**
             * 验证表单元素的输入是否有效,验证失败加入errorList、errorMap和submitted中,
             * @param {dom object|array} nEelement 当前验证的DOM元素,如果是radio/checkbox则使元素数组
             * @returns true/false
             */
            check: function (nEelement, event) {
                nEelement = this.validationTargetFor(this.clean(nEelement));
                // 获取该元素的验证规则
                var oRules = $(nEelement).rules();
                var bDependencyMismatch = false;


                //取得验证
                var oFireEvent;
                var arrRuleFire;
                if (event) {
                    var sFireEvent = $(nEelement).attr("fireEvent");
                    var sRules = "";
                    $.each(oRules, function (i, n) {
                        sRules = sRules + "'" + i + "'" + ","
                    });
                    sRules = sRules.substring(0, sRules.length - 1);

                    if (!sFireEvent) {
                        sFireEvent = "{focusout:[" + sRules + "]}";
                    }
                    oFireEvent = eval("(" + sFireEvent + ")");
                    arrRuleFire = eval("oFireEvent." + event.type);
                }

                //for ( sMethod in oRules) { 在语句中定义,首次执行到这里会报错 modify by ljy 20120620
                var sMethod = null;
                for (sMethod in oRules) {
                    if (event && oFireEvent) {
                        if (!arrRuleFire) continue;
                        if ($.inArray(sMethod, arrRuleFire) == -1)
                            continue;
                    }
                    var oRuleItem = {method: sMethod, parameters: oRules[sMethod] };
                    try {
                        // 执行该规则验证,返回true/false/dependency-mismatch/pending
                        var result = $.validator.methods[sMethod].call(this, nEelement.value.replace(/\r/g, ""), nEelement, oRuleItem.parameters, event);

                        // if a method indicates that the field is optional and therefore valid,
                        // don't mark it as valid when there are no other rules
                        if (result == "dependency-mismatch") {
                            bDependencyMismatch = true;
                            continue;
                        }
                        bDependencyMismatch = false;

                        if (result == "pending") {
                            this.toHide = this.toHide.not(this.getErrorLabel(nEelement));
                            return false;
                        }

                        if (!result) {
                            this.formatAndAddError(nEelement, oRuleItem);
                            return false;
                        }
                    } catch (e) {
                        this.settings.debug && window.console && console.log("检查元素 " + nEelement.id + "发生异常:", e);
                        throw e;
                    }
                }
                if (bDependencyMismatch) return false;
                if (this.objectLength(oRules))
                    this.successList.push(nEelement);
                return true;
            },

            // return the custom message for the given element and validation method
            // specified in the element's "messages" metadata
            customMetaMessage: function (nElement, method) {
                if (!$.metadata) return;

                var meta = this.settings.meta ? $(nElement).metadata()[this.settings.meta]
                    : $(nElement).metadata();

                return meta && meta.messages && meta.messages[method];
            },

            // return the custom message for the given element name and validation method
            customMessage: function (name, method) {
                var m = this.settings.messages[name];
                return m && (m.constructor == String ? m : m[method]);
            },

            /**
             * 获取元素提示信息
             * @param {dom} nElement
             * @param {string} 验证函数名称
             * @returns 提示信息
             */
            getMessage: function (nElement, sMethod) {
                var sMsg = this.customMessage(nElement.name, sMethod);
                if (sMsg === undefined) {
                    sMsg = this.customMetaMessage(nElement, sMethod);
                    if (sMsg === undefined) {
                        sMsg = !this.settings.ignoreTitle && nElement.title || undefined;
                        if (sMsg === undefined) {
                            sMsg = $.validator.messages[sMethod];
                            if (sMsg === undefined) {
                                sMsg = "<strong>Warning: No message defined for " + nElement.name + "</strong>";
                            }
                        }
                    }
                }
                return sMsg;
            },

            /**
             * 在check函数中,当元素校验失败后被调用,并将失败元素和信息封装到对象,
             * 保存到errorList中,将提示信息更新到errorMap和submitted中
             * @param {dom object} nElement 失败的元素
             * @param {object} oRule 执行失败的校验规则
             */
            formatAndAddError: function (nElement, oRrule) {
                var oRegex = /\$?\{(\d+)\}/g;
                var sMsg = this.getMessage(nElement, oRrule.method);
                if (typeof sMsg == "function") {
                    sMsg = sMsg.call(this, oRrule.parameters, nElement);
                } else if (oRegex.test(sMsg)) {
                    // 格式化提示信息
                    sMsg = jQuery.format(sMsg.replace(theregex, '{$1}'), oRrule.parameters);
                }
                this.errorList.push({
                    message: sMsg,
                    element: nElement
                });

                this.errorMap[nElement.name] = sMsg;
                this.submitted[nElement.name] = sMsg;
            },

            addWrapper: function (toToggle) {
                if (this.settings.wrapper)
                    toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
                return toToggle;
            },

            /**
             * 默认显示errorList中的错误提示信息的函数,该函数在showErrors调用
             */
            defaultShowErrors: function () {
                if (this.settings.showErrStyle == 'tips') {
                    this.ShowErrorsByTips();
                } else {
                    this.ShowErrorsByLable();
                }
            },

            ShowErrorsByLable: function () {
                // 显示失败元素提示
                for (var i = 0; this.errorList[i]; i++) {
                    var oError = this.errorList[i];
                    // 通过样式类改变验证失败元素的显示外观
                    this.settings.highlight && this.settings.highlight.call(this, oError.element, this.settings.errorClass, this.settings.validClass);
                    // 显示提示信息到标签中
                    if (this.settings.showErrMsg != false)
                        this.showLabel(oError.element, oError.message);
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }

                // 显示成功元素提示
                if (this.settings.success) {
                    for (var i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (var i = 0, elements = this.validElements(); elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show();
            },

            ShowErrorsByTips: function () {
                this.hideAllErrors();
                try {
                    this.showTips(this.errorList[0].element, this.errorList[0].message);
                } catch (e) {
                    // ignore IE throwing errors when focusing hidden elements
                }

                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }

                // 成功元素不提示
                for (var i = 0; this.successList[i]; i++) {
                    $(this.successList[i]).poshytip('destroy');
                }

                if (this.settings.unhighlight) {
                    for (var i = 0, elements = this.validElements(); elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
            },

            validElements: function () {
                return this.currentElements.not(this.invalidElements());
            },

            invalidElements: function () {
                return $(this.errorList).map(function () {
                    return this.element;
                });
            },

            /**
             * 为指定元素显示错误提示信息
             * @param nElement
             * @param {string} sMsg 标签提示信息
             */
            showLabel: function (nElement, sMsg) {
                var $label = this.getErrorLabel(nElement);
                if ($label.length) {
                    // 已存在则刷新显示外观
                    $label.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                    //label位置显示
                    if ($label.parent().next().length == 1) {
                        $label.css('top', $label.parent().next().offset().top + 'px');
                        $label.css('left', $label.prev().offset().left + $label.prev().width() + 10 + 'px');
                        $label.css('width', $label.parent().next().width() - 27 + 'px');
                        $label.css('height', $label.parent().next().height() + 'px');
                        $label.css('line-height', $label.parent().next().height() + 'px');
                        $label.css('padding', '0 5px 0 25px');
                    } else {
                        $label.css('top', $label.prev().offset().top + 'px');
                        $label.css('left', $label.prev().offset().left + $label.prev().width() + 10 + 'px');
                        $label.css('height', $label.prev().height() + 'px');
                        $label.css('line-height', $label.prev().height() + 'px');
                        $label.css('padding', '0 5px 0 25px');
                    }

                    // 如果是自动创建的标签则更新显示信息
                    $label.attr("generated") && $label.html(sMsg);
                } else {
                    // 创建 label
                    $label = $("<" + this.settings.errorElement + "/>")
                        .attr({"for": this.getIdOrName(nElement), generated: true})
                        .addClass(this.settings.errorClass)
                        .html(sMsg || "");
                    // 创建错误提示标签的容器标签
                    if (this.settings.wrapper) {
                        $label = $label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    // 放置标签
                    if (!this.labelContainer.append($label).length) {
                        $placeElement = $("#" + this.groups[nElement.name]);
                        if ($placeElement.length) {
                            this.settings.errorPlacement        // 自定义放置处理函数
                                ? this.settings.errorPlacement($label, $($placeElement))
                                : $label.insertAfter($placeElement); // 默认放在输入元
                        }
                        else {
                            this.settings.errorPlacement        // 自定义放置处理函数
                                ? this.settings.errorPlacement($label, $(nElement))
                                : $label.insertAfter(nElement); // 默认放在输入元素后面
                        }
                    }

                    //label位置显示
                    if ($label.parent().next().length == 1) {
                        $label.css('top', $label.parent().next().offset().top + 'px');
                        $label.css('left', $label.prev().offset().left + $label.prev().width() + 10 + 'px');
                        $label.css('width', $label.parent().next().width() - 27 + 'px');
                        $label.css('height', $label.parent().next().height() + 'px');
                        $label.css('line-height', $label.parent().next().height() + 'px');
                        $label.css('padding', '0 5px 0 25px');
                    } else {
                        $label.css('top', $label.prev().offset().top + 'px');
                        $label.css('left', $label.prev().offset().left + $label.prev().width() + 10 + 'px');
                        $label.css('height', $label.prev().height() + 'px');
                        $label.css('line-height', $label.prev().height() + 'px');
                        $label.css('padding', '0 5px 0 25px');
                    }

                }

                if (!sMsg && this.settings.success) {
                    $label.text("");
                    typeof this.settings.success == "string"
                        ? label.addClass(this.settings.success)
                        : this.settings.success($label);
                }
                this.toShow = this.toShow.add($label);
            },

            showTips: function (nElement, sMsg) {
                var $element = $(nElement);
                var sTipsLayout = $element.attr('tipslayout') || "";
                var oOptions = {};
                switch (sTipsLayout.toLowerCase()) {
                    case 'left':
                        oOptions.alignX = 'left';
                        oOptions.alignY = 'center';
                        oOptions.offsetX = 5;
                        break;
                    case "top":
                        oOptions.alignX = 'inner-left';
                        oOptions.alignY = 'top';
                        oOptions.offsetY = 5;
                        oOptions.offsetX = 0;
                        break;
                    case 'bottom':
                        oOptions.alignX = 'inner-left';
                        oOptions.alignY = 'bottom';
                        oOptions.offsetX = 0;
                        oOptions.offsetY = 5;
                        break;
                    default:
                        oOptions.alignX = 'right';
                        oOptions.alignY = 'center';
                        oOptions.offsetX = 5;
                        break;
                }
                oOptions.showOn = 'none';
                oOptions.content = sMsg;
                oOptions.alignTo = 'target';

                $(nElement).poshytip(oOptions);
                $(nElement).poshytip('show');
            },
            /**
             * 获取指定元素的错误标签,如果没有则返回空jQuery对象
             */
            getErrorLabel: function (nElement) {
                var sName = this.getIdOrName(nElement);
                return this.getErrorLabels().filter(function () {
                    return $(this).attr('for') == sName;
                });
            },

            /**
             * 获取元素的名称(name)或标识(id),分组显示的返回分组名称,
             * radio/checkbox返回名称,否则返回Id,如果没设置id返回name
             */
            getIdOrName: function (nElement) {
                return this.groups[nElement.name] || (this.checkable(nElement) ? nElement.name : nElement.id || nElement.name);
            },

            validationTargetFor: function (nElement) {
                // if radio/checkbox, validate first element in group instead
                if (this.checkable(nElement)) {
                    nElement = this.findByName(nElement.name).not(this.settings.ignore)[0];
                }
                return nElement;
            },

            // 检查元素类型是否是radio或checkbox
            checkable: function (nElement) {
                return /radio|checkbox/i.test(nElement.type);
            },

            findByName: function (sName) {
                // select by name and filter by form for performance over form.find("[name=...]")
                var nForm = this.currentForm;
                return $(document.getElementsByName(sName)).map(function (index, nElement) {
                    return nElement.form == nForm && nElement.name == sName && nElement || null;
                });
            },

            getLength: function (value, nElement) {
                switch (nElement.nodeName.toLowerCase()) {
                    case 'select':
                        return $("option:selected", nElement).length;
                    case 'input':
                        if (this.checkable(nElement))
                            return this.findByName(nElement.name).filter(':checked').length;
                }
                return value.length;
            },

            depend: function (param, nElement) {
                return this.dependTypes[typeof param]
                    ? this.dependTypes[typeof param](param, nElement)
                    : true;
            },

            dependTypes: {
                "boolean": function (param, nElement) {
                    return param;
                },
                "string": function (param, nElement) {
                    return !!$(param, nElement.form).length;
                },
                "function": function (param, nElement) {
                    return param(nElement);
                }
            },

            optional: function (nElement) {
                //return !$.validator.methods.required.call(this, $.trim(nElement.value), nElement) && "dependency-mismatch";
                // modify by ljy 20120705 "dependency-mismatch"好像没什么用
                return !$.validator.methods.required.call(this, $.trim(nElement.value), nElement);
            },

            startRequest: function (nElement) {
                if (!this.pending[nElement.name]) {
                    this.pendingRequest++;
                    this.pending[nElement.name] = true;
                }
            },

            stopRequest: function (nElement, valid) {
                this.pendingRequest--;
                // sometimes synchronization fails, make sure pendingRequest is never < 0
                if (this.pendingRequest < 0)
                    this.pendingRequest = 0;
                delete this.pending[nElement.name];
                if (valid && this.pendingRequest == 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false;
                } else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },

            previousValue: function (nElement) {
                return $.data(nElement, "previousValue") || $.data(nElement, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.getMessage(nElement, "remote")
                });
            }

        },

        /**
         * 保存验证规则对象
         */
        oClassRuleSettings: {
            required: {required: true},
            email: {email: true},
            url: {url: true},
            tel: {tel: true},
            mobile: {mobile: true},
            date: {date: true},
            dateint: {dateint: true},
            integer: {integer: true},
            number: {number: true},
            digits: {digits: true},
            postalcode: {postalcode: true},
            idcard: {idcard: true},
            equalto: {equalto: true},
            chinese: {chinese: true}
        },

        /**
         * 添加样式类验证规则,支持1个或2个入参
         * @examples
         *     jQuery.validator.addClassRules({
         *         name: {required: true, minlength: 2},
         *        zip: {required: true, digits: true, minlength: 5, maxlength: 5}
         *      });
         *
         *     jQuery.validator.addClassRules("name", {required: true, minlength: 2});
         * @return object 验证规则对象
         */
        addClassRules: function () {
            if (arguments[0].constructor == String) {
                this.oClassRuleSettings[arguments[0]] = arguments[1];
            } else {
                $.extend(this.oClassRuleSettings, arguments[0]);
            }
        },

        /**
         * 获取DOM元素通过class属性值定义的验证规则,属性值为validator.oClassRuleSettings
         * 对象的属性名称,如:<input name="user" class="required email" />
         * @param {dom} nElement 待验证元素
         * @returns object 验证规则对象
         */
        getClassRules: function (nElement) {
            var oRules = {};
            var sClasses = $(nElement).attr('class');
            sClasses && $.each(sClasses.split(' '), function () {
                if (this in $.validator.oClassRuleSettings) {
                    $.extend(oRules, $.validator.oClassRuleSettings[this]);
                }
            });
            return oRules;
        },

        /**
         * 获取DOM元素通过属性名称定义的验证规则,属性名称为validator.methods对象中的方法名称
         * <input id="cname" name="name" class="required" minlength="2" />
         * @param {dom} nElement 待验证元素
         * @returns object 验证规则对象
         */
        getAttributeRules: function (nElement) {
            var nAttr, sValue, oRules = {};
            for (var sMethod in $.validator.methods) {
                nAttr = nElement.getAttributeNode(sMethod);
                if (nAttr) {
                    sValue = nAttr.value;
                    if (sValue && $.trim(sValue).length > 0 && $.trim(sValue) != "null" && $.trim(sValue) != "undefined") {
                        if (sValue == "true") {
                            oRules[sMethod] = true;
                        } else if (nAttr.name === sMethod) {
                            oRules[sMethod] = sValue;
                        }
                    }
                }
            }


            /* 对文本输入框,如果没设置属性[maxlength],则其可能返回值有:-1, 2147483647 (IE) 或 524288 (safari)
             所以,如果出现这些值,则说明最大长度不限制,故删除该验证规则 */
            if (oRules.maxlength && /-1|2147483647|524288/.test(oRules.maxlength)) {
                delete oRules.maxlength;
            }
            return oRules;
        },

        /**
         * 获取DOM元素通过$("#标识").validate()设置的规则
         * @param {dom} nElement 待验证元素
         * @returns object 验证规则对象
         */
        getStaticRules: function (nElement) {
            var oRules = {};
            var validator = $.data(nElement.form, 'validator');
            if (validator.settings.rules) {
                oRules = $.validator.normalizeRule(validator.settings.rules[nElement.name]) || {};
            }
            return oRules;
        },

        /**
         * 检查验证规则,并进行相关调整、计算，该函数在rules中调用
         * @param {object} oRules Key/value验证规则对象
         * @param {dom} nElement 待验证元素
         * @return object 检查后的验证规则对象
         */
        normalizeRules: function (oRules, nElement) {
            // 检查处理依赖设置
            $.each(oRules, function (prop, val) {
                // 值是boolean类型,忽略明确设置为false的验证规则,如:required:false
                if (val === false) {
                    delete oRules[prop];
                    return;
                }
                // 处理依赖
                if (val.param || val.depends) {
                    var bKeepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            bKeepRule = !!$(val.depends, nElement.form).length;  // 是否存在依赖元素
                            break;
                        case "function":
                            bKeepRule = val.depends.call(nElement, nElement);
                            break;
                    }
                    if (bKeepRule) {
                        oRules[prop] = val.param !== undefined ? val.param : true;
                    } else {
                        delete oRules[prop];
                    }
                }
            });

            // 如果参数值是函数则调用计算
            $.each(oRules, function (prop, val) {
                oRules[prop] = $.isFunction(val) ? val(nElement) : val;
            });

            // 转换minlength、maxlength、min、max验证函数的参数为数值类型
            $.each(['minlength', 'maxlength', 'min', 'max'], function () {
                if (oRules[this]) {
                    oRules[this] = Number(oRules[this]);
                }
            });

            // 转换rangelength、range验证函数的参数为数值类型
            $.each(['rangelength', 'range'], function () {
                if (oRules[this]) {
                    oRules[this] = [Number(oRules[this][0]), Number(oRules[this][1])];
                }
            });

            if ($.validator.autoCreateRanges) {
                // 如果设置了min和max验证,则自动转换为range验证,并删除原min、max验证
                if (oRules.min && oRules.max) {
                    oRules.range = [oRules.min, oRules.max];
                    delete oRules.min;
                    delete oRules.max;
                }
                // 如果设置了minlength和maxlength验证,则自动转换为rangelength验证,并删除原minlength、maxlength验证
                if (oRules.minlength && oRules.maxlength) {
                    oRules.rangelength = [oRules.minlength, oRules.maxlength];
                    delete oRules.minlength;
                    delete oRules.maxlength;
                }
            }
            return oRules;
        },

        /**
         * 转换一个字符串验证规则描述为验证规则对象;如:
         * "required minlength" --> {required:true, minlength: true}
         * 该函数在：addRuleMethod/rules/init/getStaticRules被调用
         * @param {string} rule 验证规则,如果是字符串则转换
         * @return 验证规则对象
         */
        normalizeRule: function (rule) {
            if (typeof rule == "string") {
                var oRule = {};
                $.each(rule.split(/\s/), function () {
                    oRule[this] = true;
                });
                rule = oRule;
            }
            return rule;
        },

        /**
         * 添加一个自定义验证方法,供外部调用,必须包含下列参数
         * @param {string} sMethedName 验证方法名称
         * @param {function} fnMethod 验证方法
         * @param {string|callback} message 验证失败提示信息
         */
        addRuleMethod: function (sMethedName, fnMethod, message) {
            $.validator.methods[sMethedName] = fnMethod;
            $.validator.messages[sMethedName] = message != undefined ? message : $.validator.messages[sMethedName];
            if (fnMethod.length < 5) {
                $.validator.addClassRules(sMethedName, $.validator.normalizeRule(sMethedName));
            }
        },

        // 验证器的验证方法,验证方法名称全部小写
        methods: {
            /*
             * 验证表单元素是否为空,为空则返回false,否则返回true,元素为空表示:
             * 编辑框未输入数据、单选/复选未选中、下拉列表未选择
             * @param {string} sValue 待验证的元素值,如果是select元素需重新用jQuery取值
             * @param {dom object} nElement DOM 元素
             * @param {boolean} bParam 验证参数
             * @return 是否有效
             */
            required: function (sValue, nElement, bParam) {
                // check if dependency is met
                if (!this.depend(bParam, nElement))
                    return "dependency-mismatch";

                switch (nElement.nodeName.toLowerCase()) {
                    case 'select':  // select DOM元素
                        // 如果元素是多选列表返回数组,否则返回字符串
                        var val = $(nElement).val();
                        return val && val.length > 0;
                    case 'input':   // radio/checkbox DOM元素
                        if (this.checkable(nElement))
                            return this.getLength(sValue, nElement) > 0;
                    default:
                        return $.trim(sValue).length > 0;
                }
            },

            /**
             * 检查元素数据是否是数字或字母字符,空字符串视为无效
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            digitsorletter: function (sValue, nElement) {
                return this.optional(nElement) || /^[A-Za-z0-9]+$/.test(sValue);
            },

            /**
             * 检查元素数据是否是数字字符,空字符串视为无效
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            digits: function (sValue, nElement) {
                return this.optional(nElement) || /^\d+$/.test(sValue);
            },

            /**
             * 检查元素数据的长度是否大于等于最小长度
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @param {int} iParam 验证参数(最小长度)
             * @return 是否有效
             */
            minlength: function (sValue, nElement, iParam) {
                return this.optional(nElement) || this.getLength($.trim(sValue), nElement) >= iParam;
            },

            /**
             * 检查元素数据的长度是否小于等于最大长度
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @param {int} iParam 验证参数(最大长度)
             * @return 是否有效
             */
            maxlength: function (sValue, nElement, iParam) {
                return this.optional(nElement) || this.getLength($.trim(sValue), nElement) <= iParam;
            },

            /**
             * 检查元素数据的长度是否指定的范围内
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @param {array} aiParam 验证参数(最小/最大长度)
             * @return 是否有效
             */
            rangelength: function (sValue, nElement, aiParam) {
                var iLength = this.getLength($.trim(sValue), nElement);
                return this.optional(nElement) || (iLength >= aiParam[0] && iLength <= aiParam[1]);
            },

            /**
             * 检查元素数据是否大于等于指定值
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @param {float} fParam 验证参数(最小值)
             * @return 是否有效
             */
            min: function (sValue, nElement, fParam) {
                return this.optional(nElement) || sValue >= fParam;
            },

            /**
             * 检查元素数据是否小于等于指定值
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @param {float} fParam 验证参数(最大值)
             * @return 是否有效
             */
            max: function (sValue, nElement, fParam) {
                return this.optional(nElement) || sValue <= fParam;
            },

            /**
             * 检查元素数据是否指定的范围内
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @param {afloat} afParam 验证参数(最大值)
             * @return 是否有效
             */
            range: function (sValue, nElement, afParam) {
                return this.optional(nElement) || (sValue >= afParam[0] && sValue <= afParam[1]);
            },

            /**
             * 检查元素数据是否是有效的Email地址
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            email: function (sValue, nElement) {
                return this.optional(nElement) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(sValue);
            },

            /**
             * 检查元素数据是否是有效的URL地址
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            url: function (sValue, nElement) {
                return this.optional(nElement) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(sValue);
            },

            /**
             * 检查元素数据是否是有效的电话号码
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            tel: function (sValue, nElement) {
                return this.optional(nElement) || /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(sValue);
            },

            /**
             * 检查元素数据是否是有效的手机号
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            mobile: function (sValue, nElement) {
                return this.optional(nElement) || /^(13|14|15|17|18)(\d{9})$/.test(sValue);
            },

            /**
             * 检查元素数据是否是有效的日期,格式:yyyy-mm-dd
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            date: function (sValue, nElement) {
                return this.optional(nElement) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(sValue);
            },

            /**
             * 检查元素数据是否是有效的日期,格式:yyyymmdd
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            dateint: function (sValue, nElement) {
                return this.optional(nElement) || /^\d{4}\d{1,2}\d{1,2}$/.test(sValue);
            },

            /**
             * 检查元素数据是否是有效的整型类型,允许+、-、,
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            integer: function (sValue, nElement) {
                return this.optional(nElement) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(sValue);
            },

            /**
             * 检查元素数据是否是有效的浮点数类型
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            number: function (sValue, nElement) {
                return this.optional(nElement) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(sValue);
            },

            /**
             * 检查元素数据是否是有效的邮政编码
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            postalcode: function (sValue, nElement) {
                return this.optional(nElement) || /^\d{6}$/.test(sValue);
            },

            /**
             * 检查元素数据是否是有效的身份证号
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @return 是否有效
             */
            idcard: function (sValue, nElement) {
                return this.optional(nElement) || /^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?$/.test(sValue);
            },
            /**
             * 检查元素数据是否与指定的元素值相匹配
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @param {string} sParam 匹配元素标识
             * @return 是否有效
             */
            equalto: function (sValue, nElement, sParam) {
                var oTarget = $(sParam).unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
                    $(nElement).valid();
                });
                return sValue == oTarget.val();
            },

            /**
             * 检查元素数据是否是有效的中文汉字
             * @param {string} sValue 待验证的元素值
             * @param {dom object} nElement DOM 元素
             * @returns false/ture
             */
            chinese: function (sValue, nElement) {
                var regex = /^[\u4E00-\u9FA5]*$/g;
                //修正火狐浏览器不兼容问题
                if ($.browser.mozilla) {
                    return sValue.match(regex) ? true : false;
                } else {
                    return regex.test(sValue) ? true : false;
                }
            }
        }
    });
})(jQuery);

/**
 * provides cross-browser focusin and focusout events
 * IE has native support, in other browsers, use event caputuring (neither bubbles)
 * provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
 * handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
 */
(function ($) {
    // only implement if not provided by jQuery core (since 1.4)
    // TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
    if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
        $.each({
            focus: 'focusin',
            blur: 'focusout'
        }, function (original, fix) {
            $.event.special[fix] = {
                setup: function () {
                    this.addEventListener(original, handler, true);
                },
                teardown: function () {
                    this.removeEventListener(original, handler, true);
                },
                handler: function (e) {
                    arguments[0] = $.event.fix(e);
                    arguments[0].type = fix;
                    return $.event.handle.apply(this, arguments);
                }
            };
            function handler(e) {
                e = $.event.fix(e);
                e.type = fix;
                return $.event.handle.call(this, e);
            }
        });
    }

    $.extend($.fn, {
        validateDelegate: function (delegate, type, handler) {
            return this.bind(type, function (event) {
                var target = $(event.target);
                if (target.is(delegate)) {
                    return handler.apply(target, arguments);
                }
            });
        }
    });
})(jQuery);

(function ($) {
    $.fn.autoMail = function (options) {
        if ($("#mailBox")) {
            $("#mailBox").remove();
        }
        var opts = $.extend({}, $.fn.autoMail.defaults, options);
        return this.each(function () {
            var $this = $(this);
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
            var $mailBox = $('<div id="mailBox" class="' + o.divClass + '"></div>');
            $('body').append($mailBox);
            var topCord = $this.offset().top + $this.height() + 6 + o.detaPostion;
            var left = $this.offset().left, width = $this.width();
            /*if(window.console){
             console.log("input top:" + $this.offset().top + " ,left:" + $this.offset().left);
             console.log("input height:" + $this.height() + "+6" + ",deta:" + o.detaPostion + ",ie6:+13");
             console.log("input offsetH:" + $this[0].offsetHeight + "+6" + ",deta:" + o.detaPostion + ",ie6:+13");
             console.log("mailb top:" + topCord + " ,left:" + left);
             }*/
            $mailBox.css({top: topCord + 'px', left: left + 'px', width: width + 'px'});
            $mailBox.bgiframe();
            //设置高亮li
            function setEmailLi(index) {
                $('#mailBox li').attr("class", o.emailClass).eq(index).attr("class", o.emailHoverClass);
            }

            //初始化邮箱列表
            var emails = o.emails;
            var init = function (input) {
                //取消浏览器自动提示
                input.attr('autocomplete', 'off');
                //添加提示邮箱列表
                var emailList = '<p class="' + o.titleClass + '">请选择邮箱类型</p>' +
                    '<ul class="' + o.emailListClass + '">';
                if (input.val() != "") {
                    var flag = false;
                    if ($this.val().indexOf('@') == -1 || $this.val().indexOf('@') == $this.val().length - 1) {
                        for (var i = 0; i < emails.length; i++) {
                            emailList += '<li class="' + o.emailClass + '">'
                                + input.val().replace("@", "") + '@' + emails[i] + '</li>';
                        }
                    } else {
                        var elementVal = $this.val();
                        var pos = elementVal.indexOf("@");
                        var suffix = elementVal.substr(pos + 1, elementVal.length - pos - 1); //获取用户输入@后面的字符
                        if (!suffix) return;
                        var aHightlight = [];
                        for (var i = 0; i < emails.length; i++) {
                            if (emails[i] == suffix) {
                                flag = true;
                                break;
                            }
                            var sBold = emails[i].indexOf(suffix);
                            if (sBold != -1) {//筛选后按接近程度排序
                                aHightlight.push({hightlightIndex: sBold, emailLiIndex: i});
                            }
                        }
                        if (aHightlight && aHightlight.length > 0) {
                            aHightlight.sort(function (a, b) {
                                return a.hightlightIndex - b.hightlightIndex;
                            });
                            var hightlightIndex, emailLiIndex;
                            for (var j = 0; j < aHightlight.length; j++) {
                                hightlightIndex = aHightlight[j].hightlightIndex;
                                emailLiIndex = aHightlight[j].emailLiIndex;
                                emailList +=
                                    '<li class="' + o.emailClass + '">'
                                        + input.val().substring(0, pos) + '@'
                                        + emails[emailLiIndex].substr(0, hightlightIndex)
                                        + '<b class="' + o.highlightClass + '">' + suffix + '</b>'
                                        + emails[emailLiIndex].substring(hightlightIndex + suffix.length, emails[emailLiIndex].length)
                                        + '</li>';
                            }
                        }
                    }
                    emailList += '</ul>';
                    if (emailList.indexOf('<li') != -1) {
                        $mailBox.html(emailList).show(0);
                    } else if (flag) {
                        $mailBox.hide(0);
                    } else {
                        $mailBox.html('');
                        $mailBox.hide(0);
                    }
                } else {
                    $mailBox.hide(0);
                }
                //添加鼠标事件
                $('#mailBox li').hover(function () {
                    $('#mailBox li').attr("class", o.emailClass);
                    $(this).attr("class", o.emailHoverClass);
                },function () {
                    $(this).attr("class", o.emailClass);
                }).click(function () {
                        var len = $("#mailBox li").length;
                        for (var i = 0; i < len; i++) {
                            if ($('#mailBox li').eq(i).attr('class') == o.emailHoverClass) {
                                eindex = i;
                                break;
                            }
                        }
                        input.val($(this).html().replace(/<[b|B][\s\S]*?>/, '').replace(/<\/[b|B]>/, ''));
                        $mailBox.hide(0);
                    });

                setEmailLi(0);
            };
            //当前高亮下标
            var eindex = 0;
            //监听事件
            $this.focus(function () {
                init($this);
            }).blur(function () {
                    setTimeout(function () {
                        var v = $this.val();
                        if (KGF.isEmpty(v) || KGF.isEmail(v)) {
                            $mailBox.hide(0);
                            return;
                        }
                        var len = $('#mailBox li').length;
                        for (var i = 0; i < len; i++) {
                            if ($('#mailBox li').eq(i).attr('class') == o.emailHoverClass) {
                                eindex = i;
                                break;
                            }
                        }
                        if (!KGF.isEmail(v) || len > 0) {
                            var ix = v.indexOf('@');
                            if (ix < 0 || ix == v.length - 1 || len > 0) {
                                if (ix == 0 || /^(?:[\w-]+\.?)*[\w-]+@/.test(v.substring(0, ix + 1)) === false) {
                                    if (ix == -1) {
                                        if ($('#mailBox li').eq(eindex).html() != null) {
                                            $this.val($('#mailBox li').eq(eindex).html().replace(/<[b|B][\s\S]*?>/, '').replace(/<\/[b|B]>/, ''));
                                        }
                                    }
                                    $mailBox.hide(0);
                                    return;
                                }
                                if ($('#mailBox li').eq(eindex).html() != null) {
                                    $this.val($('#mailBox li').eq(eindex).html().replace(/<[b|B][\s\S]*?>/, '').replace(/<\/[b|B]>/, ''));
                                }
                            }
                        }
                        $mailBox.hide(0);
                    }, 100);
                }).keyup(function (event) {
                    //上键
                    if (event.keyCode == 40) {
                        eindex++;
                        if (eindex >= $('#mailBox li').length) {
                            eindex = 0;
                        }
                        setEmailLi(eindex);
                        //下键
                    } else if (event.keyCode == 38) {
                        eindex--;
                        if (eindex < 0) {
                            eindex = $('#mailBox li').length - 1;
                        }
                        setEmailLi(eindex);
                        //回车键
                    } else if (event.keyCode == 13) {
                        if (eindex >= 0) {
                            if ($('#mailBox li').eq(eindex).html() != null) {
                                $this.val($('#mailBox li').eq(eindex).html().replace(/<[b|B][\s\S]*?>/, '').replace(/<\/[b|B]>/, ''));
                                $mailBox.hide(0);
                            }
                        }
                    } else {
                        eindex = 0;
                        init($this);
                    }
                    //如果在表单中，防止回车提交
                }).keydown(function (event) {
                    if (event.keyCode == 13) {
                        return false;
                    }
                });
        });
    }
    $.fn.autoMail.defaults = {
        emails: ['qq.com', '163.com', '126.com', 'sina.com', 'sohu.com', 'yahoo.cn', 'gmail.com', 'hotmail.com', 'live.cn'],
        divClass: "automail-div",
        titleClass: "automail-p",
        emailListClass: "automail-ul",
        emailClass: "automail-li",
        emailHoverClass: "automail-li-hover",
        highlightClass: "automail-highlight",
        detaPostion: 0
    }
})(jQuery);

/**
 * 为字符串对象添加format方法，该方法实现格式化字符串，有两种调用方式：<br/>
 * 1、String.format(object);
 *    将String中${属性名称}替换为object对象相应属性值；
 * 2、String.format([...]);
 *    将String中%s替换为数组入参相应索引位置的数组元素；
 * 3、String.format(param);
 *    将String中所有%s替换为param；
 * @param {object}|{array}|{其它类型} 对象、一维数组或其它类型
 * @returns 格式化后的字符串
 */
String.prototype.format = function () {
    if (arguments.length === 1) {
        var oArg = arguments[0];
        if (jQuery.isArray(oArg)) {
            var iArrayIndex = 0;
            var iArrayLength = oArg.length;
            return this.replace(/\%s/g, function (match, subMatch, index, source) {
                if (iArrayIndex < iArrayLength) {
                    return oArg[iArrayIndex++];
                } else {
                    return "";
                }
            });
        }
        if (typeof(oArg) === "string" || typeof(oArg) === "number" || typeof(oArg) === "boolean" ||
            oArg instanceof String || oArg instanceof Number || oArg instanceof Date || oArg instanceof Boolean) {
            return this.replace(/\%s/g, oArg);
        }
        if (typeof(oArg) === "object") {
            return this.replace(/\${(.*?)}/g, function (match, subMatch, index, source) {
                return oArg[subMatch] || "";
            });
        }
    }
    return this;
};

/**
 * 将jQuery.param()生成的序列化对象字符串，反序列化为对象
 * @param {string} sObject 序列化对象字符串
 * @returns Object
 */
jQuery.unparam = function (sObject) {
    var oParam = {};
    var aPairs = sObject.split("&");
    if (sObject.indexOf("=") < 0) {
        return sObject;
    }

    var aPair, aAccessors, sName;
    for (var i = 0; i < aPairs.length; i++) {
        aPair = aPairs[i].split('=');
        aAccessors = [];
        sName = decodeURIComponent(aPair[0]), value = decodeURIComponent(aPair[1]);

        sName = sName.replace(/\[([^\]]*)\]/g, function (k, acc) {
            aAccessors.push(acc);
            return "";
        });
        aAccessors.unshift(sName);
        var o = oParam;

        for (var j = 0; j < aAccessors.length - 1; j++) {
            var acc = aAccessors[j];
            var nextAcc = aAccessors[j + 1];
            if (!o[acc]) {
                if ((nextAcc == "") || (/^[0-9]+$/.test(nextAcc)))
                    o[acc] = [];
                else
                    o[acc] = {};
            }
            o = o[acc];
        }
        acc = aAccessors[aAccessors.length - 1];
        if (acc == "") {
            o.push(value);
        } else {
            o[acc] = value;
        }
    }
    return oParam;
};

/**
 * 从Cookie中读取数据，获取Cookies信息, 根据Cookies内容返回反序列化后的对象。不支持多层次嵌套的对象结构。
 * 如果浏览器禁用Cookie，当前页面的Cookie数据保存在内存中，当该页面关闭后，Cookie释放。
 * @example 获取主键为user的cookie：$.getCookie("user");（如果user含有子键，则返回对象）<br/>
 *          获取主键为user，子键为name的cookie： $.getCookie("user","name");
 * @param {string} sKey cookie主键
 * @param {string} sSubKey cookie子键，可省略
 * @returns cookie值，string或object类型
 */
jQuery.getCookie = function (sKey, sSubKey) {
    var sCookieValue = "";
    if (document.cookie && document.cookie != "") {
        var sValue;
        var aCookies = document.cookie.split(";");
        try {
            for (var i = 0; i < aCookies.length; i++) {
                sValue = jQuery.trim(aCookies[i]);
                if (sValue.substring(0, sKey.length + 1) == (sKey + "=")) {
                    //获取匹配主键名称的cookie字符串
                    sCookieValue = decodeURIComponent(sValue.substring(sKey.length + 1)); //获取Cookies主键值
                    sCookieValue = $.unparam(sCookieValue);

                    if (arguments.length > 1 && typeof(arguments[1]) === "string") {
                        //获取Cookies子键值
                        if (typeof(sSubKey) != "undefined" && sSubKey != null && sSubKey != "") {
                            sCookieValue = sCookieValue[sSubKey] || "";
                        }
                    }
                    break;
                }
            }
        } catch (e) {
        }
    }
    return sCookieValue;
};

/**
 * 设置Cookies信息。value不支持多层次嵌套的对象结构。如果浏览器禁用Cookie，
 * 当前页面的Cookie数据保存在内存中，当该页面关闭后，Cookie释放
 * @param {string} sKey cookie主键
 * @param {string} sValue cookie值，可以是对象。
 * @param {Object} oOptions 设置参数对象，包括以下属性：
 *         <ul>expires：过期时间，数字(秒)或Date对象</ul>
 *         <ul>path：路径，默认为根目录</ul>
 *         <ul>domain：作用域，string，默认为根域名</ul>
 *         <ul>secure：是否加密，传递任意值均表示加密</ul>
 *         <ul>rewrite：是否覆盖，如果value传递对象则默认会和cookie的值做合并, 将rewrite设置为true则可以清空cookie并写入新值</ul>
 */
jQuery.setCookie = function (sKey, sValue, oOptions) {
    oOptions = oOptions || {};
    if (sValue === null) {
        sValue = "";
        oOptions.expires = -1;
    }

    var expires = "";
    if (oOptions.expires && (typeof(oOptions.expires) == "number" || oOptions.expires.toUTCString)) {
        var date;
        if (typeof oOptions.expires == "number") {
            date = new Date();
            date.setTime(date.getTime() + (oOptions.expires * 24 * 60 * 60 * 1000));
        } else {
            date = oOptions.expires;
        }
        expires = "; expires=" + date.toUTCString();     // 使用 expires属性, max-age属性IE不支持
    }

    var path = oOptions.path ? "; path=" + (oOptions.path) : ";path=/";
    var domain = oOptions.domain ? "; domain=" + (oOptions.domain) : "";
    var secure = oOptions.secure ? "; secure" : "";

    if (typeof sValue == "object") {
        //rewrite为true表示重写此Cookie值，不做合并处理
        if (oOptions && !oOptions.rewrite) {
            // 当前Cookie中的值，对象形式
            var currentValueObj = $.getCookie(sKey, true);
            sValue = jQuery.extend(currentValueObj, sValue);
        }
        sValue = $.param(sValue);
    }

    document.cookie = [sKey, "=", sValue, expires, path, domain, secure].join("");
};

/**
 * <p>系统全局常量包装对象</p>
 * 存放系统全局常量，每个常量为KGC对象的一个属性，这些属性的值在运行期间不允许改变，新增常量属性时，
 * 按照【属性前缀_属性名: 属性值，  // 描述】的格式定义常量属性名称;所有常量属性值要左对齐，所有描述要左对象.
 */
var KGC = {
    // 登录密码类型
    PwdType_Query: "1", // 查询密码
    PwdType_Trade: "0", // 交易密码

    // 监护人信息启用标志
    Transactor_None: "0", // 不显示监护人
    Transactor_Used: "1", // 输入显示监护人
    Transactor_Must: "2", // 必须输入监护人

    //推荐信息启用标志
    Refer_None: "0", // 不显示推荐信息
    Refer_Used: "1", // 输入显示推荐信息
    Refer_Must: "2", // 必须输入推荐信息

    // 表格统计类型
    SumType_Sum: "S", // 求和
    SumType_Count: "C", // 计数
    SumType_Avg: "A", // 平均值
    SumType_Min: "N", // 最小值
    SumType_Max: "X", // 最大值
    SumType_Text: "T", // 文本

    // 基金类型
    FT_Normal: "0", // 股票型基金
    FT_ShortBond: "1", // 债券型基金
    FT_Currency: "2", // 货币市场基金
    FT_Bond: "3", // 混合型基金
    FT_Professional: "4", // 专户基金
    FT_Index: "5", // 指数型基金
    FT_QDII: "6", // QDII基金

    // 基金状态
    FS_OnTrade: "0", // 交易
    FS_OnIssue: "1", // 发行
    FS_IssueSucc: "2", // 发行成功
    FS_IssueFail: "3", // 发行失败
    FS_OffTrade: "4", // 基金停止交易
    FS_OffBid: "5", // 停止申购
    FS_OffRedeem: "6", // 停止赎回
    FS_OnSetBal: "7", // 权益登记
    FS_OnDivdent: "8", // 红利发放
    FS_CloseFund: "9", // 基金封闭
    FS_EndFund: "a", // 基金终止

    // 支付方式
    PW_BankCard: "1", // 银行卡支付
    PW_Remit: "2", // 汇款支付
    PW_MoneyFund: "3", // 货币基金支付

    // 业务代码
    BC_SubCode: "20", // 认购
    BC_BidCode: "22", // 申购
    BC_RedeemCode: "24", // 赎回
    BC_SavePlan: "39", // 定投

    // 收费类型
    ST_Before: "A", // 前收费
    ST_After: "B", // 后收费

    // 赎回时收费类型显示方式
    STDW_None: "0", // 是否显示收费类型
    STDW_Before: "1", // 收费类型按前收费显示
    STDW_After: "2", // 收费类型按后收费显示
    STDW_Support: "3", // 显示支持的收费类型

    // 格式化字符串
    FMT_Currency: "#,##0.00", // 金额格式化化字符串
    FMT_Float2: "#,##0.##", // 格式化浮点数:最多两位小数 + 千分位
    FMT_Float3: "#,##0.###", // 格式化浮点数:最多三位小数 + 千分位
    FMT_FixedFloat2: "#,##0.00", // 格式化浮点数:固定两位小数 + 千分位
    FMT_FixedFloat3: "#,##0.000", // 格式化浮点数:固定三位小数 + 千分位

    // 风险评测方式
    REW_Internal: "0", // 内部评测
    REW_External: "1", // 外部评测

    // 基金参考费率显示方式
    FDW_SingleRow: "0", // 根据金额和支付网点返回单一费率
    FDW_Table: "1", // 显示费率表

    // 其它常量
    GO_True: "Y", // true的字符标识
    GO_False: "N", // false的字符标识
    GO_MinorFlag: "1", // 未成年标志
    GO_IdCardFlag: "0", // 身份证标识
    GO_PayWay: "payway", // 支付方式单选按钮组名称
    GO_AmountFormat: "#,##0.00", // 系统默认金额格式化掩码

    //定投投资方式
    IM_ImVarVol: "1", // 按递增金额扣款
    IM_ImFixVal: "2", // 按后续投资金额不变

    //风险等级判定标致
    RL_Normal: "0", //用户风险状态正常
    RL_Small: "1", //风险等级过低
    RL_UnEvaluate: "2", //未评估
    RL_StaleDated: "3"                          //评估过期
};


/**
 * <p>系统公用函数封装对象</p>
 */
if (typeof KGF == "undefined")
    var KGF = {};
/**
 * 获得页面宽度和高度
 * @returns 页面宽高对象
 */
KGF.getPageSize = function () {
    var iWidth = 0;
    var iHeight = 0;
    if (window.innerWidth) {
        iWidth = window.innerWidth;
        iHeight = window.innerHeight;
    } else if (document.compatMode == 'CSS1Compat') {
        iWidth = document.documentElement.clientWidth;
        iHeight = document.documentElement.clientHeight;
    } else if (document.body) {
        iWidth = document.body.clientWidth;
        iHeight = document.body.clientHeight;
    }
    return {width: iWidth, height: iHeight};
};

// 判断变量是否为空:null、undefine、nan、空字符串
KGF.isEmpty = function (value) {
    if (value === null || value === undefined || value === "" || value === "undefined" || value === undefined|| value === " ") {
        return true;
    } else if ((value instanceof Number || typeof(value) === "number") && isNaN(value)) {
        return true;
    } else {
        return false;
    }
};
//校验邮件地址
KGF.isEmail = function (v) {
    if (KGF.isEmpty(v))
        return true;
    var reEmail = /^(?:[\w-]+\.?)*[\w-]+@(?:\w+-?\w+\.)+\w+$/;
    return reEmail.test(v);
};
//校验手机号码
KGF.isMobile = function (v) {
    if (KGF.isEmpty(v))
        return true;
    var reMobile = /^(13|14|15|17|18)(\d{9})$/;
    return reMobile.test(v);
};
// 检查s是否为由数字字符组成字符串
KGF.isNumberStr = function (s) {
    return /[^\d]/g.test(s);
};

// 检查s是否为数字、字母字符串
KGF.isLetterNumber = function (s) {
    return /[\W]/g.test(s);
};

// 检查s是否是中文字符串
KGF.isChinse = function (s) {
    var reg = /^[\u4E00-\u9FA5]*$/g;
    if (KGF.browser.isFirefox())
        return  s.match(reg);
    else
        return reg.test(s);
};

// 检查输入是否是无效密码字符
KGF.isValidPwd = function (s) {
    return /^[a-zA-Z0-9_@;:'"=+-`!#$%^&*(,<.>?)]/.test(s);
};

// 判断输入的年份是否是闰年
KGF.isLeapYear = function (iYear) {
    if (iYear <= 0)
        return false;
    return   (iYear % 4 == 0 && iYear % 100 != 0) || (iYear % 400 == 0);
};
//处理input输入框默认值
KGF.disposeInputDef = function () {
    $(function () {
        $("input[type='text']").each(function () {
            if (!KGF.isEmpty($(this).val())) {
                var defVlaue = $(this).val();
                $(this).bind({
                    focus: function () {
                        if (this.value != ""&&this.value==defVlaue) {
                            this.value = "";
                        }
                    },
                    blur: function () {
                        if (this.value == "") {
                            this.value = defVlaue;
                        }
                    }
                });
            };
        });
    })
}
/**
 * 简单检查输入的身份证号是否无效，有效返回false，无效返回true
 */
KGF.isValidIDCardNo = function (code) {
    var Errors = new Array("true",
        "身份证号码位数不对,必须是15位或者18位!",
        "身份证号码出生年月日格式不对!",
        "身份证号码校验位错误!",
        "身份证地区非法!",
        "15位身份证号码由数字组成!",
        "18位身份证号码前17位由数字组成,第18位可以是数字或者大写\"X\"!");
    if (code.length != 15 && code.length != 18) {// 身份证长度不正确
        return Errors[1];
    }
    var area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    }
    var Y, JYM;
    var S, M;
    var ereg;
    var idcard_array = new Array();
    idcard_array = code.split("");
    // 地区检验
    if (area[parseInt(code.substr(0, 2))] == null)
        return Errors[4];
    // 身份号码位数及格式检验
    switch (code.length) {
        case 15:
            if (!/^[0-9]{15}$/.test(code)) {
                return Errors[5];
            }
            var sBirthday = "19" + code.substr(6, 2) + "-"
                + Number(code.substr(8, 2)) + "-"
                + Number(code.substr(10, 2));
            var d = new Date(sBirthday.replace(/-/g, "/"));
            var flag = (sBirthday != (d.getFullYear() + "-"
                + (d.getMonth() + 1) + "-" + d.getDate()));
            if (!flag)
                return Errors[0];
            else
                return Errors[2];
            break;
        case 18:
            if (!/^[0-9]{17}([0-9X])$/.test(code)) {
                return Errors[6];
            }

            var sBirthday = code.substr(6, 4) + "-"
                + Number(code.substr(10, 2)) + "-"
                + Number(code.substr(12, 2));
            var d = new Date(sBirthday.replace(/-/g, "/"));
            var flag = (sBirthday != (d.getFullYear() + "-"
                + (d.getMonth() + 1) + "-" + d.getDate()));
            if (!flag) {// 测试出生日期的合法性
                // 计算校验位
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10]))
                    * 7
                    + (parseInt(idcard_array[1]) + parseInt(idcard_array[11]))
                    * 9
                    + (parseInt(idcard_array[2]) + parseInt(idcard_array[12]))
                    * 10
                    + (parseInt(idcard_array[3]) + parseInt(idcard_array[13]))
                    * 5
                    + (parseInt(idcard_array[4]) + parseInt(idcard_array[14]))
                    * 8
                    + (parseInt(idcard_array[5]) + parseInt(idcard_array[15]))
                    * 4
                    + (parseInt(idcard_array[6]) + parseInt(idcard_array[16]))
                    * 2 + parseInt(idcard_array[7]) * 1
                    + parseInt(idcard_array[8]) * 6
                    + parseInt(idcard_array[9]) * 3;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y, 1);
                // 判断校验位
                if (M == idcard_array[17])
                    return Errors[0];// 检测ID的校验位
                else
                    return Errors[3];
            } else
                return Errors[2];
            break;
        default:
            return Errors[1];
            break;
    }
};

/**
 * 从身份证号码中取出生日
 */
KGF.getBirthdayFormIdNo = function (sIdNo) {
    //15位号码
    if (sIdNo.length == 15)
        return "19" + sIdNo.substr(6, 6);
    //18位号码
    return sIdNo.substr(6, 8);
};

/**
 * 判断是否成年人
 */
KGF.isAdult = function (sBirthday, sServerDate) {
    var year = sServerDate.substr(0, 4);
    var month = sServerDate.substring(4, 2);
    var day = sServerDate.substring(6, 2);
    var birthyear = sBirthday.substr(0, 4);
    var birthmonth = sBirthday.substr(4, 2);
    var birthday = sBirthday.substr(6, 2);
    var flag = year - birthyear;

    return flag > 18 || ((flag == 18) && (birthday < month)) || ((flag == 18) && (birthday == month) && (birthday < day));
};

/**
 * 转换boolean类型为int
 */
KGF.boolToInt = function (bValue) {
    return bValue ? 1 : 0;
};

/**
 * 字符串转换为数值，如果sValue不是数值，则返回nDefault
 */
KGF.strToNumber = function (sValue, nDefault) {
    var fValue = Number(sValue);
    return isNaN(sValue) ? nDefault : fValue;
};

/**
 * 检查value1是否为null、undefined、NaN、Finite，如果是则转换为value2，否则返回原值
 */
KGF.checkEmpty = function (value1, value2) {
    return (value1 == null) ? value2 : value1;
};

/**
 * 跳转到指定URL
 */
KGF.gotoPage = function (url) {
    window.location.href = encodeURI(url);
};

KGF.gotoPageEx = function (sMenuId, url, bIsIG) {
    if (top != window) {
        if (top.oFrame)
            top.oFrame.loadPage(sMenuId, url);
    } else {
        if (bIsIG) {
            top.oFrame.loadPage(sMenuId, url);
        } else {
            KGF.gotoPage(url);
        }
    }
};
/**
 * 打开一个窗体,显示url
 * features: 一个可选的字符串，声明了新窗口要显示的标准浏览器的特征。
 */
KGF.openDlg = function (url, features) {
    window.open(url, "", features);
};
/**
 * 构建URL查询串
 * @param oData 数据源，可以是对象，ListMap
 * @param aParams 参数名数组
 * @return 返回构建的查询串，不带？
 */
KGF.buildUrlSearch = function (oData, aParams) {
    if (!(aParams instanceof Array) || aParams.length <= 0) return "";
    // 处理第一个
    var i, sSearch = aParams[0] + "=";
    if (oData instanceof ListMap) {
        sSearch += oData.get(aParams[0]);
        for (i = 1; i < aParams.length; i++) {
            sSearch += "&" + aParams[i] + "=" + oData.get(aParams[i]);
        }
    } else if (oData instanceof Object || typeof oData == "object") {
        sSearch += oData[aParams[0]];
        for (i = 1; i < aParams.length; i++) {
            sSearch += "&" + aParams[i] + "=" + oData[aParams[i]];
        }
    } else {
        sSearch = "";
        KDlg.info("无效的数据类型：oData");
    }
    return sSearch;
};

/**
 * 获取证书查询串
 * @returns {String}
 */
KGF.getSecurityUrlParam = function () {
    //TODO
};

/**
 * 获取对象属性值列表
 * @param {object} obj
 * @param {array|string} aPropertyNames 待获取属性值的属性名称数组,必须
 * @return {array} 属性值数组
 */
KGF.getObjectPropVal = function (obj, aPropertyNames) {
    var aValue = [];
    if (obj) {
        if ($.isArray(aPropertyNames)) {    // 数组，多个属性
            for (var i = 0; i < aPropertyNames.length; i++) {
                aValue.push(obj[aPropertyNames[i]]);
            }
        } else {    // 字符串，一个属性
            aValue.push(obj[aPropertyNames]);
        }
    }
    return aValue;
};

/**
 * 检查对象数组中是否存在指定的对象
 * @param aoData 一维数组对象
 * @param sKeyName 对象键值属性名称数组
 * @param sKeyValue 对象键值属性值数组
 * @returns true/false
 */
KGF.checkObjectExits = function (aoData, aKeyName, aKeyValue) {
    if (aoData instanceof Array && aKeyName.length == aKeyValue.length) {
        var i, j, bFlag;
        var iCount = aoData.length;
        for (i = 0; i < iCount; i++) {
            bFlag = true;
            for (j = 0; j < aKeyName.length; j++) {
                if (aoData[i][aKeyName[j]] != aKeyValue[j]) {
                    bFlag = false;
                    break;
                }
            }
            if (bFlag) return true;
        }
        return false;
    } else {
        return false;
    }
};

/**
 * 从数组中查找对象并返回
 * @param aoData 一维数组对象
 * @param sKeyName 对象键值属性名称数组
 * @param sKeyValue 对象键值属性值数组
 * @returns 返回对象
 */
KGF.getObjectFromArray = function (aoData, aKeyName, aKeyValue) {
    if (aoData instanceof Array && aKeyName.length == aKeyValue.length) {
        var i, j, bFlag;
        var iCount = aoData.length;
        for (i = 0; i < iCount; i++) {
            bFlag = true;
            for (j = 0; j < aKeyName.length; j++) {
                if (aoData[i][aKeyName[j]] != aKeyValue[j]) {
                    bFlag = false;
                    break;
                }
            }
            if (bFlag) return aoData[i];
        }
        return undefined;
    }
    return undefined;
};

/**
 * 用数据字典sDictName翻译数组中所有对象指定属性<srong>sPropertyName的值，
 * 并将翻译值作为对象新属性sNewPropertyName的属性值。
 * @param {array} aoData 对象数组
 * @param {ListMap} oDict 数据字典列表
 * @param {string} sPropertyName 翻译的属性名称
 * @param {string} sNewPropertyName 存储翻译值的属性名称
 */
KGF.transferObjectArrayProperty = function (aoData, oDict, sPropertyName, sNewPropertyName) {
    var i, o, v, iCount = aoData.length;
    for (i = 0, len = iCount; i < len; i++) {
        o = aoData[i];
        v = o[sPropertyName];
        o[sNewPropertyName] = oDict.get(v, v);
    }
};
/**
 * 将数字转换为大写份额
 * @param aMount
 * @param sSuffix
 */
KGF.capitalShare=function(aMount,sSuffix){

        //字符长度
    function LengthB(str) {
        var p1 = new RegExp('%u..', 'g');
        var p2 = new RegExp('%.', 'g');
        return escape(str).replace(p1, '').replace(p2, '').length;
    }

    var low;
    var i, k, j, l_xx1;
    var cap = "", xx1, unit;
    var a = ("" + aMount).replace(/(^0*)/g, "").split(".");

    var digits = "零壹贰叁肆伍陆柒捌玖";
    var units = "份 点拾佰仟万拾佰仟亿拾佰仟万拾佰仟";
    var digit;
    low = parseFloat(aMount);
    if (isNaN(low)) {
        return "";
    }

    xx1 = Math.round(low * 100.0) + "";
    l_xx1 = xx1.length;

    for (i = 0; i < l_xx1; i++) {
        j = l_xx1 - 1 - i;
        unit = units.substr(j, 1);
        // 生成大写单位，即'..份拾...'
        k = parseInt(xx1.substr(i, 1));
        digit = digits.substr(k, 1);
        // 生成大写数字, 即'零壹贰叁...'
        cap = cap + digit + unit;
    }

    cap = cap.replace(" ", "");
    cap = cap.replace(/零拾|零佰|零仟/g, "零");
    cap = cap.replace(/零+/g, "零");
    cap = cap.replace(/零亿/g, "亿");
    cap = cap.replace(/零万/g, "万");
    cap = cap.replace(/零点/g, "点");
    cap = cap.replace(/零份/g, "份");
    cap = cap.replace(/亿万/g, "亿");
    cap = cap.replace(/^壹拾/, "拾");
    cap = cap.replace(/点份$/, "份整");
    cap = cap.replace(/份整$/, "");
    cap = cap.replace(/零$/, "");
    cap = cap.replace(/份$/, "");
    if (a.length > 1 && LengthB(a[1]) > 2) {
        cap = '小数点位数不应超过2位';
        return cap;
    }
    if (a.length > 1 && LengthB(a[0]) == 0 && a[1].charAt(0) != '0') {
        cap = cap.replace("", "零点");
    }
    if (a.length > 1 && LengthB(a[0]) == 0 && a[1].charAt(0) == '0') {
        cap = cap.replace("", "零点零");
    }
    if (cap != "" || cap.length > 0) {
        cap = cap + sSuffix;
    }
    return cap;

}



/**
 * 将人民币金额转换为大写
 * @param fAmount
 * @returns {sring}
 */
KGF.capitalRMB = function (aMount, sSuffix) {




    //字符长度
    function LengthB(str) {
        var p1 = new RegExp('%u..', 'g');
        var p2 = new RegExp('%.', 'g');
        return escape(str).replace(p1, '').replace(p2, '').length;
    }

    function covert(aMount){
        if(isNaN(aMount)) {
            return "不是一个有效的数字，请重新输入！";
        }
        var money1 = new Number(aMount);
        if(money1> 1000000000000000000) {
            return"您输入的数字太大，重新输入！";

        }
        var a = ("" + aMount).replace(/(^0*)/g, "").split(".");
        if (a.length > 1 && LengthB(a[1]) > 2) {
            cap = '小数点位数不应超过2位';
            return cap;
        }
        var monee = Math.round(money1*100).toString(10)
        var i,j;
        j=0;
        var leng = monee.length;
        var monval="";
        for( i=0;i<leng;i++)
        {
            monval= monval+to_upper(monee.charAt(i))+to_mon(leng-i-1);
        }
        return repace_acc(monval);
    }
    function to_upper( a)
    {
        switch(a){
            case '0' : return '零'; break;
            case '1' : return '壹'; break;
            case '2' : return '贰'; break;
            case '3' : return '叁'; break;
            case '4' : return '肆'; break;
            case '5' : return '伍'; break;
            case '6' : return '陆'; break;
            case '7' : return '柒'; break;
            case '8' : return '捌'; break;
            case '9' : return '玖'; break;
            default: return '' ;
        }
    }
    function to_mon(a){
        if(a>10){ a=a - 8;
            return(to_mon(a));}
        switch(a){
            case 0 : return '分'; break;
            case 1 : return '角'; break;
            case 2 : return '圆'; break;
            case 3 : return '拾'; break;
            case 4 : return '佰'; break;
            case 5 : return '仟'; break;
            case 6 : return '万'; break;
            case 7 : return '拾'; break;
            case 8 : return '佰'; break;
            case 9 : return '仟'; break;
            case 10 : return '亿'; break;
        }
    }
    function repace_acc(Money){
        Money=Money.replace("零分","");
        Money=Money.replace("零角","零");
        var yy;
        var outmoney;
        outmoney=Money;
        yy=0;
        while(true){
            var lett= outmoney.length;
            outmoney= outmoney.replace("零圆","圆");
            outmoney= outmoney.replace("零万","万");
            outmoney= outmoney.replace("零亿","亿");
            outmoney= outmoney.replace("零仟","零");
            outmoney= outmoney.replace("零佰","零");
            outmoney= outmoney.replace("零零","零");
            outmoney= outmoney.replace("零拾","零");
            outmoney= outmoney.replace("亿万","亿零");
            outmoney= outmoney.replace("万仟","万零");
            outmoney= outmoney.replace("仟佰","仟零");
            yy= outmoney.length;
            if(yy==lett) break;
        }
        yy = outmoney.length;
        if ( outmoney.charAt(yy-1)=='零'){
            outmoney=outmoney.substring(0,yy-1);
        }
        yy = outmoney.length;
        if ( outmoney.charAt(yy-1)=='圆'){
            //outmoney=outmoney +'整';
	    outmoney=outmoney;
        }
        return outmoney;
    }
    return covert(aMount);
};

/**
 * 格式化数字
 * @param fData 待格式的数字
 * @param sFormat 格式化掩码，支持：#，0.等字符，可选，则默认KGC.GO_AmountFmt：
 *          ‘#’一位数字，如果是数字末尾且是0则不显示，‘，’分位标志，‘0’一位数字，‘.’小数点，例1234567.1204格式化如下：
 *          #,###（#,###.#0）     1,234,567      #,###.0#            1,234,567.12
 *          #,###.##            1,234,567.12   #,###.0##        1,234,567.12
 *          #,###.00            1,234,567.12
 */
KGF.fmtNumber = function (fData, sFormat) {
    var arrTemp;
    var sInt, sFloat, sFmt, sSign;
    var fmtInt = "", fmtFloat = "";
    sSign = fData >= 0 ? "" : "-";
    fData = Math.abs(fData);
    var sData = fData.toString();
    if (arguments.length == 1) {
        sFormat = KGC.GO_AmountFormat;
    }
    arrTemp = sFormat.match(/[\#\,0\.]+/);
    if (arrTemp != null) {
        sFmt = arrTemp[0];
    } else {
        sFmt = KGC.GO_AmountFormat;
    }
    var reDecimal = /\./;
    if (reDecimal.test(sFmt)) {
        arrTemp = sFmt.split(".");
        fmtInt = arrTemp[0];
        fmtFloat = arrTemp[1];
    } else {
        fmtInt = sFmt;
    }

    if (reDecimal.test(sData)) {
        if (fmtFloat != "") {
            arrTemp = sData.split(".");
            var iPow10 = Math.pow(10, fmtFloat.length);  //10的fmtFloat.length次方
            var fTemp = Math.round(parseFloat("0." + arrTemp[1]) * iPow10) / iPow10;
            sInt = (Math.floor(fData) + Math.floor(fTemp)).toString();
            if (fTemp == 1) {
                fTemp = "1.0";
            }
            if (fTemp == 0||fTemp == 1)
                sFloat = "0";
            else
                sFloat = fTemp.toString().split(".")[1];
        } else {
            sInt = Math.round(fData).toString();
            sFloat = "";
        }
    } else {
        sInt = sData;
        sFloat = "";
    }

    if (fmtInt != "") {
        var iCommaLen = null;
        var iZeroCount = fmtInt.match(/0*$/)[0].length;
        if (/,/g.test(fmtInt)) {
            iCommaLen = fmtInt.match(/,[^,]*/)[0].length - 1;
        }
        var reg = new RegExp("(\\d{" + iCommaLen + "})", "g");
        if (sInt.length < iZeroCount) {
            sInt = new Array(iZeroCount + 1).join("0") + sInt;
            sInt = sInt.substr(sInt.length - iZeroCount, iZeroCount);
        }
        if (iCommaLen > 0) {
            var idx = sInt.length % iCommaLen;
            sInt = sInt.substr(0, idx) + sInt.substring(idx).replace(reg, ",$1");
        }
        sInt = sInt.replace(/^,/, "");
    }

    if (fmtFloat != "") {
        var iZeroCount = fmtFloat.match(/^0*/)[0].length;
        if (sFloat.length < iZeroCount) {
            sFloat = sFloat + new Array(iZeroCount + 1).join("0");
            if (fmtFloat.length > iZeroCount) {
                var sTemp1 = sFloat.substring(0, iZeroCount);
                var sTemp2 = sFloat.substring(iZeroCount, fmtFloat.length);
                sFloat = sTemp1 + sTemp2.replace(/0*$/, "");
            } else {
                sFloat = sFloat.substring(0, iZeroCount);
            }
        } else {
            sFloat = sFloat.substring(0, fmtFloat.length);
        }
    } else {
        sFloat = "";
    }

    if (sFloat == "") {
        sData = sInt;
    } else {
        sData = sInt + "." + sFloat;
    }
    if (sFormat != sFmt) {
        sData = sFormat.replace(sFmt, sData);
    }
    return sSign + sData;
};

/**
 * 格式化整型日期,仅检查位数和字符有效性，如果无效返回
 * @param date 可以是Date、int、string类型
 * @param sSplit 分隔符,默认'-','CN'表示用年月日分隔
 * @returns string
 */
KGF.fmtDate = function (date, sSplit) {
    var sDate, sY, sM, sD;
    if (jQuery.type(date) === "date") {
        sY = date.getFullYear();
        sM = date.getMonth() + 1 + "";
        if (sM.length === 1) {
            sM = "0" + sM;
        }

        sD = date.getDate() + "";
        if (sD.length === 1)
            sD = "0" + sD;
    } else {
        sDate = date.toString();
        if (/^\d{8}$/.test(sDate)) {
            sY = sDate.substring(0, 4);
            sM = sDate.substring(4, 6);
            sD = sDate.substring(6, 8);
        } else
            return "-";
    }

    if (sSplit === "CN") {
        sDate = sY + "年" + sM + "月" + sD + "日";
    } else if(sSplit === "MD"){//只显示月日
        sDate =  sM + "月" + sD + "日";
    }else {
        if (sSplit === "" || sSplit == null) {
            sSplit = "-";
        }
        sDate = sY + sSplit + sM + sSplit + sD;
    }
    return sDate;
};
/*把年份变成字符串形式  Add  By Congsd 2014-12-09*/
KGF.fmtDateNoSplit = function (date) {
    var sDate, sY, sM, sD;
    if (jQuery.type(date) === "date") {
        sY = date.getFullYear();
        sM = date.getMonth() + 1 + "";
        if (sM.length === 1) {
            sM = "0" + sM;
        }

        sD = date.getDate() + "";
        if (sD.length === 1)
            sD = "0" + sD;
    }
    sDate = sY + sM + sD;
    return sDate;
};


/**
 * 格式化整型时间,仅检查位数有效性
 * @param time 可以是Date、int、string类型
 * @param sSplit 分隔符,默认':','CN'表示用时分秒分隔
 * @returns string
 */
KGF.fmtTime = function (time, sSplit) {
    var sTime, sH, sM, sS;
    if (jQuery.type(time) === "date") {
        sH = time.getHours();
        if (sH.length === 1) {
            sH = "0" + sH;
        }
        sM = time.getMinutes();
        if (sM.length === 1) {
            sM = "0" + sM;
        }
        sS = time.getSeconds();
        if (sS.length === 1) {
            sS = "0" + sS;
        }
    } else {
        sTime = time.toString();
        if (sTime.length === 5) {
            sTime = "0" + sTime;
        }
        if (/^\d{6}$/.test(sTime)) {
            sH = sTime.substring(0, 2);
            sM = sTime.substring(2, 4);
            sS = sTime.substring(4, 6);
        } else if (/^\d{2}:\d{2}:\d{2}$/.test(sTime)) {
            sH = sTime.substring(0, 2);
            sM = sTime.substring(3, 5);
            sS = sTime.substring(6, 8);
        }
        else {
            return "-";
        }
    }

    if (sSplit == "CN") {
        sTime = sH + "时" + sM + "分" + sS + "秒";
    } else {
        if (sSplit == "" || sSplit == null) {
            sSplit = ":";
        }
        sTime = sH + sSplit + sM + sSplit + sS;
    }
    return sTime;
};

/**
 * 获取项目根路径
 * @returns webpath
 */

KGF.getRootPathEx = function () {
    return KGP.WEBPATH;
};

KGF.getRootPath = function () {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    return window.location.protocol + '//' + window.location.host + '/' + webName;
     //return window.location.protocol + '//' + window.location.host; //用域名访问，没有根目录时用这个
};

/**
 * <p>可扩展数据项列表类（ListMap）</p>
 * 该类用于存放数据项列表，每个数据项是一个对象，所有数据项对象为同一类型对象，有相同的属性，
 * 在这些属性中有一个索引属性（默认为key）和默认值属性（默认为value），通过索引属性可查找定
 * 位该数据项对象，索引属性和默认值属性可以重新指定。
 *
 * 该类构造器支持3种参数类型调用，其区别在于列表中数据对象的属性名称不同：
 * 1、new ListMap()
 * 列表中的数据对象仅包含属性：key、value，索引属性为key，默认值属性为value
 * 2、new ListMap(sKeyName)
 * 列表中的数据对象包含属性：sKeyName、value，索引属性为sKeyName，默认值属性为value
 * 3、new ListMap(oParent1, ...)
 * 列表中的数据对象包含属性：key、value、并且包含oParent1, ...等对象中的属性，索引属性为key，
 * 默认值属性为value
 * 4、new ListMap(sKeyName, sValueName, oParent1,...)
 * 列表中的数据对象包含属性：sKeyName、sValueName以及oParent1，...等对象中的属性， 索引属性
 * 为sKeyName，默认值属性为sValueName
 */
function ListMap() {
    var sKeyName = "key";        // 索引属性名称
    var sValueName = "value";    // 默认值属性名称
    var oParent = {};            // 数据项MapItem.prototype的值（数据项对象的父类）
    var aoMap = [];              // 存放数据项对象的数组

    // 根据入参构建数据项对象的父类（合并所有数据对象的属性到父类中）
    var iBegin = null;
    var iArgLen = arguments.length;
    if (jQuery.type(arguments[0]) == "string") {
        sKeyName = arguments[0];
        if (jQuery.type(arguments[1]) == "string") {
            if (iArgLen > 0) {
                sValueName = arguments[1];
                iBegin = 2;
            } else
                iBegin = 1;
        }
        for (var i = iBegin; i < iArgLen; i++) {
            if (jQuery.type(arguments[i]) == "object")
                jQuery.extend(oParent, arguments[i]);
        }
    }
    var o = null;
    eval("o={'" + sKeyName + "':'','" + sValueName + "':''}");
    o.getKey = function () {
        return this[sKeyName];
    };
    o.getValue = function () {
        return this[sValueName];
    };
    jQuery.extend(oParent, o);

    /**
     * 内部数据项类，该类继承于oParent
     */
    function MapItem() {
    }

    MapItem.prototype = oParent;

    /**
     * 根据索引属性的属性值查找数据项
     * @param vKey 数据项索引属性值
     * @returns 返回其索引位置，未找到返回-1
     */
    this.find = function (vKey) {
        for (var i = 0; i < aoMap.length; i++) {
            if (aoMap[i][sKeyName] == vKey)
                return i;
        }
        return -1;
    };

    /**
     * 通过数据项在数组中的索引获取映射项，如果索引越界，返回undefined
     * @param {number} iIndex 数据项索引
     * @returns {object} 数据项对象
     */
    this.items = function (iIndex) {
        if (KGF.isEmpty(iIndex)) return undefined;
        if (iIndex < aoMap.length && iIndex >= 0)
            return aoMap[iIndex];
        return undefined;
    };

    /**
     * 通过索引属性值获取该数据项的默认属性值，未找到返回undefined或defaultValue
     * @param vKey 数据项索引属性值
     * @param vDefaultValue 未找到默认返回值
     * @returns 默认属性值
     */
    this.get = function (vKey, vDefaultValue) {
        if ((!vKey) && (vKey != "")) return vDefaultValue;

        var i = this.find(vKey);
        return i >= 0 ? aoMap[i][sValueName] : vDefaultValue;
    };

    /**
     * 通过索引属性值获取该数据项的指定属性的属性，未找到返回undefined或defaultValue
     * @param vKey 数据项索引属性值
     * @param {string} sPropName 返回数据项该属性的属性值
     * @param vDefaultValue 未找到默认返回值
     * @returns 指定属性值
     */
    this.getValue = function (vKey, sPropName, vDefaultValue) {
        if ((!vKey) && (vKey != "")) return vDefaultValue;

        var i = this.find(vKey);
        if (i >= 0) {
            var item = aoMap[i];
            return item.hasOwnProperty(sPropName) ? item[sPropName] : vDefaultValue;
        } else
            return vDefaultValue;
    };

    /**
     * 通过索引属性值获取该数据项并返回，未找到返回undefined或defaultValue
     * @param vKey 数据项索引属性的属性值
     * @param vDefaultValue 未找到默认返回值
     * @returns 数据项对象
     */
    this.getItem = function (vKey, vDefaultValue) {
        if ((!vKey) && (vKey != "")) return vDefaultValue;

        var i = this.find(vKey);
        return i >= 0 ? aoMap[i] : vDefaultValue;
    };

    /**
     * 设置指定数据项默认属性的属性值，如果该数据项不存在则添加
     * @param vKey 数据项索引属性值
     * @param value 默认属性的属性值
     */
    this.set = function (vKey, value) {
        if ((!vKey) && (vKey != "")) return;

        var i = this.find(vKey);
        if (i >= 0)
            aoMap[i][sValueName] = value;
        else {
            var item = new MapItem();
            item[sKeyName] = vKey;
            item[sValueName] = value;
            aoMap.push(item);
        }
    };

    /**
     * 返回指定索引位置的数据项的索引属性值，如果索引越界，返回vDefaultValue
     * @param {number} iIndex 数据对象索引
     * @param vDefaultValue 未找到默认返回值
     * @returns 索引属性值
     */
    this.getKey = function (iIndex, vDefaultValue) {
        var o = this.items(iIndex);
        if (o) {
            return o[sKeyName];
        } else
            return vDefaultValue;
    };

    /**
     * 设置指定数据项指定属性的属性值，如果该数据项不存在则添加
     * @param vKey 数据项索引属性值
     * @param {string} sPropName 返回数据项该属性的属性值
     * @param value 属性值
     */
    this.setValue = function (vKey, sPropName, value) {
        if ((!vKey) && (vKey != "")) return;

        var i = this.find(vKey);
        if (i >= 0)
            aoMap[i][sPropName] = value;
        else {
            var item = new MapItem();
            item[sKeyName] = vKey;
            //if (oParent.hasOwnProperty(sPropName))
            item[sPropName] = value;
            aoMap.push(item);
        }
    };

    /**
     * 设置更新数据项，不存在则添加
     * @param {MapItem} o 数据项对象
     */
    this.setItem = function (o) {
        if (KGF.isEmpty(o)) return;

        // 检查该对象是否包含索引属性名称，不存在则退出
        var vKey = undefined;
        if (o.hasOwnProperty(sKeyName))
            vKey = o[sKeyName];
        if ((!vKey) && (vKey != "")) return;

        var item;
        var i = this.find(vKey);
        if (i >= 0) {
            item = aoMap[i];
        } else {
            item = new MapItem();
            aoMap.push(item);
        }
        // 赋值
        var prop = null;
        for (prop in o) {
            if (oParent.hasOwnProperty(prop)) {
                item[prop] = o[prop];
            }
        }
    };

    /**
     * 移除指定的数据项
     * @param vKey 数据项索引属性值
     */
    this.del = function (vKey) {
        if ((!vKey) && (vKey != "")) return;
        var i = this.find(vKey);
        if (i >= 0)
            aoMap.splice(i, 1);
    };

    /**
     * 返回列表中数据项的数目
     */
    this.count = function () {
        return aoMap.length;
    };

    /**
     * 将oList中的数据项添加到当前列表中，oData为ListMap类型或对象类型
     * @param {ListMap|object} oData 数据项列表
     */
    this.assigned = function (oData) {
        if (oData instanceof ListMap) {
            var iCount = oData.count();
            for (var i = 0; i < iCount; i++) {
                this.setItem(oData.items(i));
            }
        } else if (typeof(oData) === "object") {
            for (var sProp in oData) {
                this.set(sProp, oData[sProp]);
            }
        } else
            throw new Error("oData type error.");
    };

    /**
     * 解析字符串，插入到列表中，字符串格式：key1|value1;key2|value2;...
     * @param {string} sValue
     * @param {string} sSplitChar 每对key/valu之间的分隔符，可选，默认为分号(;)
     */
    this.parse = function (sValue, sSplitChar) {
        if (arguments.length == 1) {
            sSplitChar = ";";
        }
        var aItem;
        var aValue = sValue.split(sSplitChar);
        for (var i = 0; i < aValue.length; i++) {
            aItem = aValue[i].split("|");
            this.set(aItem[0], aItem[1]);
        }
    };

    /**
     * 检查数据项列表是否为空
     * @returns {boolean} false-非空，true-空
     */
    this.isEmpty = function () {
        return aoMap.length <= 0;
    };

    /**
     * 清除映射列表
     */
    this.clear = function () {
        aoMap.length = 0;
    };

    /**
     * 将列表项中的数据转换为JSON对象，转换原则：
     * 以索引属性的属性值为对象属性名，默认属性的属性值为对象属性值，
     * 将列表中的数据项对象的索引属性和默认属性转换为JSON对象
     */
    this.toJSON = function () {
        var oItem;
        var oJSON = {};
        for (var i = 0; i < this.count(); i++) {
            oItem = this.items(i);
            oJSON[oItem[sKeyName]] = oItem[sValueName];
        }
        return oJSON;
    };

    /**
     * 将列表项中的数据转换为JSON对象
     * Key加上"param."前缀
     */
    this.toParamJSON = function () {
        var oItem;
        var oJSON = {};
        for (var i = 0; i < this.count(); i++) {
            oItem = this.items(i);
            oJSON["param." + oItem[sKeyName]] = oItem[sValueName];
        }
        return oJSON;
    };

    /**
     * 以索引属性的属性值为参数名，默认属性的属性值为参数值，将列表中的数据项对象转换为URL查询字符串，
     * 返回查询串中首尾不带？和&；如果列表为空则返回空字符串""
     * @returns {string} URL查询串
     */
    this.toUrlParamStr = function () {
        var oItem;
        var sParams = "";
        var iCount = this.count();
        var sKeyName = this.getKeyName();
        var sValueName = this.getValueName();
        // 取第一个参数
        if (iCount > 0) {
            oItem = this.items(0);
            sParams = oItem[sKeyName] + "=" + oItem[sValueName];
        } else {
            return "".toString();
        }
        // 取剩余参数
        for (var i = 1; i < iCount; i++) {
            oItem = this.items(i);
            sParams += "&" + oItem[sKeyName] + "=" + oItem[sValueName];
        }
        return sParams.toString();
    };

    /**
     * 检查ListMap中的数据项对象是否有指定的属性名称
     * @param {string} sPropertyName 属性名称
     * @returns {boolean} false-不包含，true-包含
     */
    this.itemHasProperty = function (sPropertyName) {
        return (oParent.hasOwnProperty(sPropertyName));
    };

    /**
     * 返回数据项的索引属性名称
     * @returns 属性名称
     */
    this.getKeyName = function () {
        return sKeyName;
    };

    /**
     * 返回数据项的默认值的属性名称
     * @returns 属性名称
     */
    this.getValueName = function () {
        return sValueName;
    };
}


/**
 * <p>Ajax调用返回结果类</p>
 * 封装Ajax调用返回结果，包括成功失败信息及数据。
 */
function AjaxResult() {
    // 返回代码，0-成功，其它失败
    this.code = -1;
    // 返回信息
    this.message = null;
    // 返回数据，可以是JSON对象、XML、TEXT、HTML、JAVASCRIPT
    this.datas = null;
    // 返回地址
    this.url = null;
    // 附带数据
    this.tag = null;

    /**
     * 检查结果是否调用成功
     */
    this.isSuccess = function () {
        return (this.code == "0" || this.code == 0);
    };

    /**
     * 返回对象信息
     */
    this.toString = function () {
        return ("[" + this.code + "]" + this.message);
    };

    /**
     * 如果是Ajax查询数据集调用，返回结构集个数
     */
    this.count = function () {
        return this.isSuccess() ? (this.datas ? this.datas.length : 0) : 0;
    };

    /**
     * 如果是Ajax查询数据集调用，获取记录集，如果未找到返回null
     * @param {number} iIndex 记录集索引号
     */
    this.getDataset = function (iIndex) {
        if (this.isSuccess()) {
            if (iIndex === undefined || iIndex === null) {
                return this.datas ? this.datas[0] : null;
            } else if (iIndex >= 0 && iIndex < this.count()) {
                return this.datas ? this.datas[iIndex] : null;
            } else {
                return null;
            }
        } else {
            throw new Error(this.toString());
        }
    };

    /**
     * 从Ajax调用返回的数据中，获取第iIndex个记录集中的第row行的数据，如果未找到返回null
     * 该函数不在检查入参类型的有效性
     * @param {number} iIndex 记录集索引号
     * @param {number} iRow 记录集索引号
     */
    this.getData = function (iIndex, iRow) {
        if (this.isSuccess()) {
            var oData = null;
            if (arguments.length === 0) {
                iIndex = 0;
                iRow = 0;
            } else if (arguments.length === 1) {
                iRow = iIndex;
                iIndex = 0;
            } else {
                oData = this.getDataset(iIndex);
            }

            // 确定行数返回数据
            if (oData === null) {
                return null;
            } else {
                if (iRow >= 0 && iRow < oData.length) {
                    return oData[iRow];
                } else if (iRow == undefined || iRow == null) {
                    return oData[0];
                } else {
                    return null;
                }
            }
        } else {
            throw new Error(this.toString());
        }
    };
}

/**
 * <p>Ajax调用封装对象</p>
 */
var Ajax = {
    // 服务器返回数据类型定义
    DT_TEXT: "text", // 普通文本格式
    DT_XML: "xml", // XML格式
    DT_HTML: "html", // Html格式
    DT_JSON: "json", // Json格式
    DT_SCRIPT: "script", // Javascript脚本

    // 服务器返回的数据集的数据组织格式
    RDF_JSON: 0, // JSON数组格式
    RDF_ARRAY: 1, // 二维数组格式
    RDF_XML: 2, // XML数据格式

    /**
     * Ajax请求调用（使用jQuery）
     * @param sUrl 请求的URL地址
     * @param oParam 请求入参
     * @param fnCallBack 调用后回调函数
     * @param bAsync 是否异步请求，默认true
     * @param sReturnDataType 服务器返回数据类型：text、xml、html、json、script，如果不指定则默认为json
     * @param bProcess 是否显示进度提示，默认显示
     * @returns {object} 如果是同步执行返回执行结果
     */
    request: function (sUrl, oParam, fnCallBack, bAsync, sReturnDataType, bProcess) {
        if (oParam == undefined)oParam = {};
        if (KUC && KUC.getCacheData("menuid") != null) {
            oParam.pagetype = KUC.getCacheData("menuid");
        } else {
            oParam.pagetype = $.getCookie("menuid");
        }

        // 调用返回结果
        var ajaxResult = new AjaxResult();

        // 返回数据类型
        if (arguments.length < 5 || !sReturnDataType) {
            sReturnDataType = Ajax.DT_JSON;
        }

        // 异步入参
        if (arguments.length < 4 || KGF.isEmpty(bAsync)) {
            bAsync = true;
        }
        if (bProcess != false) {
            bProcess = true;
        }
        // 调用参数
        var sRequestType = "POST";

        /*
         * 调用失败处理事件，
         * @param xhr XMLHttpRequest 对象
         * @param textStatus 错误信息
         * @param error 捕获的异常对象(可选)
         */
        var ajaxErrorEvent = function (xhr, textStatus, error) {
            ajaxResult.code = -1;
            if (xhr && xhr.readyState == 0) {
                return;
            }
            if (typeof(error) === "string") {
                ajaxResult.message = "[" + xhr.status + "]" + textStatus + " " + error;
            } else {
                ajaxResult.message = "[" + xhr.status + "]" + error.message;
            }
            ajaxResult.datas = null;
            ajaxResult.url = null;
            ajaxResult.tag = null;

            KDlg.waiting(false, false);
            KGF.gotoPage(KGF.getRootPath() + "/page/common/AjaxError.jsp");
            // 调用回调函数
            //if (jQuery.isFunction(fnCallBack)) {
            //fnCallBack(ajaxResult);
            //}
        };

        /*
         * 调用成功后的处理事件
         * @param data 由服务器返回，并根据dataType参数进行处理后的数据
         * @param textStatus 描述状态的字符串，如：success
         * @param xhr XMLHttpRequest 对象
         */
        var ajaxSuccessEvent = function (data, textStatus, xhr) {
            if (bProcess)
                KDlg.waiting(false, false);
            var flag = true;
            if (sReturnDataType === Ajax.DT_JSON) {
                try {
                    var errMsg = "";
                    if (data.fieldErrors) {
                        $.each(data.fieldErrors, function (key, value) {
                            errMsg += value.toString() + ";";
                        });
                        ajaxResult.code = -1;
                        ajaxResult.message = errMsg;
                        ajaxResult.datas = null;
                        ajaxResult.url = null;
                        ajaxResult.tag = null;
                    } else {
                        ajaxResult.code = data.bizResult.errorCode;
                        ajaxResult.message = data.bizResult.errorMessage;
                        ajaxResult.datas = data.bizResult.datasets;
                        ajaxResult.url = data.url;
                        ajaxResult.tag = data.tag;
                        ajaxResult.sessionId = data.sessionId;
                    }
                } catch (e) {
                    flag = false;
                    ajaxResult.code = -1;
                    //ajaxResult.message = "Parse json data failed: " + e.message;
                    ajaxResult.message = "syserror";
                    ajaxResult.datas = data;
                }
            } else if (sReturnDataType === Ajax.DT_XML) {
                ajaxResult.code = 0;
                ajaxResult.message = textStatus;
                ajaxResult.datas = jQuery.parseXML(data);
            } else {
                ajaxResult.code = 0;
                ajaxResult.message = textStatus;
                ajaxResult.datas = data;
            }
            if (!ajaxResult.isSuccess()) {
                if (ajaxResult.message == "syserror") {
                    flag = false;
                    KGF.gotoPage(KGF.getRootPath() + "/page/common/AjaxError.jsp");
                } else if (ajaxResult.message == "timeout" || ajaxResult.tag == "timeout") {
                    flag = false;
                    KGF.gotoPage(KGF.getRootPath() + "/page/common/TimeOut.jsp");
                } else if (ajaxResult.message == "login") {
                    flag = false;
                    KGF.gotoPage(KGF.getRootPath() + "/page/frame/Login.jsp");
                }
            }
            if (KUC.getCacheData("sessionId", ajaxResult.sessionId) != ajaxResult.sessionId) {
                flag = false;
                KUC.setCacheData("sessionId", ajaxResult.sessionId);
                KGF.gotoPage(KGF.getRootPath() + "/page/common/TimeOut.jsp");
            }

            // 调用回调函数
            if (flag && jQuery.isFunction(fnCallBack)) {
                fnCallBack(ajaxResult);
            }
        };

        /*
         * 请求完成后回调函数 (请求成功或失败之后均调用)。
         * @param xhr XMLHttpRequest对象
         */
        var ajaxCompleteEvent = function (xhr, textStatus) {
        };

        /*
         * 发送请求前处理事件，可修改 XMLHttpRequest 对象的函数，
         * 如添加自定义 HTTP 头。XMLHttpRequest 对象是唯一的参数。
         * 如果返回false可以取消本次ajax请求
         * @param xhr XMLHttpRequest对象
         */
        var ajaxBeforeSendEvent = function (xhr) {
            if (bProcess != false)
                KDlg.waiting(true, true);
            return true;
        };

        //调用jQuery的ajax
        jQuery.ajax({
            type: sRequestType,
            cache: false, // 不缓存数据
            url: sUrl,
            data: oParam,
            dataType: sReturnDataType,
            error: ajaxErrorEvent,
            success: ajaxSuccessEvent,
            beforeSend: ajaxBeforeSendEvent,
            complete: ajaxCompleteEvent,
            async: bAsync
        });
        return ajaxResult;
    }    //-- function request() end
};

/**
 * <p>URL对象类</p>
 * 该类用于解析当前页面的URL或指定的URL，并将URL中查询字符串解析到ListMap中
 * @param {string} sUrlHref 待解析的URL，如果不指定则解析当前页面的URL
 */
function URL(sUrlHref) {
    /**
     * URL属性定义
     */
    this.clear = function () {
        this.protocol = "";        // 协议
        this.host = "";            // 主机
        this.port = 80;            // 端口
        this.path = "";            // 路径
        this.page = "";            // 页面
        if (!this.params)          // 请求参数
            this.params = new ListMap();
    };

    /**
     * 解析RUL
     */
    this.parseUrl = function () {
        var iX, iY, iZ, sHost;
        var sUrl = sUrlHref;
        var sParams = null;

        this.clear();

        // 解码
        if (!sUrl) sUrl = location.href;
        sUrl = decodeURI(sUrl);

        iX = sUrl.indexOf("?");
        if (iX > -1) {
            sParams = sUrl.substring(iX + 1, sUrl.length);
            sUrl = sUrl.substring(0, iX);
        }
        // 解析协议
        iX = sUrl.indexOf("://");
        if (iX > -1) {
            this.protocol = sUrl.substring(0, iX);
            iX += 3;
        } else {
            iX = 0;
        }
        // 解析主机、端口
        iY = sUrl.indexOf(":", iX);
        iZ = sUrl.indexOf("/", iX);
        if (iZ > iY && iY > iX) {
            this.host = sUrl.substring(iX, iY);
            this.port = parseInt(sUrl.substring(iY + 1, iZ));
            iX = iZ;
        } else if (iZ > iX) {
            sHost = sUrl.substring(iX, iZ);
            if (sHost.indexOf(".") > 0 && sHost != ".." && sHost != ".") {
                this.host = sHost;
                iX = iZ;
            }
        }
        // 解析路径(包括'/')
        iY = sUrl.lastIndexOf("/");
        if (iY > -1) {
            this.page = sUrl.substring(iY + 1, sUrl.length);
            if (iY >= iX) {
                this.path = sUrl.substring(iX, iY + 1);
            }
        } else {
            this.page = sUrl;
        }

        var oKucItem = KUC.getURLParam();
        for (var aKey in oKucItem) {
            this.params.set(aKey, oKucItem[aKey]);
        }
        if (sParams == null) {
            return;
        }

        // 解析请求参数
        var sItem;
        var aParam = sParams.split("&");
        for (var i = 0; i < aParam.length; i++) {
            sItem = aParam[i];
            iX = sItem.indexOf("=");
            if (iX > -1) {
                this.params.set(sItem.substring(0, iX),
                    sItem.substring(iX + 1, sItem.length));
            }
        }
        ;
    };

    // 解析
    this.parseUrl();
}

/**
 * <p>系统对话框对象</p>
 * 支持不同对话框，
 */
var KDlg = {
    // 对话框显示类型定义
    DLG_INFO: 0, // 提示信息框
    DLG_WARNING: 1, // 警告信息框
    DLG_ERROR: 2, // 错误/失败信息框
    DLG_SUCCESS: 3, // 成功信息框
    DLG_CONFIRM: 4, // 确认信息框
    // 对话框标题
    DLG_Titles: ["操作提示", "提示", "错误", "成功", "提示"],
    // 对话框按钮
    DLG_Buttons: ["确认", "取消"],
    // 对话框按钮类型
    BTN_OK: 0, // 确认按钮
    BTN_CANCEL: 1, // 取消按钮

    /**
     * 显示对话框；在调用对话框的时候，请调用指定的样式文件信息
     * 且同时在使用的文件中引入artDialog.js文件
     * @param sContent 对话框显示内容
     * @param iDlgType 对话框类型，支持：DLG_INFO,DLG_WARNING,DLG_ERROR,DLG_SUCCESS,DLG_CONFIRM,不指定为DLG_INFO
     * @param oButtons 对话框显示按钮对象，如：{"取消": doDefaultClose},不指定DLG_CONFIRM类型默认显示
     *                    确定、取消按钮，其它类型显示：确定
     * @param sTitle 对话框标题，不指定显示KGC.DLG_Titles[iDlgType]
     * @param iWidth 对话框宽度，可选
     * @param iHeight 对话框的高度，可选
     */
    dialog: function (sContent, iDlgType, oButtons, sTitle, iWidth, iHeight, oOptions) {

        /**
         * 默认确定
         */
        function doDefaultClose(event) {
            $(this).dialog("close");
        }

        // 设置显示内容
        var $dlg = $("#_kfit_dlg");
        if ($dlg.length === 0) {
            $("body").append('<div id="_kfit_dlg" class=""><div id="_kfit_dlg_msg" class="kfit_dlg_msg">' + sContent + '</div></div>');
            $dlg = $("#_kfit_dlg");
        } else {
            $("#_kfit_dlg_msg").html(sContent);
        }

        // 检查对话框类型
        if (arguments.length < 2) {
            iDlgType = KDlg.DLG_INFO;
        }

        // 对话框参数
        var oParam = {modal: true, buttons: {}};
        $.extend(oParam, oOptions);
        $.extend(oParam, {closeOnEscape: false});
        // 对话框参数-按钮
        if (KGF.isEmpty(oButtons)) {
            oParam.buttons = {"确认": doDefaultClose};
            if (iDlgType == KDlg.DLG_CONFIRM) {
                jQuery.extend(oParam.buttons, {"取消": doDefaultClose});
            }
        } else {
            jQuery.extend(oParam.buttons, oButtons);
            for (var prop in oParam.buttons) {
                if (KGF.isEmpty(oParam.buttons[prop])) {
                    oParam.buttons[prop] = doDefaultClose;
                }
            }
        }
        // 对话框参数-图标
        var sImgFile = "";
        switch (iDlgType) {
            case KDlg.DLG_INFO:                    // 提示信息框
                sImgFile = KGF.getRootPath() + "/page/common/img/dialog/information.png";
                break;
            case KDlg.DLG_WARNING:                 // 警告信息框
                sImgFile = KGF.getRootPath() + "/page/common/img/dialog/warning.png";
                break;
            case KDlg.DLG_ERROR:                   // 错误/失败信息框
                sImgFile = KGF.getRootPath() + "/page/common/img/dialog/error.png";
                break;
            case KDlg.DLG_SUCCESS:                 // 成功信息框
                sImgFile = KGF.getRootPath() + "/page/common/img/dialog/confirmation.png";
                break;
            case KDlg.DLG_CONFIRM:                 // 确认信息框
                sImgFile = KGF.getRootPath() + "/page/common/img/dialog/information.png";
                break;
            default:
                sImgFile = KGF.getRootPath() + "/page/common/img/jquery/warning.png";
        }
        $("#_kfit_dlg_img").attr("src", sImgFile);
        // 对话框参数-标题
        if (arguments.length < 4 || sTitle == null) {
            oParam.title = KDlg.DLG_Titles[iDlgType];
        } else {
            oParam.title = sTitle;
        }
        // 对话框参数-宽
        if (arguments.length > 4 && iWidth != null) {
            oParam.width = iWidth;
        } else {
            oParam.width = 491;
        }
        // 对话框参数-高
        if (arguments.length > 5 && iHeight != null) {
            oParam.height = iHeight;

        } else {
            oParam.height = 250;

        }
        // 不可改变大小
        oParam.resizable = false;
        // 初始化对话框
        $dlg.dialog(oParam);
        // 显示对话框
        $dlg.dialog("open");
        if (window != top) {
            var y = $(top.document).scrollTop();
            var x = $dlg.offset().left;
            $dlg.dialog("option", "position", [x, y]);
        }

    },

    /**
     * 显示调试信息提示框
     * @param sMsg
     * @param fnCallBack 点击确定按钮的回调过程，可选
     */
    debug: function (sMsg, fnCallBack) {
        if (KGP.ENABLE_DEBUG) {
            if (KGF.isEmpty(fnCallBack)) {
                this.dialog(sMsg, this.DLG_INFO);
            } else {
                var oButton = {"确认": fnCallBack};
                this.dialog(sMsg, this.DLG_INFO, oButton);
            }
        }
    },

    /**
     * 显示提示信息提示框
     * @param sMsg
     * @param fnCallBack 点击确定按钮的回调过程，可选
     */
    info: function (sMsg, fnCallBack, closeFn) {
        if (KGF.isEmpty(fnCallBack)) {
            this.dialog(sMsg, this.DLG_INFO);
        } else {
            var oButton = {"确认": fnCallBack};
            if (KGF.isEmpty(closeFn)) {
                this.dialog(sMsg, this.DLG_INFO, oButton);
            } else if ($.isFunction(closeFn)) {
                this.dialog(sMsg, this.DLG_INFO, oButton, null, null, null, {close: closeFn});
            }
        }
    },

    /**
     * 显示警告信息提示框
     * @param sMsg
     * @param fnCallBack 点击确定按钮的回调过程，可选
     */
    warning: function (sMsg, fnCallBack) {
        if (KGF.isEmpty(fnCallBack)) {
            this.dialog(sMsg, this.DLG_WARNING);
        } else {
            var oButton = {"确认": fnCallBack};
            this.dialog(sMsg, this.DLG_WARNING, oButton);
        }
    },

    /**
     * 显示错误信息提示框
     * @param sMsg
     * @param fnCallBack 点击确定按钮的回调过程，可选
     */
    error: function (sMsg, fnCallBack) {
        if (KGF.isEmpty(fnCallBack)) {
            this.dialog(sMsg, this.DLG_ERROR);
        } else {
            var oButton = {"确认": fnCallBack};
            this.dialog(sMsg, this.DLG_ERROR, oButton);
        }
    },

    /**
     * 显示异常信息提示框
     * @param sMsg
     * @param fnCallBack 点击确定按钮的回调过程，可选
     */
    except: function (sfnName, oErr, aArgs, fnCallBack, oOptions) {
        if (KGF.isEmpty(fnCallBack)) {
            this.dialog(sfnName + oErr.message, this.DLG_ERROR, null, null, null, null, oOptions);
        } else {
            var oButton = {"确认": fnCallBack};
            this.dialog(sfnName + oErr.message, this.DLG_ERROR, oButton, null, null, null, oOptions);
        }
    },

    /**
     * 确认提示框
     * @param sMsg
     * @param oButtons 对话框显示按钮对象，如：{"取消": doDefaultClose},不指定DLG_CONFIRM类型默认显示
     *                    确定、取消按钮，其它类型显示：确定
     */
    confirm: function (sMsg, oButtons, oOptions) {
        this.dialog(sMsg, this.DLG_CONFIRM, oButtons, null, null, null, oOptions);
    },

    /**
     * 显示/隐藏处理等待提示框
     */
    waiting: function (bShow, bShowTime) {
        var sHtml = '<div id="divMask" class="mask" style="display:none"></div><div id="divWaiting" class="waiting" style="display:none"><div id="divTime"><p>'
            + '<img src="' + KGF.getRootPath() + '/page/common/img/waiting.gif" alt="等待"/><span id="prompt">正在处理，请稍候...</span><span id="second"></span>'
            + '<input id="time" type="hidden" value="0" /><input id="timerId" type="hidden" value="" /></p><p>'
            + '<span id="cancel"><a href="javascript:KDlg.waiting(false,false);">取消</a></span></p></div></div> ';

        var $document = $(top.document);
        var $nWaiting = $document.find("#divWaiting");

        if ($nWaiting.length == 0) {
            $document.find('body').append(sHtml);
            $nWaiting = $document.find("#divWaiting");
        }
        var $nMask = $document.find("#divMask");
        $nWaiting.bgiframe();
        $nMask.bgiframe();
        $document.find('#time').val("");
        $document.find('#second').html("  ");

        var timerId = parseInt($document.find("#timerId").val());
        if (timerId > 0) {
            top.clearInterval(timerId);
            $document.find("#timerId")[0].value = "";
        }

        if (bShow) {
            // 得到浏览器的宽度
            var oSize = KGF.getPageSize();
            if ($.browser.msie && ($.browser.version == "6.0")) {
                var wleft = ($nMask.width() - $nWaiting.width()) / 2;
                $nWaiting.css('left', wleft);
            } else if ($.browser.msie && ($.browser.version == "7.0")) {
                var wleft = ($nMask.width() - $nWaiting.width()) / 2;
                $nWaiting.css('left', wleft);
            } else {
                var wleft = ($nMask.width() - $nWaiting.width()) / 2;
                var wtop = ($nMask.height() - $nWaiting.height()) / 2;
                $nWaiting.css('left', wleft);
                $nWaiting.css('top', wtop);

            }
            $nMask.attr("class", "mask");
            $nWaiting.attr("class", "waiting");

            $nWaiting.show();
            $nMask.show();
            if (bShowTime) {
                var timerId = top.setInterval(waitingTime, 1000);
                $document.find("#timerId").val(timerId);
            }
        } else {
            $nMask.hide();
            $nWaiting.hide();
        }

        /**
         * 统计处理的时间函数（单位秒）
         */
        function waitingTime() {
            var $document = $(top.document);
            var $nWaiting = $document.find("#divWaiting");
            var $nMask = $document.find("#divMask");

            var sTime = $document.find("#time").val() || "";
            sTime = (sTime == "" ? "0" : sTime);
            var iTime = parseInt(sTime);
            if (iTime == 2) {
                $nMask.attr("class", "mask1");
                $nWaiting.attr("class", "waiting1");
            }
            iTime = iTime + 1; //add by ljy 20120627
            $document.find("#time").val(iTime);
            if (iTime < 60) {
                sTime = iTime + "秒";
            } else if (iTime > 60) {
                sTime = Math.floor(iTime / 60) + "分" + iTime % 60 + "秒";
            } else {
                sTime = iTime / 60 + "分";
            }
            $document.find("#second").html(sTime);
        }
    }
};

/**
 * <p>浏览器端Session缓存器</p>
 * 用于存放当前登录客户的常用信息，如：客户号、客户名称等，这些信息从可以通过调用该对象的refreshSession()
 * 函数来重新获取。缓存项的通过set方法设置，通过get方法读取，故新增一个缓存数据项时要添加相应的set和get方法。
 */
var KUC = (function () {
    if (window != window.top && top._KUC) {
        KUC = top._KUC;
    } else {
        KUC = new KfitUserCache();
    }
    return KUC;//add by ljy 20120626
})();

function KfitUserCache(cacheFileName) {
    // 内部缓存对象，存放缓存数据
    var _KeyValue = '0000';
    var _KeyLinkParam = "1000";
    var _oUserCache = createUserCache();

    /**
     * 根据客户浏览器支持的本地缓存机制创建缓存对象，可能的缓存机制有：sessionStorage，localStorage，
     * globalStorage和页面缓存
     */
    function createUserCache() {
        return new ListMap();
    }
    ;

    /**
     * 从服务器重新获取Session数据
     */
    this.refreshSession = function () {
        Ajax.request("getCustSession.action", {"FailType": 'login'}, function (ajaxResult) {
            if (ajaxResult.isSuccess()) {
                var oData = ajaxResult.getData(0, 0);
                if (oData !== null) {
                    var sProp;
                    for (sProp in oData) {
                        KUC.setCacheData(sProp, oData[sProp]);
                    }
                }
            }
        }, false);
    };

    /**
     * 根据缓存项名称获取缓存项值
     * @param {sring} sKey 缓存项名称
     * @param vDefaultValue 如果缓存项不存在默认的返回值
     * @returns 缓存项值
     */
    this.getCacheData = function (sKey, vDefaultValue) {
        return _oUserCache.getValue(_KeyValue, sKey, vDefaultValue);
    };

    /**
     * 设置缓存项，如果存在则更新，否则新增缓存项
     * @param {sring} sKey 缓存项名称
     * @param {sring} value 缓存项值
     */
    this.setCacheData = function (sKey, value) {
        _oUserCache.setValue(_KeyValue, sKey, value);
    };

    this.removeCacheData = function (sKey) {
        var _oItem = this.getItem();
        if (_oItem || _oItem[sKey]) {
            _oItem[sKey] = undefined;
            delete _oItem[sKey];
        }
    };

    /**
     * 从缓存中移除缓存项
     * @param {sring} sKey 缓存项名称
     */
    this.removeItem = function (sKey) {
        _oUserCache.removeItem(sKey);
    };

    /**
     * 清空缓存中所有缓存项
     */
    this.clear = function () {
        _oUserCache.clear();
    };

    this.getItem = function () {
        return _oUserCache.getItem(_KeyValue, "");
    };

    // 将KUC中内容转化为String
    this.toString = function () {
        var obj = _oUserCache.getItem(_KeyValue, "");
        var sResult = "";
        var s = "";
        for (s in obj) {
            if (typeof obj[s] == "function")
                continue;
            sResult += "{" + s + ":" + obj[s] + "},";
        }
        if (sResult.length > 0) {
            sResult = sResult.substring(0, sResult.length - 1);
        }
        return sResult;
    };

    /**
     * 设置浏览器传递参数
     * @param sKey
     * @param value
     */
    this.setLinkParamData = function (sKey, value) {
        _oUserCache.setValue(_KeyLinkParam, sKey, value);
    };
    /**
     * 获取浏览器传递参数
     * @param sKey
     * @param vDefaultValue
     * @return {*}
     */
    this.getLinkParamData = function (sKey, vDefaultValue) {
        return _oUserCache.getValue(_KeyLinkParam, sKey, vDefaultValue);
    };

    this.setURLParam = function (value) {
        _oUserCache.setValue(_KeyLinkParam, "URL_PARAM", value);
    };

    this.getURLParam = function () {
        return _oUserCache.getValue(_KeyLinkParam, "URL_PARAM", {});
    };
    /**
     * 获取浏览器传递参数对象
     * @return {*}
     */
    this.getLinkParam = function () {
        return _oUserCache.getItem(_KeyLinkParam, "");
    };

    /**
     * 清空浏览器参数对象
     */
    this.clearLinkParam = function () {
        _oUserCache.del(_KeyLinkParam);
    };

    /**
     * 清除浏览器参数数据
     * @param sKey
     */
    this.removeLinkParam = function (sKey) {
        var _oItem = this.getLinkParam();
        if (_oItem || _oItem[sKey]) {
            _oItem[sKey] = undefined;
            delete _oItem[sKey];
        }
    };

}

/**
 * <p>自定义输出标签处理器kfit:out</p>
 * 该类用于处理自定义标签kfit:out中的中的变量输出，kfit:out标签中vlaue属性定义输出变量名称，dict属性定义翻译的
 * 数据字典对象名称，format属性定义数据的格式化类型，vlaue属性定义的变量名为oDataObj对象的属性名称，其值从
 * 该对象相应属性中获取，另使用自定义标签时不要用：要用完整格式，不要用<kfit:out ... />格式
 */
function KfitTag() {
    /**
     * 添加数据到自定义标签处理器，入参不固定，可以是0或多个对象
     * @param {boolean} bExistOverRide 如果指定的属性已存在，则是否覆盖，默认覆盖
     * @param {string} sScope outTag范围
     * @param oData[,...] 为多个数据对象，可以是Object或ListMap类型，
     *           如果是Object对象，则其所有属性根据bExistOverRide参数合并到oDataObj对象中，
     *           如果是ListMap,根据bExistOverRide参数,将列表中索引属性的属性值为属性名称，
     *           默认属性的属性值为属性值，合并到oDataObj对象中.
     */
    this.extendData = function (/*bExistOverRide, oData, ...*/) {
        var iBeginIdx = 1;
        var bExistOverRide = true;
        var oArg, o, sKeyName, sKeyValue, sValueName;
        if (!(jQuery.type(arguments[0]) == "boolean")) {
            bExistOverRide = true;
            iBeginIdx = 0;
        } else {
            bExistOverRide = arguments[0];
        }

        if (jQuery.type(arguments[0]) == "string") {
            this.config.scope = arguments[0];
        }
        if (arguments.length >= 2) {
            if ((jQuery.type(arguments[0]) == "boolean") && (jQuery.type(arguments[0]) == "string")) {
                bExistOverRide = arguments[0];
                this.config.scope = arguments[1];
                iBeginIdx = 2;
            }
        }
        for (var i = iBeginIdx; i < arguments.length; i++) {
            oArg = arguments[i];
            if (oArg instanceof ListMap) {
                sKeyName = oArg.getKeyName();
                sValueName = oArg.getValueName();
                for (var j = 0; j < oArg.count(); j++) {
                    o = oArg.items(j);
                    sKeyValue = o[sKeyName];
                    if (bExistOverRide || !this.config.data.outdata.hasOwnProperty(sKeyValue)) {
                        this.config.data.outdata[sKeyValue] = o[sValueName];
                    }
                }
            } else if ((oArg instanceof Object) || (typeof oArg == "object")) {
                var prop = null;
                for (prop in oArg) {
                    if (bExistOverRide || !this.config.data.outdata.hasOwnProperty(prop)) {
                        this.config.data.outdata[prop] = oArg[prop];
                    }
                }
            }
        }
    };

    /**
     * 处理自定义标签，在自定义标签位置输出相应信息，如果设置验证器，则必须是第一个参数
     * @param 同extendData
     */
    this.process = function (/* bExistOverRide, oData, ...*/) {
        // 处理入参
        if (arguments.length > 0)
            this.extendData.apply(this, arguments);

        //处理标签
        var propTag = null;
        for (propTag in this.config.methods) {
            var oMethod = this.config.methods[propTag];
            var sTag = oMethod.bAttr ? "[" + propTag + "]" : propTag;
            if ($(sTag).length == 0) {
                sTag = oMethod.bAttr ? "[" + propTag + "]" : "kfit\\:" + propTag;
            }
            if ((oMethod.scope || "") !== "")
                sTag += "[scope='" + oMethod.scope + "']";

            this.processTag(sTag, oMethod.method);
        }
    };

    /**
     * 处理所有自定义标签
     * @param {string} sTagName 标签名称
     * @param {function} fnProcess 标签处理过程
     */
    this.processTag = function (sTagName, fnProcess) {
        // 获取所有<sTagName>标签
        var anTags = $(sTagName);
        for (var i = 0; i < anTags.length; i++) {
            var oTag = anTags[i];
            try {
                // 处理每一个标签
                fnProcess(oTag, this);
            } catch (e) {
                $(oTag).replaceWith('<br/>处理标签[' + sTagName + ']失败：' + e.message);        // 如果失败则在标签位置输出错误信息
            }
        }
    }

    /**
     * 去掉参数名中的${}，获取变量名称
     * @param {string} sParamName ${参数名称}格式的字符串
     */
    this.getParamName = function (sParamName) {
        var i = sParamName.indexOf("${");
        if (i < 0) return null;
        i += 2;

        var j = sParamName.indexOf("}", i);
        if (j < 0) return null;

        return sParamName.substring(i, j);
    }

    /**
     * 替换自定义标签元素
     * @param {jQuery} o$Tag 待替换的元素jQuery对象
     * @param {string} sMode 替换方式
     * @param {string} aItem 替换数据
     * @param {string} sFormat 替换格式化字符串，可选
     */
    this.replaceCustTag = function (o$Tag, sMode, aItem, sFormat) {
        if (arguments.length === 3) {
            var sAtom;
            if (sMode === 'table') { // 显示到表格中
                sAtom = '<tr><td>%s</td><td colspan="2">%s</td></tr>';
            } else if (sMode === 'div') {// 显示到div中
                sAtom = '<div>%s%s</div>';
            } else {  // 显示到默认容器中
                sAtom = '%s%s<br/>';
            }
            sFormat = sAtom;

            for (var i = 2; i < aItem.length; i = i + 2) {
                sFormat += sAtom;
            }
        }
        var sHtml = sFormat.format(aItem);

        // 如果是显示到表格中，则替换当前表格行
        if (sMode === 'table') {
            o$Tag.parent().parent().replaceWith(sHtml);
        } else {
            o$Tag.replaceWith(sHtml);
        }
    }

    /**
     * 移除自定义标签
     * @param $Tag 自定义标签
     * @param sMode 标签所在的位置
     */
    this.removeCustTag = function ($Tag, sMode) {
        if (sMode === 'table') {
            $Tag.parent().parent().remove();
        } else {
            $Tag.remove();
        }
    }

    /**
     * 读取标签'mode'属性值
     * @param {jQuery} o$Tag 待替换的元素jQuery对象
     * @returns {string} 属性值
     */
    this.getModeAttr = function (o$Tag) {
        var sMode = o$Tag.attr('mode');
        if (sMode === undefined) {
            sMode = 'table';
        } else {
            sMode = sMode.toLowerCase();
        }
        return sMode;
    }

    /**
     * 读取标签'class'或'tclass'属性值
     * @param {jQuery} o$Tag 待替换的元素jQuery对象
     * @param {string} sAttrName 属性名称：'class'或'tclass'
     * @returns {string} 属性值
     */
    this.getClassAttr = function (o$Tag, sAttrName) {
        // 读取输入项样式类属性
        var sClass = o$Tag.attr(sAttrName);
        //var sClass = o$Tag.attr('class', sAttrName);
        if (sClass) {
            sClass = ' class="' + sClass + '"';
        } else {
            sClass = '';
        }
        return sClass;
    }

    /**
     * 读取标签boolean类型属性值
     * @param {jQuery} o$Tag 待替换的元素jQuery对象
     * @param {string} sAttrName 属性名称
     * @param {boolean} 默认值，如果该属性不存在，则返回该值
     * @returns {string} 属性值
     */
    this.getBoolAttr = function (o$Tag, sAttrName, bDefault) {
        var bReturn = bDefault;
        var sValue = o$Tag.attr(sAttrName);
        if (sValue != null && sValue.toLowerCase() === 'false') {
            bReturn = false;
        }
        return bReturn;
    }

    /**
     * 获取日期输入元素数据，格式为日期输入元素的格式；如果没有指定的元素则返回空字符串''
     * @param {string} sId 元素标识
     * @returns {string} 日期
     */
    this.getElementData = function (sId) {
        var sValue = $('#' + sId).val();
        return sValue === undefined ? '' : sValue;
    };

    /**
     * 获取日期输入元素数据，格式为日期输入元素的格式；如果没有指定的元素则返回空字符串''
     * @param {string} sId 元素标识
     * @returns {string} 日期
     */
    this.getDate = function (sId) {
        return this.getElementData(sId);
    };

    /**
     * 获取日期输入元素数据，格式为整型：yyyymmdd；如果没有指定的元素则返回0
     * @param {string} sId 元素标识
     * @returns {int} 整型日期
     */
    this.getDateAsInt = function (sId) {
        var sValue = $("#" + sId).val();
        return sValue.replace(/\D/g, '');
        // moidfy by ljy 20120619 读取JQuery UI datepicker中时间
        //return $.datepicker.formatDate( "yymmdd", $( "#" + sId ).val());
    };

    /**
     * 查询数据
     * @param key
     */
    this.lookUp = function (key, defalut) {
        var vParamValue = "";

        // 获取参数名称并查找参数值，如果没参数名称则按常量处理，
        var sParamName = key;
        if (KGF.isEmpty(sParamName)) {
            vParamValue = sParam;
        } else {
            vParamValue = this.config.data.outdata[sParamName];
        }
        // 检查参数值
        if ((vParamValue instanceof Number || typeof(vParamValue) === "number") && isNaN(vParamValue)) {
            vParamValue = defalut;
        } else if (KGF.isEmpty(vParamValue) && !KGF.isEmpty(defalut)) {
            vParamValue = defalut;
        }
        return vParamValue;
    }
}

KfitTag.prototype.config = {
    data: {
        outdata: {}
    },
    methods: {}
}
/**
 * 处理out输出标签
 * 将标签中定义的变量名称翻译为实际数据，每个out标签仅能定义一个变量名称，
 * 该标签支持下列属性：
 * value：变量名称，格式：${变量名称}，如：<kfit:out value="${fundcode}"></kfit:out>
 * dict: 用于翻译变量值，为ListMap对象名称（一般为KGD中的属性名称），如:
 *          <kfit:out value="${sharetype}" dict="ShareType"></kfit:out>
 * format: 格式化变量值的字符串，用于数值或日期时间类型的数据，支持的格式：
 *         数值型：currency或fmtNumber函数的格式化字符串（如：#,##0.00等）
 *         日期：date(格式为：yyyy-mm-dd)、datecn(格式为：yyyy年mm月dd日)
 *         时间：time(格式为：hh:nn:ss)、timecn(hh时nn分ss秒)
 * output：指明变量值的输出格式，属性值为为带%s的字符串，如果设置该参数则变量值输出到该参数%s的位置，然后在标签位置输出
 * @param {element} oTag 标签元素对象
 */
KfitTag.prototype.config.methods.out = {
    scope: null,
    bAttr: false,
    method: function (oTag, obj) {
        var sParam = oTag.getAttribute("value");
        var sFormat = oTag.getAttribute("format");
        var sDict = oTag.getAttribute("dict");
        var sOutput = oTag.getAttribute("output");
        var sDefault = oTag.getAttribute("default");
        var slength = oTag.getAttribute("maxlength");
        var bFound = true;

        // 获取参数名称并查找参数值，如果没参数名称则按常量处理，
        var sParamName = obj.getParamName(sParam);
        if (KGF.isEmpty(sParamName)) {
            vParamValue = sParam;
        } else {
            vParamValue = obj.config.data.outdata[sParamName];
        }
        // 检查参数值
        if ((vParamValue instanceof Number || typeof(vParamValue) === "number") && isNaN(vParamValue)) {
            vParamValue = "0";
            bFound = false;
        } else if (KGF.isEmpty(vParamValue)) {
            vParamValue = "--";
            bFound = false;
        }
        // 翻译参数、格式化
        if (bFound) {
            if (!KGF.isEmpty(sDict)) {// 翻译
                vParamValue = eval("KGD." + sDict + ".get('" + vParamValue + "')");
            } else if (!KGF.isEmpty(sFormat)) {// 格式化输出数据
                if (sFormat === "currency") {        // 格式化金额：#,##0.00
                    vParamValue = KGF.fmtNumber(vParamValue, KGC.FMT_Currency);
                } else if (sFormat === "date") {        // 格式化整型日期：yyyy-mm-dd
                    vParamValue = KGF.fmtDate(vParamValue);
                } else if (sFormat === "datecn") {    // 格式化整型日期：yyyy年mm月dd日
                    vParamValue = KGF.fmtDate(vParamValue, "CN");
                } else if (sFormat === "datemd") {    // 格式化整型日期：mm月dd日
                    vParamValue = KGF.fmtDate(vParamValue, "MD");
                } else if (sFormat === "time") {        // 格式化整型时间: hh:nn:ss
                    vParamValue = KGF.fmtTime(vParamValue);
                } else if (sFormat === "timecn") {    // 格式化整型时间: hh时nn分ss秒
                    vParamValue = KGF.fmtTime(vParamValue, "CN");
                } else if (sFormat === "%") {
                    vParamValue = Number(vParamValue) * 100 + "%";
                } else if ((/[\#\,0\.]+/g).test(sFormat)) {    // 格式化数字
                    vParamValue = KGF.fmtNumber(vParamValue, sFormat);
                }
            }
        }
        // 输出位置
        if (!KGF.isEmpty(sOutput)) {
            vParamValue = sOutput.format(vParamValue);
        }
        if (KGF.isEmpty($.trim(vParamValue))) {
            if (sDefault) {
                vParamValue = sDefault;
            } else {
                vParamValue = '--';
            }
        }

        if (!KGF.isEmpty(slength) && vParamValue.length > slength) {
            try {
                $(oTag).parent().attr("title", vParamValue);
            } catch (e) {
            }
            vParamValue = vParamValue.substr(0, slength) + "...";
        }
        //oTag.innerHTML = vParamValue;
        $(oTag).replaceWith(vParamValue + "");
    }
}

/**
 * 处理日期标签<kfit:date>
 * 在当前位置输出日期选择框，支持的标签属性：
 * caption：标题
 * tclass：输入项标题的样式类
 * input元素属性
 * @param {element} oTag 标签元素对象
 */
KfitTag.prototype.config.methods.date = {
    scope: null,
    bAttr: false,
    method: function (oTag, obj) {
        // 转换为jQuery对象
        var $Tag = $(oTag);
        // 读取元素标识属性
        var sId = $Tag.attr('id');
        if (!sId) {
            sId = new Date().getTime(); // 默认元素标识
        }
        // 读取标题属性
        var sCaption = $Tag.attr('caption');
        //增加格式化处理
        var sFormat = $Tag.attr('format');
        // 读取输入项标题属性
        var sTitleClass = obj.getClassAttr($Tag, 'tclass');
        // 读取元素属性
        var sAttribes = KDom.getAttribeString(oTag, ["tclass", "caption", "maxlength", "readonly"]);
        // 组织输出标签并替换
        var sDate, sDateLabel;
        // 标题
        if (sCaption) {
            sDateLabel = '<label for="%s" %s>%s</label>'.format([sId, sTitleClass, sCaption]);
        } else {
            sDateLabel = '';
        }
        // 输入项
        sDate = '<input id="%s" %s type="text" maxlength="10"></input>'.format([sId, sAttribes]);
        // modify by ljy 20120702 sAttribes在IE6,7 下不兼容
        //sDate = '<input id="%s" %s type="text" maxlength="10"></input>'.format([sId, ""]);
        // 替换自定义标签
        obj.replaceCustTag($Tag, "", [sDateLabel, sDate]);

        var $datepicker = $('#' + sId);

        $datepicker.datepicker();
        // 加载日期样式
        if (sFormat) { // add by ljy 增加格式化处理
            $datepicker.datepicker("option", "dateFormat", sFormat);
        }

        // 判断是否可用
        var bDisable = $Tag.attr('disable');
        if (bDisable) {
            $datepicker.datepicker("option", "disable", bDisable);
        }

        // 设置显示目标
        var sAltField = $Tag.attr('altField');
        if (sAltField) {
            $datepicker.datepicker("option", "altField", '#' + sAltField);
        }

        // 设置显示目标格式
        var sAltFormat = $Tag.attr('altFormat');
        if (sAltFormat) {
            $datepicker.datepicker("option", "altFormat", sAltFormat);
        }

        // 自适应
        var bAutoSize = $Tag.attr('autoSize');
        if (bAutoSize) {
            $datepicker.datepicker("option", "autoSize", bAutoSize);
        }

        // Have the datepicker appear automatically when the field receives focus ('focus'),
        // appear only when a button is clicked ('button'), or appear when either event takes place ('both').
        var sShowOn = $Tag.attr('showOn');
        if (sShowOn) {
            $datepicker.datepicker("option", "showOn", sShowOn);
        }

        // 按钮图片 URL
        // The URL for the popup button image.
        // If set, buttonText becomes the alt value and is not directly displayed.
        var sButtonImage = $Tag.attr('buttonImage');
        if (sButtonImage) {
            $datepicker.datepicker("option", "buttonImage", sButtonImage);
        }

        // 组件后面显示一个图片
        var bButtonImageOnly = $Tag.attr('buttonImageOnly');
        if (bButtonImageOnly) {
            $datepicker.datepicker("option", "buttonImageOnly", bButtonImageOnly);
        }

        // 组件后显示图片上文字
        var sButtonText = $Tag.attr('buttonText');
        if (sButtonText) {
            $datepicker.datepicker("option", "buttonText", sButtonText);
        }

        // 月份是否可以改变:显示一个下拉列表
        var bChangeMonth = $Tag.attr('changeMonth');
        if (bChangeMonth) {
            $datepicker.datepicker("option", "changeMonth", bChangeMonth);
        }

        // 年份是否可以改变：显示一个下拉列表
        var bChangeYear = $Tag.attr('changeYear');
        if (bChangeYear) {
            $datepicker.datepicker("option", "changeYear", bChangeYear);
        }

        // 显示两个月份
        var bDouble = $Tag.attr('double');
        if (bDouble) {
            $datepicker.datepicker("option", "numberOfMonths", 2);
        }
        // Set the date to highlight on first opening if the field is blank.
        // Specify either an actual date via a Date object or as a string in the current dateFormat,
        // or a number of days from today (e.g. +7) or a string of values and periods ('y' for years,
        // 'm' for months, 'w' for weeks, 'd' for days, e.g. '+1m +7d'), or null for today.
        var sDefaultDate = $Tag.attr('defaultDate');
        if (sDefaultDate) {
            $datepicker.datepicker("option", "defaultDate", sDefaultDate);
        }

        // Set the first day of the week: Sunday is 0, Monday is 1, ...
        // This attribute is one of the regionalisation attributes.
        var iFirstDay = $Tag.attr('firstDay');
        if (iFirstDay) {
            $datepicker.datepicker("option", "firstDay", iFirstDay);
        }

        // Set a maximum selectable date via a Date object or as a string in the current dateFormat,
        // or a number of days from today (e.g. +7) or a string of values and periods ('y' for years,
        // 'm' for months, 'w' for weeks, 'd' for days, e.g. '+1m +1w'), or null for no limit.
        var sMaxDate = $Tag.attr('maxDate');
        if (sMaxDate) {
            $datepicker.datepicker("option", "maxDate", sMaxDate);
        }

        // Set a minimum selectable date via a Date object or as a string in the current dateFormat,
        // or a number of days from today (e.g. +7) or a string of values and periods ('y' for years,
        // 'm' for months, 'w' for weeks, 'd' for days, e.g. '-1y -1m'), or null for no limit.
        var sMinDate = $Tag.attr('minDate');
        if (sMinDate) {
            $datepicker.datepicker("option", "minDate", sMinDate);
        }

        // Whether to show the button panel
        var bShowButtonPanel = $Tag.attr('showButtonPanel');
        if (bShowButtonPanel) {
            $datepicker.datepicker("option", "showButtonPanel", bShowButtonPanel);
        }

        // When true a column is added to show the week of the year.
        // The calculateWeek option determines how the week of the year is calculated.
        // You may also want to change the firstDay option.
        var bShowWeek = $Tag.attr('showWeek');
        if (bShowWeek) {
            $datepicker.datepicker("option", "showWeek", bShowWeek);
        }

        // 设置星期字符
        $datepicker.datepicker("option", "dayNamesMin", ['日', '一', '二', '三', '四', '五', '六']);
        // 设置月份字符
        $datepicker.datepicker("option", "monthNames", ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月']);
        $datepicker.datepicker("option", "monthNamesShort", ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月']);
    }
}

KfitTag.prototype.config.methods.kfittips = {
    scope: null,
    bAttr: true,
    method: function (oTag, obj) {
        var oOptions = {};
        // 转换为jQuery对象
        var $Tag = $(oTag);
        // 读取资源名称属性
        var sRes = $Tag.attr('resid');
        if (sRes) {
            sRes = KGS[sRes];
            oOptions.content = sRes ? sRes : '';
        }

        var sContent = $Tag.attr('content');
        oOptions.content = sContent ? sContent : '';

        var sTClass = $Tag.attr('tclass');
        if (sTClass) {
            oOptions.className = sTClass;
        }

        var sShowOn = $Tag.attr('showon');
        oOptions.showOn = sShowOn ? sShowOn : "hover";

        var sAlignTo = $Tag.attr('alignTo');
        oOptions.alignTo = sAlignTo ? sAlignTo : 'target';
        var sTipsLayout = $Tag.attr('tipslayout') || "";
        switch (sTipsLayout.toLowerCase()) {
            case 'right':
                oOptions.alignX = 'right';
                oOptions.alignY = 'center';
                oOptions.offsetX = 5;
                break;
            case "left":
                oOptions.alignX = 'left';
                oOptions.alignY = 'center';
                oOptions.offsetX = 5;
                break;
            case 'bottom':
                oOptions.alignX = 'inner-left';
                oOptions.alignY = 'bottom';
                oOptions.offsetX = 0;
                oOptions.offsetY = 5;
                break;
            default:
                oOptions.alignX = 'inner-left';
                oOptions.alignY = 'top';
                oOptions.offsetY = 5;
                oOptions.offsetX = 0;
                break;
        }
        $Tag.poshytip(oOptions);
    }
}
/**
 * <p>页面控制基础类</p>
 * 该类是所有页面js控制类的基类，实现下列公用功能:<ul>
 * <li>1.记录客户操作行为并提交</li>
 * <li>2.页面设置</li>
 */
function KfitPageBase() {
    // 定义本对象的this引用，子类中可以直接使用this.$Super访问基类中的同名方法或属性
    this.$Super = this;

    // 页面动作定义
    var _ACT_LOAD = 0;    // 页面加载动作--基类自动记录
    var _ACT_UNLOAD = 1;    // 页面释放动作--基类自动记录
    var _ACT_CLICK = 2;    // 页面点击动作--基类自动记录
    var _ACT_FOCUS = 3;    // 获得焦点
    var _ACT_AJAX = 7;    // Ajax访问
    var _ACT_ERROR = 8;    // 错误
    var _ACT_UNDEFINE = 9;    // 未定义动作

    // 页面动作定义访问器，供外部/子类访问
    this.ACT_LOAD = function () {
        return _ACT_LOAD;
    };
    this.ACT_UNLOAD = function () {
        return _ACT_UNLOAD;
    };
    this.ACT_CLICK = function () {
        return _ACT_CLICK;
    };
    this.ACT_FOCUS = function () {
        return _ACT_FOCUS;
    };
    this.ACT_AJAX = function () {
        return _ACT_AJAX;
    };
    this.ACT_ERROR = function () {
        return _ACT_ERROR;
    };
    this.ACT_UNDEFINE = function () {
        return _ACT_UNDEFINE;
    };

    // 保存当前this
    var $Self = this;
    // 保存当页面的客户行为的对象数组，存放Action对象
    var aoActions = [];
    // 标志当前是否已停止记录用户行为，true-停止记录
    var bStopRecord = false;
    // 自动提交时间间隔,单位：秒，默认10秒提交一次
    var iAutoPostInterval = 10;
    // 自动提交定时器标识
    var autoPostHandle = 0;
    // 标志当前是否正在提交用户行为，true-正在提交
    var bIsPosting = false;

    /**
     * 该方法被子类对象在页面的onload中首先被调用，用于初始页面控制对象，包括数据、变量、从服务器获取数据等,
     * 该函数在子类对象中被覆盖，在子类的initialize方法中必须调用父类的initialize方法，即：
     * this.$Super.initialize.apply(this, arguments);
     */
    this.initialize = function () {
        //简单换肤
        changeSkin();
        // 页面进入记录
        // modify by ljy 20120628 ===的优先级大于 &
        if ((KGP.USER_ACTION_LEVEL & 1) === 1) {
            var o = new UserAction(null);
            o.action = _ACT_LOAD;
            aoActions.push(o);
        }
        // 初始化用户行为监听事件
        initBodyListenEvent();
        if (KGP.FORBID_PAGE_ERROR)
            window.onerror = onPageError;
        if (KGP.FORBID_PAGE_RIGHTBUTTON)
            document.oncontextmenu = onPageMouseClick;
        if (KGP.FORBID_PAGE_KEYBOARD)
            document.onkeydown = onPageKeyDown;

        // TODO 子类要完成的操作
    };

    /**
     * 初始化当前页面的元素，包括显示控制、状态控制、数据初始化等，该函数在initialize
     * 函数之后被调用，该函数在子类对象中被覆盖。
     */
    this.initElement = function () {
        function endsWith(str, pattern) {
            var d = str.length - pattern.length;
            return d >= 0 && str.lastIndexOf(pattern) === d;
        }

        if (top.window == window && KUC.getItem() == '' && endsWith(location.pathname, "html")) {
            KGF.gotoPage(KGF.getRootPath());
            return;
        }
        // TODO 子类要完成的操作
    };

    /**
     * 初始化当前页面的元素CSS样式，该函数在initElement函数之后被调用，
     * 该函数在子类对象中被覆盖，在子类的initCSS方法中必须调用父类的initCSS方法，即：
     * this.$Super.initCSS.apply(this, arguments);
     */
    this.initCSS = function () {

    };

    //简单换肤
    function changeSkin() {
        var cssP = window.parent.document.getElementById('frameCss');
        var cssCh = window.document.getElementById('skin');

        if (cssP == null || cssCh == null) {
            return;
        } else {
            var shrefP = cssP.href.search('red');
            var igCss = cssP.href.search('ig');
            var kfitCss = cssP.href.search('fit');
            if (shrefP >= 0) {
                cssCh.href = KGF.getRootPath() + "/page/common/Frame_red_iframe.css";
            } else if (igCss >= 0) {
                cssCh.href = KGF.getRootPath() + "/page/frame_ig/Frame_iframe_ig.css";
            } else if (kfitCss >= 0) {
                cssCh.href = KGF.getRootPath() + "/page/common/Kfit.css";
            } else {
                return;
            }
        }
    }
    ;

    /**
     * 该函数被子类对象在页面的onunload中被调用，用于释放initialize方法中初始化的数据，
     * 该函数在子类对象中被覆盖,必须在子类的finalize方法中调用父类的finalize方法，即：
     * 子类名称.prototype.finalize.apply(this, arguments);
     */
    this.finalize = function () {
        // 页面离开记录
        if ((KGP.USER_ACTION_LEVEL & 2) === 2) {
            var o = new UserAction(null);
            o.action = _ACT_UNLOAD;
            aoActions.push(o);
        }

        // 停止记录用户行为
        bStopRecord = true;
        // 停止自动提交
        if (autoPostHandle != 0) {
            this.stopAutoPostAction();
        }
        // 提交用户操作记录（行为）
        this.postActions(false, true);
        // TODO 子类要完成的操作
    };

    /**
     * 添加用户行为到缓存列表，在适当时候，可手动或自动将列表中用户行为提交到服务器
     * @param {sring} sActionId 用户行为标识
     * @param {sring} sActionName 用户行为名称
     */
    this.addAction = function (sActionId, sActionName, sElement, sData) {
        if (arguments.length === 0)
            return;
        var o = new UserAction(null);
        o.action = sActionId;
        if (arguments.length > 1)
            o.title = sActionName;
        if (arguments.length > 2) {
            o.element = sElement;
        }
        if (arguments.length > 3) {
            o.data = sData;
        }
        aoActions.push(o);
    };

    /**
     * 启动自动提交功能
     * @param {int} iInterval 自动检查时间间隔，单位：分钟
     */
    this.startAutoPostAction = function (iInterval) {
        iInterval = Number(iInterval);
        if (KGF.isEmpty(iInterval)) {
            iInterval = 5;
        } else if (iInterval < 5) {
            iInterval = 1;
        }
        iAutoPostInterval = iInterval;
        // modify by ljy 20120629 1000为1秒,乘以60才是分钟
        autoPostHandle = setTimeout(autoPostAction, iAutoPostInterval * 1000 * 60);
    };

    /**
     * 停止自动提交功能
     */
    this.stopAutoPostAction = function () {
        clearTimeout(autoPostHandle);
        autoPostHandle = 0;
    };

    this.doErrorEvent = function (errorMsg) {
        doErrorEvent(errorMsg);
    };

    /**
     * 自动提交用户行为定时器执行共
     */
    function autoPostAction() {
        if (!bIsPosting) {
            $Self.postActions();
        }
        autoPostHandle = setTimeout(autoPostAction, iAutoPostInterval * 1000 * 60);
    }

    /*
     * 外部提交
     * */
    function postOuterAction(ao) {
        if (KGP.USER_ACTION_URL) {
            for (var i = 0; i < ao.length; i++) {
                var a = ao[i];
                var p = [a.action, a.version, a.time, a.page, a.title, a.element, a.data];
                var img = new Image;
                img.src = encodeURI(KGP.USER_ACTION_URL + "?p=" + p.join(","));
            }
        }
    }
    ;
    /**
     * 手动提交用户行为到服务器
     * @param bAsync 是否异步请求，默认true
     * @param bCallback 是否回调，默认true（不回调）
     */
    this.postActions = function (bAsync, bCallback) {
        if (aoActions.length === 0) return;
        if (KGP.USER_ACTION_TYPE == 1) {
            postOuterAction(aoActions);
            aoActions = [];
            return;
        }
        if (arguments.length < 1)
            bAsync = true;
        if (arguments.length < 2)
            bCallback = true;
        try {
            // 如果正在提交则取消
            if (bIsPosting)
                return;
            else
                bIsPosting = true;
            // 准备数据
            var oParam = {};
            for (var i = 0; i < aoActions.length; i++) {
                oParam["paramList[" + i + "].action"] = aoActions[i].action;
                oParam["paramList[" + i + "].data"] = aoActions[i].data;
                oParam["paramList[" + i + "].element"] = aoActions[i].element;
                oParam["paramList[" + i + "].mouseX"] = aoActions[i].mouseX;
                oParam["paramList[" + i + "].mouseY"] = aoActions[i].mouseY;
                oParam["paramList[" + i + "].title"] = aoActions[i].title;
                oParam["paramList[" + i + "].page"] = aoActions[i].page;
                oParam["paramList[" + i + "].search"] = aoActions[i].search;
                oParam["paramList[" + i + "].time"] = aoActions[i].time;
                oParam["paramList[" + i + "].pagetype"] = aoActions[i].pagetype;
                oParam["paramList[" + i + "].version"] = aoActions[i].version;
                aoActions[i].postFlag = true;
            }
            if (bCallback) {//页面离开不再回调，免得资源被释放，回调方法不存在
                Ajax.request("postUserAction.do", oParam, null, bAsync, null, false);
            } else {
                Ajax.request("postUserAction.do", oParam, function (ajaxResult) {
                    // 提交成功则删除aoActions中已提交的数据
                    if (ajaxResult.isSuccess()) {
                        for (var i = aoActions.length - 1; i >= 0; i--) {
                            if (aoActions[i].postFlag)
                                aoActions.pop();
                        }
                    }
                }, bAsync, null, false);
            }
        } catch (e) {
            KDlg.except("postActions", e);
        }
        bIsPosting = false;
    };

    /**
     * 检查当前点击页面操作是否要记录,需要记录返回true，否则返回false
     * 该过程允许在子类中被覆盖
     * @param event 单击事件对象
     * @return true/false
     */
    this.filterEvent = function (event) {
        // 如果点击的目标元素没有onclick处理事件则不处理
        if (event.type === "click") {
            // modify by ljy 判断是否有click事件
            if (!$(event.target).data("events"))
                return false;
            if (!$(event.target).data("events")["click"])
                return false;
            return true;
        } else {
            return true;
        }
    };

    /**
     * 初始化body元素监听用户行为事件,
     * 目前监控的事件包括：
     * click，change，focusin，focusout，error
     */
    function initBodyListenEvent() {
        // 监听页面错误
        // modify by ljy 20120627 ===的优先级大于&,需要加括号
        if ((KGP.USER_ACTION_LEVEL & 4) === 4) {
            $("body").error(doErrorEvent);
        }
        // 监听页面元素获得焦点事件
        if ((KGP.USER_ACTION_LEVEL & 8) === 8) {
            $("body").focus(doBodyListenEvent);
        }
        // 监听页面元素单击事件
        if ((KGP.USER_ACTION_LEVEL & 16) === 16) {
            $("body").click(doBodyListenEvent);
        }
    }

    /**
     * 点击页面处理过程，用于记录用户操作
     * @param event 单击事件对象
     */
    function doBodyListenEvent(event) {
        if (!event)
            event = window.event;

        if (!bStopRecord && $Self.filterEvent(event)) {
            var o = new UserAction(event);
            aoActions.push(o);
        }
    }

    /**
     * 页面错误事件处理过程
     * @param sMessage 错误信息
     */
    function doErrorEvent(sMessage) {
        if (bStopRecord) return;

        var o = new UserAction(null);
        o.action = _ACT_ERROR;
        o.data = sMessage;
        aoActions.push(o);
    }

    /**
     * 用户行为类，封装用户的一个操作行，该类对象存放在aoActioins变量中
     */
    function UserAction(oEvent) {
        // 用户动作标识
        this.action = _ACT_UNDEFINE;
        // 用户动作描述
        this.actionName = "";
        // 用户操作的元素
        this.element = "";
        // 用户操作时，鼠标指针位置:X
        this.mouseX = "";
        // 用户操作时，鼠标指针位置:Y
        this.mouseY = "";
        if (oEvent !== null) {
            this.mouseY = oEvent.clientY;
            this.mouseX = oEvent.clientX;
            if (oEvent.type === "click") {
                this.action = _ACT_CLICK;
                this.actionName = "单击";
            } else if (oEvent.type === "focus") {
                this.action = _ACT_FOCUS;
                this.actionName = "焦点";
            }
            var oTarget;
            if (oEvent.target) {
                oTarget = oEvent.target;
            } else if (oEvent.srcElement) {
                oTarget = oEvent.srcElement;
            } else {
                oTarget = null;
            }

            if (oTarget) {
                this.element = oTarget.localName;
                if (oTarget.id != "") {
                    this.element += "#" + oTarget.id;
                }
            }
        }
        // 用户操作的元素的数据内容
        this.data = "";
        // 用户操作的页面(只读)
        this.page = location.pathname;
        // 用户操作的页面参数(只读)
        this.search = location.search.replace(/&/g, "|").replace("?", "");
        // 页面标题(只读)
        this.title = document.title;
        // 用户操作时时间(只读)
        function LZ(x) {
            return(Number(x) < 0 || Number(x) > 9 ? "" : "0") + x;
        }

        var d = new Date();
        this.time = d.getFullYear() + "" + LZ(d.getMonth() + 1) + "" + LZ(d.getDate()) + "" +
            LZ(d.getHours()) + "" + LZ(d.getMinutes()) + "" + LZ(d.getSeconds());
        //页面类型（菜单）

        if (window != window.top && top._KUC) {
            this.pagetype = KUC.getCacheData("menuid");
            this.version = KUC.getCacheData("FrameVersion");
        } else {
            this.pagetype = $.getCookie("menuid");
            this.version = $.getCookie("FrameVersion");
        }
        // 提交标志，false-未提交，true-已提交或正在提交
        this.postFlag = false;

        // 输出为数值JSOON对象(只读)，用于提交服务器
        this.toObject = function () {
            return {
                action: this.action,
                page: this.page,
                title: this.title,
                search: this.search,
                element: this.element,
                data: this.data,
                mouseX: this.mouseX,
                mouseY: this.mouseY,
                time: this.time
            };
        };
    }

    /**
     * 动态加载javascript文件
     * @param url
     * @returns string
     */
    function includeScript(url) {
        var scriptTag = $("script[src=\"" + url + "\"]");
        if ((scriptTag.length || "") !== "0") {
            var head = $("head")[0];
            scriptTag = document.createElement("script");
            scriptTag.setAttribute("src", url);
            scriptTag.setAttribute("type", "text/javascript");
            head.appendChild(scriptTag);
        }
        return scriptTag;
    }

    /**
     * 动态加载javascript文件
     * @param url
     * @returns string
     */
    function includeCSS(url) {
        var linkTag = $("link[href=\"" + url + "\"]");
        if ((linkTag.length || "") !== "0") {
            var head = $("head")[0];
            linkTag = document.createElement("link");
            linkTag.setAttribute("href", url);
            linkTag.setAttribute("type", "text/css");
            linkTag.setAttribute("rel", "stylesheet");
            linkTag.setAttribute("media", "all");
            head.appendChild(linkTag);
        }
        return linkTag;
    }

    // 页面错误处理
    function onPageError(sMessage, sUrl, sLine) {
        return false;
    }

    // 鼠标右键
    function onPageMouseClick() {
        return false;
    }

    // 键盘事件
    function onPageKeyDown(event) {
        var e = event || window.event;
        var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        var srcElement = e.srcElement || e.target;
        if (srcElement.getAttribute("readonly")) {
            return false;
        }
        var type = srcElement.type;
        //屏蔽回车和backspace
        if ((keyCode == 8) && (type != 'text' && type != 'textarea' && type != 'password')) {
            return false;
        }
        //屏蔽 Alt+ 方向键 ← ,Alt+ 方向键 →
        if ((e.altKey) && ((keyCode == 37) || (keyCode == 39))) {
            return false;
        }
        //屏蔽 F5 刷新键 ,Ctrl + R
        if ((keyCode == 116) || (e.ctrlKey && keyCode == 82)) {
            keyCode = 0;
            return false;
        }
        //屏蔽F11/F12
        if (keyCode == 122 || keyCode == 123) {
            keyCode = 0;
            return false;
        }
        if (e.ctrlKey && keyCode == 78) return false;  //屏蔽 Ctrl+n
        if (e.shiftKey && keyCode == 121)return false; //屏蔽 shift+F10
        if (srcElement.tagName == "A" && e.shiftKey)   //屏蔽 shift 加鼠标左键新开一网页
            return false;

        //屏蔽Alt+F4
        if ((e.altKey) && (keyCode == 115)) {
            window.showModelessDialog("about:blank", "", "dialogWidth:1px;dialogheight:1px");
            return false;
        }
    }
}

/**
 * 加载Javascript页面控制类，首先继承于<p>KfitPageBase</p>类，然后在当前窗口中创建该类的对象实例：o+类名，
 * 并将该对象的<p>initialize</p>方法设置到页面的<p>onload</p>事件中，<p>initialize</p>方法设置
 * 到页面的<p>onunload</p>事件中.
 * @param sJsClassName
 * @returns 创建的页面控制对象
 */
function loadJsPageClass(sJsClassName) {
    // 设置页面控制类继承于KfitPageBase基类
    eval(sJsClassName + ".prototype = new KfitPageBase();");
    eval(sJsClassName + ".prototype.constructor = " + sJsClassName + ";");

    var ojbReturn = null;
    try {
        // 创建页面控制对象
        var sVarName = "o" + sJsClassName;
        ojbReturn = eval("window." + sVarName + " = new " + sJsClassName + "();");

        // 关联界面加载处理事件

        $(document).ready(function () {
            try {
                ojbReturn['initialize']();
                ojbReturn['initElement']();
                ojbReturn['initCSS']();
                if (KGP.USER_ACTION_AUTO_POST > 0) {// 全部加载后启动自动提交功能
                    ojbReturn['startAutoPostAction'](KGP.USER_ACTION_AUTO_POST);
                } else {
                    ojbReturn['postActions'](true, false);
                }
            } catch (e) {
                if ((KGP.USER_ACTION_LEVEL & 4) === 4) {
                    ojbReturn['doErrorEvent']("初始化[" + sVarName + "]失败：" + e.message);
                    ojbReturn['postActions'](true, false);
                }
                KDlg.except("初始化[" + sVarName + "]失败：", e);
            }
        });

        // 关联界面卸载处理事件
        $(window).unload(function () {
            try {
                eval(sVarName + ".finalize();" + sVarName + " = null;");
            } catch (e) {
                KDlg.except("释放[" + sVarName + "]失败：", e);
            }
        });
    } catch (e) {
        ojbReturn = null;
        KDlg.except("加载[" + sJsClassName + ".js]失败：", e);
    }
    return ojbReturn;
}

/**
 * <p>页面document元素操作函数封装对象</p>
 */
var KDom = {
    /**
     * 显示/隐藏指定的标识的元素
     * @param sElementId 元素的id
     * @param bShow true-显示,false-隐藏
     */
    display: function (sElementId, bShow) {
        var node = document.getElementById(sElementId);
        if (node != null) {
            if (bShow) {
                if (node.style.display == "none")
                    node.style.display = "";
            } else {
                if (node.style.display != "none")
                    node.style.display = "none";
            }
        }
    },

    /**
     * 使指定标识的元素无效或有效
     * @param sElementId 元素的id
     * @param bDisabled true-无效,false-有效
     */
    disabled: function (sElementId, bDisabled) {
        if (bDisabled)
            $("#" + sElementId).attr("disabled", true);
        else
            $("#" + sElementId).removeAttr("disabled");
    },

    getAttribeString: function (nSrcElement, aExcludeAttrs) {
        var sAttribe = "";
        $.each(nSrcElement.attributes, function (index, oAttribe) {
            if (!aExcludeAttrs || !(oAttribe.name in aExcludeAttrs))
                sAttribe += " " + oAttribe.name + "='" + oAttribe.value + "'";
        });
        return sAttribe;
    },

    /**
     * 向下拉选择框中添加选择项
     * @param sSelectId 下拉选择框元素标识
     * @param dataList 数据列表，可以一维数组对象或ListMap
     * @param sTextPropName 选项text属性的取值属性名称
     * @param sValuePropName 选项value属性的取值属性名称
     * @param bClearItems 是否清除旧选项
     * @param vDefaultValue 默认选择值，如果是number类型则为索引，string类型为选择的value
     */
    addSelectOption: function (sSelectId, dataList, aTextPropName, aValuePropName, bClearItems, vDefaultValue) {
        // 获取数据
        function getValues(oData, aProName) {
            var sExt = "";
            var sValue = oData[aProName[0]];
            for (var i = 1; i < aProName.length; i++) {
                sExt += oData[aProName[i]] + " ";
            }
            if (aProName.length > 1)
                sValue = "[" + sValue + "]" + jQuery.trim(sExt);
            return sValue;
        }

        // 获取下拉元素对象
        var select = document.getElementById(sSelectId);
        if (KGF.isEmpty(select)) return;
        // 清除旧
        if (bClearItems) {
            this.clearSelectOption(sSelectId, false);
        }

        var defaultItem = null;
        if (arguments.length > 5) {
            if (typeof(arguments[5]) === "number") {
                defaultItem = arguments[5];
            } else if (typeof(arguments[5]) === "string") {
                defaultItem = arguments[5];
            }
        } else if (arguments.length == 4) {
            bClearItems = false;
        } else if (arguments.length == 3) {
            aValuePropName = ["key"];
        } else if (arguments.length == 2) {
            aTextPropName = ["value"];
            aValuePropName = ["key"];
        }

        var option, text, value;
        if (dataList instanceof ListMap) {
            var iCount = dataList.count();
            for (var i = 0; i < iCount; i++) {
                text = getValues(dataList.items(i), aTextPropName);
                value = getValues(dataList.items(i), aValuePropName);
                option = new Option(text, value);
                if (defaultItem === i || defaultItem === value) {
                    option.selected = true;
                }
                select.options.add(option);
            }
        } else if (dataList instanceof Array) {
            var iCount = dataList.length;
            for (var i = 0; i < iCount; i++) {
                text = getValues(dataList[i], aTextPropName);
                value = getValues(dataList[i], aValuePropName);
                option = new Option(text, value);
                if (defaultItem === i || defaultItem === value) {
                    option.selected = true;
                }
                select.options.add(option);
            }
        }
    },

    /**
     * 为下拉列表元素添加一个选择项
     * @param {string} sElementId 元素标识
     * @param {string} sValue 选择值
     * @param {string} sText 选项名称
     */
    addSelectOneOption: function (sElementId, sValue, sText) {
        var select = document.getElementById(sElementId);
        if (!KGF.isEmpty(select)) {
            var option = new Option(sText, sValue);
            select.options.add(option);
        }
    },

    /**
     * 清除下拉选择框选项
     * @param sSelectId 下拉选择框元素标识
     */
    clearSelectOption: function (sSelectId, bAddTopItem) {
        // 获取下拉元素对象
        var select = document.getElementById(sSelectId);
        if (KGF.isEmpty(select)) return;

        select.innerHTML = "";
        if (bAddTopItem) {
            var option = new Option(KGP.TOP_ITEM_TEXT, "");
            option.selected = true;
            select.options.add(option);
        }
    },

    /**
     * 获取Select元素选中条目的Text值（不是Value）
     * @param sSelectId
     * @returns string
     */
    getSelectText: function (sSelectId) {
        var o = document.getElementById(sSelectId);
        return KGF.isEmpty(o) ? "" : o.options[o.selectedIndex].text;
    },

    /**
     * 获取Radio元素组中选中的选项值
     * @param sRadioName Radio元素组名称
     * @returns boolean
     */
    getRadioValue: function (sRadioName) {
        var obj = document.getElementsByName(sRadioName);
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].checked) {
                return obj[i].value;
            }
        }
        return undefined;
    },

    /**
     * 设置元素的innerHTML
     * @param sElementId
     * @param sHtml
     */
    setInnerHtml: function (sElementId, sHtml) {
        $("#" + sElementId).html(sHtml);
    },

    /**
     * 转换金额为大写，并显示到指定的元素内
     * @param sId 显示大写元素标识
     * @param fNumber 金额
     * @param sSuffix 显示后缀
     */
    showCapitalRMB: function (sElementId, fNumber, sSuffix) {
        if (KGF.isEmpty(fNumber)) return;

        var $Obj = jQuery("#" + sElementId);
        if (KGF.isEmpty($Obj)) return;

        var sCapital = KGF.capitalRMB(fNumber, sSuffix);
        if (Number(fNumber) > 0 && !KGF.isEmpty(sCapital)) {
            $Obj.html(sCapital);
            $Obj.css("color", "#FF3300");
        } else {
            $Obj.html("");
            $Obj.css("color", "red");
        }
    },

    /**
     * 转数字转换为大写，并显示到指定的元素内
     * @param sId 显示大写元素标识
     * @param fNumber 份额
     * @param sSuffix 显示后缀
     */
    showCapitalShare:function (sElementId, fNumber, sSuffix) {
        if (KGF.isEmpty(fNumber)) return;

        var $Obj = jQuery("#" + sElementId);
        if (KGF.isEmpty($Obj)) return;

        var sCapital = KGF.capitalShare(fNumber, sSuffix);
        if (Number(fNumber) > 0 && !KGF.isEmpty(sCapital)) {
            $Obj.html(sCapital);
            $Obj.css("color", "#FF3300");
        } else {
            $Obj.html("");
            $Obj.css("color", "red");
        }
    },
    /**
     * 显示金额输入限制信息到指定的元素内
     * @param sElementId 显示信息的元素标识
     * @param fMin 最小金额
     * @param fMax 最大金额
     * @param sUnit 金额单位（元、份）
     * @param sBizType 业务操作类型（申购、认购。。）
     */
    showAmountRangeMsgByDC: function (sElementId, fMin, fMax, sUnit, sBizType) {
        var sMsg = "", sMax, sMin, min, max;
        if (typeof(fMin) == "string") {
            sMin = fMin;
            while (sMin.indexOf(",") != -1) {
                sMin = sMin.replace(",", "");
            }
            min = Number(sMin);
        } else {
            min = fMin;
        }
        if (typeof(fMax) == "string") {
            sMax = fMax;
            while (sMax.indexOf(",") != -1) {
                sMax = sMax.replace(",", "");
            }
            max = Number(sMax);
        } else {
            max = fMax;
        }
        if (min >= 0) {
            sMsg = fMin + sUnit;
        }
        if (!KGF.isEmpty(sElementId)) {
            KDom.display(sElementId, true);
            document.getElementById(sElementId).innerHTML = sMsg;
            $("#" + sElementId).css("color", "black");
        }
        return sMsg;
    },
    /**
     * 显示金额输入限制信息到指定的元素内
     * @param sElementId 显示信息的元素标识
     * @param fMin 最小金额
     * @param fMax 最大金额
     * @param sUnit 金额单位（元、份）
     * @param sBizType 业务操作类型（申购、认购。。）
     */
    showAmountRangeMsgByDCNew: function (sInputId, sElementId, fMin, fMax, sUnit, sBizType) {
        var sMsg = "", sMax, sMin, min, max;
        if (typeof(fMin) == "string") {
            sMin = fMin;
            while (sMin.indexOf(",") != -1) {
                sMin = sMin.replace(",", "");
            }
            min = Number(sMin);
        } else {
            min = fMin;
        }
        if (typeof(fMax) == "string") {
            sMax = fMax;
            while (sMax.indexOf(",") != -1) {
                sMax = sMax.replace(",", "");
            }
            max = Number(sMax);
        } else {
            max = fMax;
        }
        if (min >= 0) {
            if (max > min) {
                sMsg = sBizType + "范围(" + fMin + " " + sUnit + "~" + fMax + " " + sUnit + ")";
                if (min == 0) sMsg = sMsg + "(不含0)";
            } else {
                sMsg = sBizType + "起点为：" + fMin + " " + sUnit;
            }
        }
        $("#" + sInputId).val(min +sUnit +"起");
        $("#" + sInputId).css("color", "gray");
        if (!KGF.isEmpty(sElementId)) {
            KDom.display(sElementId, true);
            document.getElementById(sElementId).innerHTML = sMsg;
            $("#" + sElementId).css("color", "black");
        }
        return sMsg;
    },
    /**
     * 显示金额输入限制信息到指定的元素内
     * @param sElementId 显示信息的元素标识
     * @param fMin 最小金额
     * @param fMax 最大金额
     * @param sUnit 金额单位（元、份）
     * @param sBizType 业务操作类型（申购、认购。。）
     */
    showAmountRangeMsg: function (sElementId, fMin, fMax, sUnit, sBizType) {
        var sMsg = "", sMax, sMin, min, max;
        if (typeof(fMin) == "string") {
            sMin = fMin;
            while (sMin.indexOf(",") != -1) {
                sMin = sMin.replace(",", "");
            }
            min = Number(sMin);
        } else {
            min = fMin;
        }
        if (typeof(fMax) == "string") {
            sMax = fMax;
            while (sMax.indexOf(",") != -1) {
                sMax = sMax.replace(",", "");
            }
            max = Number(sMax);
        } else {
            max = fMax;
        }
        if (min >= 0) {
            if (max > min) {
                sMsg = sBizType + "范围(" + fMin + " " + sUnit + "~" + fMax + " " + sUnit + ")";
                if (min == 0) sMsg = sMsg + "(不含0)";
            } else {
                sMsg = sBizType + "起点为：" + fMin + " " + sUnit;
            }
        }
        if (!KGF.isEmpty(sElementId)) {
            KDom.display(sElementId, true);
            document.getElementById(sElementId).innerHTML = sMsg;
            $("#" + sElementId).css("color", "black");
        }
        return sMsg;
    },

    /**
     * 检查金额输入限制,并显示提示信息到指定的元素内
     * @param fAmount 金额输入
     * @param fMin 最小金额
     * @param fMax 最大金额
     * @param sUnit 金额单位（元、份）
     * @param sBizType 业务操作类型（申购、认购。。）
     * @param sErrMsgId 显示错误信息的元素标识
     */
    checkAmountLimit: function (fAmount, fMin, fMax, sBizType, sErrMsgId, sUnit) {
        if (KGF.isEmpty(sUnit)) {
            sUnit = "元";
        }
        var sErrMsg = "", bReturn = true;
        // 非数字
        if (fAmount == "" || !Number(fAmount)) {
            sErrMsg = '交易金额格式非法。';
            bReturn = false;
        } else {
            var fTempAmount = Number(fAmount);
            // 检查小数点位数
            var i = (fAmount.toString()).indexOf('.');
            if (i >= 0) {
                i = (fAmount.toString()).substring(i + 1, fAmount.toString().length);
                if (i.length >= 3) {
                    sErrMsg = '交易金额错误，小数点位数不应超过2位';
                    bReturn = false;
                }
            }
            // 检查最大值和最小值
            if (bReturn) {
                if (fTempAmount < Number(fMin)) {
                    sErrMsg = "交易金额错误，该基金" + sBizType + "起点为：" + fMin + sUnit;
                    bReturn = false;
                } else if (fTempAmount > Number(fMax)) {
                    sErrMsg = "交易金额错误，该基金" + sBizType + "上限为：" + fMax + sUnit;
                    bReturn = false;
                }
            }
        }
        if (!KGF.isEmpty(sErrMsgId)) {
            document.getElementById(sErrMsgId).innerHTML = sErrMsg;
        }
        if (!bReturn) {
            $("#" + sErrMsgId).css('color', 'red');
        }
        return bReturn;
    },

    /**
     * 设置买入基金时的支付方式，将支付方式显示到指定元素sElementId中，
     * @param sElementId 显示支付方式的元素标识
     * @param fnsPayWayChangeEventName 支付方式选择改变时的处理方法，该处理方法入参为选择项Id
     * @param defaultValu 默认选择项的值
     * @returns 返回默认选择项的元素标识
     */
    setBuyPayWay: function (sElementId, fnsPayWayChangedEventName, defaultValu, aParams) {
        // 检查是否支持选择支付方式
        if (!KGP.BUY_SUPPORT_WAY) return "";

        var sReturn = "";
        var i, o, sId, sKey, sName, j;
        var sText = "", fnsDoFunc = "";
        var iCount = KGD.PayWay.count();
        var bHasEventFunc = !KGF.isEmpty(fnsPayWayChangedEventName);

        // 支付方式改变处理过程
        if (bHasEventFunc) {
            i = fnsPayWayChangedEventName.indexOf("(");
            if (i >= 0) {
                fnsPayWayChangedEventName = fnsPayWayChangedEventName.substring(0, i);
            }
            if (!KGF.isEmpty(fnsPayWayChangedEventName)) {
                fnsPayWayChangedEventName = "onclick='javascript:" + fnsPayWayChangedEventName;
            }
        }

        // 输出支付方式
        for (i = iCount - 1; i >= 0; i--) {
            o = KGD.PayWay.items(i);
            sKey = o[KGD.PayWay.getKeyName()];
            if (aParams != null && aParams != undefined) {
                var bSign = false;
                for (j = 0; j < aParams.length; j++) {
                    if (aParams[j] == sKey) {
                        bSign = true;
                        break;
                    }
                }
                if (bSign)
                    continue;
            }
            // 判断是否支持该类支付方式
            if ((KGC.PW_BankCard === sKey && KGP.BUY_SUPPORT_BANK_CARD) || // 银行卡支付
                (KGC.PW_MoneyFund === sKey && KGP.BUY_SUPPORT_MONEY_FUND) || // 货币基金支付
                (KGC.PW_Remit === sKey && KGP.BUY_SUPPORT_REMIT))             // 汇款支付
            {
                sName = o[KGD.PayWay.getValueName()];
                sId = KGC.GO_PayWay + sKey;
                if (bHasEventFunc) {
                    fnsDoFunc = fnsPayWayChangedEventName + "(\"" + sId + "\");'";
                }
                sText += "<div>"
                    + "<input id='" + sId + "' name='" + KGC.GO_PayWay + "' type='radio' value='" + sKey + "' " + fnsDoFunc + "/>"
                    + "<label for='" + sId + "'>" + sName + "</label>"
                    + "</div>";
                if (sReturn == "" && (sKey == defaultValu || i == defaultValu)) {
                    sReturn = sId;
                }
            }

        }
        document.getElementById(sElementId).innerHTML = sText;
        return sReturn;
    },

    /**
     * 通过表单提交指定参数到指定的Action
     * @param sFormId 表单标识，如果为空则创建默认表单
     * @param sAction 提交的动作或页面
     * @param oParams 提交的参数列表(ListMap)
     * @param bTarget 指定弹出窗口位置
     * @param bAutoPost 是否自动提交
     * @param bParamPrefix 是否加参数前缀,true则加上param
     */
    initPostForm: function (sFormId, sAction, oParams, bTarget, bAutoPost, bParamPrefix) {
        var oForm = null;
        bParamPrefix = bParamPrefix || "";
        var bIsDefault = KGF.isEmpty(sFormId);
        try {
            var bNew = false;
            if (bIsDefault) {
                sFormId = "postForm000";
            }
            // 创建表单
            oForm = document.getElementById(sFormId);
            if (KGF.isEmpty(oForm)) {
                oForm = document.createElement("form");
                oForm.id = sFormId;
                bNew = true;
            }
            oForm.method = "post";

            // 独立窗口中显示
            if (!bTarget) {
                oForm.target = "_self";
            } else if (bTarget && typeof bTarget == "boolean") {
                oForm.target = "_blank";
            } else {
                oForm.target = bTarget;
            }
            oForm.action = sAction;
            // 创建表单输入项
            var i, element, sName, oParam;
            if (oParams) {
                var sKeyName = oParams.getKeyName();
                var sValueName = oParams.getValueName();
                for (i = 0; i < oParams.count(); i++) {
                    oParam = oParams.items(i);
                    if (bParamPrefix == "false")
                        sName = oParam[sKeyName];
                    else
                        sName = "param." + oParam[sKeyName];
                    element = oForm[sName];
                    if (element == null) {
                        element = document.createElement("input");
                        element.type = "hidden";
                        element.name = sName;
                        oForm.appendChild(element);
                    }
                    element.value = oParam[sValueName];
                }
            }
            if (bNew) {
                document.body.appendChild(oForm);
            }
            if (bAutoPost) {
                oForm.submit();
            }
        } catch (e) {
            KDlg.except("初始化表单失败：", e);
        }
        // 如果是自动创建的则自动释放
        if (bIsDefault && oForm != null) {
            document.body.removeChild(oForm);
        }
    },

    /**
     * 显示操作步骤信息到指定元素中
     * @param {array} aStep 操作步骤数组
     * @param {int} iCurrentIndex 当前操作步骤在aStep中的索引位置，从0开始
     * @param {string} sElementId 元素标识,可选，如果省略则默认名称：operateStep
     */
    showOperateStep: function (aStep, iCurrentIndex, sElementId, bInsertSpan) {
        if (sElementId == null) {
            sElementId = "operateStep";
        }
        var oNode = document.getElementById(sElementId);
        if ($.isEmptyObject(oNode)) return;
        oNode = $("#" + sElementId);
        if ($.isArray(aStep) && aStep.length > 0) {
            try {
                iCurrentIndex = iCurrentIndex || 0;
                var sTemplate = "<td class='%s'>%s</td>";
                if (bInsertSpan) {
                    sTemplate = "<td><span class='%s'>%s</span></td>";
                }

                var sHtml = sTemplate.format([((iCurrentIndex == 0) ? "operate-step-current" : "operate-step"), aStep[0]]);
                //sTemplate = "<span></span>" + sTemplate;
                for (var i = 1; i < aStep.length; i++) {
                    sHtml += sTemplate.format([((iCurrentIndex == i) ? "operate-step-current" : "operate-step"), aStep[i]]);
                }
                oNode.append(sHtml);
            } catch (e) {
                KDlg.except("showOperateStep", e, arguments);
            }
        }

        //步骤的样式显示

        var ilen = $('#' + sElementId).children().length;
        var sElementType = 'td';
        if (bInsertSpan) {
            sElementType = 'span';
        }

        $('#' + sElementId + ' ' + sElementType + ':first').removeClass();
        $('#' + sElementId + ' ' + sElementType + ':last').removeClass();
        if (iCurrentIndex == 0) {
            $('#' + sElementId + ' ' + sElementType + ':first').addClass('first-current');
            $('#' + sElementId + ' ' + sElementType + ':last').addClass('last');
        } else if (iCurrentIndex == (ilen - 1)) {
            $('#' + sElementId + ' ' + sElementType + ':first').addClass('first');
            $('#' + sElementId + ' ' + sElementType + ':last').addClass('last-current');
        } else {
            $('#' + sElementId + ' ' + sElementType + ':first').addClass('first');
            $('#' + sElementId + ' ' + sElementType + ':last').addClass('last');
        }
    },

    /**
     * 根据SHARE_TYPE_DISPALY_WAY参数设置收费方式下拉列表。
     * @param {string} sParentElementId 下拉列表父元素标识
     * @param {string} sElementId 下拉列元素标识
     * @param {string} sShareClasses 支持的所有收费类型
     * @param {string} sShareType 收费类型
     */
    showShareType: function (sParentElementId, sElementId, sShareClasses, sShareType) {
        var sWay = KGP.SHARE_TYPE_DISPALY_WAY;  //3
        if (sWay === KGC.STDW_None) {            // 不显示收费类型  0
            KDom.display(sParentElementId, false);
        } else if (sWay === KGC.STDW_Before) {    // 收费类型按前收费显示  1
            KDom.addSelectOneOption(sElementId, KGC.ST_Before, KGD.ShareType.get(KGC.ST_Before));
            KDom.disabled(sElementId, true);
        } else if (sWay === KGC.STDW_After) {        // 收费类型按后收费显示 2
            KDom.addSelectOneOption(sElementId, KGC.ST_After, KGD.ShareType.get(KGC.ST_After));
            KDom.disabled(sElementId, true);
        } else if (sWay === KGC.STDW_Support) {    // 显示支持的收费类型 3
            var iDisable = 0;
            sShareClasses = sShareClasses || "";
            if (sShareClasses == "" || sShareClasses == "--")
                sShareClasses = sShareType;
            if (sShareClasses.indexOf(KGC.ST_Before) > -1) {   //前收费
                KDom.addSelectOneOption(sElementId, KGC.ST_Before, KGD.ShareType.get(KGC.ST_Before));
                iDisable++;
            }
            if (sShareClasses.indexOf(KGC.ST_After) > -1) {   //后收费
                KDom.addSelectOneOption(sElementId, KGC.ST_After, KGD.ShareType.get(KGC.ST_After));
                iDisable++;
            }
            KDom.disabled(sElementId, iDisable < 2);        //设置下拉选择框无效
        }
    },

    /**
     * 根据BUY_ADD_BANK_CARD参数，显示添加银行卡连接
     * @param {string} sElementId 显示连接的元素标识
     * @param {string} sPrefix 修改银行卡的文学
     */
    showAddBankCardLink: function (sElementId, sPrefix) {
        var sHtml = "";
        if (KGP.BUY_ADD_BANK_CARD) {
            var url = KGF.getRootPath() + "/page/bankChannel/addBank/AddBank1.html";
            sHtml = "<a class='font-link' href='" + url + "'>添加银行卡</a>";
        } else {
            sHtml = "";
        }
        $("#" + sElementId).html(sHtml);
    }
};

/**
 * <p>系统页面样式方法封装对象</p>
 * 该对象组织页面元素样式的设置方法，注意：页面特有的设置不要放入该对象
 */

var KCss = {
    twoColorTable: function (sTableId, sOddClass, sEvenClass) {
        var id = sTableId;
        var odd = oddClass;
        var even = evenClass;
        $('#' + id + ' tr:odd').addClass(odd);
        $('#' + id + ' tr:even').addClass(even);
    },

    /**
     * 三列表格内容排版
     * @param {string} sTableClass表格样式名称
     * @param {string} sTd1Class表格第一列样式
     * @param {string} sTd2Class表格第二列样式
     * @param {string} sTd3Class表格第三列样式
     */
    tableSettypeForThree: function (sTableClassName, sTd1Class, sTd2Class, sTd3Class) {
        var sclassName = sTableClassName;
        var td1 = sTd1Class;
        var td2 = sTd2Class;
        var td3 = sTd3Class;
        $('.' + sclassName + ' tr td:nth-child(1)').addClass('textalign-right ' + td1);
        $('.' + sclassName + ' tr td:nth-child(2)').addClass('textalign-left ' + td2);
        $('.' + sclassName + ' tr td:nth-child(3)').addClass('textalign-left ' + td3);
    },
    /**
     * 二列表格内容排版
     * @param {string} sTableClass表格样式名称
     * @param {string} sTd1Class表格第一列样式
     * @param {string} sTd2Class表格第二列样式
     */
    tableSettypeForTwo: function (sTableClassName, sTd1Class, sTd2Class) {
        var sclassName = sTableClassName;
        var td1 = sTd1Class;
        var td2 = sTd2Class;
        $('.' + sclassName + ' tr td:nth-child(1)').addClass('textalign-right ' + td1);
        $('.' + sclassName + ' tr td:nth-child(2)').addClass('textalign-left ' + td2);
    },

    /**
     * 表格列内容排版
     * @param {string} sTableClass表格样式名称
     * @param {array}  aTdListClass表格格列样式
     */
    tableSettype: function (sTableClass, aTdListClass) {
        var $table = $('.' + sTableClass);
        var sLength = aTdListClass.length;
        var sTrLength = $table.find('tr').length;
        if (sLength < 1) {
            return;
        } else {
            for (var k = 0; k < sTrLength; k++) {
                var $tr = $table.find('tr').eq(k);
                for (var i = 0, j = 0; i < sLength; i++, j++) {
                    var dis = $tr.find('td').eq(j).css('display');
                    if (dis == 'none') {
                        i = i - 1;
                    } else {
                        $tr.find('td').eq(j).addClass(aTdListClass[i]);
                    }
                }
            }
        }
    },

    /**
     * 数据显示列表样式，鼠标划过,鼠标点击，行样式
     * @param {string} sTableClass表格样式名称
     * 修改，点击后，行中链接无法使用
     *
     */
    tableShowDataRowHover: function () {
        $('.dataTable tbody tr').hover(
            function () {
                $(this).children().addClass('trhover');
            }, function () {
                $(this).children().removeClass('trhover');
            }

        );
    }
}

/**
 * <p>系统表格封装对象</p>
 * 创建表格装饰表格函数，该函数用到jQuery.datatable组件
 */
var KGrid = new KfitGrid();
function KfitGrid() {
    /**
     * 初始化表格，入参是一个对象[$('#table').dataTable({入参});]，主要设置属性如下：
     * -------------------------------------------------------------------
     * aaData属性：表格数据源支持2种格式：
     *         {aaData: [['d00', 'd01', 'd02'],['d10', 'd11', 'd12']]} 或
     *         {aaData: [{"name1": d00, "name2": d01, "name3": d02}, {"name1": d10, "name2": d11, "name3": d12}]}
     * -------------------------------------------------------------------
     * bPaginate属性：是否分页显示，true/false 默认：true
     * -------------------------------------------------------------------
     * sPaginationType属性：分页按钮类型，two_button / full_numbers，默认：two_button
     * -------------------------------------------------------------------
     * iDisplayLength属性：分页显示时，每页显示的数据行数
     * -------------------------------------------------------------------
     * iDisplayStart属性：分页显示时，表格中数据的初始位置，不是页数，是行号
     * -------------------------------------------------------------------
     * bLengthChange属性：是否显示选择每页显示行数的下拉选择列表，true/false 默认：true
     * -------------------------------------------------------------------
     * bFilter属性：是否显示过滤框，true/false 默认：true
     * -------------------------------------------------------------------
     * bSort属性：是否允许点击列头排序，true/false 默认：true
     * -------------------------------------------------------------------
     * aaSorting属性: 设置表格默认排序，以后用户可以更改覆盖，如以第2、3列排序（列索引从0开始）
     * {aaSorting: [[2,'asc'], [3,'desc']]}
     * -------------------------------------------------------------------
     * aaSortingFixed属性：设置表格初始排序，该排序设置后，不能再被用户更改覆盖
     * {aaSortingFixed: [[0,'asc']]}
     * -------------------------------------------------------------------
     * bSortCellsTop属性：当多表头时，点击列头排序，排序标记是否显示在上面的单元格中，true/false， 默认：false(下边)
     * -------------------------------------------------------------------
     * bSortClasses属性：是否添加样式sorting_1、sorting_2、sorting_3到排序表格列上，true/false， 默认：true
     * -------------------------------------------------------------------
     * bInfo属性：是否显示表格信息，即：oLanguage.sInfo属性的信息
     * -------------------------------------------------------------------
     * bProcessing属性：在处理数据时（如排序），是否显示处理提示信息
     * -------------------------------------------------------------------
     * bAutoWidth属性：是否允许自动计算列宽度，true/false  默认：false
     * -------------------------------------------------------------------
     * aLengthMenu属性: 分页显示时，每页显示行数下拉列表，两个数组前面是实际行数，后面是在下拉列表中显示文字
     * {[[10, 25, 50, -1], ["十行", "二十行", "五十行", "全部"]]}
     * -------------------------------------------------------------------
     * asStripeClasses属性： 设置行样式，以数组中的样式名，依次重复将样式加载到数据行上
     * {"asStripeClasses": [ 'strip1', 'strip2', 'strip3' ]}
     * -------------------------------------------------------------------
     * bDestroy属性：是否重新加载表格参数：true/false 默认：false
     * {"bFilter": false, "bDestroy": true}
     * -------------------------------------------------------------------
     * oLanguage属性：定义表格中用的文字信息，默认英文
     * -------------------------------------------------------------------
     * sScrollX属性：显示水平滚动条，指定水平滚动宽度，可以是任意CSS单位
     * {"sScrollY": "200px"}
     * -------------------------------------------------------------------
     * sScrollY属性：显示竖直滚动条，指定竖直滚动高度，可以是任意CSS单位
     * -------------------------------------------------------------------
     * sDom属性：允许添加其它元素到表格中，取值：
     *         l - 页行数选择列表        i - 表格信息
     *      f - 查找输入框            p - 分页按钮
     *      t - 表格                    r - 处理信息
     *      H - jQueryUI "header" 样式类('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')
     *      F - jQueryUI "footer" 样式类('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')
     * {"sDom": '<"top"i>rt<"bottom"flp><"clear">'}
     * -------------------------------------------------------------------
     * fnCreatedRow：function(nRow, aData, iDataIndex) 当TR元素被创建（其包含的TD也被创建）后调用，可以在该回调函数中修改元素数据
     *         function( nRow, aData, iDataIndex ) {
     *             if (aData[4] == "A")  $('td:eq(4)', nRow).html('<b>A</b>');
     *         }
     * -------------------------------------------------------------------
     * fnHeaderCallback回调函数，这些函数分别在绘制相关内容时被调用，可在这些回调函数中修改元素数据
     *         function( nHead, aData, iStart, iEnd, aiDisplay ) {
     *          nHead.getElementsByTagName('th')[0].innerHTML = "Displaying "+(iEnd-iStart)+" records";
     *      }
     * fnDrawCallback: function(oSettings){}
     * fnFooterCallback: function(nFoot, aData, iStart, iEnd, aiDisplay){}
     * fnInitComplete：function(oSettings, json){}
     * fnRowCallback：function(nRow, aData, iDisplayIndex, iDisplayIndexFull)
     * -------------------------------------------------------------------
     * sGroupCol属性：对指定列进行分组显示，string 格式：列名|列索引[:翻译数据字典]
     * -------------------------------------------------------------------
     * bSubSum属性: 是否对分组进行小计需，true/false
     * -------------------------------------------------------------------
     * bGroupCollapse属性: 是否允许折叠分组，true/false
     * *******************************************************************
     * aoColumns属性：该属性是一个对象，又包含多个属性，具体如下：
     * -------------------------------------------------------------------
     * sTitle: string 指定该列的列标题
     *         { "sTitle": "基金名称", "aTargets": [0]}
     * -------------------------------------------------------------------
     * sType: string 指定该列的数据类型，影响排序和数据显示，包括：'string', 'numeric', 'date' 和 'html'
     *         { "sType": "html", "aTargets": [0]}
     * -------------------------------------------------------------------
     * sWidth: string 定义表格列宽度，该参数可以任何CSS值（3em, 20px 等).
     *         { "sWidth": "20%", "aTargets": [0] }
     * -------------------------------------------------------------------
     * mDataProp: string|int|function|null 指定该列获取数据时从哪来读取数据
     *         { "mDataProp": "browser" },
     * -------------------------------------------------------------------
     * bUseRendered: boolean
     * -------------------------------------------------------------------
     * fnRender: function (o, val) 显示该列单元格数据时被调用，用于显示数据处理：
     *     {"fnRender": function ( o, val ){return o.aData[0] +' '+ o.aData[3];},"aTargets": [0]}
     * -------------------------------------------------------------------
     * sDefaultContent: string
     *         该列的默认值,当该列数据遇到null时，用该值替换
     *         {"mDataProp": null, "sDefaultContent": "Edit", "aTargets": [ -1 ]}
     * -------------------------------------------------------------------
     * bVisible: boolean 设置该列是否显示
     *         { "bVisible": false, "aTargets": [0] }
     * -------------------------------------------------------------------
     * bSortable: boolean 是否允许在该列上进行排序：
     *         { "bSortable": false, "aTargets": [0] }
     * -------------------------------------------------------------------
     * sClass: string 设置该列每个单元格的类名
     *         { "sClass": "my_class", "aTargets": [0] }
     * -------------------------------------------------------------------
     * sName: string 指定该列的名称，仅用于表格的服务器端处理
     *         { "sName": "engine", "aTargets": [0] },
     * -------------------------------------------------------------------
     * sSortDataType: string 定义该列排序时读取实际数据的方式：
     *         { "sSortDataType": "dom-select", "aTargets": [ 4 ] },
     * -------------------------------------------------------------------
     * fnCreatedCell: 回调函数，单元格被创建后调用,可在该函数中为单元个设置样式
     *         function (nTd, sData, oData, iRow, iCol){$(nTd).css('color', 'blue');}
     * -------------------------------------------------------------------
     * aDataSort: array 设置多列联合排序：
     *         { "aDataSort": [ 0, 1 ], "aTargets": [0] }
     * -------------------------------------------------------------------
     * asSorting: array 设置该列的初始排序方向：
     *         { "asSorting": [ "asc" ], "aTargets": [ 1 ] }
     * -------------------------------------------------------------------
     * bSearchable: boolean 是否允许在该列上进行数据过滤：
     *         { "bSearchable": false, "aTargets": [0] }
     * -------------------------------------------------------------------
     * iDataSort: int 重定向排序列，及点击该列按其他列排序
     *         { "iDataSort": 1, "aTargets": [0] }
     * -------------------------------------------------------------------
     * sContentPadding: string
     * -------------------------------------------------------------------
     * oDict: ListMap | array[object] 翻译表格列中的数据的数据源
     * -------------------------------------------------------------------
     * sKeyName：string | array[string] 数据源中的键值属性名称
     * -------------------------------------------------------------------
     * sValueName： 数据源中的返回值属性名称
     * -------------------------------------------------------------------
     * sSumType: string KGC中：SumType_Sum，SumType_Count，SumType_Avg，SumType_Min，SumType_Max，SumType_Text
     *         设置该列的统计方式
     * -------------------------------------------------------------------
     * sSumText：string
     *         当sSumType = SumType_Text时，需设置该属性
     * -------------------------------------------------------------------
     * sDisplayFormat: string
     *         格式化显示数据，支持浮点数[#.0]，日期[ymd- ymd/ ymdCN]，时间[hns:]
     *         该参数与oDict不能同时设置
     * -------------------------------------------------------------------
     * iScale: integer
     *         放缩比例，仅对数值型有效（注意：放缩时不再对原数据类型进行检查，假设是数值型），显示的数据为：原数据 * 10的iScale次幂
     * -------------------------------------------------------------------
     * 该函数不再检查传入参数的有效性，由调用者保证
     *
     * @param {string}  sTableId     表格元素的ID，必须指定
     * @param {string}  sParentId     表格所在元素（父节点）ID，当表格元素未创建时必须指定
     * @param {array}   aaDatas     在表格中显示的数据，二维数组或一维对象数组，不允许为空数组，可以是null
     * @param {array}   aoColumns     表格列定义，参考上面说明，允许为null
     * @param {object}  oOption     是否分页显示，默认不分页，允许为null
     */
    this.createGrid = function (sParentId, sTableId, aaDatas, aoColumns, oOption) {
        //检查参数，sTableId、sParentId必须传递
        if (arguments.length < 2) return null;

        // 准备参数
        var oOptions = KGrid.getDefaultParam(sParentId, sTableId);
        $.extend(oOptions, oOption);
        oOptions.aaData = aaDatas;
        oOptions.aoColumns = aoColumns;

        //检查表格是否创建，如果没创建则自动创建表格

        var $table = $("#" + sTableId);
        if (!$table || $table.length == 0) {
            $("#" + sParentId).append('<table id="' + sTableId + '" class=""></table>');
            $table = $("#" + sTableId);
        }
        //检查列定义,处理数据翻译，格式显示和数据统计设置
        var oColumn, bSum = false;
        if (aoColumns) {
            for (var i = 0; i < aoColumns.length; i++) {
                oColumn = aoColumns[i];
                // 支持显示详细信息时使用 add by ljy 20120809
                if (oColumn.bDetail) {
                    oColumn.bSortable = false;
                    oColumn.mDataProp = null;
                    oColumn.fnRender = function (o, val) {
                        return '<img name="detail_" style="cursor:pointer" title="点击查看' + oColumn.sTitle + '" src="%s">'.format(KGF.getRootPath() + "/page/common/img/jquery/details_open.png");
                    };
                    continue;
                }
                ;
                if (oColumn.oDict || oColumn.sDisplayFormat)    // 该需要翻译，设置fnCreatedCell属性
                    oColumn.fnCreatedCell = doTranslateCallback;
                if (oColumn.sSumType)
                    bSum = true;
            }
        }
        //加载数据统计回调函数
        if (bSum) {
            oOptions.fnFooterCallback = doSumDataCallback;
            // 检查有没有tfoot，没有则添加
            if ($("tfoot", $table).length == 0) {
                var sThHtml = "<th>合计：</th>";
                for (var i = 1; i < aoColumns.length; i++)
                    sThHtml += "<th></th>";
                $table.append("<tfoot><tr>" + sThHtml + "</tr></tfoot>");
            }
        }
        // 检查分组定义，分组时不能分页
        if (!oOptions.bPaginate && oOptions.sGroupCol) {
            oOptions.fnDrawCallback = doColGroupSumCallback;
        }
        oOptions.bDestroy = true;
        // 加载表格
        return $table.dataTable(oOptions);
    }

    /**
     * 显示普通表格，可以指定是否排序及默认排序列，可以指定是否分页显示及每页显示的数据行数，可以指定是否支持表格数据查找
     * @param {string}  sParentId     表格所在元素（父节点）ID，当表格元素未创建时必须指定
     * @param {string}  sTableId     表格元素的ID，必须指定
     * @param {array}   aaDatas     可选，在表格中显示的数据，二维数组或一维对象数组，不允许为空数组，
     * @param {array}   aoColumns     可选，表格列定义，参考上面说明，可选
     * @param {boolean} bCanSort    可选，是否支持点击列头排序：true/false，默认：true
     * @param {array}   aaDefaultSorting 可选，表格默认排序，bCanSort入参为true时有效，例：[[2,'asc'], [3,'desc']]-->按第2列升序第3列降序排列数据（列号从0开始）
     * @param {boolean} bPaginate    可选，表格中的数据是否分页显示：trur/false，默认：false
     * @param {integer} iRowOfPage    可选，表格分页显示数据时，每页显示数据的行数，默认：20
     * @param {boolean} bCanFilter  可选，是否支持表格数据过滤：true/false，默认：false
     */
    this.createNormalGrid = function (sParentId, sTableId, aaDatas, aoColumns, bSort, aaDefaultSorting, bPaginate, iRowOfPage, bCanFilter) {
        //检查参数，sTableId、sParentId必须传递
        if (arguments.length < 2) return null;

        var oOption = {};
        var iLen = arguments.length;
        switch (true) {
            case iLen > 4:
                oOption.bSort = bSort;
            case iLen > 5:
                oOption.aaSorting = aaDefaultSorting;
            case iLen > 6:
                oOption.bPaginate = bPaginate;
            case iLen > 7:
                oOption.iDisplayLength = iRowOfPage;
            case iLen > 8:
                oOption.bFilter = bCanFilter;
        }

        // 加载表格
        return KGrid.createGrid(sParentId, sTableId, aaDatas, aoColumns, oOption);
    }

    /**
     * 显示分组表格，可以指定是否排序及默认排序列，可以指定是否分页显示及每页显示的数据行数，可以指定是否支持表格数据查找
     * @param {string}  sParentId     表格所在元素（父节点）ID，当表格元素未创建时必须指定
     * @param {string}  sTableId     表格元素的ID，必须指定
     * @param {array}   sGroupCol    指定分组列，格式：分组列索引或数据源属性名称[:翻译数据字典名称]
     * @param {array}    aaGroupSort 分组列数据排序
     * @param {array}   aaDatas     可选，在表格中显示的数据，二维数组或一维对象数组，不允许为空数组，
     * @param {array}   aoColumns     可选，表格列定义，参考上面说明，可选
     * @param {boolean} bGroupCollapse 可选，是否允许折叠分组数据行，true/false，默认：false
     * @param {boolean} bSubSum        可选，是否对分组数据进行小计，需在aoColumns中对列设置sSumType属性，true/false，默认：false
     * @param {boolean} bCanSort    可选，是否支持点击列头排序：true/false，默认：true
     * @param {array}   aaDefaultSorting 可选，表格默认排序，例：[[2,'asc'], [3,'desc']]-->按第2列升序第3列降序排列数据（列号从0开始）
     * @param {boolean} bCanFilter  可选，是否支持表格数据过滤：true/false，默认：false
     * @param {boolean} bChangeTabId tab切换展示
     * @param {boolean} bCreateTabFirst 是否先生称tab(不管是否有对应分组的数据，都会产生一个选项位置)
     */
    this.createGroupGrid = function (sParentId, sTableId, sGroupCol, aaGroupSort, aaDatas, aoColumns, bGroupCollapse, bSubSum, bSort, aaDefaultSorting, bCanFilter, bChangeTabId, bCreateTabFirst) {
        //检查参数，sTableId、sParentId必须传递
        if (arguments.length < 4) return null;

        var oOption = {"sGroupCol": sGroupCol,
            "aaSortingFixed": aaGroupSort,
            "bPaginate": false,
            "bGroupCollapse": bGroupCollapse,
            "bSubSum": bSubSum,
            "bChangeTabId": bChangeTabId,
            "bCreateTabFirst": bCreateTabFirst
        };
        var iLen = arguments.length;
        if (iLen > 6) {
            oOption.bSort = bSort;
            if (iLen > 7) {
                oOption.aaSorting = aaDefaultSorting;
                if (iLen > 8)
                    oOption.bFilter = bCanFilter;
            }
        }
        // 加载表格
        KGrid.createGrid(sParentId, sTableId, aaDatas, aoColumns, oOption);
    };
    this.createPagingGrid = function (sParentId, sTableId, oOption) {
        var oOptions = KGrid.getDefaultParam();
        oOptions.bSort = false;
        oOptions.bPaginate = true;
        oOptions.bInfo = true;
        oOptions.bServerSide = true;
        oOptions.bFilter = true;
        oOptions.bLengthChange = true;
        oOptions.iDisplayLength = 15;
        oOptions.aLengthMenu = [15, 25, 50, 100];
        oOptions.sDom = '<"ui-top"lf>t<"fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix"ip>';
        oOptions.fnServerData = function (sSource, aoData, fnCallback, oSettings) {
            var aoParam = oOption.aoParam;
            if (!KGF.isEmpty(aoParam)) {
                for (var i = 0; i < aoParam.length; i++) {
                    var p = aoParam[i];
                    if (!KGF.isEmpty(p.id) && !KGF.isEmpty($("#" + p.id).val())) {
                        aoData.push({"name": p.name, "value": $("#" + p.id).val()});
                    } else if (!KGF.isEmpty(p.value)) {
                        aoData.push({"name": p.name, "value": p.value});
                    } else {
                        aoData.push({"name": p.name, "value": ""});
                    }
                }
            }
            Ajax.request(sSource, aoData, function (ajaxResult) {
                var data = ajaxResult.getDataset(0);
                var param = ajaxResult.getData(1, 0);
                var columns = oSettings.aoColumns;
                for (var i = 0; i < columns.length; i++) {
                    var oColumn = columns[i];
                    if (oColumn.oDict || oColumn.sDisplayFormat)    // 该需要翻译，设置fnCreatedCell属性
                        oColumn.fnCreatedCell = doTranslateCallback;
                }
                ;
                var jsonData = {"aaData": data};
                jsonData.sEcho = param.sEcho;
                jsonData.iTotalRecords = param.iTotalRecords;
                jsonData.iTotalDisplayRecords = param.iTotalDisplayRecords;
                jsonData.iDisplayStart = param.iDisplayStart;
                jsonData.iDisplayLength = param.iDisplayLength;
                fnCallback(jsonData);
                new KfitTag().process();
            });
        };
        $.extend(oOptions, oOption);
        //检查表格是否创建，如果没创建则自动创建表格
        var $table = $("#" + sTableId);
        if (!$table || $table.length == 0) {
            $("#" + sParentId).append('<table id="' + sTableId + '" class=""></table>');
            $table = $("#" + sTableId);
        }
        return $table.dataTable(oOptions);
    };

    /**
     * (!会将原框架的分页按钮隐藏，同时请小心修改sDom)可以显示换页按钮、分页信息和下拉框
     * @param sTableId 表格id
     * @param sPageChangerDivId 父级div的id
     * @param iDisplayLength 每页显示数据的行数(由于此处是外围计算，无法动态处理，该值必须正确)
     */
    this.showPageChanger = function (sTableId, iDisplayLength) {
        // 将原框架的分页按钮隐藏
        $('#' + sTableId + '_paginate').hide();
        var $table = $('#' + sTableId);
        // 修改sDom时，请小心本位置可能定位出错
        var $selectDiv = $table.next().find('#divPageChanger');
        // 清除div里面的所有元素
        $selectDiv.html('');
        var oTable = $table.dataTable();
        var iRecordTotal = oTable.fnGetData().length;
        var iPageTotal = Math.ceil(iRecordTotal / iDisplayLength);
        var minPage = 1;

        if (minPage > iPageTotal) {
            minPage = 0;
        }

        // 换页按钮
        var $buttonPageDiv = $('<div id="divButtonPage"></div>');
        $buttonPageDiv.append($('<a type="button" id="pageFirst" />'));
        $buttonPageDiv.append($('<a type="button" id="pagePrevious" />'));
        $buttonPageDiv.append($('<a type="button" id="pageNext" />'));
        $buttonPageDiv.append($('<a type="button" id="pageLast" />'));
        $selectDiv.append($buttonPageDiv);

        // 分页下拉框
        var $select = $('<select id="selectPage"></select>');
        for (var i = 0; i < iPageTotal; ++i) {
            $select.append('<option value=' + i + '>' + (i + 1) + '</option>');
        }
        $selectDiv.append($('<div id="divSelectPage"></div>').append($('<span id="selectHintHead">转到第</span>')).append($select).append($('<span id="selectHintFoot">页</span>')));

        // 分页信息
        var $pageInfo = $('<p id="pageInfo">共<span id="pageInfoCurrent">' + minPage + '</span>/<span id="pageInfoTotal">' + iPageTotal + '</span>页&nbsp;&nbsp;共<span id="pageInfoRecordTotal">' + iRecordTotal + '</span>条记录</p>');
        $selectDiv.append($('<div id="divPageInfo"></div>').append($pageInfo));

        // 事件绑定
        var fnPageChange = function (sPage, bIsSelect) {
            var nowPage = parseInt($select.val());
            var newPage = parseInt(sPage);
            if (bIsSelect || nowPage != newPage) {
                if (newPage >= 0 && newPage < iPageTotal) {
                    oTable.fnPageChange(newPage);
                    $select.val(newPage);
                    $selectDiv.find('#pageInfoCurrent').html(newPage + 1);
                }
            }
        }
        $select.change(function (event) {
            fnPageChange(event.target.value, true);
        });
        $buttonPageDiv.find('#pageFirst').click(function (event) {
            fnPageChange(0);
        });
        $buttonPageDiv.find('#pagePrevious').click(function (event) {
            fnPageChange(parseInt($select.val()) - 1);
        });
        $buttonPageDiv.find('#pageNext').click(function (event) {
            fnPageChange(parseInt($select.val()) + 1);
        });
        $buttonPageDiv.find('#pageLast').click(function (event) {
            fnPageChange(iPageTotal - 1);
        });
    }

    /**
     * 通过hover的方式显示列表数据详细信息
     * @param sTableId 表格id
     * @param fnFormatDetails(aData) 格式化详细信息，aData:本行数据
     * @param iSpeed 展示速度
     */
    this.showDetailByHover = function (sTableId, fnFormatDetails, fnOpenDoneCallBack, iSpeed) {
        if (!fnFormatDetails) {
            return;
        }
        if (!iSpeed) {
            iSpeed = 200;
        }
        var oTable = $('#' + sTableId).dataTable();
        $('#' + sTableId + ' > tbody > tr td:not(.dataTables_empty)').parent().hover(function () {
            var nTr = this;
            var $nTr = $(this);
            // 关闭其它tr打开的详细信息
            $nTr.siblings('tr').each(function (i) {
                var nowTr = this;
                if (oTable.fnIsOpen(nowTr)) {
                    $(nowTr).find('td:first').css('background', 'none');
                    $(nowTr).next().find('div.detail_cover').stop().slideUp(iSpeed, function () {
                        oTable.fnClose(nowTr);
                    });
                }
            });

            // 打开本tr的详细信息
            if (!oTable.fnIsOpen(nTr)) {
                var divCover = '<div class="detail_cover">' + fnFormatDetails(oTable.fnGetData(nTr)) + '</div>';
                oTable.fnOpen(nTr, divCover, 'details');
                $nTr.next().find('td').css('height', 'auto').find('div.detail_cover').stop().slideDown(iSpeed);
                $nTr.find('td:first').css('background', 'url("' + KGF.getRootPath() + '/page/dc/images/Public/10.png") no-repeat top left');
                if (fnOpenDoneCallBack) {
                    fnOpenDoneCallBack(nTr, oTable.fnGetData(nTr));
                }
            }
        }, function () {
        });
        $('#' + sTableId + ' > tbody').hover(function () {
        }, function () {
            // 关闭所有tr打开的详细信息
            $(this).children('tr').each(function (i) {
                var nowTr = this;
                if (oTable.fnIsOpen(nowTr)) {
                    $(nowTr).find('td:first').css('background', 'none');
                    $(nowTr).next().find('div.detail_cover').stop().slideUp(iSpeed, function () {
                        oTable.fnClose(nowTr);
                    });
                }
            });
        });
    }

    /**
     * 显示列表数据详细信息
     * @param sTableId
     * @param fnFormatDetails
     */
    this.showDetail = function (sTableId, oColumns, iColCount) {
        var oTable = $('#' + sTableId).dataTable();
        $('#' + sTableId + ' tbody td img[name="detail_"]').die().live('click', function () {
            var nTr = $(this).parents('tr')[0];
            if (oTable.fnIsOpen(nTr)) {
                this.src = KGF.getRootPath() + "/page/common/img/jquery/details_open.png";
                oTable.fnClose(nTr);
            }
            else {
                this.src = KGF.getRootPath() + "/page/common/img/jquery/details_close.png";
                oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr, oColumns, iColCount), 'details');
            }
        });
    }

    function fnFormatDetails(oTable, nTr, oColumns, iColCount) {
        var aData = oTable.fnGetData(nTr);
        return doTranslateDetail(aData, oColumns, iColCount);
    }

    /**
     * 解析字段显示条件
     * @param sDataName
     * @param sCondition
     */
    function analyseCondition(sDataName, sCondition) {
        var sFieldSearch = /\${\S+}/;
        while (sFieldSearch.test(sCondition)) {
            var arrField = sCondition.match(sFieldSearch);
            if (arrField.length == 1) {
                var sField = sDataName + "." + arrField[0].substring(2, arrField[0].length - 1);
                var sFieldReplace = new RegExp("\\" + arrField[0]);
                sCondition = sCondition.replace(sFieldReplace, sField);
            }
        }
        return sCondition;
    }

    /**
     * deltail信息翻译
     * @param oData 数据
     * @param oColumns 字段列
     * @param iCol 每行显示列数
     * @returns string
     */
    function doTranslateDetail(aData, oColumns, iCol) {
        var i, iRow = 0, sHtml = "", sRow = "";
        for (i = 0; i < oColumns.length; i++) {
            var oColumn = oColumns[i];
            // 根据条件判断是否显示
            if (oColumn.sCondition) {
                var sCondition = analyseCondition("aData", oColumn.sCondition);
                var bVisible = eval(sCondition);
                if (oColumn.bVisible)
                    oColumn.bVisible = oColumn.bVisible && bVisible;
                else
                    oColumn.bVisible = bVisible;
            }

            if (oColumn.bDetail || (oColumn.bVisible == false))
                continue;

            var oDict = oColumn.oDict;
            var sData = aData[oColumn.mDataProp];
            if (oDict) {
                var sKeyName = oColumn.sKeyName;
                var sValueName = oColumn.sValueName;
                if (oDict instanceof ListMap) {
                    if (sKeyName == null) {
                        sData = oDict.get(sData, sData);
                    } else {
                        sData = oDict.getValue(aData[sKeyName], sValueName, sData);
                    }
                } else if ($.isArray(oDict)) {
                    var sValue = KGF.getObjectPropVal(aData, sKeyName);
                    var oData = KGF.getObjectFromArray(oDict, sKeyName, sValue);
                    if (oData) {
                        sValue = KGF.getObjectPropVal(oData, sValueName);
                        sData = sValue.join(" ");
                    }
                }
            }
            //add by zhangqc 增加对fnRender支持
            var ofnRender = oColumn.fnRender;
            if (ofnRender) {
                var jsonD = {aData: aData};
                sData = ofnRender(jsonD, sData);
            }

            // 检查放缩比例，注意
            var iScale = oColumn.iScale;
            if (iScale) {
                sData = Number(sData) * Math.pow(10, iScale);
            }

            // 检查格式化显示
            var sDisplayFmt = oColumn.sDisplayFormat;
            if (sDisplayFmt) {
                var sFmt;
                if (sDisplayFmt.match(/[#0]/)) {
                    sData = KGF.fmtNumber(sData, sDisplayFmt);
                } else if (sDisplayFmt == "%") {
                    sData = Number(sData) * 100 + "%";
                } else if (sDisplayFmt.match(/^ymd/)) {
                    if (sData) {
                        sFmt = sDisplayFmt.substring(3);
                        if (sFmt == "") sFmt = "-";
                        sData = KGF.fmtDate(sData, sFmt);
                    }
                } else if (sDisplayFmt.match(/^hns/)) {
                    if (sData) {
                        sFmt = sDisplayFmt.substring(3);
                        if (sFmt == "") sFmt = ":";
                        sData = KGF.fmtTime(sData, sFmt);
                    }
                }
            }
            if (sData == "undefined" || $.trim(sData) == "" || sData == null) {
                if (oColumn.sDefaultContent) {
                    sData = oColumn.sDefaultContent;
                } else if (!oColumn.canEmpty) {//默认不能为空
                    continue;
                }
            }

            sRow += "<td>%s</td><td class='%s'>%s</td>".format([oColumn.sTitle, oColumn.sClass, sData]);
            iRow += 1;
            if (iRow % iCol == 0) {
                sHtml += "<tr>%s<tr>".format([sRow]);
                sRow = "";
                iRow = 0;
            }
            //详细最后一行显示一条数据时，合并
            if (i >= (parseInt(oColumns.length / iCol) * iCol) - 1) {
                if (iRow == 1) {
                    sRow = sRow + "<td></td><td class='textalign-left'></td>";
                }
            }
        }
        if (sRow != "") {
            sHtml += "<tr>%s</tr>".format([sRow]);
        }
        return "<div class='tbDatail-head'></div><table class='tbDetail'>%s</table>".format([sHtml]);
    }

    /**
     * 获取表格默认参数,表格类型有：1-分页表格，2-不分页表格，3-分组表格
     * @param {string} sTableType 表格类型
     * @return {object} 默认参数
     */
    this.getDefaultParam = function (sParentId, sTableId, sTableType) {
        return {
            "bAutoWidth": false, // 是否允许自动计算列宽度：true/false  默认：false
            "bFilter": false, // 是否显示过滤框：true/false 默认：true
            "bPaginate": false, // 是否分页显示：true/false 默认：true
            "iDisplayLength": 20, // 分页显示时，每页显示的数据行数
            "sPaginationType": "full_numbers", // 分页显示时，显示全部按钮
            "bLengthChange": false, // 分页显示时，不能选择每页显示的行数
            "bSort": true, // 是否允许点击列头排序：true/false 默认：true
            "sScrollX": null, // 显示水平滚动条
            "sScrollY": null, // 显示竖直滚动条
            "bInfo": false, // 不显示表格信息
            "bJQueryUI": true, // 默认使用jQuer-ui样式
            "sDom": 't<"fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix"lfp<"dataTables_paginate page-changer"<"#divPageChanger">>>',
            "oLanguage": {                    // 定义表格中用的文字信息，默认英文
                "oAria": {
                    "sSortAscending": "：激活升序排序",
                    "sSortDescending": "：激活降序排序"
                },
                "oPaginate": {
                    "sFirst": "首页",
                    "sLast": "尾页",
                    "sNext": "下页",
                    "sPrevious": "上页"
                },
                "sEmptyTable": "目前还没有，晚点再看看",
                "sInfo": "显示 _START_ ～ _END_ / _TOTAL_ 行",
                "sInfoEmpty": "显示 0 行",
                "sInfoFiltered": "(在 _MAX_ 行中过滤)",
                "sInfoPostFix": "",
                "sInfoThousands": ",",
                "sLengthMenu": "每页显示 _MENU_ 行",
                "sLoadingRecords": "正在准备数据，请稍后...",
                "sProcessing": "正在处理数据，请稍后...",
                "sSearch": "&nbsp;&nbsp;查找：",
                "sUrl": "",
                "sZeroRecords": "目前还没有，晚点再看看"
            }
        };
    };

    /**
     * 1、翻译表格列中的数据，如将基金类型代码翻译为基金类型名称,需要在列定义中配置oDict[sKeyName, sValueName]属性，
     *       oDict为ListMap类型的数据列表，如果同时指定sKeyName, sValueName属性，则用sKeyName定位数据项，返回数据项
     *    sValueName属性的值，如果oDict为ListMap类型则sKeyName和sValueName属性可以不设置或为字符串，如果oDict为
     *    对象数组（数据集)类型，则sKeyName和sValueName属性必须设置，为字符串数组类型
     * 2、格式化显示数据，读取属性：sDisplayFormat，支持浮点数，日期，时间
     *       浮点数：支持[#.0]字符：1234.507->#,###.##(1,234.5)，#,###.00(1,234.50)
     *    日期：支持ymd- ymd/ ymdCN，时间：仅支持hns:
     * @example {"sTitle": "风险等级", "mDataProp": "risklevel", "oDict": KGD.CustRisk}
     * @param o 数据对象
     * @param val 当前cell中的数据
     * @returns 返回当前cell待显示的数据
     */
    function doTranslateCallback(nTd, sData, oData, iRow, iCol) {
        try {
            var oColumn = this.fnSettings().aoColumns[iCol];
            // 检查数据字典翻译
            var oDict = oColumn.oDict;
            if (oDict) {
                var sKeyName = oColumn.sKeyName || "";
                var sValueName = oColumn.sValueName;
                if (oDict instanceof ListMap) {
                    if (sKeyName == "") {
                        sData = oDict.get(sData, sData);
                    } else {
                        sKeyName = $.isArray(sKeyName) ? sKeyName[0] : sKeyName;
                        sValueName = $.isArray(sValueName) ? sValueName[0] : sValueName;
                        sData = oDict.getValue(oData[sKeyName], sValueName, sData);
                    }
                } else if ($.isArray(oDict)) {
                    var sValue = KGF.getObjectPropVal(oData, sKeyName);
                    var oData = KGF.getObjectFromArray(oDict, sKeyName, sValue);
                    if (oData) {
                        sValue = KGF.getObjectPropVal(oData, sValueName);
                        sData = sValue.join(" ");
                    }
                }
            }

            // 检查放缩比例，注意
            var iScale = oColumn.iScale;
            if (iScale) {
                sData = Number(sData) * Math.pow(10, iScale);
            }

            // 检查格式化显示
            var sDisplayFmt = oColumn.sDisplayFormat;
            if (sDisplayFmt) {
                var sFmt;
                if (sDisplayFmt.match(/[#0]/)) {
                    sData = KGF.fmtNumber(sData, sDisplayFmt);
                } else if (sDisplayFmt.match(/^ymd/)) {
                    if (sData) {
                        sFmt = sDisplayFmt.substring(3);
                        if (sFmt == "") sFmt = "-";
                        sData = KGF.fmtDate(sData, sFmt);
                    }
                } else if (sDisplayFmt.indexOf(/^hns/)) {
                    if (sData) {
                        sFmt = sDisplayFmt.substring(3);
                        if (sFmt == "") sFmt = ":";
                        sData = KGF.fmtTime(sData, sFmt);
                    }
                }
            }
        } catch (e) {
        }

        $(nTd).html(sData);
    }

    /**
     * 对表格数据进行分组统计，要对表格进行分组，需设置sGroupCol属性(string)，
     * 设置格式：列名|列索引[:翻译数据字典]，要对分组进行小计需设置bSubSum属性(boolean)，
     * 允许折叠分组需设置bGroupCollapse属性(boolean)
     */
    function doColGroupSumCallback(oSettings) {
        if (oSettings.aiDisplay.length == 0) return;

        try {
            // 检查有无数据行
            var nTrs = $("tbody tr", oSettings.nTable);
            if (nTrs.length == 0) return;
            var iColCount = nTrs[0].getElementsByTagName("td").length;
            if (iColCount == 0) return;

            // 检查是否设置分组属性
            var sGroupCol = oSettings.oInit.sGroupCol;
            if (!sGroupCol || sGroupCol == "") return;

            // 处理记录分组
            var oDict = null,
                index = sGroupCol.indexOf(":"),
                conditionVal = null,
                conditionIndex = sGroupCol.indexOf("!=["),
                conditionEndIndex = sGroupCol.indexOf("]");
            if (index > 0) {
                if (conditionIndex == -1) {
                    oDict = KGD[sGroupCol.substring(index + 1)];
                } else {//含条件
                    oDict = KGD[sGroupCol.substring(index + 1, conditionIndex)];
                    conditionVal = sGroupCol.substring(conditionIndex + 3, conditionEndIndex)
                }
                sGroupCol = sGroupCol.substring(0, index);
                if (sGroupCol == "") return;
            }

            // 检查是否允许折叠分组
            var bGroupCollapse = oSettings.oInit.bGroupCollapse;
            var sGroupButtonFmt = !bGroupCollapse ? null : '<span class="unexpand" onclick="KGrid.doShowHideGroup(event, \'%s\', %s, %s' +
                ')"></span>';

            // 检查是否要对分组进行小计
            var bNeedCalCount = false,
                aoSums = null, sGroupSumHtmlFmt = null,
                bSubSum = oSettings.oInit.bSubSum;
            if (bSubSum) {
                var oSums = checkColSum(oSettings.aoColumns);
                bSubSum = (oSums && oSums.aoSums.length > 0);
                if (bSubSum) {
                    aoSums = oSums.aoSums;
                    bNeedCalCount = oSums.iNeedCalCount > 0;
                    // 生成小计行
                    sGroupSumHtmlFmt = (function () {
                        var i, j, sSumHtml = "<td>小计：</td>", iCount = aoSums.length;
                        for (i = 1; i < iColCount; i++) {
                            for (j = 0; j < iCount; j++) {
                                // if (aoSums[j].colIndex = i) break;
                                // modify by ljy 20120625 "=="误写为"="
                                if (aoSums[j].colIndex == i) break;
                            }
                            (j < iCount) ? sSumHtml += '<td>%s</td>' : sSumHtml += '<td></td>';
                        }
                        return '<tr level="0" class="grid_group_subsum">' + sSumHtml + '</tr>';
                    })();
                }
            }
            // 创建分组行
            var i, j, iIndex, iGroupIndex = 0, iGroupCount = 1, iRowCount = nTrs.length, bCreateTabFirstDone = false,
                aRowData, sGroupHtml = "", aGroupSumValue, sGroupValue, sGroupCaption, sLastGroupValue = "",
                sGroupHtmlFmt = '<tr level="0"><td colspan="%s" class="datatables_group_row">%s</td></tr>';
            for (i = 0; i < iRowCount; i++) {
                iIndex = oSettings._iDisplayStart + i;
                aRowData = oSettings.aoData[oSettings.aiDisplay[iIndex]]._aData;
                sGroupValue = aRowData[sGroupCol];
                // 处理分组
                if (sGroupValue != sLastGroupValue) {
                    if (conditionVal && (sGroupValue == conditionVal)) {//过滤分组条件
                        continue;
                    }
                    // 如果有小计行则分组行索引要加1
                    if (bSubSum && i > 0) iGroupIndex++;
                    if (oSettings.oInit.bCreateTabFirst) {
                        if (!bCreateTabFirstDone) {
                            for (var dictIndex = 0; dictIndex < oDict.count(); ++dictIndex) {
                                var dict = oDict.items(dictIndex);
                                // 分组标题信息
                                sGroupCaption = "<li id='tabChange" + dict.key + "' class='unSelectedClassfy'>" + dict.value + "</li>";
                                // 显示折叠按钮
                                if (bGroupCollapse)
                                    if (oSettings.oInit.bChangeTabId) {
                                        $("#bChangeTabId").append(sGroupCaption);
                                    }
                            }
                        }
                        bCreateTabFirstDone = true;
                    } else {
                        // 分组标题信息
                        sGroupCaption = (oDict != null) ? oDict.get(sGroupValue, sGroupValue) : sGroupValue;
                        sGroupCaption = "<li id='tabChange" + sGroupValue + "' class='unSelectedClassfy'>" + sGroupCaption + "</li>";
                        // 显示折叠按钮
                        if (bGroupCollapse)
                            if (oSettings.oInit.bChangeTabId) {
                                $("#bChangeTabId").append(sGroupCaption);
                            }
                    }
//                    sGroupCaption = sGroupButtonFmt.format([oSettings.nTable.id, 0, iIndex + iGroupIndex]) + sGroupCaption;	//隐藏分组行
                    // 分组行html
//                    sGroupHtml = sGroupHtmlFmt.format([iColCount, sGroupCaption]);
                    // 显示小计行
                    if (bSubSum && i > 0) {
                        // 计算分组计数、平均值
                        calSumData(aoSums, iGroupCount);
                        aGroupSumValue = [];
                        for (j = 0; j < aoSums.length; j++) {
                            aGroupSumValue.push(aoSums[j].sumValue);
                        }
                        //sGroupHtml = sGroupSumHtmlFmt.format(aGroupSumValue) + sGroupHtml;
                        //mdf by licl 2014/1/17
                        sGroupHtml = sGroupSumHtmlFmt.format(aGroupSumValue);
                        // 清除旧数据
                        resetSumValue(aoSums);
                        // 新分组
                        if (bNeedCalCount) sumRowData(aoSums, aRowData);
                        iGroupCount = 1;
                    }
                    // 插入DOM
                    $(nTrs[i]).before(sGroupHtml);
                    sLastGroupValue = sGroupValue;
                    iGroupIndex++;
                } else if (bSubSum) {    // 统计数据
                    if (bNeedCalCount)
                        sumRowData(aoSums, aRowData);
                    iGroupCount++;
                }
            }
            oSettings.oInit.bChangeTabId = false;
            // 最后一个小计
            if (bSubSum && i > 0) {
                // 计算分组计数、平均值
                calSumData(aoSums, iGroupCount);
                aGroupSumValue = [];
                for (j = 0; j < aoSums.length; j++) {
                    aGroupSumValue.push(aoSums[j].sumValue);
                }
                sGroupHtml = sGroupSumHtmlFmt.format(aGroupSumValue);
                // 插入DOM
                $(nTrs[i - 1]).after(sGroupHtml);
            }
        } catch (e) {
            $Super.addAction($Super.ACT_ERROR(), "表格数据分组", oSettings.nTable.id);
        }
    }

    /**
     * 统计数据并在页脚显示,必须对列设置sSumType,sSumText属性，sSumType取值：
     *         SumType_Sum: "S",        // 求和
     *         SumType_Count: "C",        // 计数
     *         SumType_Avg: "A",        // 平均值
     *         SumType_Min: "N",        // 最小值
     *         SumType_Max: "X",        // 最大值
     *         SumType_Text: "T",        // 文本
     * -------------------------------------------------------------------
     * @param {dom} nRow 页脚行
     * @param {array} aaData 表格数据
     * @param {int} iStart 当前页的起始行索引
     * @param {int} iEnd 当前页的结束行索引
     * @param {array} aiDisplay 当前页数据行索引与aaData中索引的映射
     */
    function doSumDataCallback(nFoot, aaData, iStart, iEnd, aiDisplay) {
        var aoColumns = this.fnSettings().aoColumns;
        if (!aoColumns) return;

        var oSums = checkColSum(aoColumns);
        if (!oSums || oSums.aoSums.length === 0) return;

        try {
            // 统计计算
            var i, aoSums = oSums.aoSums,
                iNeedCalCount = oSums.iNeedCalCount;
            if (iNeedCalCount > 0) {
                var bDataIsArray = false, iCount = aaData.length;
                if (iCount > 0)
                    bDataIsArray = $.isArray(aaData[0]);
                for (i = 0; i < iCount; i++) {
                    sumRowData(aoSums, aaData[i], bDataIsArray);
                }
            }
            calSumData(aoSums, aaData.length);

            // 显示到tfooter上
            var nCells = nFoot.getElementsByTagName('th');
            for (var i = 0; i < aoSums.length; i++) {
                nCells[aoSums[i].colIndex].innerHTML = aoSums[i].sumValue;
            }
        } catch (e) {
            $Super.addAction($Super.ACT_ERROR(), "表格数据分组", this.fnSettings().nTable.id);
        }
    }

    /**
     * 检查表格列定义中有没有统计列,即检查有没有设置sSumType,sSumText属性，sSumType取值：
     *         SumType_Sum: "S",        // 求和
     *         SumType_Count: "C",        // 计数
     *         SumType_Avg: "A",        // 平均值
     *         SumType_Min: "N",        // 最小值
     *         SumType_Max: "X",        // 最大值
     *         SumType_Text: "T",        // 文本
     * -------------------------------------------------------------------
     * @param {array} aoColumns 表格列定义数组
     * @return {object} {"iNeedCalCount": n,
     *                      "aoSums": [{"colIndex": i, "colName": colName, "sumType": sSumType, "sumText": sSumText, "sumValue": vData, "displayFormat": null}]}
     */
    function checkColSum(aoColumns) {
        if (!aoColumns) return null;

        var aoSums = [];
        var i, vData, sSumType, iNeedCalCount = 0;
        // 检查有没有设置统计列
        for (i = 0; i < aoColumns.length; i++) {
            sSumType = aoColumns[i].sSumType;
            if (sSumType) {
                // 求和、计数、平均值
                if ($.inArray(sSumType, [KGC.SumType_Sum, KGC.SumType_Count, KGC.SumType_Avg]) >= 0)
                    vData = 0;
                else if ($.inArray(sSumType, [KGC.SumType_Min, KGC.SumType_Max]) >= 0)
                    vData = null;
                else if (sSumType === KGC.SumType_Text)
                    vData = aoColumns[i].sSumText;
                else
                    continue;
                aoSums.push({"colIndex": i,
                    "colName": aoColumns[i].mDataProp,
                    "sumType": sSumType,
                    "sumText": aoColumns[i].sSumText,
                    "sumValue": vData,
                    "displayFormat": aoColumns[i].sDisplayFormat
                });
                // 计数和静态文本仅显示，不用计算
                if (sSumType !== KGC.SumType_Text && sSumType !== KGC.SumType_Count) iNeedCalCount++;
            }
        }
        return {"iNeedCalCount": iNeedCalCount, "aoSums": aoSums};
    }

    /**
     * 重置checkColSum函数返回的统计对象的aoSums属性的初始值
     * @param {array} aoSums 统计对象
     */
    function resetSumValue(aoSums) {
        for (var i = 0; i < aoSums.length; i++) {
            sSumType = aoSums[i].sumType;
            if ($.inArray(sSumType, [KGC.SumType_Sum, KGC.SumType_Count, KGC.SumType_Avg]) >= 0)
                aoSums[i].sumValue = 0;
            else if ($.inArray(sSumType, [KGC.SumType_Min, KGC.SumType_Max]) >= 0)
                aoSums[i].sumValue = null;
        }
    }

    /**
     * 统计给定的数据行，完成计算[计数][平均值]
     * @param {array} aoSums 统计对象数组
     * @param {array|object} aRowData 数据行数或数据行数据对象
     * @param {boolean} aRowData是否是数组
     */
    function sumRowData(aoSums, aRowData, bDataIsArray) {
        var i, oSumItem, vData;
        for (i = 0; i < aoSums.length; i++) {
            oSumItem = aoSums[i];
            vData = bDataIsArray ? aRowData[oSumItem.colIndex] : aRowData[oSumItem.colName];
            if (vData == null) return;

            if ($.inArray(oSumItem.sumType, [KGC.SumType_Sum, KGC.SumType_Avg]) >= 0) {
                oSumItem.sumValue += KGF.strToNumber(vData, 0);
            } else if (oSumItem.sumType == KGC.SumType_Min) {
                if (oSumItem.sumValue == null || (vData < oSumItem.sumValue))
                    oSumItem.sumValue = vData;
            } else if (oSumItem.sumType == KGC.SumType_Max) {
                if (oSumItem.sumValue == null || (vData > oSumItem.sumValue))
                    oSumItem.sumValue = vData;
            }
        }
    }

    /**
     * 对[计数][平均值]进行计算
     * @param {array} aoSums 统计对象数组
     * @param {number} iRowCount 数据行数或数据行数据对象
     */
    function calSumData(aoSums, iRowCount) {
        var i, oSumItem;
        // 行数据统计计算完毕计算[计数][平均值]
        for (i = 0; i < aoSums.length; i++) {
            oSumItem = aoSums[i];
            if (oSumItem.sumType === KGC.SumType_Count)
                oSumItem.sumValue = iRowCount;
            else if (oSumItem.sumType === KGC.SumType_Avg)
                oSumItem.sumValue = KGF.fmtNumber(oSumItem.sumValue / iRowCount, "#,##0.0000");

            // 格式化
            if (oSumItem.displayFormat) {
                var sFmt,
                    sDisplayFmt = oSumItem.displayFormat;
                if (sDisplayFmt.match(/[#0]/)) {
                    oSumItem.sumValue = KGF.fmtNumber(oSumItem.sumValue, sDisplayFmt);
                } else if (sDisplayFmt.match(/^ymd/)) {
                    if (oSumItem.sumValue) {
                        sFmt = sDisplayFmt.substring(3);
                        if (sFmt == "") sFmt = "-";
                        oSumItem.sumValue = KGF.fmtDate(oSumItem.sumValue, sFmt);
                    }
                } else if (sDisplayFmt.indexOf(/^hns/)) {
                    if (oSumItem.sumValue) {
                        sFmt = sDisplayFmt.substring(3);
                        if (sFmt == "") sFmt = ":";
                        oSumItem.sumValue = KGF.fmtTime(oSumItem.sumValue, sFmt);
                    }
                }
            }
        }
    }

    /**
     * 显示/隐藏分组下的数据行
     * @param {event} oEvent
     * @param {string} sTableId 表格Id
     * @param {integer} iLevel 分组级别，从0开始
     * @param {integer} iTrIndex 分组标题所在行的索引
     */
    this.doShowHideGroup = function (oEvent, sTableId, iLevel, iTrIndex) {
        //var sFlag = oEvent.target.innerHTML;
        //var bExpand = sFlag == "-";
        // bExpand ? oEvent.target.innerHTML = "+" : oEvent.target.innerHTML = "-";

        var oEve = oEvent.srcElement || oEvent.target;
        var sFlag = oEve.className;
        var bExpand = sFlag == "unexpand";
        bExpand ? oEve.className = "expand" : oEve.className = "unexpand";

        var nTr, nTrs = $('tbody tr', $("#" + sTableId));
        for (var i = iTrIndex + 1; i < nTrs.length; i++) {
            nTr = $(nTrs[i]);
            if (nTr.attr("level")) {
                return;
            } else {
                bExpand ? nTr.hide() : nTr.show();
            }
        }
    },

    /**
     * 显示隐藏表格列
     * @param {DataTable} $Table 表格对象，通过：$('#XXX').dataTable();获取
     * @param {int} iCol 要显示或隐藏的列索引
     * @param {int} iOperateFlag 操作标志：0-隐藏，1-显示，2-反向
     */
        this.fnShowHideColCallback = function ($Table, iCol, iOperateFlag) {
            if ($Table) {
                switch (iOperateFlag) {
                    case 0:
                        $Table.fnSetColumnVis(iCol, false);
                        break;
                    case 1:
                        $Table.fnSetColumnVis(iCol, true);
                        break;
                    case 2:
                        $Table.fnSetColumnVis(iCol, bVis ? false : true);
                        break;
                }
            }
        };
}

//JS Keyboard - 随机生成的软键盘.
if (typeof KeyBoard == "undefined")
    var KeyBoard = {

        RandomSort: function (x, y) {
            return Math.random() - 0.5;
        },

        //获得无序数字数组
        getRandomNum: function () {
            var numArray = new Array();
            var i;
            for (i = 0; i < 10; i++)
                numArray[i] = i;//生成一个数字数组
            numArray.sort(this.RandomSort);
            return numArray;
        },


        //获得无序字符数组
        getRandomChar: function (startASCII, charNum) {
            var charArray = new Array();
            var startASCII = startASCII;
            var charNum = charNum;
            var i, j;
            for (i = 0, j = startASCII; i < charNum; i++, j++)
                charArray[i] = j;//生成一个字母表
            charArray.sort(this.RandomSort);

            //对ASCII码进行翻译
            for (i = 0; i < charArray.length; i++)
                charArray[i] = String.fromCharCode(charArray[i]);
            return charArray;
        },

        //获得无序特殊字符
        getRandomChar1: function (arr) {
            var charArray = new Array();
            var charArray = arr;
            charArray.sort(this.RandomSort);

            //对ASCII码进行翻译
            for (i = 0; i < charArray.length; i++)
                charArray[i] = String.fromCharCode(charArray[i]);
            return charArray;
        },


        //功能按钮实现及特殊符号按钮显示
        keyjudge: function (inputId, kb) {
            var inputId = inputId;
            var kb = kb;
            kb.find("td").mouseover(function () {
                this.className += ' kb-mouseover';
            }).mouseout(function () {
                    this.className = this.className.replace(' kb-mouseover', '');
                }).click(function () {
                    //大成特有代码
                    $('#passwd').hide();
                    $('#'+inputId).show();
                    $('#'+inputId).focus();

                    if (this.id == 'kbClose' || this.id == 'kbEnter') {
                        kb.remove();
                        $('#' + inputId).removeAttr("readonly").focus();
                        return false;
                    }
                    if (this.id == 'kbClear') {
                        $('#' + inputId).val('');
                        return false;
                    }
                    if (this.id == 'kbBackspace') {

                        var leng = $('#' + inputId).val().length;
                        var num;
                        num = $('#' + inputId).val().substr(0, leng - 1);
                        $('#' + inputId).val(num);
                        return false;
                    }
                    if (this.id == 'kbCaps') {
                        $.each($(".kb-key", kb), function (i, o) {
                            var num = o.innerHTML.charCodeAt(0);
                            if (num > 96 && num < 123)
                                o.innerHTML = o.innerHTML.toUpperCase();
                            else if (num > 64 && num < 91)
                                o.innerHTML = o.innerHTML.toLowerCase();
                        });
                        return false;
                    }

                    //特殊符号判断
                    if (this.innerHTML == '&lt;') {
                        $('#' + inputId).attr('value', $('#' + inputId).val() + '\<');
                        return false;
                    }
                    if (this.innerHTML == '&amp;') {
                        $('#' + inputId).attr('value', $('#' + inputId).val() + '\&');
                        return false;
                    }
                    if (this.innerHTML == '&gt;') {
                        $('#' + inputId).attr('value', $('#' + inputId).val() + '\>');
                        return false;
                    }
                    if (this.innerHTML == '&nbsp;') {
                        $('#' + inputId).attr('value', $('#' + inputId).val() + '');
                        return false;
                    }
                    else {
                        $('#' + inputId).attr('value', $('#' + inputId).val() + this.innerHTML);
                    }
                });

        },

        //数字键盘表
        numberKeyBoard: function (inputId, kb) {
            var inputId = inputId;
            var kb = kb;

            //数字盘排列
            var keyboard = '<table class="kb-table"><tr>';
            var numArray = this.getRandomNum();
            for (i = 0; i < 10; i++) {
                if (i == 3) keyboard += '<td id="kbClose" colspan="2" class="kb-close">关闭</td>';
                if (i == 6) keyboard += '<td id="kbClear" colspan="2" class="kb-clear">清除</td>';
                if (i == 9) keyboard += '<td id="kbEnter" colspan="2" class="kb-close">确定</td>';
                if (i % 3 == 0 && i > 0) keyboard += '</tr><tr>';
                keyboard += '<td class="kb-key">' + numArray[i] + '</td>';
            }
            keyboard += '<td class="kb-key">&nbsp;</td><td id="kbBackspace" colspan="3" class="kb-backspace">← 回格</td></tr></table>';

            kb.html(keyboard);
            kb.appendTo('body');
            this.keyjudge(inputId, kb);

            return false;
        },

        //全键盘表
        allKeyBoard: function (inputId, kb) {
            var inputId = inputId;
            var kb = kb;
            var keyboard = '<table class="kb-table"><tr>';

            var numArray = this.getRandomNum();        //数字
            var charArray = this.getRandomChar(97, 26); //字母

            var arr = [33, 64, 35, 36, 37, 94, 38, 42, 40, 41, 95, 43];
            var otherArray = this.getRandomChar1(arr);


            var i = 0;
            for (i = 0; i < otherArray.length; i++) {
                keyboard += '<td class="kb-key">' + otherArray[i] + '</td>';
            }
            keyboard += '</tr><tr>';

            var i = 0;
            //输出数字
            for (i = 0; i < 10; i++) {
                keyboard += '<td class="kb-key">' + numArray[i] + '</td>';
            }

            keyboard += '<td id="kbBackspace" colspan="2" class="kb-backspace">← 回格</td></tr><tr>';

            //输出字母
            for (i = 0; i < charArray.length; i++) {
                if (i == 10)    keyboard += '<td id="kbCaps" colspan="2" class="kb-caps">大小写</td>';
                if (i == 20)    keyboard += '<td id="kbClear" colspan="2" class="kb-clear">清除</td>';
                if (i % 10 == 0 && i > 0)    keyboard += '</tr><tr>';
                keyboard += '<td class="kb-key">' + charArray[i] + '</td>';
            }
            keyboard += '<td colspan="2" class="kb-key">&nbsp;</td><td id="kbClose" colspan="2" class="kb-close">关闭</td><td id="kbEnter" colspan="2" class="kb-close">确定</td></tr></table>';

            kb.html(keyboard);
            kb.appendTo('body');
            this.keyjudge(inputId, kb);

            return false;
        },

        showKeyBoard: function (inputId, state) {
            var inputId = inputId;
            var state = state;

            $('#' + inputId).attr("readonly", "true");
            var kb = $('#keyBoard');
            if (kb.length != 0)
                kb.html();
            else
                kb = $('<div id="keyBoard" class="kb-div"></div>');

            //state为0时，启动数字键盘，为1时，启动全键盘
            if (state == 0) {
                this.numberKeyBoard(inputId, kb);
            } else {
                this.allKeyBoard(inputId, kb);
            }

            //确定键盘位置
            var offset = $('#' + inputId).offset();
            var left = offset.left;
            var height = $('#' + inputId).height();
            var top = offset.top + height + 15;
            var maxTop = $(document.body).height() - kb.height();
            if (top > maxTop) {
                top = offset.top - kb.height() - 5;
            }
            kb.css({left: left + 'px', top: top + 'px'});
        }
    };


/**
 * DES加密
 * Copyright(c) 1998-2012 SZKingdom Co. Ltd.
 * All right reserved.
 */

/**
 * 用固定的密钥加密字符串
 * @param sData 待加密的字符串
 */
function encData(sData,systemkey1,systemkey2,systemkey3) {
    //return strEnc(sData, "5eatrKwcmn04A07WCYYs", "fmT10Vt70ACI7moLksCB", "SsBDivFmnv6QU7GbSRt5");
    return strEnc(sData, systemkey1, systemkey2, systemkey3);
}

/*
 * encrypt the string to string made up of hex
 * return the encrypted string
 */
function strEnc(data, firstKey, secondKey, thirdKey) {

    if (data == null || data.length == 0 || firstKey == null || firstKey == "") {
        return "";
    }

    var encData = "";
    var leng = data.length;
    var firstLength = 0, secondLength = 0, thirdLength = 0;
    var firstKeyBt = null, secondKeyBt = null, thirdKeyBt = null;

    if (firstKey != null && firstKey != "") {
        firstKeyBt = getKeyBytes(firstKey);
        firstLength = firstKeyBt.length;
    }
    ;
    if (secondKey != null && secondKey != "") {
        secondKeyBt = getKeyBytes(secondKey);
        secondLength = secondKeyBt.length;
    }
    ;
    if (thirdKey != null && thirdKey != "") {
        thirdKeyBt = getKeyBytes(thirdKey);
        thirdLength = thirdKeyBt.length;
    }
    ;

    if (leng < 4) {
        var index;
        var encBt = strToBt(data);
        if (firstLength > 0) {
            for (index = 0; index < firstLength; index++) {
                encBt = enc(encBt, firstKeyBt[index]);
            }
            if (secondLength > 0) {
                for (index = 0; index < secondLength; index++) {
                    encBt = enc(encBt, secondKeyBt[index]);
                }
                if (thirdLength > 0) {
                    for (index = 0; index < thirdLength; index++) {
                        encBt = enc(encBt, thirdKeyBt[index]);
                    }
                }
            }
        }
        encData = bt64ToHex(encBt);
    } else {
        var iterator = parseInt(leng / 4);
        var remainder = leng % 4;
        var i = 0;
        for (i = 0; i < iterator; i++) {
            var tempData = data.substring(i * 4 + 0, i * 4 + 4);
            var encBt = strToBt(tempData);
            var index;
            if (firstLength > 0) {
                for (index = 0; index < firstLength; index++) {
                    encBt = enc(encBt, firstKeyBt[index]);
                }
                if (firstLength > 0) {
                    for (index = 0; index < secondLength; index++) {
                        encBt = enc(encBt, secondKeyBt[index]);
                    }
                    if (firstLength > 0) {
                        for (index = 0; index < thirdLength; index++) {
                            encBt = enc(encBt, thirdKeyBt[index]);
                        }
                    }
                }
            }
            encData += bt64ToHex(encBt);
        }

        if (remainder > 0) {
            var remainderData = data.substring(iterator * 4 + 0, leng);
            var encBt = strToBt(remainderData);
            var index;
            if (firstLength > 0) {
                for (index = 0; index < firstLength; index++) {
                    encBt = enc(encBt, firstKeyBt[index]);
                }
                if (firstLength > 0) {
                    for (index = 0; index < secondLength; index++) {
                        encBt = enc(encBt, secondKeyBt[index]);
                    }
                    if (firstLength > 0) {
                        for (index = 0; index < thirdLength; index++) {
                            encBt = enc(encBt, thirdKeyBt[index]);
                        }
                    }
                }
            }
            encData += bt64ToHex(encBt);
        }
    }
    return encData;
}

/*
 * chang the string into the bit array
 * return bit array(it's length % 64 = 0)
 */
function getKeyBytes(key) {
    var keyBytes = new Array();
    var leng = key.length;
    var iterator = parseInt(leng / 4);
    var remainder = leng % 4;
    var i = 0;
    for (i = 0; i < iterator; i++) {
        keyBytes[i] = strToBt(key.substring(i * 4 + 0, i * 4 + 4));
    }
    if (remainder > 0) {
        keyBytes[i] = strToBt(key.substring(i * 4 + 0, leng));
    }
    return keyBytes;
}

/*
 * chang the string(it's length <= 4) into the bit array
 * return bit array(it's length = 64)
 */
function strToBt(str) {
    var leng = str.length;
    var bt = new Array(64);
    if (leng < 4) {
        var i = 0, j = 0, p = 0, q = 0;
        for (i = 0; i < leng; i++) {
            var k = str.charCodeAt(i);
            for (j = 0; j < 16; j++) {
                var pow = 1, m = 0;
                for (m = 15; m > j; m--) {
                    pow *= 2;
                }
                bt[16 * i + j] = parseInt(k / pow) % 2;
            }
        }
        for (p = leng; p < 4; p++) {
            var k = 0;
            for (q = 0; q < 16; q++) {
                var pow = 1, m = 0;
                for (m = 15; m > q; m--) {
                    pow *= 2;
                }
                bt[16 * p + q] = parseInt(k / pow) % 2;
            }
        }
    } else {
        for (i = 0; i < 4; i++) {
            var k = str.charCodeAt(i);
            for (j = 0; j < 16; j++) {
                var pow = 1;
                for (m = 15; m > j; m--) {
                    pow *= 2;
                }
                bt[16 * i + j] = parseInt(k / pow) % 2;
            }
        }
    }
    return bt;
}

/*
 * chang the bit(it's length = 4) into the hex
 * return hex
 */
function bt4ToHex(binary) {
    var hex = null;
    switch (binary) {
        case "0000" :
            hex = "0";
            break;
        case "0001" :
            hex = "1";
            break;
        case "0010" :
            hex = "2";
            break;
        case "0011" :
            hex = "3";
            break;
        case "0100" :
            hex = "4";
            break;
        case "0101" :
            hex = "5";
            break;
        case "0110" :
            hex = "6";
            break;
        case "0111" :
            hex = "7";
            break;
        case "1000" :
            hex = "8";
            break;
        case "1001" :
            hex = "9";
            break;
        case "1010" :
            hex = "A";
            break;
        case "1011" :
            hex = "B";
            break;
        case "1100" :
            hex = "C";
            break;
        case "1101" :
            hex = "D";
            break;
        case "1110" :
            hex = "E";
            break;
        case "1111" :
            hex = "F";
            break;
    }
    return hex;
}

/*
 * chang the hex into the bit(it's length = 4)
 * return the bit(it's length = 4)
 */
function hexToBt4(hex) {
    var binary = null;
    switch (hex) {
        case "0" :
            binary = "0000";
            break;
        case "1" :
            binary = "0001";
            break;
        case "2" :
            binary = "0010";
            break;
        case "3" :
            binary = "0011";
            break;
        case "4" :
            binary = "0100";
            break;
        case "5" :
            binary = "0101";
            break;
        case "6" :
            binary = "0110";
            break;
        case "7" :
            binary = "0111";
            break;
        case "8" :
            binary = "1000";
            break;
        case "9" :
            binary = "1001";
            break;
        case "A" :
            binary = "1010";
            break;
        case "B" :
            binary = "1011";
            break;
        case "C" :
            binary = "1100";
            break;
        case "D" :
            binary = "1101";
            break;
        case "E" :
            binary = "1110";
            break;
        case "F" :
            binary = "1111";
            break;
    }
    return binary;
}

/*
 * chang the bit(it's length = 64) into the string
 * return string
 */
function byteToString(byteData) {
    var str = "";
    var i, j, m;
    for (i = 0; i < 4; i++) {
        var count = 0;
        for (j = 0; j < 16; j++) {
            var pow = 1;
            for (m = 15; m > j; m--) {
                pow *= 2;
            }
            count += byteData[16 * i + j] * pow;
        }
        if (count != 0) {
            str += String.fromCharCode(count);
        }
    }
    return str;
}

function bt64ToHex(byteData) {
    var hex = "";
    var i, j;
    for (i = 0; i < 16; i++) {
        var bt = "";
        for (j = 0; j < 4; j++) {
            bt += byteData[i * 4 + j];
        }
        hex += bt4ToHex(bt);
    }
    return hex;
}

function hexToBt64(hex) {
    var binary = "";
    var i;
    for (i = 0; i < 16; i++) {
        binary += hexToBt4(hex.substring(i, i + 1));
    }
    return binary;
}

/*
 * the 64 bit des core arithmetic
 */
function enc(dataByte, keyByte) {
    var keys = generateKeys(keyByte);
    var ipByte = initPermute(dataByte);
    var ipLeft = new Array(32);
    var ipRight = new Array(32);
    var tempLeft = new Array(32);
    var i = 0, j = 0, k = 0, m = 0, n = 0;
    for (k = 0; k < 32; k++) {
        ipLeft[k] = ipByte[k];
        ipRight[k] = ipByte[32 + k];
    }
    for (i = 0; i < 16; i++) {
        for (j = 0; j < 32; j++) {
            tempLeft[j] = ipLeft[j];
            ipLeft[j] = ipRight[j];
        }
        var key = new Array(48);
        for (m = 0; m < 48; m++) {
            key[m] = keys[i][m];
        }
        var tempRight = xor(pPermute(sBoxPermute(xor(expandPermute(ipRight), key))), tempLeft);
        for (n = 0; n < 32; n++) {
            ipRight[n] = tempRight[n];
        }
    }

    var finalData = new Array(64);
    for (i = 0; i < 32; i++) {
        finalData[i] = ipRight[i];
        finalData[32 + i] = ipLeft[i];
    }
    return finallyPermute(finalData);
}

function initPermute(originalData) {
    var i, m, n;
    var ipByte = new Array(64);
    for (i = 0, m = 1, n = 0; i < 4; i++, m += 2, n += 2) {
        for (j = 7, k = 0; j >= 0; j--, k++) {
            ipByte[i * 8 + k] = originalData[j * 8 + m];
            ipByte[i * 8 + k + 32] = originalData[j * 8 + n];
        }
    }
    return ipByte;
}

function expandPermute(rightData) {
    var i;
    var epByte = new Array(48);
    for (i = 0; i < 8; i++) {
        if (i == 0) {
            epByte[i * 6 + 0] = rightData[31];
        } else {
            epByte[i * 6 + 0] = rightData[i * 4 - 1];
        }
        epByte[i * 6 + 1] = rightData[i * 4 + 0];
        epByte[i * 6 + 2] = rightData[i * 4 + 1];
        epByte[i * 6 + 3] = rightData[i * 4 + 2];
        epByte[i * 6 + 4] = rightData[i * 4 + 3];
        if (i == 7) {
            epByte[i * 6 + 5] = rightData[0];
        } else {
            epByte[i * 6 + 5] = rightData[i * 4 + 4];
        }
    }
    return epByte;
}

function xor(byteOne, byteTwo) {
    var i;
    var xorByte = new Array(byteOne.length);
    for (i = 0; i < byteOne.length; i++) {
        xorByte[i] = byteOne[i] ^ byteTwo[i];
    }
    return xorByte;
}

function sBoxPermute(expandByte) {
    var sBoxByte = new Array(32);
    var binary = "";

    var s1 = new Array();
    s1[0] = [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7];
    s1[1] = [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8];
    s1[2] = [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0];
    s1[3] = [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13];

    var s2 = new Array();
    s2[0] = [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10];
    s2[1] = [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5];
    s2[2] = [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15];
    s2[3] = [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9];

    var s3 = new Array();
    s3[0] = [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8];
    s3[1] = [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1];
    s3[2] = [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7];
    s3[3] = [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12];

    var s4 = new Array();
    s4[0] = [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15];
    s4[1] = [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9];
    s4[2] = [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4];
    s4[3] = [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14];

    var s5 = new Array();
    s5[0] = [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9];
    s5[1] = [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6];
    s5[2] = [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14];
    s5[3] = [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3];

    var s6 = new Array();
    s6[0] = [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11];
    s6[1] = [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8];
    s6[2] = [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6];
    s6[3] = [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13];

    var s7 = new Array();
    s7[0] = [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1];
    s7[1] = [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6];
    s7[2] = [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2];
    s7[3] = [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12];

    var s8 = new Array();
    s8[0] = [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7];
    s8[1] = [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2];
    s8[2] = [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8];
    s8[3] = [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11];

    var m = 0;
    for (m = 0; m < 8; m++) {
        var i = 0, j = 0;
        i = expandByte[m * 6 + 0] * 2 + expandByte[m * 6 + 5];
        j = expandByte[m * 6 + 1] * 2 * 2 * 2
            + expandByte[m * 6 + 2] * 2 * 2
            + expandByte[m * 6 + 3] * 2
            + expandByte[m * 6 + 4];
        switch (m) {
            case 0 :
                binary = getBoxBinary(s1[i][j]);
                break;
            case 1 :
                binary = getBoxBinary(s2[i][j]);
                break;
            case 2 :
                binary = getBoxBinary(s3[i][j]);
                break;
            case 3 :
                binary = getBoxBinary(s4[i][j]);
                break;
            case 4 :
                binary = getBoxBinary(s5[i][j]);
                break;
            case 5 :
                binary = getBoxBinary(s6[i][j]);
                break;
            case 6 :
                binary = getBoxBinary(s7[i][j]);
                break;
            case 7 :
                binary = getBoxBinary(s8[i][j]);
                break;
        }
        sBoxByte[m * 4 + 0] = parseInt(binary.substring(0, 1));
        sBoxByte[m * 4 + 1] = parseInt(binary.substring(1, 2));
        sBoxByte[m * 4 + 2] = parseInt(binary.substring(2, 3));
        sBoxByte[m * 4 + 3] = parseInt(binary.substring(3, 4));
    }
    return sBoxByte;
}

function pPermute(sBoxByte) {
    var pBoxPermute = new Array(32);
    pBoxPermute[ 0] = sBoxByte[15];
    pBoxPermute[ 1] = sBoxByte[ 6];
    pBoxPermute[ 2] = sBoxByte[19];
    pBoxPermute[ 3] = sBoxByte[20];
    pBoxPermute[ 4] = sBoxByte[28];
    pBoxPermute[ 5] = sBoxByte[11];
    pBoxPermute[ 6] = sBoxByte[27];
    pBoxPermute[ 7] = sBoxByte[16];
    pBoxPermute[ 8] = sBoxByte[ 0];
    pBoxPermute[ 9] = sBoxByte[14];
    pBoxPermute[10] = sBoxByte[22];
    pBoxPermute[11] = sBoxByte[25];
    pBoxPermute[12] = sBoxByte[ 4];
    pBoxPermute[13] = sBoxByte[17];
    pBoxPermute[14] = sBoxByte[30];
    pBoxPermute[15] = sBoxByte[ 9];
    pBoxPermute[16] = sBoxByte[ 1];
    pBoxPermute[17] = sBoxByte[ 7];
    pBoxPermute[18] = sBoxByte[23];
    pBoxPermute[19] = sBoxByte[13];
    pBoxPermute[20] = sBoxByte[31];
    pBoxPermute[21] = sBoxByte[26];
    pBoxPermute[22] = sBoxByte[ 2];
    pBoxPermute[23] = sBoxByte[ 8];
    pBoxPermute[24] = sBoxByte[18];
    pBoxPermute[25] = sBoxByte[12];
    pBoxPermute[26] = sBoxByte[29];
    pBoxPermute[27] = sBoxByte[ 5];
    pBoxPermute[28] = sBoxByte[21];
    pBoxPermute[29] = sBoxByte[10];
    pBoxPermute[30] = sBoxByte[ 3];
    pBoxPermute[31] = sBoxByte[24];
    return pBoxPermute;
}

function finallyPermute(endByte) {
    var fpByte = new Array(64);
    fpByte[ 0] = endByte[39];
    fpByte[ 1] = endByte[ 7];
    fpByte[ 2] = endByte[47];
    fpByte[ 3] = endByte[15];
    fpByte[ 4] = endByte[55];
    fpByte[ 5] = endByte[23];
    fpByte[ 6] = endByte[63];
    fpByte[ 7] = endByte[31];
    fpByte[ 8] = endByte[38];
    fpByte[ 9] = endByte[ 6];
    fpByte[10] = endByte[46];
    fpByte[11] = endByte[14];
    fpByte[12] = endByte[54];
    fpByte[13] = endByte[22];
    fpByte[14] = endByte[62];
    fpByte[15] = endByte[30];
    fpByte[16] = endByte[37];
    fpByte[17] = endByte[ 5];
    fpByte[18] = endByte[45];
    fpByte[19] = endByte[13];
    fpByte[20] = endByte[53];
    fpByte[21] = endByte[21];
    fpByte[22] = endByte[61];
    fpByte[23] = endByte[29];
    fpByte[24] = endByte[36];
    fpByte[25] = endByte[ 4];
    fpByte[26] = endByte[44];
    fpByte[27] = endByte[12];
    fpByte[28] = endByte[52];
    fpByte[29] = endByte[20];
    fpByte[30] = endByte[60];
    fpByte[31] = endByte[28];
    fpByte[32] = endByte[35];
    fpByte[33] = endByte[ 3];
    fpByte[34] = endByte[43];
    fpByte[35] = endByte[11];
    fpByte[36] = endByte[51];
    fpByte[37] = endByte[19];
    fpByte[38] = endByte[59];
    fpByte[39] = endByte[27];
    fpByte[40] = endByte[34];
    fpByte[41] = endByte[ 2];
    fpByte[42] = endByte[42];
    fpByte[43] = endByte[10];
    fpByte[44] = endByte[50];
    fpByte[45] = endByte[18];
    fpByte[46] = endByte[58];
    fpByte[47] = endByte[26];
    fpByte[48] = endByte[33];
    fpByte[49] = endByte[ 1];
    fpByte[50] = endByte[41];
    fpByte[51] = endByte[ 9];
    fpByte[52] = endByte[49];
    fpByte[53] = endByte[17];
    fpByte[54] = endByte[57];
    fpByte[55] = endByte[25];
    fpByte[56] = endByte[32];
    fpByte[57] = endByte[ 0];
    fpByte[58] = endByte[40];
    fpByte[59] = endByte[ 8];
    fpByte[60] = endByte[48];
    fpByte[61] = endByte[16];
    fpByte[62] = endByte[56];
    fpByte[63] = endByte[24];
    return fpByte;
}

function getBoxBinary(i) {
    var binary = "";
    switch (i) {
        case 0 :
            binary = "0000";
            break;
        case 1 :
            binary = "0001";
            break;
        case 2 :
            binary = "0010";
            break;
        case 3 :
            binary = "0011";
            break;
        case 4 :
            binary = "0100";
            break;
        case 5 :
            binary = "0101";
            break;
        case 6 :
            binary = "0110";
            break;
        case 7 :
            binary = "0111";
            break;
        case 8 :
            binary = "1000";
            break;
        case 9 :
            binary = "1001";
            break;
        case 10 :
            binary = "1010";
            break;
        case 11 :
            binary = "1011";
            break;
        case 12 :
            binary = "1100";
            break;
        case 13 :
            binary = "1101";
            break;
        case 14 :
            binary = "1110";
            break;
        case 15 :
            binary = "1111";
            break;
    }
    return binary;
}
/*
 * generate 16 keys for xor
 */
function generateKeys(keyByte) {
    var key = new Array(56);
    var keys = new Array();

    keys[ 0] = new Array();
    keys[ 1] = new Array();
    keys[ 2] = new Array();
    keys[ 3] = new Array();
    keys[ 4] = new Array();
    keys[ 5] = new Array();
    keys[ 6] = new Array();
    keys[ 7] = new Array();
    keys[ 8] = new Array();
    keys[ 9] = new Array();
    keys[10] = new Array();
    keys[11] = new Array();
    keys[12] = new Array();
    keys[13] = new Array();
    keys[14] = new Array();
    keys[15] = new Array();
    var loop = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

    var i;
    for (i = 0; i < 7; i++) {
        for (j = 0, k = 7; j < 8; j++, k--) {
            key[i * 8 + j] = keyByte[8 * k + i];
        }
    }

    var i, j, k;
    for (i = 0; i < 16; i++) {
        var tempLeft = 0;
        var tempRight = 0;
        for (j = 0; j < loop[i]; j++) {
            tempLeft = key[0];
            tempRight = key[28];
            for (k = 0; k < 27; k++) {
                key[k] = key[k + 1];
                key[28 + k] = key[29 + k];
            }
            key[27] = tempLeft;
            key[55] = tempRight;
        }
        var tempKey = new Array(48);
        tempKey[ 0] = key[13];
        tempKey[ 1] = key[16];
        tempKey[ 2] = key[10];
        tempKey[ 3] = key[23];
        tempKey[ 4] = key[ 0];
        tempKey[ 5] = key[ 4];
        tempKey[ 6] = key[ 2];
        tempKey[ 7] = key[27];
        tempKey[ 8] = key[14];
        tempKey[ 9] = key[ 5];
        tempKey[10] = key[20];
        tempKey[11] = key[ 9];
        tempKey[12] = key[22];
        tempKey[13] = key[18];
        tempKey[14] = key[11];
        tempKey[15] = key[ 3];
        tempKey[16] = key[25];
        tempKey[17] = key[ 7];
        tempKey[18] = key[15];
        tempKey[19] = key[ 6];
        tempKey[20] = key[26];
        tempKey[21] = key[19];
        tempKey[22] = key[12];
        tempKey[23] = key[ 1];
        tempKey[24] = key[40];
        tempKey[25] = key[51];
        tempKey[26] = key[30];
        tempKey[27] = key[36];
        tempKey[28] = key[46];
        tempKey[29] = key[54];
        tempKey[30] = key[29];
        tempKey[31] = key[39];
        tempKey[32] = key[50];
        tempKey[33] = key[44];
        tempKey[34] = key[32];
        tempKey[35] = key[47];
        tempKey[36] = key[43];
        tempKey[37] = key[48];
        tempKey[38] = key[38];
        tempKey[39] = key[55];
        tempKey[40] = key[33];
        tempKey[41] = key[52];
        tempKey[42] = key[45];
        tempKey[43] = key[41];
        tempKey[44] = key[49];
        tempKey[45] = key[35];
        tempKey[46] = key[28];
        tempKey[47] = key[31];
        var m;
        switch (i) {
            case 0:
                for (m = 0; m < 48; m++) {
                    keys[ 0][m] = tempKey[m];
                }
                break;
            case 1:
                for (m = 0; m < 48; m++) {
                    keys[ 1][m] = tempKey[m];
                }
                break;
            case 2:
                for (m = 0; m < 48; m++) {
                    keys[ 2][m] = tempKey[m];
                }
                break;
            case 3:
                for (m = 0; m < 48; m++) {
                    keys[ 3][m] = tempKey[m];
                }
                break;
            case 4:
                for (m = 0; m < 48; m++) {
                    keys[ 4][m] = tempKey[m];
                }
                break;
            case 5:
                for (m = 0; m < 48; m++) {
                    keys[ 5][m] = tempKey[m];
                }
                break;
            case 6:
                for (m = 0; m < 48; m++) {
                    keys[ 6][m] = tempKey[m];
                }
                break;
            case 7:
                for (m = 0; m < 48; m++) {
                    keys[ 7][m] = tempKey[m];
                }
                break;
            case 8:
                for (m = 0; m < 48; m++) {
                    keys[ 8][m] = tempKey[m];
                }
                break;
            case 9:
                for (m = 0; m < 48; m++) {
                    keys[ 9][m] = tempKey[m];
                }
                break;
            case 10:
                for (m = 0; m < 48; m++) {
                    keys[10][m] = tempKey[m];
                }
                break;
            case 11:
                for (m = 0; m < 48; m++) {
                    keys[11][m] = tempKey[m];
                }
                break;
            case 12:
                for (m = 0; m < 48; m++) {
                    keys[12][m] = tempKey[m];
                }
                break;
            case 13:
                for (m = 0; m < 48; m++) {
                    keys[13][m] = tempKey[m];
                }
                break;
            case 14:
                for (m = 0; m < 48; m++) {
                    keys[14][m] = tempKey[m];
                }
                break;
            case 15:
                for (m = 0; m < 48; m++) {
                    keys[15][m] = tempKey[m];
                }
                break;
        }
    }
    return keys;
}
if (!window.top.pop) {
    window.top.closePop = function (doc) {
        doc = doc || window.top.document;

        var oldPop = doc.getElementById("popWindow");
        if (oldPop) {
            doc.body.removeChild(oldPop);
        }
    }
    window.top.pop = function (url, width, height) {
        height = height || 200;
        width = width || 600;
        var doc = window.top.document;

        window.top.closePop(doc);

        var maskDiv = doc.createElement("div");
        maskDiv.id = "popWindow";
        maskDiv.style.position = "fixed";
        maskDiv.style.left = "0";
        maskDiv.style.top = "0";
        maskDiv.style.width = "100%";
        maskDiv.style.height = "100%";
        maskDiv.style.zIndex = "9999";


        //maskDiv.style = "position:fixed;left: 0;top: 0;width: 100%;height: 100%;z-index: 900;";

        var maskCon = doc.createElement("div");
        maskCon.id = "maskConId";
        maskCon.style.background = "#000000";
        maskCon.style.filter = "alpha(opacity=50)";
        maskCon.style.opacity = ".5";
        maskCon.style.width = "100%";
        maskCon.style.height = "100%";
        maskCon.style.position = "absolute";
        maskCon.style.left = "0";
        maskCon.style.top = "0";
        //maskCon.style="background: #292929;filter: alpha(opacity=70);opacity: .7;width: 100%;height: 100%;position:" +
        //              " absolute;left: 0;top: 0;";
        maskDiv.appendChild(maskCon);
        var maskIframeDiv = doc.createElement("div");
        maskIframeDiv.id = "maskIframeDivId";
        var maskIframe = doc.createElement("iframe");
        maskIframe.id = "maskIframeId";
        maskIframe.style.position = "absolute";
        maskIframe.style.width = width + "px";
        maskIframe.style.height = height + "px";
        maskIframe.style.top = "50%";
        maskIframe.frameborder = 0;
        maskIframe.style.left = "50%";
        maskIframe.scrolling = 'no';
        maskIframe.resizable = 'yes';
        maskIframe.style.overflow = 'hidden';
        maskIframe.setAttribute("frameborder", "0", 0); //for ie7+
        maskIframe.style.border = 0;
        maskIframe.allowTransparency = "true";


        //maskIframe.style = "position: absolute;width:"+width+"px;height:"+height+"px;top:50%;left:50%;";
        maskDiv.appendChild(maskIframeDiv);
        maskIframeDiv.appendChild(maskIframe);
        maskIframe.src = url;
        doc.body.appendChild(maskDiv);
        if (window.navigator.appVersion.indexOf('MSIE 6.0') != -1) { //add by zhangqc 独立于ie6的样式
            maskDiv.style.position = 'absolute';
            maskDiv.style.height = getCurrentPgHeight() + "px";
            maskCon.style.height = getCurrentPgHeight() + "px";
            setTimeout(function () {
                maskIframe.style.top = getTopScrollTop() + "px";
                maskIframe.style.left = maskIframe.offsetLeft - ( width / 2) + "px";
            }, 0);
        } else {
            setTimeout(function () {
                maskIframe.style.top = maskIframe.offsetTop - (height / 2) + "px";
                maskIframe.style.left = maskIframe.offsetLeft - ( width / 2) + "px";
            }, 0);
        }


    };
}
function getCurrentPgHeight() {
    var h = 0;
    try {
        h = document.documentElement.scrollHeight;
    } catch (e) {
        h = document.body.scrollHeight;
    }
    return h;
}
function getTopScrollTop() //add by zhangqc  20111109
{
    return top.document.documentElement.scrollTop + top.document.body.scrollTop;
}
