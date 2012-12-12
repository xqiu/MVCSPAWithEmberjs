

//// Hooks up a form to jQuery Validation
//ko.bindingHandlers.validate = {
//    init: function (elem, valueAccessor) {
//        $(elem).validate();
//    }
//};

//// Simulates HTML5-style placeholders on older browsers
//ko.bindingHandlers.placeholder = {
//    init: function (elem, valueAccessor) {
//        var placeholderText = ko.utils.unwrapObservable(valueAccessor()),
//            input = $(elem);

//        input.attr('placeholder', placeholderText);

//        // For older browsers, manually implement placeholder behaviors
//        if (!Modernizr.input.placeholder) {
//            input.focus(function () {
//                if (input.val() === placeholderText) {
//                    input.val('');
//                    input.removeClass('placeholder');
//                }
//            }).blur(function () {
//                setTimeout(function () {
//                    if (input.val() === '' || input.val() === placeholderText) {
//                        input.addClass('placeholder');
//                        input.val(placeholderText);
//                    }
//                }, 0);
//            }).blur();

//            input.parents('form').submit(function () {
//                if (input.val() === placeholderText) {
//                    input.val('');
//                }
//            });
//        }
//    }
//};