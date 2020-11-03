let chBoxesChecked = [];
let list = new Set();

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
//POST зарос на сервер для выбора из какой группы читать теги
 $(document).on('change', '.inputGroupTagsSelect', function(e) {         // при событии на элементе формы (изменении)
    e.preventDefault();                                                   // сброс стандартного поведения

        let url = $('#groupList').attr('action');

            $.ajax({
            url: url,
            data: $('#groupList').serialize(),                                   //сериализация данных из формы
            method: 'POST',
            success: function(data){                                    // когда данные успешно вернулись разбираю data
                $('#prime').hide()
                $('.listTags').empty()                                  // Очистка списка

                for (let key in data) {                                 // на пары ключ-значение и отрисовываю список
                    $('.listTags').append(
                    "<div class=\"custom-control custom-checkbox\">" +
                    "<input type=\"checkbox\" class=\"custom-control-input checkboxes\" id=" +
                    key + " value=" + key + " " + data[key] + ">" +
                    "<label class=\"custom-control-label\" for=" + key + ">" + key + " " + data[key] +
                    "</label></div>"
                        );
                    }
                }
            });
});


// POST зарос на сервер для формирования SQL запроса в InfluxDB
$(document).on('submit', '#sqlRequestToInflux', function (e) {
    e.preventDefault();

    let timeClientFieldFrom = document.getElementById('timeBefore');
    let timeClientUtcValueFrom = new Date(timeClientFieldFrom.value).toISOString();

    let timeClientFieldTo = document.getElementById('timeAfter');
    let timeClientUtcValueTo = new Date(timeClientFieldTo.value).toISOString();

    let submitInfluxQuery = new FormData($('#sqlRequestToInflux')[0]);
    submitInfluxQuery.append('timeClientUtcValueFrom', timeClientUtcValueFrom);
    submitInfluxQuery.append('timeClientUtcValueTo', timeClientUtcValueTo);


    let urlSubmitInfluxQuery = $('#sqlRequestToInflux').attr('action');

    $.ajax({
        url: urlSubmitInfluxQuery,
        data: submitInfluxQuery,
        type: 'POST',
        contentType: false,
        processData: false

    })
        .done(console.log('send'))
});


// Перечень выбранных тегов
$(document).on('click', '.tagsSelected', function() {             // по клику на кнопке "Продлжить"
    let checkboxes = $('.checkboxes');                                          // получаем содержимое всех чеубоксов

    for (let index = 0; index < checkboxes.length; index++) {       // список уникальных тегов, чтобы не было повторов
        if (checkboxes[index].checked) {
            list.add(checkboxes[index].value);                      // добавляются в Set значения из checkboxes
        }
    }
    tagsListForInfluxGenerator();
});


// Редактирование списка выбранных тегов (удаление ненужных)
$(document).on('click', '.tagsDelete', function() {
    let checkboxes = $('.checkboxesTagsSelected');

    for (let index = 0; index < checkboxes.length; index++) {
        if (checkboxes[index].checked) {
            list.delete(checkboxes[index].value);                   // Удаляются из Set содержимое выбранных checkboxes
        }
    }
    tagsListForInfluxGenerator();
});


//  Генератор списка с чекбоксами
function tagsListForInfluxGenerator() {
        $('.listOfSelectedTags').empty();
            for (let i of list) {                                  // Генератор списка тегов, отобраных для отображения
                chBoxesChecked.push(i);
                $('.listOfSelectedTags').append(
                    "<div class=\"custom-control custom-checkbox\">" +
                    "<input type=\"checkbox\" class=\"custom-control-input checkboxesTagsSelected\" name=\"chBoxes\"" +
                    "id=" + i + " value=" + i + ">" +
                    "<label class=\"custom-control-label\" for=" + i + ">" + i +
                    "</label></div>"
                );
            }
        $('#hiddenInput').val(chBoxesChecked);          // скрытый input, содержимое готорого отправляется ajax в influx
}


let excelToCSVFileInput = document.getElementById('excelToCSVFileInput');

function handleFile(e) {
  var files = e.target.files, f = files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});

          console.log('открыт файл')

          var first_sheet_name = workbook.SheetNames[0];
          var address_of_cell = 'A1';

          /* Get worksheet */
          var worksheet = workbook.Sheets[first_sheet_name];

          /* Find desired cell */
          var desired_cell = worksheet[address_of_cell];

          /* Get the value */
          var desired_value = (desired_cell ? desired_cell.v : undefined);

          console.log(desired_value)
      };
          reader.readAsArrayBuffer(f);
  }
excelToCSVFileInput.addEventListener('change', handleFile, false);


// Client time to UTC time
var d = new Date();
var n = d.toISOString();
console.log(n);