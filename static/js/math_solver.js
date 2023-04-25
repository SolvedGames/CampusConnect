$("#solve-btn").on("click", () =>
{
    $("#main-output-text").html("Solving...");

    $.ajax({
        type: "POST",
        url: "/maths/solver/",
        data: {
            question: $("#main-input-input").val()
        },
        success: (data) =>
        {
            $("#main-output-text").html(data);
            console.log(data);
        }
    });
});