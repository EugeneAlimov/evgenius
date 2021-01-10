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
                xaxis: {domain: [0.15, 0.85]}
            }
            for (let item of myObj) {
                for (let i in chBoxObjSelectList) {
                    let itemArr = []
                    itemArr = item[i]
                    console.log(Object.values(chBoxObjSelectList)[yaxis - 1])
                    let trace = {}
                    let overlaying = ''
                    let position
                    let positionAnalog = [0, 0.035, 0.07, 0.105, 0.14, 0.175] // шаг 0,035
                    let positionBool = [0.825, 0.86, 0.895, 0.93, 0.965, 1]
                    trace['x'] = item['time']
                    trace['y'] = item[i]
                    trace['yaxis'] = `y${yaxis}`
                    trace['name'] = i
                    trace['type'] = 'line'
                    if (Object.values(chBoxObjSelectList)[yaxis - 1] === 'Bool') { // получение типа данных и проверка на соответствие bool
                        trace['line'] = {shape: 'vh'}                               //Если bool установить тип графика "ступенчатый"
                    } else {
                        trace['line'] = {shape: 'spline'}                           //Если НЕ bool установить тип графика "сглаженная лииния"
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
                    console.log(position)
                    layoutConstruct = {'title': i, 'overlaying': overlaying, 'position': position, side: 'left'}
                    layout[`yaxis${yaxis}`] = layoutConstruct
                    yaxis += 1
                }
            }

            data = d
            Plotly.newPlot('chart', data, layout, {scrollZoom: true}, {editable: true}, {autosize: true})
        }
    });
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

