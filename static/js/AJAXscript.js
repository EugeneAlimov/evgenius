let chBoxesChecked = [];



//POST зарос на сервер для выбора из какой группы читать теги

 $(document).on('change', '.inputGroupTagsSelect', function (e) {         // при событии на элементе формы (изменении)
    e.preventDefault();                                                   // сброс стандартного поведения

        let url = $('#groupList').attr('action');

            $.ajax({
            url: url,
            data: $('#groupList').serialize(),                                   //сериализация данных из формы
            method: 'POST',
            success: function(data){                                    // когда данные успешно вернулись разбираю data
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
    console.log(timeBefore.type)

        let newUrl = $('#sqlRequestToInflux').attr('action');

            $.ajax({
                url: newUrl,
                data: $('#sqlRequestToInflux').serialize(),
                method: 'POST',
                success: function() {
                    console.log('DONE');
            }
            });
});




// Перечень выбранных тегов. Генератор списка с чекбоксами.
// Нужно добавить кнопку удаления ненужных тегов и запрос на обновление SQL запроса для перерисовки тренда

$(document).on('click', '.tagsSelected', function(){                // по клику на кнопке "Продлжить"
    let checkboxes = $('.checkboxes')                               // получаем содержимое всех чеубоксов

    for (let index = 0; index < checkboxes.length; index++) {       // Отрисовуем в отдельный список выбранные теги
        if (checkboxes[index].checked) {
        chBoxesChecked.push(checkboxes[index].value);                // массив значений уже выбранных чекбоксов
            $('.listOfSelectedTags').append(
                "<div class=\"custom-control custom-checkbox\">" +
                "<input type=\"checkbox\" class=\"custom-control-input checkboxesTagsSelected\" name=\"chBoxes\" id=" +
                index + " value=" + index + ">" +
                "<label class=\"custom-control-label\" for=" + index + ">" + checkboxes[index].value +
                "</label></div>"
                );
        };
    };
    $('#hiddenInput').val(chBoxesChecked);
    // return function(chBoxesChecked) {;
// };
});



// обработка элементов, которые были динамически добавлены на страницу
// якобы рабочая
//$(function() {
//        $(document).on('click touchstart', '.selector', function(){
//            console.log($(this));
//        });
//    });
