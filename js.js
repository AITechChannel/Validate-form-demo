
function Validator(option) {
    var formElement = document.querySelector(option.form);
    var selectorRules = {};

    if (formElement) {
        formElement.onsubmit = function (e) {
            e.preventDefault();
        }

        function validate (inputElement, rule) {

            var inputCheck;
            var rules = selectorRules[rule.selector];
            var errorText = inputElement.parentElement.querySelector('.form-message');
            
            for (var i = 0; i < rules.length; ++i){

            inputCheck = rules[i](inputElement.value);
            if (inputCheck) break;

            }

            if (inputCheck) {
            errorText.innerText = inputCheck;
            inputElement.style.borderColor = 'red';
            } else {
            errorText.innerText = '';
            inputElement.style.borderColor = 'rgb(115, 156, 160)';
            }

       }
    //    Bước 1, lặp qua từng function trong mảng có key là rules
        option.rules.forEach( function(rule) {
            // Lấy ra từng rule con, và lấy giá tị truyền qua key là rule.selector
          if (Array.isArray(selectorRules[rule.selector])) {
              selectorRules[rule.selector].push(rule.check)
            // lần 2 push thêm func vào value có key là rule.selector

            } else {    
                selectorRules[rule.selector] = [rule.check]
            }
            console.log(selectorRules)
            // lần nhất kiểm tra thấy selectorRules[rule.selector] trống thì chèn các func đã định nghĩa vào mãng rỗng này
            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement){
                inputElement.onblur = function (){
                    validate (inputElement, rule)
                }
            }
        })
    }
}

Validator.isRequied = function (selector) {
    return {
        selector: selector,
        check: function (value) {
            return value.trim() ? undefined : "Vui lòng nhập tên đầy đủ của bạn";
        }
    }
}


Validator.isEmail = function (selector) {
    return {
        selector: selector,
        check: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            // regex.test là cú pháp test regex
            if (regex.test(value)) {
                undefined
            } else {
                if (value.trim()==='') {
                    return 'Vui lòng nhập Email của bạn'
                } else {
                    return 'Ồ! Trường này phải là Email'
                }
            }
        }
    }
}


Validator.characters = function (selector, min, max) {
    return {
        selector: selector,
        check: function (value) {
            if (min <= value.length & value.length <= max & value.trim() != '') {
                undefined
            } else if (value.length <min & value.trim() != '') {
                return `Mật khẩu tối thiểu là ${min} ký tự`
            } else if (value.length >max & value.trim() != '') {
                return `Mật khẩu tối đa là ${max} ký tự`
            } else {
                return `Vui lòng nhập mật khẩu của bạn`
            }
        }
    }
}


Validator.isConfirm = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        check: function (value) {
            // return value === getConfirmValue() ? undefined : message ||'Giá trị nhập vào không đúng'
            if (value === getConfirmValue()) {
                undefined
            } else if (message) {
                    if(value == '') {
                        return 'Vui lòng nhập lại mật khẩu'
                    } else {
                        return message
                    }
                } else {
                    return 'Giá trị nhập vào không đúng'
            }
        }
    }
}


Validator({
    form: '#form-1',
    rules: [
        Validator.isRequied('#fullname'),
        Validator.isRequied('#email'),
        Validator.isEmail('#email'),
        Validator.characters('#password', 6, 12),
        Validator.isConfirm('#password-confirm', function () {
            return document.querySelector('#password').value
        }, 'Mật khẩu nhập lại không chính xác')
    ]
});