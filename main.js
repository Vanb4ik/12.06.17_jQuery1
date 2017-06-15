(function ($) {
/*
*GET /user - Users list
 GET /user?id=<id> - specific user
 POST /user - create user
 PUT /user - update user
 DELETE /user?id=<id> - remove user
 GET /countries - countries list
* */
    var $table=$("#users-table");

    var $form = $("form[name$='users-edit']");

    $("h2>button").css
    ({
        "border-radius":"5px",
        "box-shadow": "10px 10px 10px rgba(30, 30, 30, 0.5)"
    });



    $("#create").click(function (e)//показати/сховати форму при кліку на кнопку
    {
        e.preventDefault();
        if(e.target.tagName.toUpperCase()==="BUTTON")
        {
            showForm();
        }
    });
    $($form).click(function (e)//слухач на форму
    {
        e.preventDefault();

        if (e.target.tagName.toUpperCase()==="BUTTON")
        {
            var $btn = e.target;
            /*console.log($btn);*/
            if ($($btn).attr("class")==="btn btn-save")//якщо клас btn-save пушимо на сервер і створюємо/редагуємо строку
            {

                if(   $("#fullname")[0].value
                    &&$("#profession")[0].value
                    &&$("#address")[0].value
                    &&$("#short-info")[0].value)
                {
                    var toCreate =
                        {
                            id: $form.attr("value"),
                            fullName:   $("#fullname")[0].value,
                            birthday:   $("#birthday")[0].value,
                            profession: $("#profession")[0].value,
                            address:    $("#address")[0].value,
                            country:    $("#country")[0].value,
                            shortInfo:  $("#short-info")[0].value,
                            fullInfo:   $("#full-info")[0].value
                        };


                    /*function returnTyp()
                    {
                        if(toCreate.id) //якщо є ід - то повертаемо метод редагувати
                        {
                            return "PUT";
                        }
                        return "POST"; // інакше створити
                    }
                    var data =JSON.stringify(toCreate);//тут джейсонимо
                    $.ajax
                    ({
                        url: "/user?id=" + toCreate.id, type: returnTyp(), data: data, success: function (result)
                        {
                            // а тут ніц не робить
                        }
                    });*/

                    var xhr = new XMLHttpRequest();
                    xhr.open(toCreate.id ? "put":"post","/user");//якщо є ід - то "put" інакше "post"
                    xhr.responseType= "json";
                    xhr.setRequestHeader("Content-Type","application/json");//кажемо серверу що передаємо йому джейсон
                    var data =JSON.stringify(toCreate); // тут перетворюємо джейсон в строку
                    /*console.log(data);*/
                    xhr.send(data); //відпраляємо запит та передаємо тепер ту строку
                    xhr.onreadystatechange = function ()
                    {
                        if (this.readyState !==this.DONE)
                        {
                            return;
                        }

                        var todo = this.response;
                        if ($form.attr("value"))
                        {
                            editRow($form.attr("value"));
                        }
                        else
                        {
                            addRow(todo,$table);
                        }
                        console.log(data);
                        $form.attr("value","");
                        $($form).toggleClass("users-edit-hidden");
                        clearForm();//почистити поля форми
                    };
                }
            }
            else if ($($btn).attr("class")==="btn btn-cancel")
            {
                $($form).toggleClass("users-edit-hidden");
                clearForm();//почистити поля форми
            }
        }
    });
    function editRow(id)//функція редагуання строки
    {
        var $idTr= $("#"+id)[0];
        $idTr.querySelector(".fullName").innerText=   $("#fullname")[0].value;
        $idTr.querySelector(".profession").innerText= $("#profession")[0].value;
        $idTr.querySelector(".short-info").innerText= $("#short-info")[0].value;

    }
    $.getJSON("/user", function (uList)//заповняє таблицю з сервера+додає кнопки управління
    {
        for (var i = 0; i < uList.length; i++)
        {
            var $tr=$("<tr></tr>").attr("id",uList[i].id).appendTo($table);

            $("<td></td>").addClass("fullName").text(uList[i].fullName).appendTo($tr);
            $("<td></td>").addClass("profession").text(uList[i].profession).appendTo($tr);
            $("<td></td>").addClass("short-info").text(uList[i].shortInfo).appendTo($tr);
            var $td=$("<td></td>");
            $("<button type='button'>Remove</button>")
                .addClass("removeBtn")
                .attr("data-target", uList[i].id)
                .appendTo($td);
            $("<button type='button'>Edit</button>")
                .addClass("editBtn")
                .attr("data-target", uList[i].id)
                .appendTo($td);
            $td.appendTo($tr);

           /*console.dir(uList[i]);*/
        }
    }).fail(function (err)
    {
    });
    $.getJSON("/countries", function (uList)//заповняє formu з сервера списком країн
    {
        for (var i = 0; i < uList.length; i++)
        {
            $("<option></option>").attr("value",i).text(uList[i]).appendTo($("#country"));
        }
    });
    $($table).click(function (e)//слухач на кнопки видалення/редагування
    {
        e.preventDefault();


        if (e.target.tagName ==="BUTTON")
        {
             var $btn = e.target,
             $id = $($btn).attr("data-target");
             targetRow($id,true);
             if ($($btn).attr("class")==="removeBtn")//якщо клас removeBtn то
             {
                 remove ($id);
             }
             else if ($($btn).attr("class")==="editBtn")
             {
                 showForm(false);//сховати форму
                 setToEdit($id,$form);//функція редагування обєкта
             }
        }

    });
    function targetRow(id)//анімація на строку при кліку
    {
        if(id)
        {
            $("tr#"+id+">td").css({
            "border-top":"2px solid red",
            "border-bottom":"2px solid red"});
            idStyle = id;
            setTimeout(function ()
            {
                $("tr#"+id+">td").css({
                    "border-top":"none",
                    "border-bottom":"none",
                    "transition": "opacity 0.3s"});// чого підкресло
            },5000)
        }

    }
    function setToEdit(id,form)//функція заповнення форми табличними значеннями
    {
        form.attr("value",id);
        $.getJSON("/user?id="+id, function (uList)//заповняє таблицю з сервера+додає кнопки управління
        {
            $("#fullname")[0].value=uList.fullName;
            $("#birthday")[0].value=uList.birthday;
            $("#profession")[0].value=uList.profession;
            $("#address")[0].value=uList.address;
            /*$("#country")[0].value=uList.country;*/       // тут ще не придумав
            $("#short-info")[0].value=uList.shortInfo;
            $("#full-info")[0].value=uList.fullInfo;
        });


    }
    function addRow(todo,table)//ф-ія створення рядків в твблиці
    {
        var $tr=$("<tr></tr>").attr("id",todo.id).appendTo(table);
        $("<td></td>").addClass("fullname").text($("#fullname")[0].value).appendTo($tr);
        $("<td></td>").addClass("profession").text($("#profession")[0].value).appendTo($tr);
        $("<td></td>").addClass("short-info").text($("#short-info")[0].value).appendTo($tr);
        var $td=$("<td></td>");
        $("<button type='button'>Remove</button>")
         .addClass("removeBtn")
         .attr("data-target", todo.id)
         .appendTo($td);
        $("<button type='button'>Edit</button>")
         .addClass("editBtn")
         .attr("data-target", todo.id)
         .appendTo($td);
        $td.appendTo($tr);
    }
    function  remove(id) //функція видалення по ід
    {
        $.ajax({url: "/user?id="+id,type: 'DELETE', success: function(result)
        {
            /*console.log(result);*/
            $("tr#"+result).remove();// клас ) во як правильно
        }
        });

    }
    function clearForm ()//очищення форми
    {
        $("#fullname")[0].value="";
        $("#birthday")[0].value="";
        $("#profession")[0].value="";
        $("#address")[0].value="";
        $("#short-info")[0].value="";
        $("#full-info")[0].value="";
    }
    function showForm(bool)//ф-ція показати заховати форму+стилі форми
    {
        $form.toggleClass("users-edit-hidden",bool);
        $form.css
        ({
            "position": "fixed"
        });

    }
})(jQuery);