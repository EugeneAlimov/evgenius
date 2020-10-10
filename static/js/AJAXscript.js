
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
                    $(".listTags").append(
                    "<div class=\"custom-control custom-checkbox\">" +
                    "<input type=\"checkbox\" class=\"custom-control-input\" id=" + key + ">" +
                    "<label class=\"custom-control-label\" for=" + key + ">" + key + data[key] +
                    "</label></div>"
                    );
                    };
                }
            });
});





//                                            <div class=\"custom-control custom-checkbox\">
//                                                <input type=\"checkbox\" class=\"custom-control-input\" id={{ tags.name_tag }} >
//                                                <label class=\"custom-control-label\" for={{ tags.name_tag }}>
//                                                    {{ tags.name_tag }}{{ tags.comment }}</label>
//                                            </div>



// обработка элементов, которые были динамически добавлены на страницу
// якобы рабочая



//$(function() {
//        $(document).on('click touchstart', '.selector', function(){
//            console.log($(this));
//        });
//    });