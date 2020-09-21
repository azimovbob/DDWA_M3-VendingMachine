const _url = 'http://tsg-vending.herokuapp.com/';
var money = 0.0;

//loads items
function loadItems(){
    $('#items').empty();
    $.ajax({
        type: 'GET',
        url: _url + 'items',
        success: function(items){
        const itemsContent = $('#items');
        $.each(items, function(index, item){
            var box = '<div onclick = "getItem('+ (index+1) + ',' + item.id + ')">'; 
            var boxItem = '<span class=itemId>' + (index+1) + '</span><span class=itemName>'+item.name+'</span>';
            boxItem +='<span class = "itemPrice" id = "itemPrice' + item.id + '"' + '>$'+ item.price.toFixed(2) +'</span>'
            boxItem +='<span class = "itemQuantity">Quantity Left: <span id = "itemQuantity'+item.id+'">'+ item.quantity + '</span>'
            itemsContent.append($(box).attr({class: 'box-item', id: 'box'+index}));
            $('#box'+index).append(boxItem);
    })
        },
        error: function(){
            handleErrorMessage('Error with the server');
        }
    });
}   


//Make purchase button clicked
function vendItem(){ 
    var itemId = $('#itemId').val();
    var actualId = $('#actualId').val();
    var totalMoney = $('#moneyInput').val();
    if(itemId  == ''){
        handleErrorMessage('Please make a selection');
    }else if(totalMoney == ''){
        handleErrorMessage('Please deposit money');
    }else{
        $.ajax({
            type: 'POST',
            url: _url + 'money/' + totalMoney + '/item/' + actualId,
            data: '',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            'datatype': 'json',
            success: function(change){
                
                displayChange(change);
                $('#userMessage').val("Thank you!!!");
                $('#moneyInput').val('');
                $('#itemId').val('');
                $('#actualId').val('');
                money=0;
                loadItems();
            },
            error: function(error){
                handleErrorMessage(error.responseJSON.message);
                loadItems();
            }
        });
    }
}

//Get Item ID and display it for user
function getItem(index, id){
    $('#userMessage').val('');
    $('#itemId').val(index);
    $('#actualId').val(id);
}

//Display coins to the user
function displayChange(change){
    var quarter = '';
    var dime = '';
    var nickel = '';
    var penny = '';

    if(change.quarters > 0){
        if(change.quarters > 1){
            quarter = change.quarters + ' Quarters';
        }else{
            quarter = change.quarters + ' Quarter';
        }
    }

    if(change.dimes > 0){
        if(change.dimes > 1){
            dime = change.dimes + ' Dimes';
        }else{
            dime = change.dimes + ' Dime';
        }
    }

    if(change.nickels > 0){
        if(change.nickels > 1){
            nickel = change.nickels + ' Nickels';
        }else{
            nickel = change.nickels + ' Nickel';
        }
    }

    if(change.pennies > 0){
        if(change.penneis>1){
            penny = change.pennies + ' Pennies';
        }else{
            penny = change.pennies + ' Penny';
        }
        
    }
    $('#change').val(quarter + ' ' + dime + ' ' + nickel + ' ' + penny);
}

//Get money from user Methods
function onDollarBtnClicked(){
    money+=1;
    $('#moneyInput').val(money.toFixed(2));
}

function onQuaterBtnClicked(){
    money+=0.25;
    $('#moneyInput').val(money.toFixed(2));
}

function onDimeBtnClicked(){
    money+=0.1;
    $('#moneyInput').val(money.toFixed(2));
}

function onNickelBtnClicked(){
    money+=0.05;
    $('#moneyInput').val(money.toFixed(2));
}

//Error handler
function handleErrorMessage(msg){
    $('#userMessage').val(msg)
}


//Change return button clicked
function changeReturnBtnClicked(){
    $('#moneyInput').val('');
    $('#userMessage').val('');
    $('#change').val('');
    $('#itemId').val('');
    $('#actualId').val('');
    money=0;
    loadItems();
}

$(document).ready(function(){
    loadItems();
});