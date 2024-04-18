select = document.querySelector("#theme");
webBody =  document.querySelector("body");
select.addEventListener('change', changeTheme);

function changeTheme(){
    if (select.value == "dark"){
        webBody.style.backgroundColor = "black"
        webBody.style.color = "white"
        webBody.style.backgroundImage = "none";
        webBody.style.fontFamily = "Arial"

    }
    if (select.value == "light"){
        webBody.style.backgroundColor = "bisque"
        webBody.style.color = "darkslategray"
        webBody.style.backgroundImage = "none";
        webBody.style.fontFamily = "cursive"
    }
    if (select.value == "egypt"){
        webBody.style.backgroundImage = `url("imidzs/piramisok.jpg")`;
        webBody.style.backgroundRepeat = "no-repeat";
        webBody.style.backgroundSize = "cover"
        webBody.style.color = "blanchedalmond"
        webBody.style.fontFamily = "'Times New Roman', Times, serif"
    }
    if (select.value == "cyber"){
        webBody.style.backgroundImage = `url("imidzs/cyber.jpg")`;
        webBody.style.backgroundRepeat = "no-repeat";
        webBody.style.backgroundSize = "cover"
        webBody.style.color = "cyan"
        webBody.style.fontFamily = "'Courier New', Courier, monospace"

    }
}