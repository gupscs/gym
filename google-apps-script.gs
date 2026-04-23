function doPost(e){

const sheet=
SpreadsheetApp
.getActiveSpreadsheet()
.getSheetByName(
'Logs'
);

const body=
JSON.parse(
e.postData.contents
);

body.logs.forEach(
log=>{

sheet.appendRow([

log.date||'',
log.day||'',
log.entry||''

]);

}
);

return ContentService
.createTextOutput(
'ok'
);

}
