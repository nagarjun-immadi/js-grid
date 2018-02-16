var tbody = document.getElementById('grid-body');
var searchInput = document.getElementById('search');
var addUser = document.getElementById('add-user');
var formHolder = document.getElementById('form-holder');
var close = document.getElementById('close');
var save = document.getElementById('save');
var usersData = [];

function buildTable(users) {
    var rows = '';
    for (var index = 0; index < users.length; index++) {
        var user = users[index];
        rows += '<tr> \
                    <td>'+ user.id +'</td> \
                    <td>'+ user.first_name +'</td> \
                    <td>'+ user.last_name +'</td> \
                    <td>'+ user.email +'</td> \
                    <td>'+ user.gender +'</td> \
                    <td>'+ user.phone +'</td> \
                    <td>'+ user.address +'</td> \
                    <td>'+ user.university +'</td> \
                    <td>'+ user.country +'</td> \
                    <td>'+ user.dob +'</td> \
                    <td>'+ user.skills +'</td> \
                    <td>'+ user.experience +'</td> \
                </tr>';
    }
    tbody.innerHTML = rows;
}

function getUsers() {
    tbody.innerHTML = '<tr class="message"><td colspan=12><img src="img/loader.gif" /></td></tr>';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        usersData = JSON.parse(this.responseText);
        buildTable(usersData);
      }
    };
    xhttp.open("GET", "http://localhost:3000/users", true);
    xhttp.send();
}

getUsers();

searchInput.addEventListener("keyup", function(event) {
    var searchTerm = event.target.value;
    if(searchTerm.length > 1) {
        var filteredRecords = [];
        var userObj = usersData[0];
        var keys = Object.keys(userObj);
        for (var index = 0; index < usersData.length; index++) {
            var user = usersData[index];
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                var value = String(user[key]).toLowerCase();
                if(value.indexOf(searchTerm) !== -1) {
                    filteredRecords.push(user);
                    break;
                }
            }
        }
        if(filteredRecords.length > 0) {
            buildTable(filteredRecords);
        } else {
            tbody.innerHTML = '<tr class="message"><td colspan=12>No Records Founds</td></tr>';
        }
    } else {
        buildTable(usersData);
    }
});

addUser.addEventListener('click', function(event){
    formHolder.classList.add("show");
    formHolder.classList.remove("hide");
    clearErrors();
    var userForm = document.getElementsByName('user-form')[0];
    userForm.reset();
});

close.addEventListener('click', function(event){
    formHolder.classList.add("hide");
    formHolder.classList.remove("show");
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function clearErrors() {
    var errorDivIds = [
        'first_name_error',
        'last_name_error',
        'email_error',
        'gender_error',
        'phone_error',
        'address_error',
        'university_error',
        'country_error',
        'dob_error',
        'skills_error',
        'experience_error',
    ];

    for (var index = 0; index < errorDivIds.length; index++) {
        var element = document.getElementById(errorDivIds[index]);
        element.innerHTML = '';
    }
}

save.addEventListener('click', function(event){
    event.preventDefault();
    
    clearErrors();

    var errors = {};

    var firstName = document.querySelector('input[name="first_name"]');
    if(!firstName.value) {
        errors.first_name = "Please enter first name";
    }

    var lastName = document.querySelector('input[name="last_name"]');
    if(!lastName.value) {
        errors.last_name = "Please enter last name";
    }

    var email = document.querySelector('input[name="email"]');
    if(!email.value) {
        errors.email = "Please enter email";
    } else {
        if(!validateEmail(email.value)) {
            errors.email = "Please enter a valid email";
        }
    }

    var genderArr = document.querySelectorAll('input[name="gender"]');
    var genderValue = '';
    for (var i = 0; i < genderArr.length; i++) {
        if (genderArr[i].checked) {
            genderValue = genderArr[i].value;
            break;
        }
    }
    if(!genderValue) {
        errors.gender = "Please select";
    }

    var phone = document.querySelector('input[name="phone"]');
    if(!phone.value) {
        errors.phone = "Please enter phone number";
    } else {
        var phoneValue = String(phone.value);
        if(phoneValue.length != 10) {
            errors.phone = "Please enter a valid phone number";
        }
    }

    var address = document.querySelector('textarea[name="address"]');
    if(!address.value) {
        errors.address = "Please enter address";
    }

    var university = document.querySelector('input[name="university"]');
    if(!university.value) {
        errors.university = "Please enter university";
    }

    var country = document.querySelector('select[name="country"]');
    if(!country.value) {
        errors.country = "Please select a country";
    }

    var dob = document.querySelector('input[name="dob"]');
    if(!dob.value) {
        errors.dob = "Please enter a date";
    }

    var skillsArr = document.querySelectorAll('input[name="skills"]');
    var skillsValue = '';
    for (var i = 0; i < skillsArr.length; i++) {
        if (skillsArr[i].checked) {
            skillsValue = skillsValue ? skillsValue +', '+ skillsArr[i].value : skillsArr[i].value;
        }
    }
    if(!skillsValue) {
        errors.skills = "Please select a skill";
    }

    var experience = document.querySelector('input[name="experience"]');
    if(!experience.value) {
        errors.experience = "Please enter experience";
    }

    for (var key in errors) {
        if (errors.hasOwnProperty(key)) {
            var error = errors[key];
            var errorDiv = document.getElementById(key+'_error');
            errorDiv.innerHTML = error;
        }
    }

    if(Object.keys(errors).length === 0) {
        var data = {
            "first_name": firstName.value,
            "last_name": lastName.value,
            "email": email.value,
            "gender": genderValue,
            "phone": String(phone.value),
            "address": address.value,
            "university": university.value,
            "country": country.value,
            "dob": dob.value,
            "skills": skillsValue,
            "experience": experience.value
        };

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 201) {
            var newUser = JSON.parse(this.responseText);
            console.log(newUser);
            usersData.push(newUser);
            buildTable(usersData);
            formHolder.classList.add("hide");
            formHolder.classList.remove("show");

            var userForm = document.getElementsByName('user-form')[0];
            userForm.reset();
          }
        };
        
        xhttp.open("POST", "http://localhost:3000/users", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(data));
    }
});