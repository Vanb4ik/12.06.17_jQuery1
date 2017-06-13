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
    $("#create").click(function (e)//показати/сховати форму
    {
        e.preventDefault();
        if(e.target.tagName.toUpperCase()==="BUTTON")
        {
            $($form).toggleClass("users-edit-hidden");
            /*console.log("Create User");*/
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
                /*console.log("submit");*/
                var toCreate =
                    {
                        /*id: this.elements.id.value,*/
                        fullName:   $("#fullname")[0].value,
                        birthday:   $("#birthday")[0].value,
                        profession: $("#profession")[0].value,
                        address:    $("#address")[0].value,
                        country:    $("#country")[0].value,
                        shortInfo:  $("#short-info")[0].value,
                        fullInfo:   $("#full-info")[0].value
                    };

                var xhr = new XMLHttpRequest();
                xhr.open(toCreate.id ? "put":"post","/user");//якщо є ід - то "put" інакше "post"
                xhr.responseType= "json";
                xhr.setRequestHeader("Content-Type","application/json");//кажемо серверу що передаємо йому джейсон
                var data =JSON.stringify(toCreate); // тут перетворюємо джейсон в строку
                xhr.send(data); //відпраляємо запит та передаємо тепер ту строку
                xhr.onreadystatechange = function ()
                {
                    if (this.readyState !==this.DONE)
                    {
                        return;
                    }
                    var todo = this.response;
                    /*console.log(todo);*/
                    var rowExistent = document.getElementById(todo.id);
                    addRow(todo,$table,rowExistent);
                    if (rowExistent)
                    {
                        rowExistent.parentElement.removeChild(rowExistent);
                    }

                    clearForm();//почистити поля форми
                };


            }
            else if ($($btn).attr("class")==="btn btn-cancel")
            {
                $($form).toggleClass("users-edit-hidden");

            }
        }

    });
    $.getJSON("/user", function (uList)//заповняє таблицю з сервера+додає кнопки управління
    {
        for (var i = 0; i < uList.length; i++)
        {
            var $tr=$("<tr></tr>").attr("id",uList[i].id).appendTo($table);

            $("<td></td>").text(uList[i].fullName).appendTo($tr);
            $("<td></td>").text(uList[i].profession).appendTo($tr);
            $("<td></td>").text(uList[i].shortInfo).appendTo($tr);
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
            $("<option></option>").text(uList[i]).appendTo($("#country"));
        }
    });
    $($table).click(function (e)//слухач на кнопки видалення/редагування
    {
        e.preventDefault();
        if (e.target.tagName ==="BUTTON")
        {
             var $btn = e.target,
             $id = $($btn).attr("data-target");
             if ($($btn).attr("class")==="removeBtn")//якщо клас removeBtn то
             {
                 remove ($id);
                 /*console.log($id);*/

             }
             else if ($($btn).attr("class")==="editBtn")
             {
                 $($form).toggleClass("users-edit-hidden",false);
             /*setToEdit(id,form);*/

             }

        }
    });
    function addRow(todo,table,before)//ф-ія створення рядків в твблиці
    {
        var $tr=$("<tr></tr>").attr("id",todo.id).appendTo(table);
        $("<td></td>").text($("#fullname")[0].value).appendTo($tr);
        $("<td></td>").text($("#profession")[0].value).appendTo($tr);
        $("<td></td>").text($("#short-info")[0].value).appendTo($tr);
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
        var removeXhr = new XMLHttpRequest(); //спитати як запустити функцію видаленняя через $.
        removeXhr.open("delete","/user?id="+id);
        removeXhr.responseType="json";
        removeXhr.onreadystatechange = function ()
        {
            if (this.readyState !== this.DONE)
            {
                return;
            }
            var rowToRemowe =$("#"+id)[0];// тут пизда повна спитати як правильно
            rowToRemowe.parentElement.removeChild(rowToRemowe);
            /*console.dir(rowToRemowe);*/
        };
        removeXhr.send();
    }
    function clearForm ()
    {
        $("#fullname")[0].value="";
        $("#birthday")[0].value="";
        $("#profession")[0].value="";
        $("#address")[0].value="";
        /*$("#country")[0].value;*/
        $("#short-info")[0].value="";
        $("#full-info")[0].value="";
    }

})(jQuery);