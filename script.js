let div = document.getElementById("div");
let logo = document.querySelectorAll("span");
let story = document.querySelector(".story");
let input = document.querySelector(".searchbar");

let s = false;
let a;
let b;
let c;
let newcolor;
function newcolorlogo() {
for(let i=0;i<logo.length; i++){
  let x = Math.floor(Math.random() * 256);
  let y = Math.floor(Math.random() * 256);
  let z = Math.floor(Math.random() * 256);
  let newcolo = `${x},${y},${z}`;
   logo[i].style.color=`rgba(${newcolo})`;
}}
setInterval(newcolorlogo, 2000)

div.addEventListener("click", () => {
   a = Math.floor(Math.random() * 256);
   b = Math.floor(Math.random() * 256);
   c = Math.floor(Math.random() * 256);
   newcolor = `${a},${b},${c}`;
   let ds=document.querySelector("#div p")
   div.style.background=`rgba(${newcolor})`;
   ds.innerHTML=`<span style='color: blue;'>rgba</span>(${newcolor})`;
   ds.addEventListener("click", (e) => {
    navigator.clipboard.writeText(ds.textContent)
   })
   let storie=document.createElement("section");
   storie.innerHTML=`<span style='color: blue;'>rgba</span>(${newcolor})`;
   story.append(storie);
   let stocolor=document.createElement("div");
   stocolor.style.background=`rgba(${newcolor})`;
   stocolor.className="color";
   storie.appendChild(stocolor);
   storie.className="stories"
   //let storie = document.querySelectorAll("section")
   storie.addEventListener("click", () => {
 navigator.clipboard.writeText(storie.textContent)
    })
   save();
});
 let storie = document.querySelectorAll("section")
function save() { 
localStorage.setItem("a", story.innerHTML);
    }

function save2() {
   story.innerHTML=localStorage.getItem("a");
  
}

save2(); 
s=true;
let blues =document.querySelector(".blue");
let searchicon = document.querySelector(".searchicon2");
function searchcolor() {
  if(input.value == "Blue" || input.value == "Bleu") {
     blues.style.top="19%"
     
  }
}
searchicon.onclick=searchcolor;
