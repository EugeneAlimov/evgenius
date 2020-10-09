


 //POST зарос на сервер при выборе из какой группы читать теги

 $(document).on('change', '#inputGroupSelect03', function (e) {         // при событии на элементе формы (изменении)
    e.preventDefault();                                                 // сброс стандартного поведения

        let formData = $('#groupList')
        let url = formData.attr("action");
            $.ajax({
            url: url,
            data: formData.serialize(),                                 //сериализация данных из формы
            type: 'POST',
            success: function(data){                                    // когда данные успешно вернулись разбираю data
                for (let key in data) {                                 // на пары ключ-значение и отрисовываю список
                    let a = key                                         // тегов с комментариями и чекбоксами
                    let b = data[key]
                    $(".listTags").append("<div class=\"custom-control custom-checkbox\"><div class=\"custom-control custom-checkbox\"><label class=\"custom-control-label\">" + key + data[key] + "</label></div>");
            // console.log(key, data[key])
                }
            }
        });

    });

// обработка элементов, которые были динамически добавлены на страницу
// якобы рабочая



//$(function() {
//        $(document).on('click touchstart', '.selector', function(){
//            console.log($(this));
//        });
//    });