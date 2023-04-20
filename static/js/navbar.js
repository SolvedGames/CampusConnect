$(() =>
{
    const NAVBAR_FILE = "/static/html/navbar.html";

    var navbarMarkup = "";
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', NAVBAR_FILE, false); // set async to false
    xhr.send();
    
    if (xhr.status === 200) {
        navbarMarkup = xhr.responseText;
    }
    
    $(".navbar-container").html(navbarMarkup);
});
