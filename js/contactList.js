$(document).ready(function () {
    
    loadContacts();

    $(document).on("click", '#add-button', addContact);


    $('#edit-button').click(function(event){

        var haveValidationErrors = checkAndDisplayValidationErrors($('#edit-form').find('input'));

        if(haveValidationErrors){
            return false;
        }

        $.ajax({
            type: 'PUT',
            url: 'http://localhost:8080/contact/' + $('#edit-contact-id').val(),
            
            data: JSON.stringify({
                contactId: $('#edit-contact-id').val(),
                firstName: $('#edit-first-name').val(),
                lastName: $('#edit-last-name').val(),
                company: $('#edit-company').val(),
                email: $('#edit-email').val(),
                phone: $('#edit-phone').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            'datatype': 'json',
            success: function(){
                alert("success")
                $('#errorMessages').empty();
                hideEditForm();
                loadContacts();
            },
            error: function(){
                alert("failure");
                $('#errorMessages').append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later'));
            }
        })
    });
});

function loadContacts() {
    clearContactTable();
    const contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/contacts',
        success: function(contactArray){
            $.each(contactArray, function(index, contact){
                var name = contact.firstName +' '+contact.lastName;
                var company = contact.company;

                var row = '<tr>';
                row += '<td>' + name + '</td>';
                row += '<td>' + company + '</td>';
                row += '<td><a onclick = deleteContact(' + contact.contactId + ')>Delete<a></td>';
                row += '<td><a onclick = "showEditForm(' + contact.contactId + ')">Edit<a></td>';
                contentRows.append(row);

            })
        },
        error: function(){
            $('#errorMessages').append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later'));

        }
    })
}


function addContact(event){
    event.preventDefault();

    var haveValidationErrors = checkAndDisplayValidationErrors($('#add-form').find('input'));

    if(haveValidationErrors){
        return false;
    }

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/contact',
        data: JSON.stringify({
            firstName: $('#add-first-name').val(),
            lastName: $('#add-last-name').val(),
            company: $('#add-company').val(),
            email: $('#add-email').val(),
            phone: $('#add-phone').val()
        }),
        headers:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        'datatype': 'json',
        success: function(){
            $('#errorMessages').empty();
            $('#add-first-name').val('');
            $('#add-last-name').val('');
            $('#add-company').val('');
            $('#add-email').val('');
            $('#add-phone').val('');
            loadContacts();
        },
        error: function(){
            $('#errorMessages').append($('<li>')
            .attr({class: 'list-group-item list-group-item-danger'})
            .text('Error calling web service. Please try again later'));
        }
    })
}


function clearContactTable(){
    $('#contentRows').empty();
}

function showEditForm(contactId){
    $('#errorMessages').empty();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/contact/' + contactId,
        success: function(data, status){
            $('#edit-first-name').val(data.firstName);
            $('#edit-last-name').val(data.lastName);
            $('#edit-company').val(data.company);
            $('#edit-email').val(data.email);
            $('#edit-phone').val(data.phone);
            $('#edit-contact-id').val(data.contactId);
        },
        error: function(){
            $('#errorMessages').append($('<li>')
            .attr({class: 'list-group-item list-group-item-danger'})
            .text('Error calling web service. Please try again later'));
        } 
    })

    $('.contactTableDiv').hide();
    $('#editFormDiv').show();
}
  
function hideEditForm(){
    $('#errorMessages').empty();

    $('#edit-first-name').val('');
    $('#edit-last-name').val('');
    $('#edit-company').val('');
    $('#edit-email').val('');
    $('#edit-phone').val('');

    
    $('#editFormDiv').hide();
    $('.contactTableDiv').show();
}

function deleteContact(contactId){
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/contact/' + contactId,
        success: function(){
            loadContacts();
        }
    })
}

function checkAndDisplayValidationErrors(input){
    $('#errorMessages').empty();

    var errorMessages = [];

    input.each(function(){
        if(!this.validity.valid){
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + this.validationMessage);
        }
    });

    if(errorMessages.length > 0){
        $.each(errorMessages, function(index, message){
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
        })
        return true;
    }else{
        return false;
    }
}
