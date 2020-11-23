let targetIdBuffer = ''
let chBoxObjSelectList = {}
const checkboxes = $('.checkboxesTagsSelected');



// let excelFileSubmitButton = document.getElementById('excelFileSubmitButton'); // отключение по умолчанию кнопки отправки
// excelFileSubmitButton.disabled=true; // excel афйла на распарсивание

// let excelFileInput = document.getElementById('excelFileInput'); // получение объекта input-a отправки на распарсивание
// let excelFileInputValue = excelFileInput.value; // excel файла и длины строки содержимого объекта
//
// excelFileInput.addEventListener('change', disableExcelFileSubmitButton); // как произойдет изменение в форме вызов функции
                                                                      // включение кнопки
// Включение кнопки отправки excel файла если содержимое инпута изменится и будет > 0
// function disableExcelFileSubmitButton() {
//     excelFileInputValue = excelFileInput.value;
//     if(excelFileInputValue.length > 0) {
//         excelFileSubmitButton.disabled=false
//     }
// }


// при очередном обновлении списка отмечает галочками теги, которые были выбраны ранее
function TagsCheckBox () {
    let element = document.getElementsByClassName('checkboxes')
    for (let i = 0; i < element.length - 1; i++) {
        element[i].checked = chBoxObjSelectList.hasOwnProperty(element[i].id);
    }
}

//POST зарос на сервер для выбора из какой группы читать теги
$(document).on('click', '.listGroup', function(e) {    // при событии на элементе формы
    e.preventDefault();                                                   // сброс стандартного поведения

    const nameGroup = this.id;                                            // id элемента по которому кликнули

                // выделение выбранной группы
    const targetId = `group-hover-${nameGroup}`
    const groupHover = document.getElementById(`${targetId}`)
        if (targetIdBuffer.length > 0) {
                document.getElementById(`${targetIdBuffer}`).style.backgroundColor = ''
        }
    targetIdBuffer = targetId
    groupHover.style.backgroundColor = '#020202'
    // ***********************************************

    const groupListForm = $('#groupList');                                // получение объекта формы
    const url = groupListForm.attr('action');

    let groupAjaxData = new FormData(groupListForm[0]);                   // новый FormData, который будет отправлен на сервер (пустой)
    groupAjaxData.append('groupList', nameGroup)                    // наплнение FormData

            $.ajax({
            url: url,
            data: groupAjaxData,
            method: 'POST',
            contentType: false,
            processData: false,

            success: function(data){                              // когда данные успешно вернулись разобрать data
                $('#prime').hide()
                const listTagsStyle = $('.listTags')
                const namesArr = []
                const dataTypes = []
                listTagsStyle.empty()                                  // Очистка списка
                listTagsStyle.css('height', `${window.innerHeight / 100 * 77.5}px`);
                listTagsStyle.css('width', `375px`, );
                listTagsStyle.css('overflow-y', `scroll`);
                for (let key in data) {                     // на пары ключ-значение и отрисовать список
                    listTagsStyle.append(
                        `<li class="tags-chek-box-block checkbox-hover">
                        <label class="checkbox-other">
                        <input type="checkbox" class="checkboxes" id="${key}" value="${data[key][1]}">
                        <span class="tags-chek-box-label">${key} - ${data[key][0]}</span>
                        </label>
                        </li>`
                        );
                    }
                TagsCheckBox()
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

    let submitInfluxQueryForm =  $('#sqlRequestToInflux');
    let submitInfluxQuery = new FormData(submitInfluxQueryForm[0]);

    submitInfluxQuery.append('timeClientUtcValueFrom', timeClientUtcValueFrom);
    submitInfluxQuery.append('timeClientUtcValueTo', timeClientUtcValueTo);
    // submitInfluxQuery.append('list', chBoxesChecked);


    let urlSubmitInfluxQuery = submitInfluxQueryForm.attr('action');

    $.ajax({
        url: urlSubmitInfluxQuery,
        data: submitInfluxQuery,
        method: 'POST',
        contentType: false,
        processData: false,
        success: function (data) {

            let o = 0
            let myObj = Object.values(data)
            let d = []
            for (let item of myObj) {
                for (let i in chBoxObjSelectList) {
                    let trace = {}
                    trace['x'] = item['time']
                    trace['y'] = item[i]
                    trace['name'] = i
                    if (Object.values(chBoxObjSelectList) === 'bool')
                        {trace['line'] = {shape: 'hvh'}
                        } else {
                            trace['line'] = {shape: 'spline'}
                        }
                    trace['type'] = 'scatter'
                    d.push(trace)

                }
            }
            console.log('d ', d)
            data = d
            console.log('data ', data)

            const layout = {
    title: 'multiple y-axes example',
    width: window.innerWidth / 100 * 98,
    height: window.innerHeight / 100 * 78,
    xaxis: {domain: [0.1, 0.9]
            },

    yaxis: {
        // autosize: true,
        height: 900,
        title: 'yaxis title',
        titlefont: {color: '#1f77b4'},
        tickfont: {color: '#1f77b4'},
        automargin: true,
        // side: 'right',
        },

    yaxis2: {
        title: 'yaxis2 title',
        titlefont: {color: '#ff7f0e'},
        tickfont: {color: '#ff7f0e'},
        anchor: 'y',
        overlaying: 'y',
        side: 'left',
        automargin: true,
        position: 0.01
    },

        // yaxis3: {
        //     title: 'yaxis4 title',
        //     titlefont: {color: '#d62728'},
        //     tickfont: {color: '#d62728'},
        //     anchor: 'y',
        //     overlaying: 'y',
        //    side: 'right',
        //     position: 0.25
        //
        // },
        //
        // yaxis4: {
        //     title: 'yaxis5 title',
        //     titlefont: {color: '#9467bd'},
        //     tickfont: {color: '#9467bd'},
        //     anchor: 'y',
        //     overlaying: 'y',
        //    side: 'right',
        //     position: 0.3
        // }
};

            Plotly.newPlot('chart', data, layout, {scrollZoom: true}, {editable: true}, {autosize: true})
        }
    });
});

// Список выбранных тегов для отправки в influx
$(document).on('click', '#continue', function() {             // по клику на кнопке "Продлжить"
    tagsListForInfluxGenerator();
});

// скрипт памяти выбранных тегов при смене группы(чтобы не терялись при возврате к списку)
$(document).on('click', '.checkboxes', function () {
    const chId = this.id
    const value = document.getElementById(chId).value

    if (document.getElementById(chId).checked) {
        chBoxObjSelectList[chId] = value
    } else {
        delete chBoxObjSelectList[chId]
    }
})

// Редактирование списка выбранных тегов (удаление ненужных) из списка для influx и снятие галочек в списке тегов из групп
$(document).on('click', '.tagsDelete', function() {
    let element = document.getElementsByClassName('checkboxesTagsSelected')
    for (let i = 0; i <= element.length - 1; i++) {
        if (element[i].checked) {
            delete chBoxObjSelectList[element[i].id]
        }
    }

    tagsListForInfluxGenerator();
    TagsCheckBox();
});

//  Генератор списка тегов для отправки influx с чекбоксами
function tagsListForInfluxGenerator() {
    let listOfSelectedTags = $('.listOfSelectedTags')
    const chBoxesChecked = []
        listOfSelectedTags.empty();
            for (let i of Object.keys(chBoxObjSelectList)) {     // Генератор списка тегов, отобраных для отображения
                chBoxesChecked.push(i);
                listOfSelectedTags.append(
                    `<li class="tags-chek-box-block">
                    <label class="checkbox-other">
                    <input type="checkbox" class="checkboxesTagsSelected" id="${i}" value="${i}">
                    <span class="tags-chek-box-label">${i}</span>
                    </label>
                    </li>`
                );
            }
        $('#hiddenInput').val(chBoxesChecked);      // скрытый input, содержимое готорого отправляется ajax-ом в influx
}





// let excelToCSVFileInput = document.getElementById('excelToCSVFileInput');
//
// function handleFile(e) {
//   let files = e.target.files;
//   let f = files[0];
//   let reader = new FileReader();
//   reader.onload = function(e) {
//       let data = new Uint8Array(e.target.result);
//       let workbook = XLSX.read(data, {type: 'array'});
//
//           console.log('открыт файл')
//
//           let first_sheet_name = workbook.SheetNames[0];
//           let address_of_cell = 'A1';
//
//           /* Get worksheet */
//           let worksheet = workbook.Sheets[first_sheet_name];
//
//           /* Find desired cell */
//           let desired_cell = worksheet[address_of_cell];
//
//           /* Get the value */
//           let desired_value = (desired_cell ? desired_cell.v : undefined);
//
//           console.log(desired_value)
//       };
//           reader.readAsArrayBuffer(f);
//   }
// excelToCSVFileInput.addEventListener('change', handleFile, false);


