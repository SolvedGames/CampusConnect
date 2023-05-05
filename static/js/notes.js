var mouseLocation = [0, 0];
var isMouseDown = false;

var prevMousedownNoteLocation = [2, 3];
var updateNoteLocationInterval = -1;

var currentMovingNote = null;
var currentHoveringNote = null;

var currentEditingConnectionIndex = -1;

var updateNoteConnectionInterval = -1;

var connections = [
    
]

function updateNoteEvents()
{
    $(".note .note-textarea").off();

    $(".note").on("mouseenter", (e) =>
    {
        $(e.currentTarget).data("isHovering", true);
        currentHoveringNote = e.currentTarget;
    });

    $(".note").on("mouseleave", (e) =>
    {
        $(e.currentTarget).data("isHovering", false);
        currentHoveringNote = null;

    }).data("isHovering", false);

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

                updateConnectionLocationOnNoteMove(note);
        
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
        
        if (text == "" && (e.code == "Backspace" || e.code == "Delete"))
        {
            $(e.target).remove();
        }
    });


    $(".note .note-connection-icon").off();

    $(".note .note-connection-icon").on("mousemove", (e) =>
    {
        if (isMouseDown && updateNoteConnectionInterval == -1)
        {
            addNewNoteConnection(e.target.parentElement);
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
    if (currentMovingNote)
    {
        currentMovingNote.css("z-index", "");
        currentMovingNote = null;
    }

    clearInterval(updateNoteLocationInterval);
    updateNoteLocationInterval = -1;

    if (updateNoteConnectionInterval != -1)
    {
        clearInterval(updateNoteConnectionInterval);

        var connection = connections[currentEditingConnectionIndex];
        if (currentHoveringNote != null && currentHoveringNote != connection.note)
        {
            connections[currentEditingConnectionIndex].connectedNote = currentHoveringNote;
        }

        updateNoteConnectionInterval = -1;
    }

    isMouseDown = false;
});


function updateNoteLocationToMouse(note, offset)
{
    $(note).css("left", (mouseLocation[0] - offset[0]) + "px");
    $(note).css("top", (mouseLocation[1] - offset[1]) + "px");

    //console.log(mouseLocation[0] + " : " + mouseLocation[1]);
    //console.log(offset[0] + " : " + offset[1]);
}

function updateConnectionLocationToMouse(note)
{
    var index = -1;

    for (let i = 0; i < connections.length; i++)
    {
        const connection = connections[i];
        
        if (connection.note == note)
        {
            index = i;
            break;
        }
    }

    var connection = connections[index];

    var path = connection.path;
    var points = connection.points;

    var noteHalfWidth = $(note).width() / 2;
    var noteHalfHeight = $(note).height() / 2;

    var posX = Number($(note).css("left").replace("px", ""));
    var posY = Number($(note).css("top").replace("px", ""));

    const p0 = { x: Number($(note).css("left").replace("px", "")) + $(note).width() / 2, y: Number($(note).css("top").replace("px", "")) + $(note).height() / 2 };
    const p2 = { x: mouseLocation[0], y: mouseLocation[1] };
    const p1 = { x: Math.max(p0.x, p2.x) + (p0.x - p2.x) / 2, y: Math.max(p0.y, p2.y) + (p0.y - p2.y) / 2 };

    connections[index].points = [p0, p1, p2];

    path.setAttribute("d", "M" + (posX + noteHalfWidth) + "," + (posY + noteHalfHeight) + " " + (p2.x) + "," + (p2.y));
}

function updateConnectionLocationOnNoteMove(note)
{
    var index = -1;

    for (let i = 0; i < connections.length; i++)
    {
        const connection = connections[i];
        
        if (connection.note.isEqualNode($(note).get(0)) || connection.connectedNote.isEqualNode($(note).get(0)))
        {
            index = i;
            
            var note = connection.note;
            var connectedNote = connection.connectedNote;

            var path = connection.path;
            var points = connection.points;

            var noteHalfWidth = $(note).width() / 2;
            var noteHalfHeight = $(note).height() / 2;

            var posX = Number($(note).css("left").replace("px", ""));
            var posY = Number($(note).css("top").replace("px", ""));

            const p0 = { x: Number($(note).css("left").replace("px", "")) + $(note).width() / 2, y: Number($(note).css("top").replace("px", "")) + $(note).height() / 2 };
            var p2;
            if (connectedNote == null)
            {
                p2 = points[2];
            }
            else
            {
                p2 = { x: Number($(connectedNote).css("left").replace("px", "")) + $(connectedNote).width() / 2, y: Number($(connectedNote).css("top").replace("px", "")) + $(connectedNote).height() / 2 };
            }
            const p1 = { x: Math.max(p0.x, p2.x) + (p0.x - p2.x) / 2, y: Math.max(p0.y, p2.y) + (p0.y - p2.y) / 2 };

            connections[index].points = [p0, p1, p2];

            path.setAttribute("d", "M" + (posX + noteHalfWidth) + "," + (posY + noteHalfHeight) + " " + (p2.x) + "," + (p2.y));
        }
    }

    
    //var connection = connections[index];
    
    

    console.log(mouseLocation);
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

function addNewNoteConnection(note)
{
    var noteHalfWidth = $(note).width() / 2;
    var noteHalfHeight = $(note).height() / 2;

    var posX = Number($(note).css("left").replace("px", ""));
    var posY = Number($(note).css("top").replace("px", ""));

    const p0 = { x: Number($(note).css("left").replace("px", "")) + noteHalfWidth, y: Number($(note).css("top").replace("px", "")) + noteHalfHeight };
    const p2 = { x: mouseLocation[0], y: mouseLocation[1] };
    const p1 = { x: Math.max(p0.x, p2.x) + (p0.x - p2.x) / 2, y: Math.max(p0.y, p2.y) + (p0.y - p2.y) / 2 };

    var svg = $("#connections-svg");

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M" + (posX + noteHalfWidth) + "," + (posY + noteHalfHeight) + " " + (p2.x) + "," + (p2.y));
    path.setAttribute("stroke", "#fff");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    path.setAttribute("marker-end", "url(#arrow)");

    svg.append(path);

    connections.push({ note: note, connectedNote: null, path: path, points: [ p0, p1, p2 ]});

    currentEditingConnectionIndex = connections.length - 1;
    updateNoteConnectionInterval = setInterval(() =>
    {
        updateConnectionLocationToMouse(note);

    }, 0);
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
