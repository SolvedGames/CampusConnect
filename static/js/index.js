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