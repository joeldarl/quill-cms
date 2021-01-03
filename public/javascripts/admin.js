function copyUrl(textId) {
    var copyText = document.getElementById(textId);
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert('Url copied to clipboard.')
}

var fileInput  = document.querySelector( ".input-file" ),  
    button     = document.querySelector( ".input-file-trigger" ),
    returnText = document.querySelector(".file-return-text");
      
if (button && fileInput && returnText)
{
    button.addEventListener( "keydown", function( event ) {  
        if ( event.keyCode == 13 || event.keyCode == 32 ) {  
            fileInput.focus();  
        }  
    });
    button.addEventListener( "click", function( event ) {
       fileInput.focus();
       return false;
    });  
    fileInput.addEventListener( "change", function( event ) {  
        returnText.innerHTML = this.value;  
    });  
}

// Date input
$("#edit-form").submit(function( event ) {
    var timeStr = $("#time-editor").val();
    $("#date").val($("#date-selector").val() + ' ' + timeStr);
});

// Sortable tables
(() => {
    $(".sortable").sortable();
    $(".sortable").disableSelection();
})();

function saveSort(id, postUrl) {
    var table = document.getElementById(id);
    var rows = table.getElementsByClassName('item');
    var ids = [];
    for(var i = 0; i < rows.length; i++){
        ids.push(rows[i].getAttribute("item-id"));
    }
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = (e) => {
        if (xmlhttp.readyState === 4) {
            let res = JSON.parse(xmlhttp.response);
            if(res.err) {
                flashMessage(res.err);
            } else {
                flashMessage(res.info);
            }
        }
    };

    xmlhttp.open("POST", postUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send(JSON.stringify({"ids":ids}));
}

function flashMessage(message) {
    var span = document.createElement("span");
    span.textContent = message;
    span.className = 'flash-message';
    document.getElementById("admin-body").prepend(span);
    setTimeout(() => {
        span.remove();
    }, 10000)
}