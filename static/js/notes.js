var mouseLocation = [0, 0];
var isMouseDown = false;

var prevMousedownNoteLocation = [2, 3];
var updateNoteLocationInterval = -1;

var currentMovingNote = null;

function updateNoteEvents()
{
    $(".note .note-textarea").off();

    $(".note .note-textarea").on("mousedown", (e) =>
    {
        var note = $(e.target.parentElement);
    
        prevMousedownNoteLocation = [note.css("left").replace("px", ""), note.css("top").replace("px", "")];
    
        if (updateNoteLocationInterval == -1 && !$(e.target.parentElement).hasClass("editing"))
        {
            var offsetX = e.pageX - Number(note.css("left").replace("px", ""));
            var offsetY = e.pageY - Number(note.css("top").replace("px", ""));

            note.css("z-index", "200");
            currentMovingNote = note;
        
            updateNoteLocationInterval = setInterval(() =>
            {
                updateNoteLocationToMouse(note, [offsetX, offsetY]);
        
            }, 0);
        }
    });
    
    $(".note .note-textarea").on("mouseup", (e) =>
    {
        var note = $(e.target.parentElement);
    
        var mousedownNoteLocation = [note.css("left").replace("px", ""), note.css("top").replace("px", "")];
    
        if (mousedownNoteLocation.toString() == prevMousedownNoteLocation.toString())
        {
            $(note).addClass("editing");
            $(e.target).attr("contenteditable", "true");
        }
    });
    
    $(".note .note-textarea").on("focusout", (e) =>
    {
        var note = $(e.target.parentElement);
    
        $(note).removeClass("editing");
        $(e.target).attr("contenteditable", "false");
    });

    $(".note .note-textarea:empty").on("keydown", (e) =>
    {
        var text = e.target.innerText;
        
        if (text == "")
        {
            $(e.target).remove();
        }
    });
}

$(document).on("mousemove", (e) =>
{
    mouseLocation = [e.pageX, e.pageY];
});

$(document).on("mousedown", () =>
{
    isMouseDown = true;
});

$(document).on("mouseup", () =>
{
    currentMovingNote.css("z-index", "");
    currentMovingNote = null;

    clearInterval(updateNoteLocationInterval);
    updateNoteLocationInterval = -1;
});

$(document).on("mouseup", () =>
{
    isMouseDown = false;
});

function updateNoteLocationToMouse(note, offset)
{
    $(note).css("left", (mouseLocation[0] - offset[0]) + "px");
    $(note).css("top", (mouseLocation[1] - offset[1]) + "px");

    //console.log(mouseLocation[0] + " : " + mouseLocation[1]);
    //console.log(offset[0] + " : " + offset[1]);
}

function addNewNote()
{
    var note = $('<div class="note" style="top: ' + (mouseLocation[1] - 25) + 'px; left: ' + (mouseLocation[0] - 25) + 'px;" tabindex=0>');
    note.append($('<div placeholder="Type something.." class="note-textarea">'));

    $("#main-notes").append(note);

    var offsetX = 25;
    var offsetY = 25;

    note.css("z-index", "200");
    currentMovingNote = note;

    updateNoteLocationInterval = setInterval(() =>
    {
        updateNoteLocationToMouse(note, [offsetX, offsetY]);

    }, 0);

    updateNoteEvents();
}

$("#note-tool").on("mousemove", () =>
{
    if (isMouseDown && updateNoteLocationInterval == -1)
    {
        addNewNote();
    }
});

$(".note").attr("tabindex", "0");
updateNoteEvents();
