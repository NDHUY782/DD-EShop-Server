
var localpath      = window.location.pathname
var clearlocalpath = localpath.replace('/', '');

$('ul.menu-container li a').map(function() {
    if ($(this).attr("href") === localpath || $(this).attr("href") === clearlocalpath){
        if ($(this).parent().parent().parent().parent().parent().parent().prop('className') === "menu-item mega-menu mega-menu-full"){
            $(this).parent().parent().parent().parent().parent().parent().addClass("current")
        }
        else $(this).parent().addClass("current")
    }
})

$('div.blog_category div.blog_category_sub a').map(function() {
    if ($(this).attr("href") === localpath || $(this).attr("href") === clearlocalpath){
        $(this).parent().addClass("current")
    }
})


//---show List category product ---//
function showListLoai() {
    document.getElementById("showListLoai").classList.toggle("show");
}
 
function showListGia() {
    document.getElementById("showListGia").classList.toggle("show");
}


//---set time notify ---//
const myTimeout = setTimeout(notifies, 5000);

function notifies() {
    $('div.alert').css('display','none');
}

//----submit search ---//
$(document).ready(function() {
    $('input[name=search]').keyup(function(event) {
        if (event.code === 'Enter')
        {
            event.preventDefault();
            $('form#searchProductHome').submit();
        }
    });
});

//----submit form đơn hàng ---//

$('form[name="donhang"]').on( "submit", function( event ) {
    event.preventDefault();
    let flag = false;
    let data = {}
    let city = $("#city option:selected").text()
    let district = $("#district option:selected").text()
    let ward = $("#ward option:selected").text()
    let phuongthucthanhtoan = $("#phuongthucthanhtoan option:selected").text()
    if (city !== "Chọn tỉnh thành" && district !== "Chọn quận huyện" && ward !== "Chọn phường xã"){
        if(phuongthucthanhtoan !== 'Chọn hình thức thanh toán'){
            flag = true
            data.tinh = city
            data.huyen = district
            data.xa = ward
        }
    }
    if(!flag){
        $('span[class="form-message"]').text("Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng và phương thức thanh toán") 
    }
    if (flag) {
        $('span[class="form-message"]').text("")
        $('input[name="diachi"]').val(JSON.stringify(data))
        $('input[name="tongthanhtoan"]').val($('strong.TongThanhToan').text().replace(/\D/g, ''))
        let ghichu = ($('textarea[name="ghichu"]').val());
        let tongTienHang = $('span#totalProduct').text().replace(/\D/g, '')
        let voucher      = $('span[class="voucher"]').text().replace(/\D/g, '')
        let phiVanChuyen = $('span.Free_Delivery').text().replace(/\D/g, '')
        let info = {
            "ghichu": ghichu,
            "tongTienHang": tongTienHang,
            "voucher": voucher,
            "phiVanChuyen": phiVanChuyen
        }
        $('input[name="info"]').val(JSON.stringify(info))
        localStorage.removeItem('cart')
        $('form[name="donhang"]')[0].submit();
    }
});

//--------------- Ajax -------------------///
//-------add Cart start ----------//
let cart = []
const addCart = async (id, name, avatar, price) => {

    let count = $('input[name="quantityProduct"]').val()
    if (count !== undefined) {
        for (let i = 0; i < count; i++) {
            let storage = localStorage.getItem('cart')

            if (storage) {
                cart = JSON.parse(storage)
            }
        
        
            let product = {
                product: {id, name, avatar, price},
                quantity: 1
            }
        
            let item = cart.find(c => c.product.id == id)
            if (item) {
                item.quantity += 1
            } else {
               await cart.push(product)
            }

            localStorage.setItem('cart', JSON.stringify(cart))

            showCart(cart)
        }
    } else {
        let storage = localStorage.getItem('cart')

        if (storage) {
            cart = JSON.parse(storage)
        }
    
    
        let product = {
            product: {id, name, avatar, price},
            quantity: 1
        }
    
        let item = cart.find(c => c.product.id == id)
        if (item) {
            item.quantity += 1
        } else {
            cart.push(product)
        }

        localStorage.setItem('cart', JSON.stringify(cart))

        showCart(cart)
    }

    alertify.success(` Thêm vào giỏ hàng thành công`); 
}

const reduceItem = (id, name, avatar, price) => {

    let storage = localStorage.getItem('cart')

    if (storage) {
        cart = JSON.parse(storage)
    }

    let product = {
        product: {id, name, avatar, price},
        quantity: 1
    }

    let item = cart.find(c => c.product.id == id)
    if (item) {
        if(item.quantity <= 1) removeItem(id)
        else item.quantity -= 1
    } else {
        removeItem(id)
    }


    localStorage.setItem('cart', JSON.stringify(cart))

    showCart(cart)
}

const removeItem = (id) => {
    let storage = localStorage.getItem('cart')

    if (storage) {
        cart = JSON.parse(storage)
    }

    cart = cart.filter(item => item.product.id !== id)

    localStorage.setItem('cart', JSON.stringify(cart))

    showCart(cart)

    alertify.warning(` Xóa khỏi giỏ hàng thành công`);
}

window.onload = function() {

    let storage = localStorage.getItem('cart')

    if (storage) {
        cart = JSON.parse(storage)
    }

    showCart(cart)

}

const showCart = (shoppingCart) => {
    let arrSanPham = []
    let totalCart = 0
    let numberCart = 0

    let cartBody = document.getElementById('top-add-cart')
    let checkOut = document.getElementById('check-out')

    if (checkOut !== null)     checkOut.innerHTML = ''
    cartBody.innerHTML = ''
    shoppingCart.map(item => {
        let data = {}
        data.id = item.product.id
        data.name = item.product.name
        data.avatar = item.product.avatar
        data.sl = item.quantity
        data.price = item.product.price
        arrSanPham.push(JSON.stringify(data))

        totalCart += Number(item.product.price) * Number(item.quantity)
        numberCart += 1
        let price = priceHelper(item.product.price)
        let totalOneProduct = priceHelper(Number(item.product.price) * Number(item.quantity))
        cartBody.innerHTML += `<div class="top-cart-item">
                                    <div class="top-cart-item-image border-0">
                                        <a href="#"><img src="/uploads/products/${item.product.avatar}" alt="Cart Image 1" /></a>
                                    </div>
                                    <div class="top-cart-item-desc">
                                        <div class="top-cart-item-desc-title">
                                            <a href="#" class="fw-medium">${item.product.name}</a>
                                            <span class="top-cart-item-price d-block">${price}</span>
                                            <div class="d-flex mt-2">
                                                <a href="/thanh-toan" class="fw-normal text-black-50 text-smaller"><u>Sửa</u></a>
                                                <a  class="fw-normal text-black-50 text-smaller ms-3"><u onclick="removeItem('${item.product.id}')">Xóa</u></a>
                                            </div>
                                        </div>
                                        <div class="top-cart-item-quantity">x ${item.quantity}</div>
                                    </div>
                               </div>`
        
        if (checkOut !== null) {
            checkOut.innerHTML += `<tr class="cart_item">
                                        <td class="cart-product-remove">
                                            <a class="remove" title="Remove this item">
                                            <i class="icon-trash2" onclick="removeItem('${item.product.id}')"></i>
                                            </a>
                                        </td>

                                        <td class="cart-product-thumbnail">
                                            <a href="#"><img width="64" height="64" src="/uploads/products/${item.product.avatar}"
                                                    alt="Pink Printed Dress"></a>
                                        </td>

                                        <td class="cart-product-name">
                                            <a href="#">${item.product.name}</a>
                                        </td>

                                        <td class="cart-product-price">
                                            <span class="amount">${price}</span>
                                        </td>

                                        <td class="cart-product-quantity">
                                            <div class="quantity">
                                                <input type="button" onclick="reduceItem('${item.product.id}', '${item.product.name}', '${item.product.avatar}', '${price}')" value="-" class="minus">
                                                <input type="text" name="quantity" value="${item.quantity}" class="qty" />
                                                <input type="button" onclick="addCart('${item.product.id}', '${item.product.name}', '${item.product.avatar}', '${price}')" value="+" class="plus">
                                            </div>
                                        </td>

                                        <td class="cart-product-subtotal">
                                            <span class="amount">${totalOneProduct}</span>
                                        </td>
                                    </tr>`
        }
    })

    let cartNumber = document.getElementById('top-cart-title')
    let cartNumberHeader = document.getElementById('top-cart-number')
    cartNumber.innerHTML = ''
    cartNumberHeader.innerHTML = ''
    cartNumber.innerHTML += `${numberCart}`
    cartNumberHeader.innerHTML += `${numberCart}`

    let cartTotal = document.getElementById('totalCart')
    let productTotal = document.getElementById('totalProduct')
    let totalPrice = priceHelper(totalCart)

    cartTotal.innerHTML = `${totalPrice}`
    if (productTotal !== null) productTotal.innerHTML = `${totalPrice}`

    //----Xử lý thanh toán---//
    tongThanhToan()
    //----Đưa thông tin lên server---//
    getSanpham(arrSanPham)
}

//----hàm Helper---//
// const priceHelper = (price) => {
//     let USDollar = new Intl.NumberFormat('vi-VN', {
//         style: 'currency',
//         currency: 'VND',
//     });
//     let newprice = USDollar.format(price)

//     return newprice;
// }
// const addCartHelper = (id, name, avatar, price) => {
//     xhtmlStatus = `<a class="btn btn-light me-2"><i onclick="addCart('${id}', '${name}', '${avatar}', '${price}')" class="icon-line-shopping-cart"></i></a>`
//     return xhtmlStatus;
// }
// const highlightHelper = (name, keyword) => {
//     if(keyword !== ""){
//         const regex = new RegExp(keyword, "gi");
//         name = name.replace(regex, (search) => {
//             return `<span class="text-red">${search}</span>`
//         });
//         return name;
//     }
//     return name;
// }
//----hàm Helper---//


//-------add Cart End ----------//
let phiVanChuyen = 0
//-------phiVanChuyen start ----------//
$('select#city').change(function() {
    var e = document.getElementById("city");
    var value = e.value;
    var text = e.options[e.selectedIndex].text;

    link = "/thanh-toan/phiVanChuyen/" + value

    $.get(link,
        function (data, textStatus, jqXHR) {
            let { success, soTien } = data;
            if (success === true) {
                phiVanChuyen = soTien
                tongThanhToan()
                let soTienVND = '+' + priceHelper(soTien)
                $('span.Free_Delivery').html(soTienVND)
            }
        },
        "json"
    );
})
//-------phiVanChuyen end ----------//

//-------Tính Tổng Thanh Toán start ----------//
const tongThanhToan = () => {
    let tongTienHang = $('span#totalProduct').text().replace(/\D/g, '')
    let voucher      = $('span[class="voucher"]').text().replace(/\D/g, '')
    let tongThanhToan = priceHelper(Number(tongTienHang) + Number(phiVanChuyen) - Number(voucher))

    $('strong.TongThanhToan').text(tongThanhToan)

}
//-------Tính Tổng Thanh Toán end ----------//

//-------- Đưa thông tin lên server ---------//

const getSanpham = (arrSanPham) => {
    $('input[name="sanpham"]').val(JSON.stringify(arrSanPham))
    // $('input[name="tongthanhtoan"]').val($('strong.TongThanhToan').text().replace(/\D/g, ''))

}

const updateInfo = () => {

}

//------- Phương thức thanh toán ------------//
$('select[name="phuongthucthanhtoan"]').change(function() {
    var chuyenkhoan = document.getElementById("chuyenkhoan");
    chuyenkhoan.innerHTML = ``
    if (this.value === 'Chuyển khoản ngân hàng'){
        chuyenkhoan.innerHTML += `<label class="nganhang">Ngân hàng BIDV chi nhánh Thủ Đức</label><br>
                                  <label class="nganhang">9704 0616 9304 2934</label><br>
                                  <label class="nganhang">Trương Quang Khải</label>`
    }
})

$('input[name="magiamgia"]').change(function() {
    let value = this.value
    if (value === '') value = '1'
    link = "/thanh-toan/maGiamGia/" + value

    $.get(link,
        function (data, textStatus, jqXHR) {
            let { value, ngayketthuc, ngaybatdau ,success } = data;
            let flag = false
            if (success === true) {
                let tongTienHang = $('span#totalProduct').text().replace(/\D/g, '')
                let today = new Date()
                let day = today.getTime()/(60*1000*60*60*24);
                if (ngayketthuc > day && day >ngaybatdau){
                    if (Number(tongTienHang) > value.gioi_han_tien_giam){
                        flag = true
                        // $('span[name="magiamgia"]').text('Mã giảm giá hợp lệ')
                        // $('span[name="magiamgia"]').css('color', 'green')
    
                        let voucher = 0
                        if (value.loai == false) {
                            voucher = priceHelper(value.sotien);
                            $('span[name="magiamgia"]').text(`Mã giảm giá ${voucher} hợp lệ`)
                            $('span[name="magiamgia"]').css('color', 'green')
                        }
                        else {
                            $('span[name="magiamgia"]').text(`Mã giảm giá ${value.phamtram}% hợp lệ`)
                            $('span[name="magiamgia"]').css('color', 'green')
                            voucher = priceHelper(Number(tongTienHang) * value.phamtram * 0.01);
                        }
    
                        let voucherTotal = document.getElementById('magiamgia')
                        voucherTotal.innerHTML= ''
                        voucherTotal.innerHTML += `<td class="cart-product-name">
                                                                    <strong>Voucher từ Khai Space</strong>
                                                                </td>
                                                                <td class="cart-product-name">
                                                                    <span class="voucher">-${voucher}</span>
                                                                </td>`
                    }                   
                }
            }
            if (flag == false) {
                $('span[name="magiamgia"]').text("Mã giảm giá không hợp lệ")
                $('span[name="magiamgia"]').css('color', 'red')
                let voucherTotal = document.getElementById('magiamgia')
                    voucherTotal.innerHTML= ''
            }
            tongThanhToan()
        },
        "json"
    );
})








