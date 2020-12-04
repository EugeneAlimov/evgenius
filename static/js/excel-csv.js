let excelFileSubmitButton = document.getElementById('excelFileSubmitButton'); // отключение по умолчанию кнопки отправки
excelFileSubmitButton.disabled=true; // excel афйла на распарсивание

let excelFileInput = document.getElementById('excelFileInput'); // получение объекта input-a отправки на распарсивание
let excelFileInputValue = excelFileInput.value; // excel файла и длины строки содержимого объекта

excelFileInput.addEventListener('change', disableExcelFileSubmitButton); // как произойдет изменение в форме вызов функции
// включение кнопки
// Включение кнопки отправки excel файла если содержимое инпута изменится и будет > 0
function disableExcelFileSubmitButton() {
    excelFileInputValue = excelFileInput.value;
    if(excelFileInputValue.length > 0) {
        excelFileSubmitButton.disabled=false
    }
}






let excelToCSVFileInput = document.getElementById('excelToCSVFileInput');

function handleFile(e) {
  let files = e.target.files;
  let f = files[0];
  let reader = new FileReader();
  reader.onload = function(e) {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, {type: 'array'});

          console.log('открыт файл')

          let first_sheet_name = workbook.SheetNames[0];
          let address_of_cell = 'A1';

          /* Get worksheet */
          let worksheet = workbook.Sheets[first_sheet_name];

          /* Find desired cell */
          let desired_cell = worksheet[address_of_cell];

          /* Get the value */
          let desired_value = (desired_cell ? desired_cell.v : undefined);

          console.log(desired_value)
      };
          reader.readAsArrayBuffer(f);
  }
excelToCSVFileInput.addEventListener('change', handleFile, false);
