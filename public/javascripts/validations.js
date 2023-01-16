//a module for all string validation functions
const validatorModule = (function() {
    "use strict";
    const isNotEmpty = function (str)  {
        return  {
            isValid: (str.value.length !== 0),
            message: 'please enter a non empty value'
        };
    };
    //check if not selected
    const isNotSelected = function (value)  {
        return  {
            isValid: (value.options.selectedIndex !== 0),
            message: 'please select value'
        };
    };

    //check if sol or date
    const isNotDateOrSol = function (str) {
        return {
            isValid:checkDateOrSol(str),
            message: 'please enter a sol number or valid date'
        };
    };

    //check if sol or date exist
    const isExistDateOrSol = function (input) {
        return checkDateRange(input);
    };

    //check if the email is valid.
    const isValidEmail = function(input){
        return {
            isValid:validEmail(input),
            message: 'please enter valid email'
        };
    };

    //check if the passwords same.
    const samePasswords = function(input){
        return {
            isValid:(input[0].value===input[1].value),
            message: 'confirm password not the same.'
        };
    };

    //check if the password valid
    const validPassword = function(input){
        return {
            isValid:(input.value.length>=8),
            message: 'password must to have at least 8 characters .'
        };
    };

    const validatorEmailPass = function(input) {

    };

    //check if the email valid.
    const validEmail = function(input) {
        const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (input.value.match(regexEmail)) {
            return true;
        }
        return false;
    };


    //check if the date is in the range
    const checkDateRange = function(input)
    {
        let regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(input[0].value.match(regEx))
        {
            let date = new Date(input[0].value);
            if(date > input[2]['list'][input[1].toString()]['landing_date'] && date <  input[2]['list'][input[1].toString()]['max_date'])
                return {
                    isValid:true,
                    message: ''
                } ;
            if(date < input[2]['list'][input[1].toString()]['landing_date'])
            return {
                isValid:false,
                message: 'date is not in mission range. mission start date at: ' + input[2]['list'][input[1].toString()]['landing_date']
            } ;
            else
                return {
                    isValid:false,
                    message: 'date is not in mission range. mission max date at: ' + input[2]['list'][input[1].toString()]['max_date']
                } ;
        }
        else
        {
            if(input[0].value < input[2]['list'][input[1].toString()]['max_sol'])
                return {
                    isValid:true,
                    message: ''
                } ;
            return {
                isValid:false,
                message: 'sol is not in mission range. max sol is: ' + input[2]['list'][input[1].toString()]['max_sol']
            } ;
        }
    };

    //check if the value is sol or date or not both of them.
    const checkDateOrSol = function(str)
    {
        let regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(str.value.match(regEx))
        {
            let d = new Date(str.value);
            let dNum = d.getTime();
            if(!dNum && dNum !== 0)
                return false; // NaN value, Invalid date
            return d.toISOString().slice(0,10) === str.value;
        }
        else if(!isNaN(str.value) && Number.isInteger(Number(str.value)) && str.value > 0 )
        {
            return true;
        }
        return false;
    };

    //check the status from the server.
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }

    return {
        isNotEmpty,
        isNotSelected,
        status,
        isNotDateOrSol,
        isExistDateOrSol,
        isValidEmail,
        samePasswords,
        validPassword
    };
}) ();

//check if the input is valid.
const validateInput = (inputElement, validateFunc ,flag) => {
    let errorElement;
    //check if there is one params or more.
    if(!flag)
        errorElement = inputElement.nextElementSibling; // the error message div
    else
        errorElement = inputElement[0].nextElementSibling; // the error message div
    let v = validateFunc(inputElement); // call the validation function

    errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
    //check if there is one params or more.
    if(!flag)
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
    else
        v.isValid ? inputElement[0].classList.remove("is-invalid") : inputElement[0].classList.add("is-invalid");
    return v.isValid;
};