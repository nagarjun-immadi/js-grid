var tbody = document.getElementById('grid-body');
var searchInput = document.getElementById('search');
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