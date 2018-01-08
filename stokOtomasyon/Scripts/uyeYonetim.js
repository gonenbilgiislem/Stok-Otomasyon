//Personel Hesaplarını Getir
function Personeller() {
    var url = '/UyeYonetim/VerileriGetir';
    $('#tablo').html("");
    var thead = '<thead><tr><th>Seç</th><th>Resim</th><th>Ad Soyad</th><th>Kullanıcı Adı</th><th>Yetki</th></tr></thead>';
    $('#tablo').append(thead);
    $.getJSON(url, function (data) {
        for (var item in data.Result) {
            var checkbox = '<input type="checkbox" name="secili" value=' + data.Result[item].ID + ' />';
            var yetki = '<button id="yetki" value="' + data.Result[item].ID + '" class="btn btn-block btn-danger">' + data.Result[item].Yetki1 + '</button>';
            var user = '<tbody><tr><td>' + checkbox + '</td><td width="50" height="50""><img style="width:100%; height:auto;" src="' + data.Result[item].Resim + '" alt="" /></td><td>' + data.Result[item].Ad + ' ' + data.Result[item].Soyad + '</td><td>' + data.Result[item].Kad + '</td><td>' + yetki + '</td></tr></tbody>';
            $('#tablo').append(user);
        }
        var tfoot = '<tfoot><tr><th>Seç</th><th>Resim</th><th>Ad Soyad</th><th>Kullanıcı Adı</th><th>Yetki</th></tr></tfoot>';
        $('#tablo').append(tfoot);
    });
};

//Personel hesap sayfasına yönlendir
function yonlendir() {
    location.href = '/UyeYonetim';
}

//Personel hesap ekle
$("#veri").on("submit", function (event) {
    event.preventDefault();
    var sifreTkrar = $("input[name='SifreTekrar']").val();
    $.ajax({
        type: "POST",
        url: '/UyeYonetim/Ekle',
        data: $(this).serialize(),
        dataType: "json",
        success: function (gelenDeg) {
            if (gelenDeg == "1") {
                swal("Eklendi", "Hesap Başarıyla Oluşturuldu!", "success");
                setTimeout('yonlendir()', 3000)
            }
            else if (gelenDeg == "hesabıZatenVar") {
                swal("Eklenmedi", "Personele ait bir hesap zaten var!", "error");
            }
            else if (gelenDeg == "sifreFarklı") {
                swal("Eklenmedi", "Şifreler birbirinden uyumsuz,tekrar kontrol edip deneyin!", "error");
            }
        },
        error: function () {
            swal("Hata", "Hesap Oluşturulurken Hata Oluştu!", "error");
        }
    });
});

//Personel Hesap Sil
$("#hesapSil").click(function () {
    var data = [];
    var sayac = 0;
    $("input[name='secili']:checked").each(function () {
        data[sayac] = $(this).val();
        sayac++;
    });
    swal({
        title: 'Silinsin mi?',
        text: "Hesap(lar)ı gerçekten silmek istiyor musunuz?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sil'
    }).then(function () {
        $.ajax({
            type: "POST",
            url: '/UyeYonetim/SilJSON',
            data: { data },
            dataType: "json",
            success: function (gelenDeg) {
                if (gelenDeg == "1") {
                    swal("Silindi", "Silme işlemi başarıyla gerçekleşti!", "success");
                    Personeller();
                }
                else if (gelenDeg == "2") {
                    swal("Hata!", "Silinecek birşey bulunamadı!", "error");
                }
            },
            error: function () {
                swal("Hata!", "Hesap(lar) Silinirken hata oluştu!", "error");
            }
        });
    })
});

//Yetki değiştir
$(document).on("click", "#yetki", function () {
    var prsnlID = $(this).val();
    swal({
        title: 'Yetkiler',
        input: 'select',
        inputOptions: {
            'Personel': 'Personel',
            'Admin': 'Admin'
        },
        inputPlaceholder: 'Yetki seçiniz',
        showCancelButton: true
    }).then(function (result) {
        $.ajax({
            type: "POST",
            url: '/UyeYonetim/YetkiGuncelle',
            data: { yetkiAd: result, prsnlID: prsnlID },
            dataType: "json",
            success: function (gelenDeg) {
                if (gelenDeg == "1") {
                    swal("Güncellendi", "Yetki başarıyla güncellendi!", "success");
                    Personeller();
                }
                else if (gelenDeg == "0")
                    swal("Hata!", "Yetki güncellenirken hata oluştu!", "error");
            },
            error: function () {
                swal("Hata!", "Yetki güncellenirken hata oluştu!", "error");
            }
        });
    })
});
