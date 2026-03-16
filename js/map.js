window.addEventListener("load",function(){

const map = document.getElementById("svgMap");

map.addEventListener("load", function(){

const svgDoc = map.contentDocument;

const districts = {
hatyai:{
name:"อำเภอหาดใหญ่",
gi:5,
page:"district-hatyai.html"
},
muang:{
name:"อำเภอเมือง",
gi:4,
page:"district-muang.html"
},
sadao:{
name:"อำเภอสะเดา",
gi:3,
page:"district-sadao.html"
}
};

for(let id in districts){

let area = svgDoc.getElementById(id);

area.style.fill = "#2e5aac";
area.style.cursor = "pointer";

area.addEventListener("mouseover",function(e){

area.style.fill = "#ff9800";

tooltip.style.display = "block";
tooltip.innerHTML =
districts[id].name +
"<br>GI "+districts[id].gi;

});

area.addEventListener("mousemove",function(e){

tooltip.style.left = e.pageX+"px";
tooltip.style.top = e.pageY+"px";

});

area.addEventListener("mouseout",function(){

area.style.fill = "#2e5aac";
tooltip.style.display = "none";

});

area.addEventListener("click",function(){

area.style.transition = "0.5s";
area.style.transformOrigin = "center";
area.style.transform = "scale(1.6)";

setTimeout(()=>{
window.location.href = districts[id].page;
},600);

});

}

});

});

