$('pre code').each(function(){
    var lines = $(this).text().split('\n').length - 1, widther='';
    if (lines>99) {
        widther = 'widther'
    }
    var $numbering = $('<ul/>').addClass('pre-numbering ' + widther).attr("unselectable","on");
    $(this).addClass('has-numbering ' + widther)
            .parent()
            .append($numbering);
    for(var i=1;i<=lines;i++){
        $numbering.append($('<li/>').text(i));
    }
});