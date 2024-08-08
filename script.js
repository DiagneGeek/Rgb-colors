let canvas = document.querySelector(".canvas");
let linkBar=document.querySelector(".scroll-indicator")
let links = document.querySelectorAll(".links button");
let generateBtn = document.querySelector(".generate-btn")

const [
 collectionsContainer,
 collectionsLink
 ] = [
 document.querySelector(".collectionsContainer"),      
 document.querySelector(".collections-btn") 
 ]

const firstState = () => {
   linkBar[0].style.left = linkBar[0].offsetLeft+"px";
   linkBar[0].style.width = linkBar[0].offsetWidth+"px";
}firstState();

generateBtn.addEventListener("click", () => {
   let r = Math.floor(Math.random() * 256);
   let g = Math.floor(Math.random() * 256);
   let b = Math.floor(Math.random() * 256);
   let newcolor = `${r},${g},${b}`;
   
   let rgbText = document.querySelector(".canvas p");
   canvas.style.background=`rgb(${newcolor})`;
   rgbText.innerHTML=`<span style='color: blue;'>rgba</span>(${newcolor})`;
});


const copyElement = (rgbText) => {
 let copyBtn = document.querySelector(".copy-btn");
 let copyMessage = document.querySelector(".copyMessage");

    copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(rgbText.textContent);
    copyMessage.style.animation="2s affmessage";
    setTimeout(() => copyMessage.style.animation="none" ,1950)
   }) 
}
copyElement(document.querySelector(".canvas p"));


links.forEach(link => { 
   link.onclick = (e) => {
   linkBar.style.left = e.target.offsetLeft+"px";
   linkBar.style.width = e.target.offsetWidth+"px";
   e.target.className="active";
   
   if(e.target.innerHTML === "collections") {
     links[0].classList.remove ("active");
     collectionsContainer.classList.add("visiblity");  
   }else{
      links[1].classList.remove ("active");
     collectionsContainer.classList.remove("visiblity")
   }  
  }
})

/* a faire: */
/* mettre en place le système de collection*/
