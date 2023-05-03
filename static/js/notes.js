$(".note").attr("tabindex", "0");

var prevMousedownNoteLocation = [2, 3];

$(".note .note-textarea").on("mousedown", (e) =>
{
    var note = $(e.target.parentElement);

    prevMousedownNoteLocation = [note.css("left").replace("px", ""), note.css("top").replace("px", "")];
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

$(".note").on("mousedown", (e) =>
{
    var note = $(e.target);

    var mouseLocation = [e.pageX, e.pageY];
    $(note).css("left", e.pageX + "px");
    $(note).css("top", e.pageY + "px");
});
