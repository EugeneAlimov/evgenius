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

// Перечень выбранных тегов. Генератор списка с чекбоксами.
// Нужно добавить кнопку удаления ненужных тегов и запрос на обновление SQL запроса для перерисовки тренда

$(document).on('click', '.tagsSelected', function(){                // по клику на кнопке "Продлжить"
    let checkboxes = $('.checkboxes');                              // получаем содержимое всех чеубоксов

    $('.listOfSelectedTags').empty();                               // Очистка списка

    for (let index = 0; index < checkboxes.length; index++) {       // список уникальных тегов, чтобы не было повторов
        if (checkboxes[index].checked) {
            list.add(checkboxes[index].value);
        };
    };
        for (let i of list) {                                       // Генератор списка тегов, отобраных для отображения
        chBoxesChecked.push(i);
        console.log(i)
        $('.listOfSelectedTags').append(
            "<div class=\"custom-control custom-checkbox\">" +
            "<input type=\"checkbox\" class=\"custom-control-input checkboxesTagsSelected\" name=\"chBoxes\" id=" +
            i + " value=" + i + ">" +
            "<label class=\"custom-control-label\" for=" + i + ">" + i +
            "</label></div>"
        );
    };
    $('#hiddenInput').val(chBoxesChecked);
});



// обработка элементов, которые были динамически добавлены на страницу
// якобы рабочая
//$(function() {
//        $(document).on('click touchstart', '.selector', function(){
//            console.log($(this));
//        });
//    });
