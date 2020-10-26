let chBoxesChecked = [];
let list = new Set();


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
                    };
                }
            });
});


// POST зарос на сервер для формирования SQL запроса в InfluxDB
$(document).on('click', '.ajaxClick', function(e) {
    e.preventDefault();

        let newUrl = $('#sqlRequestToInflux').attr('action');

            $.ajax({
                url: newUrl,
                data: $('#sqlRequestToInflux').serialize(),
                method: 'POST',
                success: function() {
                    console.log('ajax sql influx DONE');
                }
            });
});

// Перечень выбранных тегов
$(document).on('click', '.tagsSelected', function(){                // по клику на кнопке "Продлжить"
    let checkboxes = $('.checkboxes');                              // получаем содержимое всех чеубоксов

    for (let index = 0; index < checkboxes.length; index++) {       // список уникальных тегов, чтобы не было повторов
        if (checkboxes[index].checked) {
            list.add(checkboxes[index].value);                      // добавляются в Set значения из checkboxes
        };
    };
    tagsListForInfluxGenerator();
});

// Редактирование списка выбранных тегов (удаление ненужных)
$(document).on('click', '.tagsDelete', function() {
    let checkboxes = $('.checkboxesTagsSelected');

    for (let index = 0; index < checkboxes.length; index++) {
        if (checkboxes[index].checked) {
            list.delete(checkboxes[index].value);                   // Удаляются из Set содержимое выбранных checkboxes
        };
    };
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
            };
        $('#hiddenInput').val(chBoxesChecked);          // скрытый input содержимое готорого отправляется ajax в influx
    };

// обработка элементов, которые были динамически добавлены на страницу
// якобы рабочая
//$(function() {
//        $(document).on('click touchstart', '.selector', function(){
//            console.log($(this));
//        });
//    });

(function(){
        let trace1 = {x: [1, 2, 3], y: [4, 5, 6], name: 'yaxis1 data', type: 'scatter'};

        let trace2 = {x: [2, 3, 4], y: [40, 50, 60], name: 'yaxis2 data', yaxis: 'y2', type: 'scatter'};

        let trace3 = {x: [4, 5, 6], y: [40000, 50000, 60000], name: 'yaxis3 data', yaxis: 'y3', type: 'scatter'};

        let trace4 = {x: [5, 6, 7], y: [400000, 500000, 600000], name: 'yaxis4 data', yaxis: 'y4', type: 'scatter'};

        let data = [trace1, trace2, trace3, trace4];

        let layout = {
            title: 'multiple y-axes example',
            width: 1800,
            xaxis: {domain: [0.3, 0.7]},
            yaxis: {
                title: 'yaxis title',
                titlefont: {color: '#1f77b4'},
                tickfont: {color: '#1f77b4'}
            },

        yaxis2: {
            title: 'yaxis2 title',
            titlefont: {color: '#ff7f0e'},
            tickfont: {color: '#ff7f0e'},
            anchor: 'free',
            overlaying: 'y',
            side: 'left',
            position: 0.15
        },
        yaxis3: {
            title: 'yaxis4 title',
            titlefont: {color: '#d62728'},
            tickfont: {color: '#d62728'},
            anchor: 'x',
            overlaying: 'y',
            side: 'right'
        },
        yaxis4: {
            title: 'yaxis5 title',
            titlefont: {color: '#9467bd'},
            tickfont: {color: '#9467bd'},
            anchor: 'free',
            overlaying: 'y',
            side: 'right',
            position: 0.85
        }
         };
    Plotly.newPlot('chart', data, layout, {scrollZoom: true}, {editable: true});
}());
