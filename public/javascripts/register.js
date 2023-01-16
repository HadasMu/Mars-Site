const RegisterModule = (function() {
    "use strict";

});

// validate the input elements
const validateRegisterForm = async (event) => {
    event.preventDefault();
    let v;
    let email = document.getElementById("Email");
    let name = document.getElementById("First_name");
    let family_name = document.getElementById("Family_name");

    let data = { "email": event.currentTarget.form[0].value ,"first_name": event.currentTarget.form[1].value ,"family_name": event.currentTarget.form[2].value};

    // display all errors, force checking all fields
    let v1 = validateInput(email, validatorModule.isValidEmail, false);
    let v2 = validateInput(name, validatorModule.isNotEmpty, false);
    let v3 = validateInput(family_name, validatorModule.isNotEmpty, false);
    v = v1 && v2 && v3;

    await fetch('/api/registerCheck/' + email.value)
        .then(validatorModule.status)
        .then(res => res.json())
        .then(res => {
            if(res['exist'])
            {
                let errorElement = email.nextElementSibling;
                errorElement.innerHTML = "email already exist. please try to log in";
                v = false;
            }
            else
            {
                if (!v)
                    event.preventDefault();
                else
                    fetch('/register', {
                        method: 'POST',
                        mode: 'cors',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({data})
                    }).then((res) => {
                        window.location.href = res.url;
                    })
            }
        })
        .catch(err => console.log(err));
};

//check events in register page
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("register-button").addEventListener("click",validateRegisterForm);
});