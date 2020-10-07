


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
            console.log(data)
            }
//            error: alert('Произошла ошибка :(Обновите страницу и попробуйте снова.')
        })

    });


// обработка элементов, которые были динамически добавлены на страницу
// якобы рабочая

$(function() {
        $(document).on('click touchstart', '.selector', function(){
            console.log($(this));
        });
    });