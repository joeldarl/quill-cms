var simplemde = new SimpleMDE();

function copyUrl(textId) {
    var copyText = document.getElementById(textId);
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
}