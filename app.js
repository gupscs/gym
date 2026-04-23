let treinos=[];
let cargaChart;
let corridaChart;

fetch("treino.json")
.then(r=>r.json())
.then(data=>{

treinos=data.treinos;

M.AutoInit();

montarDias();

popularSelect();

mostrarTreino(0);

dashboard();

});


function trocarTela(nome){

document.getElementById(
"screenTreinos"
).classList.add("hidden");

document.getElementById(
"screenRegistrar"
).classList.add("hidden");

document.getElementById(
"screenDash"
).classList.add("hidden");


if(nome=="treinos")
document.getElementById(
"screenTreinos"
).classList.remove("hidden");

if(nome=="registrar")
document.getElementById(
"screenRegistrar"
).classList.remove("hidden");

if(nome=="dash")
document.getElementById(
"screenDash"
).classList.remove("hidden");

}



function montarDias(){

let html="";

treinos.forEach((d,i)=>{

html+=`
<a class='chip blue white-text tab-chip'
onclick='mostrarTreino(${i})'>
${d.dia}
</a>
`;

});

document.getElementById(
"diasAbas"
).innerHTML=html;

}



function mostrarTreino(i){

let t=treinos[i];

let html="";

if(t.musculacao){

t.musculacao.forEach(ex=>{

let ultima=
localStorage.getItem(
i+"_"+ex
)||"-";

html+=`
<div class='card exercise-card'>
<div class='card-content'>

<span class='card-title'>
${ex}
</span>

Última carga:
<b>${ultima}</b>

</div>
</div>
`;

});

}


if(t.corrida){

html+=`
<div class='card exercise-card'>
<div class='card-content'>

<span class='card-title'>
Corrida ${t.corrida.tipo}
</span>

Última distância:
<b>
${localStorage.getItem(i+"_dist")||0}
km
</b>

</div>
</div>
`;

}

document.getElementById(
"treinoDia"
).innerHTML=html;

}



function popularSelect(){

let s=
document.getElementById("diaSelect");

treinos.forEach((t,i)=>{

s.innerHTML+=
`<option value='${i}'>
${t.dia}
</option>`;

});

M.FormSelect.init(s);

s.onchange=formRegistro;

formRegistro();

}



function formRegistro(){

let idx=
document.getElementById(
"diaSelect"
).value;

let t=treinos[idx];

let html="";

if(t.musculacao){

html+="<h5>Cargas</h5>";

t.musculacao.forEach(ex=>{

let v=
localStorage.getItem(
idx+"_"+ex
)||"";

html+=`
<div class='input-field'>

<input
id='${idx}_${ex}'
type='number'
step='0.1'
value='${v}'
>

<label class='active'>
${ex}
</label>

</div>
`;

});

}



if(t.corrida){

html+=`

<h5>Corrida</h5>

<div class='input-field'>
<input id='tempo'
type='number'
step='0.1'>
<label class='active'>
Tempo (min)
</label>
</div>


<div class='input-field'>
<input id='vmax'
type='number'
step='0.1'>
<label class='active'>
Vel Máx
</label>
</div>


<div class='input-field'>
<input id='dist'
type='number'
step='0.1'>
<label class='active'>
Distância
</label>
</div>

`;

}


html+=`
<a class='btn blue'
onclick='salvar(${idx})'>
Salvar
</a>
`;

document.getElementById(
"formRegistro"
).innerHTML=html;

}



function salvar(idx){

let t=treinos[idx];

if(t.musculacao){

t.musculacao.forEach(ex=>{

let v=
document.getElementById(
idx+"_"+ex
).value;

localStorage.setItem(
idx+"_"+ex,
v
);

});

}


if(t.corrida){

localStorage.setItem(
idx+"_tempo",
document.getElementById(
"tempo"
).value
);

localStorage.setItem(
idx+"_vmax",
document.getElementById(
"vmax"
).value
);

localStorage.setItem(
idx+"_dist",
document.getElementById(
"dist"
).value
);

}

M.toast({
html:'Treino salvo'
});

dashboard();

}



function dashboard(){

let labels=[];
let cargas=[];
let km=[];

treinos.forEach((t,i)=>{

if(t.musculacao){

labels.push(t.dia);

cargas.push(
Number(
localStorage.getItem(
i+"_"+t.musculacao[0]
)||0
)
);

}

km.push(
Number(
localStorage.getItem(
i+"_dist"
)||0
)
);

});

document.getElementById(
"volumeTotal"
).innerHTML=
cargas.reduce((a,b)=>a+b,0);

document.getElementById(
"corridaTotal"
).innerHTML=
km.reduce((a,b)=>a+b,0);



if(cargaChart)
cargaChart.destroy();

cargaChart=
new Chart(
document.getElementById(
"chartCarga"
),
{
type:"line",
data:{
labels,
datasets:[
{
label:"Progressão de carga",
data:cargas,
tension:.4
}
]
}
}
);



if(corridaChart)
corridaChart.destroy();

corridaChart=
new Chart(
document.getElementById(
"chartCorrida"
),
{
type:"bar",
data:{
labels,
datasets:[
{
label:"Distância",
data:km
}
]
}
}
);

}



function syncSheets(){

fetch(
"https://SEU_WEB_APP",
{
method:"POST",
body:JSON.stringify(localStorage)
}
);

M.toast({
html:'Sincronizado'
});

}
