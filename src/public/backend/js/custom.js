
$(document).ready(function () {
    $('[name=from]').tagify();
    var from = document.querySelector('input[name=from]')
    tagify = new Tagify( from );
    $('[name=cc]').tagify();
    var cc = document.querySelector('input[name=cc]')
    tagify = new Tagify( cc );

    var ckbAll = $(".cbAll");
    var fmAdmin = $("#zt-form");

    // CKEDITOR
    if ($('textarea#content_ck').length) {
        CKEDITOR.replace('content_ck');
    }

    //call active menu
    activeMenu();

    //check selectbox
    // change_form_action("#zt-form .slbAction", "#zt-form","#btn-action");

    //check all
    ckbAll.click(function () {
        $('input:checkbox').not(this).prop('checked', this.checked);
        if ($(this).is(':checked')) {
            $(".ordering").attr("name", "ordering");
        }else{      
            $(".ordering").removeAttr("name");
        }
        
    });
    // hiden notify
    hiddenNotify(".close-btn");

    setTimeout(function () {
        $(".close-btn").parent().css({'display': 'none'});
    },7000);


    $("input[name=cid]").click(function () {
        if ($(this).is(':checked')) {
            $(this).parents("tr").find('.ordering').attr("name", "ordering");
        }else{
            $(this).parents("tr").find('.ordering').removeAttr("name");
        }
    });
    
    // CONFIRM DELETE
    $('i.fa-trash-alt').on('click', () => {
        if (!confirm("Bạn có chắc chắn muốn xóa dòng này không?")) return false;
    });

    //active menu function
    function activeMenu() {
        var arrPathname = window.location.pathname.split('/');
        var pattern = (typeof arrPathname[2] !== 'undefined') ? arrPathname[2] : '';

        if (pattern != '') {
            $('#side-menu li a').each(function (index) {
                var subject = $(this).attr("href");
                if (subject != "#" && subject.search(pattern) > 0) {
                    $(this).closest("li").addClass("active");
                    if ($(this).parents("ul").length > 1) {
                        $("#side-menu ul").addClass('in').css("height", "auto");
                        $("#side-menu ul").parent().addClass('active');
                    }
                    return;
                }
            });
        } else {
            $('#side-menu li').first().addClass("active");
        }
    }

    
    function change_form_action(slb_selector, form_selector, id_btn_action) {

        var optValue;
        var isDelete = false;
        var pattenCheckDelete = new RegExp("delete", "i");

        $(slb_selector).on("change", function () {
            optValue = $(this).val();
            
            
            if(optValue !== "") {
                $(id_btn_action).removeAttr('disabled');
            } else {
                $(id_btn_action).attr('disabled', 'disabled');
            }
            $(form_selector).attr("action", optValue);
        });

        $(form_selector + " .btnAction").on("click", function () {
            isDelete = pattenCheckDelete.test($(slb_selector).val());
            if(isDelete){
                var confirmDelete = confirm('Are you really want to delete?');
                if(confirmDelete === false){
                    return;
                }
            }

            var numberOfChecked = $(form_selector + ' input[name="cid"]:checked').length;
            if (numberOfChecked == 0) {
                alert("Please choose some items");
                return;
            } else {
                var flag = false;
                var str = $(slb_selector + " option:selected").attr('data-comfirm');
               
                if (str != undefined) {

                    //Kiểm tra giá trị trả về khi user nhấn nút trên popup
                    flag = confirm(str);
                    if (flag == false) {
                        return flag;
                    } else {
                        $(form_selector).submit();
                    }

                } else {
                    if (optValue != undefined) {
                        $(form_selector).submit();
                    }
                }
            }

        });
    }

    // hidden parent (hidden message notify)
    function hiddenNotify(close_btn_selector){
        $(close_btn_selector).on('click', function(){
            $(this).parent().css({'display':'none'});
        })    
    }

    // list article select box category
    $('select[name="filter_category"]').change(function(){
        var path = window.location.pathname.split('/')
        var linkRedirect = '/' + path[1] + '/' + path[2] + '/filter-category/' + $(this).val();
        window.location.pathname = linkRedirect;
    })
    // list group select box product
    $('select[name="filter-group"]').change(function(){
        var path = window.location.pathname.split('/')
        var linkRedirect = '/' + path[1] + '/' + path[2] + '/filter-group/' + $(this).val();
        window.location.pathname = linkRedirect;
    })

// Form setting
    $('button.btn_setting').click(function(){
        var myId = $(this).attr('id');
        $("button").removeClass("btn-default").addClass("btn-primary");
        $(`button#${myId}`).removeClass("btn-primary").addClass("btn-default");
        $("div.card-body").attr("hidden",true);
        $(`div#${myId}`).removeAttr('hidden');
    });
// loai gia
    $(".inputRadio:radio").parent().find('.inputloaiGiamGia').attr("hidden",true);
    $(".inputRadio:radio:checked").parent().find('.inputloaiGiamGia').removeAttr("hidden");

    $("[class=inputRadio]").click(function(){
        $("input.inputloaiGiamGia").attr("hidden",true);
        $(this).parent().children().map(function() {
            if($(this).attr("class") === "form-control form-control-sm inputloaiGiamGia"){
                $(this).removeAttr('hidden');
            }
        })

    })


// Form menu
    // let menu_child_count = $('input.menu_child_count').val()
    // var count = (menu_child_count > 0) ? menu_child_count : 0;
    // var flag  = (menu_child_count > 0) ? true : false;

    // $('button.btn_menu').click(function(){
    // var myId = $(this).attr('id');
    // $("button").removeClass("btn-default").addClass("btn-primary");
    // $(`button#${myId}`).removeClass("btn-primary").addClass("btn-default");
    // if (myId === 'add_menu') {
    //     flag  = true
    //     count++
    //     $("div.card-menu").append(`<div class="card-body" id = "menu_child${count}">
    //                             <div class="form-group" >
    //                                 <label for="menu_child">Name Menu Child</label>
    //                                 <input type="text" class="form-control" name="menu_child" id="menu_child" value="">
    //                             </div>
    //                             <div class="form-group" >
    //                                 <label for="link_child">Link Child</label>
    //                                 <input type="text" class="form-control" name="link_child" id="link_child" value="">
    //                             </div>
    //                             <input type="hidden" name="parent" value="true">
    //                         </div>`);                   
    // }
    // if (myId === 'back'){
    //     $(`div#menu_child${count}`).remove()
    //     count--
    // }
    // if (myId === 'cancel'){
    //     var linkRedirect = '/dhuy782/menu/';
    //     window.location.pathname = linkRedirect;
    // }
    // // if (count >= 1){
    // //     $(`div#link_menu`).remove()
    // // }
    // if (count < 1 && flag == true) {
    //     flag = false
    //     $("div.card-menu").append(`<div class="form-group" id="link_menu" >
    //                             <label for="link">Link</label>
    //                             <input type="text" class="form-control" name="link" id="link" value="">
    //                         </div>`)
    // }
    // if (count < 1) {
    //     count = 0
    // }
    // });


// active sidebar
    var localpath = window.location.pathname
    $('ul.nav-sidebar li a').map(function() {
        if ($(this).attr("href") === localpath){
            $(this).addClass("active")
            if ($(this).parent().parent().prop('className') === "nav nav-treeview"){
                $(this).parent().parent().removeAttr("style")
                $(this).parent().parent().css("display","block")
            }
        }
    })

});

// discount 
function discountProduct() {  
    if($('#discount').val() >0){
        $('[value="discount"]').attr("checked",true)
    } else {
        $('[value="discount"]').removeAttr('checked');
    }
}



