let targetIdBuffer = ''
let chBoxObjSelectList = {}
const checkboxes = $('.checkboxesTagsSelected');

// при очередном обновлении списка отмечает галочками теги, которые были выбраны ранее
function TagsCheckBox() {
    let element = document.getElementsByClassName('checkboxes')
    for (let i = 0; i < element.length - 1; i++) {
        element[i].checked = chBoxObjSelectList.hasOwnProperty(element[i].id);
    }
}

//POST зарос на сервер для выбора из какой группы читать теги
$(document).on('click', '.listGroup', function (e) {    // при событии на элементе формы
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

        success: function (data) {                              // когда данные успешно вернулись разобрать data
            $('#prime').hide()
            const listTagsStyle = $('.listTags')
            const namesArr = []
            const dataTypes = []
            listTagsStyle.empty()                                  // Очистка списка
            listTagsStyle.css('height', `${window.innerHeight / 100 * 77.5}px`);
            listTagsStyle.css('width', `375px`,);
            listTagsStyle.css('overflow-y', `scroll`);
            for (let key in data) {                     // на пары ключ-значение и отрисовать список
                let comment = ` - ${data[key][0]}`
                if (comment === ' - null') {
                        comment = ''
                    }
                listTagsStyle.append(
                    `<li class="tags-chek-box-block checkbox-hover">
                        <label class="checkbox-other">
                        <input type="checkbox" class="checkboxes" id="${key}" value="${data[key][1]}">
                        <span class="tags-chek-box-label">${key}${comment}</span>
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

    let submitInfluxQueryForm = $('#sqlRequestToInflux');
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

            let axisColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#1f77b4', '#ff7f0e']
            let yaxis = 1
            let boolCounter = 0
            let analogCounter = 0
            const myObj = Object.values(data)
            const d = []
            let layoutConstruct = {}
            const layout = {
                title: 'multiple y-axes example',
                width: window.innerWidth / 100 * 98,
                height: window.innerHeight / 100 * 78,
                xaxis: {domain: [0.15, 0.85], 'showgrid': false, rangeslider: {}},
                rangeslider: {
                    currentvalue: true,
                    bgcolor: '#2ca02c',
                    activebgcolor: '#2ca02c'
                },
                legend: {borderwidth: 0,
                    xanchor: 'left',
                    x: -0.02,
                    y: -0.36,
                    yanchor: 'top',
                    valign: 'bottom',
                    orientation: 'h',
                    bgcolor: 'white',
                    bordercolor: '#444',
                    font: {
                        family: '\"Open Sans\", verdana, arial, sans-serif',
                        size: 12,
                        color: '#2a3f5f'
                        },
                    traceorder: 'normal',
                    itemsizing: 'trace',
                    itemwidth: 30,
                    itemclick: 'toggle',
                    itemdoubleclick: 'toggleothers',
                }
            }
            for (let item of myObj) {
                for (let i in chBoxObjSelectList) {
                    let itemArr = []
                    itemArr = item[i]
                    // console.log(Object.values(chBoxObjSelectList)[yaxis - 1])
                    let trace = {}
                    let overlaying = ''
                    let position
                    let positionAnalog = [0.0, 0.025, 0.05, 0.075, 0.1, 0.125] // шаг 0,028
                    let positionBool = [1.0, 0.975, 0.95, 0.925, 0.9, 0.875] // шаг 0,03
                    trace['x'] = item['time']
                    trace['y'] = item[i]
                    trace['yaxis'] = `y${yaxis}`
                    trace['name'] = i
                    trace['type'] = 'line'
                    if (Object.values(chBoxObjSelectList)[yaxis - 1] === 'Bool') { // получение типа данных и проверка на соответствие bool
                        trace['line'] = {shape: 'vh'}                               //Если bool установить тип графика "ступенчатый"
                    } else {
                        trace['line'] = {shape: 'vh'}                           //Если НЕ bool установить тип графика "сглаженная лииния"
                    }
                    d.push(trace)
                    if (yaxis === 1) {
                        overlaying = 'false'
                    } else {
                        overlaying = 'y'
                    }
                    if (Object.values(chBoxObjSelectList)[yaxis - 1] === 'Bool') {
                        position = positionBool[boolCounter]
                        boolCounter += 1
                    } else {
                        position = positionAnalog[analogCounter]
                        analogCounter += 1
                    }
                    // console.log(position)
                    layoutConstruct = {
                        'overlaying': overlaying,
                        'tickangle': 270,
                        'position': position,                        
                        'tickfont': {color: axisColors[`${yaxis-1}`]},
                        'showgrid': false,
                        rangeslider: {}
                        }
                    console.log(layoutConstruct)
                    layout[`yaxis${yaxis}`] = layoutConstruct
                    yaxis += 1
                }
            }

            data = d
            Plotly.newPlot('chart', data, layout, {scrollZoom: true, autosize: false,
                legend: {yanchor: 'auto', orientation: 'h', x: 0, y: -1, traceorder: 'normal', itemsizing: 'trace', xanchor: 'left', valign: 'middle'}, displaylogo: false, responsive: true, margin:{autoexpand: true}})
        }

    });        let gd = document.getElementById('chart')
console.log('gd.data ', gd)

});

// Список выбранных тегов для отправки в influx
$(document).on('click', '#continue', function () {             // по клику на кнопке "Продлжить"
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
$(document).on('click', '.tagsDelete', function () {
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




// var ctx = document.getElementById('myChart');

// var myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         datasets: [
//             {
//             data: [20, 50, 100, 75, 25, 0],
//             label: 'Left dataset',

//             // This binds the dataset to the left y axis
//             yAxisID: 'left-y-axis'
//         },
//         {
//             data: [0.1, 0.5, 1.0, 2.0, 1.5, 0],
//             label: 'Right dataset',

//             // This binds the dataset to the right y axis
//             yAxisID: 'right-y-axis'
//         },
//         {
//             data: [10, 15, 10, 22, 35, 20],
//             label: 'Right dataset2222222',

//             // This binds the dataset to the right y axis
//             yAxisID: 'right22-y22-axis22'
//         },
//         {
//             data: [180, 155, 140, 132, 125, 140],
//             label: 'Right dataset55555',

//             // This binds the dataset to the right y axis
//             yAxisID: 'right55-y55-axis55'
//         }
//     ],
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
//     },
//     options: {
//         scales: {
//             yAxes: [{
//                 id: 'left-y-axis',
//                 type: 'linear',
//                 position: 'left'
//             },
//             {
//                 id: 'right-y-axis',
//                 type: 'linear',
//                 position: 'right'
//             },
//             {
//                 id: 'right22-y22-axis22',
//                 type: 'linear',
//                 position: 'right'
//             },
//             {
//                 id: 'right55-y55-axis55',
//                 type: 'linear',
//                 position: 'right'
//             }
//         ]
//         }
//     }
// });