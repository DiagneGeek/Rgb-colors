let div = document.getElementById("div");
let logo = document.querySelectorAll("span");
let story = document.querySelector(".story");

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
   div.style.background=`rgba(${newcolor})`;
   
   let storie=document.createElement("section");
   storie.innerHTML=`<span style='color: blue;'>rgba</span>(${newcolor})`;
   story.append(storie);
   let stocolor=document.createElement("div");
   stocolor.style.background=`rgba(${newcolor})`;
   stocolor.className="color";
   storie.appendChild(stocolor);
   storie.className="stories"

   storie.addEventListener("click", () => {
 navigator.clipboard.writeText(storie.textContent)
    })
   save();
});
 let storie = document.querySelectorAll("section")
function save() { 
localStorage.setItem("saveCollection", story.innerHTML);
    }

function save2() {
   story.innerHTML=localStorage.getItem("saveCollection");
  
}

save2(); 
