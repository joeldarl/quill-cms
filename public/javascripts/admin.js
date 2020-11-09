$().ready(()=> {

    // var textareas = document.getElementsByTagName("textarea");
    
    // if(textareas.length){
    //     var simplemde = new SimpleMDE();
    // }

    function copyUrl(textId) {
        var copyText = document.getElementById(textId);
        copyText.select();
        copyText.setSelectionRange(0, 99999)
        document.execCommand("copy");
    }

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

});