select = document.querySelector("#theme");
webBody =  document.querySelector("body");
select.addEventListener('change', changeTheme);

function changeTheme(){
    if (select.value == "dark"){
        webBody.style.backgroundColor = "black"
    }
    if (select.value == "light"){
        webBody.style.backgroundColor = "bisque"
    }
    if (select.value == "egypt"){
        webBody.style.backgroundImage = `url("imidzs/piramisok.jpg")`;
        webBody.style.backgroundRepeat = "no-repeat";
        webBody.style.backgroundSize = "cover"
    }
    if (select.value == "cyber"){
        webBody.style.backgroundImage = `url("imidzs/cyber.jpg")`;
        webBody.style.backgroundRepeat = "no-repeat";
        webBody.style.backgroundSize = "cover"
    }
}