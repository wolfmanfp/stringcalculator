var color = 'black';
var cellNumber = 10;
var appName = "wolfmanfp_draw";
var fileName = "myPicture";

function createTable() {
    var $tableholder = $('#tableholder');
    var $table= $('<table>');

    for (var i = 0; i < cellNumber; i++) {
        var $tr = $('<tr>');
        for (var j = 0; j < cellNumber; j++) {
            var $td = newTableCell();
            $tr.append($td);
        }
        $table.append($tr);
    }
    $tableholder.append($table);
}

function newTableCell() {
    return $('<td>').mousedown(function(e) {
        switch (e.which) {
            case 1:
                $(this).removeClass()
                    .addClass(color);
                break;
            case 3:
            default:
                $(this).removeClass();
                break;
    }}).on("contextmenu", function(){
        return false;
    });
}

function loadColors() {
    var $colors = $('#colors');
    $colors.append(newColor('black').addClass('active'));
    $colors.append(newColor('red'));
    $colors.append(newColor('green'));
    $colors.append(newColor('blue'));
    $colors.append(newColor('cyan'));
    $colors.append(newColor('magenta'));
    $colors.append(newColor('yellow'));
}

function newColor(colorName) {
    return $('<div>').addClass(colorName).click(function() {
        color = colorName;
        $('#colors').children().removeClass('active');
        $(this).addClass('active');
    });
}

function loadButtons() {
    $('#save').click(function(){
        savePicture();
    });
    $('#load').click(function(){
        loadPictureREST();
    });
    $('#clear').click(function(){
        clearPicture();
    });
}

function savePicture(){
    var picture = [];
    $('#tableholder tr').each(function() {
        var td = [];
        $(this).children().each(function(){
            td.push($(this).attr('class'));
        });
        picture.push(td);
    });
    var pictureJSON = JSON.stringify(picture);
    savePictureREST(pictureJSON);
}

function savePictureLS(pictureJSON){
    localStorage.setItem('picture', pictureJSON);
}

function savePictureREST(pictureJSON) {
    $.post(
        "http://music.elvis.hu/drawapi/store.php",
        {
            name: fileName,
            app: appName,
            data: pictureJSON
        },
        function(response) {
            if(response.state == 'ok') {
                alert('The picture has been saved.');
            } else {
                alert('It doesn\'t work! :(');
            }
        }
    );
}

function loadPicture(pictureJSON) {
    var $table = $('#tableholder table');
    try {
        var picture = JSON.parse(pictureJSON);

        $table.empty();
        for (var i = 0; i < picture.length; i++) {
            var $tr = $('<tr>');
            var row = picture[i];

            for (var j = 0; j < row.length; j++) {
                var cellColor = row[j];
                $tr.append(newTableCell().addClass(cellColor));
            }

            $table.append($tr);
        }
    } catch (e) {
        alert("You didn't save a picture yet. :(")
    }
}

function loadPictureLS() {
    var pictureJSON = localStorage.getItem('picture');
    loadPicture(pictureJSON);
}

function loadPictureREST() {
    $.get("http://music.elvis.hu/drawapi/get.php?app="+appName+"&name="+fileName,
        function(data){
            var pictureJSON = data.data;
            loadPicture(pictureJSON);
        });
}

function clearPicture() {
    $('td').removeClass();
}

function aboutWindow() {
    $('#about_btn').click(function(){
        $('#about').show();
    });
    $(".close").click(function() {
        $('#about').hide();
    });
}

window.onload = function(){
    createTable();
    loadColors();
    loadButtons();
    aboutWindow();
};
