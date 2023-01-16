const PassModule = (function() {
    "use strict";

});

// validate the input elements
const validatePassForm = (event) => {
    let v;
    let pass = document.getElementById("password");
    let confirm = document.getElementById("confirm");

    // display all errors, force checking all fields
    let v1 = validateInput(pass , validatorModule.validPassword ,false);
    let v2= true;
    if(v1)
        v2 = validateInput([confirm,pass] ,validatorModule.samePasswords , true )
    v = v1 && v2;
    if(!v)
        event.preventDefault();
    return v;
};

//check events in pass page.
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("password-button").addEventListener("click",validatePassForm);
});