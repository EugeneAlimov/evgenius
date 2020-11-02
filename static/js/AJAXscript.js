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

// обработка элементов, которые были динамически добавлены на страницу
// якобы рабочая
//$(function() {
//        $(document).on('click touchstart', '.selector', function(){
//            console.log($(this));
//        });
//    });


// plotly JS
(function() {

        let trace1 = {x: [1, 2, 3], y: [4, 5, 6], name: 'yaxis1 data', type: 'scatter'};

        let trace2 = {x: [2, 3, 4], y: [40, 50, 60], name: 'yaxis2 data', yaxis: 'y2', type: 'scatter'};

        let trace3 = {x: [4, 5, 6], y: [40000, 50000, 60000], name: 'yaxis3 data', yaxis: 'y3', type: 'scatter'};

        let trace4 = {x: [5, 6, 7], y: [400000, 500000, 600000], name: 'yaxis4 data', yaxis: 'y4', type: 'scatter'};

        let data = [trace1, trace2, trace3, trace4];

        let layout = {
            title: 'multiple y-axes example',
           width: 1920,
            xaxis: {domain: [0.3, 0.7]},

        yaxis: {
            title: 'yaxis title',
            titlefont: {color: '#1f77b4'},
            tickfont: {color: '#1f77b4'},
            },

        yaxis2: {
            title: 'yaxis2 title',
            titlefont: {color: '#ff7f0e'},
            tickfont: {color: '#ff7f0e'},
            anchor: 'y',
            overlaying: 'y',
//            side: 'left',
            position: 0.2
        },

        yaxis3: {
            title: 'yaxis4 title',
            titlefont: {color: '#d62728'},
            tickfont: {color: '#d62728'},
            anchor: 'y',
            overlaying: 'y',
//            side: 'right'
            position: 0.25

        },

        yaxis4: {
            title: 'yaxis5 title',
            titlefont: {color: '#9467bd'},
            tickfont: {color: '#9467bd'},
            anchor: 'y',
            overlaying: 'y',
//            side: 'right',
            position: 0.3
        }
    };
        Plotly.newPlot('chart', data, layout, {scrollZoom: true}, {editable: true});
}());

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