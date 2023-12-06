
const changeStatus = (link) => {
    $.get(link,
        function (data, textStatus, jqXHR) {
            let { success, id, status } = data;
            if (success === true) {
                let parent = `#changeStatus-${id}`
                let classColor = "danger"
                let iconColor = "ban"
        
                if(status === "active"){
                    classColor = "success"
                    iconColor = "check"
                } 

                let link = `dhuy782/category/change-status/${id}/${status}`

        
                let xhtmlStatus = `<a href="javascript:changeStatus('${link}')" class="rounded-circle btn btn-sm btn-${classColor}"><i class="fas fa-${iconColor}"></i></a>`
                $(parent).html(xhtmlStatus);
                alertify.success('Thay đổi status thành công');
            }
        },
        'json'
    );
}

const changeOrdering = (link, id, collection) => {
    let idOrdering = `input${collection}-${id}`
    let i = document.getElementById(idOrdering).value;
    let newlink = link + i + '/' + collection;
    $.get(newlink,
        function (data, textStatus, jqXHR) {
            let { success, collection } = data;
            if (success === true) {
                alertify.success(` Thay đổi ${collection} thành công`); 
            }
        },
        "json"
    );
}

const changeCheckBox = (link, value_input) => {
    let value = document.getElementById(value_input).value;
    let newlink = link + value ;

    $.get(newlink,
        function (data, textStatus, jqXHR) {
            let { success, collection } = data;
            if (success === true) {
                alertify.success(` Thay đổi lựa chọn thành công`); 
            }
        },
        "json"
    );
}

const changeCategory = (link, category) => {
    let i = category.options[category.selectedIndex].value;
    let newlink = link + i;
    $.get(newlink,
        function (data, textStatus, jqXHR) {
            let { success, name } = data;
            if (success === true) {
                alertify.success(`Thay đổi ${name} thành công`); 
            }
        },
        "json"
    );
}
