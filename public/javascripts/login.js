const LoginModule = (function() {
    "use strict";

});

//validator of the fronted side of login
const validatorLogin = (event) =>{
    let email = document.getElementById("Email");
    let pass = document.getElementById("Password");

    // display all errors, force checking all fields
    let v1 = validateInput(email, validatorModule.isValidEmail, false);
    let v2 = validateInput(pass, validatorModule.isNotEmpty, false);

    let v = v1 && v2;

    if (!v)
    {
        document.getElementById("errormessageLogin").innerText = "";
        event.preventDefault();
    }



    return v;
}

//check events.
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("login").addEventListener("click",validatorLogin);
    if ( window.history.replaceState ) {
        window.history.replaceState( null, null, window.location.href );
    }
});