$(() =>
{
    document.querySelectorAll(".card:nth-child(3n - 1) ion-icon")
        .forEach(element =>
        {
            if (!element.getAttribute("name").includes("-outline"))
            {
                element.setAttribute("name", element.getAttribute("name") + "-outline");
            }
        });
});

$("#problem-solver-card").on("click", () =>
{
    window.location.href = "/maths/solver/"
});

$("#notes-card").on("click", () =>
{
    window.location.href = "/notes/"
});
