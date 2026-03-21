const giData = [
{
id:1,
name:"ผ้าทอเกาะยอ",
img:"images/kohyor.jpg",
history:"ภูมิปัญญาท้องถิ่น",
importance:"สร้างรายได้ชุมชน",
source:"เกาะยอ",
score:null
},
{
id:2,
name:"ปลากะพงทะเลสาบ",
img:"images/seabass.jpg",
history:"เลี้ยงในทะเลสาบ",
importance:"ส่งออกคุณภาพสูง",
source:"ทะเลสาบ",
score:16
},
{
id:3,
name:"กุ้งทะเลสาบ",
img:"images/shrimp.jpg",
history:"ประมงพื้นบ้าน",
importance:"อาหารพื้นเมือง",
source:"ทะเลสาบ",
score:null
}
]

const grid = document.getElementById("giGrid")
const statusBox = document.getElementById("statusBox")

function renderGI(){
giData.forEach(g=>{
grid.innerHTML += `
<div class="gi-card">
<img src="${g.img}">
<div class="gi-content">
<h4>${g.name}</h4>
<p>ประวัติ : ${g.history}</p>
<p>ความสำคัญ : ${g.importance}</p>
<p>แหล่งผลิต : ${g.source}</p>
<button onclick="learnGI(${g.id})">เรียนรู้</button>
</div>
</div>
`
})
}

function renderStatus(){
statusBox.innerHTML=""
giData.forEach(g=>{
if(g.score){
statusBox.innerHTML += `
<div class="status-item pass">
✔ ${g.name} ผ่าน (${g.score}/10)
</div>`
}else{
statusBox.innerHTML += `
<div class="status-item notpass">
○ ${g.name} ยังไม่สอบ
</div>`
}
})
}

function learnGI(id){
alert("เปิดบทเรียน GI "+id)
}

function showPlace(name){
alert("สถานที่ : "+name)
}

function startQuiz(){
alert("เริ่มระบบข้อสอบ")
}

renderGI()
renderStatus()
