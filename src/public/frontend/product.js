
//----hàm Helper---//
const priceHelper = (price) => {
    let USDollar = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    let newprice = USDollar.format(price)

    return newprice;
}
const addCartHelper = (id, name, avatar, price) => {
    xhtmlStatus = `<a class="btn btn-light me-2"><i onclick="addCart('${id}', '${name}', '${avatar}', '${price}')" class="icon-line-shopping-cart"></i></a>`
    return xhtmlStatus;
}
const highlightHelper = (name, keyword) => {
    if(keyword !== ""){
        const regex = new RegExp(keyword, "gi");
        name = name.replace(regex, (search) => {
            return `<span class="text-red">${search}</span>`
        });
        return name;
    }
    return name;
}


//------Filter Products---------//
const changeCheckBox = (link) => {
    const arr = []
    let danhmuc = ""

    $(".filterLoai:checkbox:checked").map(function () {
        arr.push(this.value)
        danhmuc += this.id + " & "
    })

    if (arr.length > 0){
        var result = danhmuc.substring(0, danhmuc.length - 3);
        $('b[name=filterLoai]').text(result)
        $('div#filterLoai').attr("hidden", false);

    } else {
        var result = danhmuc.substring(0, danhmuc.length - 1);
        $('b[name=filterLoai]').text(result)
        $('b[name=filterLoai]').text('')
        $('div#filterLoai').attr("hidden", true);
    }

    loaiSanPham(arr)

    $("#showListLoai").removeClass("show");
    $("#showListGia").removeClass("show");
}

//------Filter Price---------//
const changeGia = () => {
    const arr = []
    let gia = ""
    $(".filterPrice:checkbox:checked").map(function () {
        arr.push(this.value)
        gia += this.id + " & "
    })

    if (arr.length > 0){
        var result = gia.substring(0, gia.length - 3);
        $('b[name=filterGia]').text(result)
        $('div#filterGia').attr("hidden", false);

    } else {
        var result = gia.substring(0, gia.length - 1);
        $('b[name=filterGia]').text(result)
        $('b[name=filterGia]').text('')
        $('div#filterGia').attr("hidden", true);
    }

    loaiGia(arr)

    $("#showListGia").removeClass("show");
    $("#showListLoai").removeClass("show");
}

//------input filter ---------//
const filterLoai = () => {
    $(".filterLoai:checkbox").prop('checked', false); 
    $('b[name=filterLoai]').text('')
    $('div#filterLoai').attr("hidden", true);
}

const filterGia = () => {
    $(".filterPrice:checkbox").prop('checked', false); 
    $('b[name=filterGia]').text('')
    $('div#filterGia').attr("hidden", true);
}







