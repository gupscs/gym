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




function buscarExercicio(nome){

let q=
encodeURIComponent(
nome+" exercício musculação"
);

window.open(
"https://www.google.com/search?tbm=isch&q="+q,
"_blank"
);

}



function mostrarTreino(i){

let t=treinos[i];

let html="";

if(t.musculacao){

t.musculacao.forEach(ex=>{

let hist=
JSON.parse(
localStorage.getItem(
"hist_"+i+"_"+ex.exercicio
)||"[]"
);

let ultima=
hist.length ?
hist[hist.length-1].peso
:"-";


html+=`
<div class='card exercise-card'>

<div class='card-content'>

<span class='card-title'>
${ex.exercicio}
</span>

${ex.series} x ${ex.repeticoes}

<br>

Descanso:
${ex.descanso_seg||60}s

<br><br>

Última carga:
<b>${ultima}</b>

<br><br>

<a
class='btn-small blue'
onclick="
buscarExercicio(
'${ex.exercicio}'
)">
Ver execução
</a>

</div>

</div>
`;

});

}



if(t.corrida){

html+=`
<h5>
Corrida ${t.corrida.tipo}
</h5>
`;

if(t.corrida.blocos){

t.corrida.blocos.forEach(b=>{

html+=`
<div class='card'>
<div class='card-content'>

<b>${b.fase}</b>

<br>

${b.tempo_min||""}
${b.tempo_min ? " min" : ""}

<br>

${b.estrutura||""}

<br>

${b.descricao||""}

</div>
</div>
`;

});

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

let hoje=
new Date()
.toISOString()
.split("T")[0];

let html=`

<div class='input-field'>
<input
id='dataTreino'
type='date'
value='${hoje}'
>
<label class='active'>
Data
</label>
</div>

`;



if(t.musculacao){

t.musculacao.forEach(ex=>{

html+=`

<div class='input-field'>

<input
id='${idx}_${ex.exercicio}'
type='number'
step='0.1'
>

<label class='active'>
${ex.exercicio}
</label>

</div>

`;

});

}



if(t.corrida){

html+=`

<div class='input-field'>
<input id='tempo' type='number' step='0.1'>
<label class='active'>
Tempo
</label>
</div>


<div class='input-field'>
<input id='vmax' type='number' step='0.1'>
<label class='active'>
Vel Máx
</label>
</div>


<div class='input-field'>
<input id='dist' type='number' step='0.1'>
<label class='active'>
Distância
</label>
</div>

`;

}



html+=`
<a
class='btn blue'
onclick='salvar(${idx})'>
Salvar
</a>
`;

document.getElementById(
"formRegistro"
).innerHTML=html;

}




function salvar(idx){

let dataTreino=
document.getElementById(
"dataTreino"
).value;

let t=treinos[idx];



if(t.musculacao){

t.musculacao.forEach(ex=>{

let chave=
"hist_"+
idx+"_"+
ex.exercicio;

let hist=
JSON.parse(
localStorage.getItem(chave)
||"[]"
);

hist.push({

data:dataTreino,

peso:Number(
document.getElementById(
idx+"_"+ex.exercicio
).value
),

reps_realizadas:
ex.repeticoes

});

localStorage.setItem(
chave,
JSON.stringify(hist)
);

});

}



if(t.corrida){

let chave=
"hist_corrida_"+idx;

let hist=
JSON.parse(
localStorage.getItem(chave)
||"[]"
);

hist.push({

data:dataTreino,

tempo:Number(
document.getElementById(
"tempo"
).value
),

vmax:Number(
document.getElementById(
"vmax"
).value
),

dist:Number(
document.getElementById(
"dist"
).value
)

});

localStorage.setItem(
chave,
JSON.stringify(hist)
);

}


dashboard();

mostrarTreino(idx);

M.toast({
html:"Treino salvo"
});

}




function dashboard(){

let datas=[];
let cargas=[];
let distancias=[];



let chave=
"hist_0_"+
treinos[0].musculacao[0].exercicio;


let hist=
JSON.parse(
localStorage.getItem(
chave
)||"[]"
);


hist.forEach(x=>{

datas.push(
x.data
);

cargas.push(
x.peso
);

});



let corridaHist=[];

treinos.forEach((t,i)=>{

let h=
JSON.parse(
localStorage.getItem(
"hist_corrida_"+i
)||"[]"
);

corridaHist=
corridaHist.concat(h);

});


corridaHist.forEach(x=>
distancias.push(x.dist)
);



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
distancias.reduce(
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
labels:datas,
datasets:[
{
label:"Progressão carga",
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
type:"line",

data:{
labels:datas,
datasets:[
{
label:"Distância",
data:distancias,
tension:.4
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
