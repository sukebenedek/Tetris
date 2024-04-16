select = document.querySelector("#theme");
webBody =  document.querySelector("body");
select.addEventListener('change', changeTheme);

function changeTheme(){
    console.log(select.value);
    if (select.value == 'dark'){
        webBody.style.backgroundColor = "black"
        for (let i = 0; i < g.length; i++) {
            for (let j = 0; j < g[i].length; j++) {
                g[i].color = "black"
            }
        }
    }
}