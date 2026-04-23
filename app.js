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

["screenTreinos",
"screenRegistrar",
"screenDash"]

.forEach(id=>
document.getElementById(id)
.classList.add("hidden")
);

if(nome==="treinos")
document.getElementById(
"screenTreinos"
).classList.remove("hidden");

if(nome==="registrar")
document.getElementById(
"screenRegistrar"
).classList.remove("hidden");

if(nome==="dash")
document.getElementById(
"screenDash"
).classList.remove("hidden");

}



function montarDias(){

let html="";

treinos.forEach((t,i)=>{

html+=`
<a class='chip blue white-text'
onclick='mostrarTreino(${i})'>
${t.dia}
</a>
`;

});

document.getElementById(
"diasAbas"
).innerHTML=html;

}




function mostrarTreino(i){

let t=treinos[i];

let html=`
<div class='card'>
<div class='card-content'>

<span class='card-title'>
${t.dia}
</span>

<p>
<b>Objetivo:</b>
${t.objetivo||"-"}
</p>

</div>
</div>
`;



/* MUSCULAÇÃO */
if(t.musculacao){

html+="<h5>Musculação</h5>";

t.musculacao.forEach(ex=>{

let chave=
i+"_"+ex.exercicio;

let ultima=
localStorage.getItem(chave)||"-";

html+=`
<div class='card exercise-card'>

<div class='card-content'>

<span class='card-title'>
${ex.exercicio}
</span>

<p>
${ex.series} x ${ex.repeticoes}
</p>

<p>
Descanso:
${ex.descanso_seg||60}s
</p>

<p>
Última carga:
<b>${ultima}</b>
</p>

</div>

</div>
`;

});

}



/* CORRIDA */
if(t.corrida){

html+=`
<h5>
Corrida (${t.corrida.tipo})
</h5>
`;

if(t.corrida.blocos){

t.corrida.blocos.forEach(b=>{

html+=`
<div class='card'>
<div class='card-content'>

<b>${b.fase}</b><br>

${b.tempo_min ?
"Tempo: "+b.tempo_min+" min<br>" : ""}

${b.repeticoes ?
"Repetições: "+b.repeticoes+"<br>" : ""}

${b.estrutura||""}
${b.descricao ? "<br>"+b.descricao : ""}

</div>
</div>
`;

});

}


if(t.corrida.progressao){

html+="<h6>Progressão</h6>";

t.corrida.progressao.forEach(p=>{

html+=`
<div class='card'>
<div class='card-content'>

Semanas:
${p.semanas}

<br>

Distância:
${p.distancia_km} km

</div>
</div>
`;

});

}


if(t.corrida.meta){

html+=`
<p>
Meta:
${t.corrida.meta}
</p>
`;

}

}

document.getElementById(
"treinoDia"
).innerHTML=html;

}




function popularSelect(){

let s=
document.getElementById(
"diaSelect"
);

s.innerHTML="";

treinos.forEach((t,i)=>{

s.innerHTML+=`
<option value='${i}'>
${t.dia}
</option>
`;

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


/* PESOS */
if(t.musculacao){

html+="<h5>Cargas</h5>";

t.musculacao.forEach(ex=>{

let chave=
idx+"_"+ex.exercicio;

let v=
localStorage.getItem(chave)||"";

html+=`
<div class='input-field'>

<input
id='${chave}'
type='number'
step='0.1'
value='${v}'
>

<label class='active'>
${ex.exercicio}
</label>

</div>
`;

});

}



/* REGISTRO CORRIDA */
if(t.corrida){

let tempo=
localStorage.getItem(
idx+"_tempo"
)||"";

let vmax=
localStorage.getItem(
idx+"_vmax"
)||"";

let dist=
localStorage.getItem(
idx+"_dist"
)||"";

html+=`

<h5>Corrida</h5>

<div class='input-field'>
<input
id='tempo'
type='number'
step='0.1'
value='${tempo}'
>
<label class='active'>
Tempo (min)
</label>
</div>


<div class='input-field'>
<input
id='vmax'
type='number'
step='0.1'
value='${vmax}'
>
<label class='active'>
Vel máx
</label>
</div>


<div class='input-field'>
<input
id='dist'
type='number'
step='0.1'
value='${dist}'
>
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


/* SALVAR CARGAS */
if(t.musculacao){

t.musculacao.forEach(ex=>{

let chave=
idx+"_"+ex.exercicio;

let valor=
document.getElementById(
chave
).value;

localStorage.setItem(
chave,
valor
);

});

}



/* SALVAR CORRIDA */
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
html:"Treino salvo"
});

dashboard();

mostrarTreino(idx);

}




function dashboard(){

let labels=[];
let cargas=[];
let km=[];


treinos.forEach((t,i)=>{

labels.push(
t.dia
);


/* primeiro exercício */
if(
t.musculacao &&
t.musculacao.length>0
){

cargas.push(
Number(
localStorage.getItem(
i+"_"+t.musculacao[0].exercicio
)||0
)
);

}
else{
cargas.push(0);
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
cargas.reduce(
(a,b)=>a+b,
0
);

document.getElementById(
"corridaTotal"
).innerHTML=
km.reduce(
(a,b)=>a+b,
0
);



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
label:"Carga",
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
label:"Distância km",
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
body:JSON.stringify(
localStorage
)
}
);

M.toast({
html:"Sincronizado"
});

}
