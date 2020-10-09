


 //POST зарос на сервер при выборе из какой группы читать теги

 $(document).on('change', '#inputGroupSelect03', function (e) {           // при событии на элементе формы (изменении)
    e.preventDefault();                                                   // сброс стандартного поведения

        let formData = $('#groupList')
        let url = formData.attr("action");
            $.ajax({
            url: url,
            data: formData.serialize(),                                   //сериализация данных из формы
            type: 'POST',
            success: function(data){

            for (let key in data) {
            let a = key
            let b = data[key]
            a = String(a)
            b = String(b)
                $(".listTags").append("<div class=\"custom-control custom-checkbox\"><div class=\"custom-control custom-checkbox\"><label class=\"custom-control-label\">" (a b) "</label></div>");
            // console.log(key, data[key])
                }
            }
//            error: alert('Произошла ошибка :(Обновите страницу и попробуйте снова.')
        });

    });




//<div class="custom-control custom-checkbox">
//<div class="custom-control custom-checkbox">
//<label class="custom-control-label" for={{ tags.name_tag }}>{{ tags.name_tag }}{{ tags.comment }}</label>
//</div>

// обработка элементов, которые были динамически добавлены на страницу
// якобы рабочая



//$(function() {
//        $(document).on('click touchstart', '.selector', function(){
//            console.log($(this));
//        });
//    });