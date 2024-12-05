const urlParams = new URLSearchParams(window.location.search);
let retBtn = document.getElementById('ret');

const var1 = urlParams.get("data1");
const var2 = urlParams.get("data2");
const var3 = urlParams.get("data3");
const var4 = urlParams.get("data4");

document.getElementById("data1").innerText = var1;
document.getElementById("data2").innerText = var2;
document.getElementById("data3").innerText = var3;
document.getElementById("data4").innerText = var4;
retBtn.addEventListener("click",()=>{
    window.location.href = "index.html";
})