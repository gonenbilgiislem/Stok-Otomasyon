//Ürün Bilgilerini Getir
function Urunler() {
    var url = '/Urun/UrunleriGetir';
    $('#tablo').html("");
    var thead = '<thead><tr><th>Seç</th><th>Marka</th><th>Ad</th><th>Adet</th><th>Alış Fiyatı</th><th>Kdv</th><th>Satış Fiyatı</th><th>Eklenme Tarihi</th><th>Güncelle</th></tr></thead>';
    $('#tablo').append(thead);
    $.getJSON(url, function (data) {
        for (var item in data.Result) {
            var checkbox = '<input type="checkbox" name="secili" value=' + data.Result[item].ID + ' />';
            var button = '<button id="yonlendir" value="' + data.Result[item].ID + '" class="btn btn-block btn-info">Güncelle</button>';
            var user = '<tbody><tr><td>' + checkbox + '</td><td>' + data.Result[item].Marka + '</td><td>' + data.Result[item].Ad + '</td><td>' + data.Result[item].Adet + '</td><td>' + data.Result[item].AlisFiyat + ' TL</td><td>% ' + data.Result[item].Kdv + '</td><td>' + data.Result[item].SatisFiyat + ' TL</td><td>' + data.Result[item].EklenmeTarih + '</td><td>' + button + '</td></tr></tbody>';
            $('#tablo').append(user);
        }
    });
    var tfoot = '<tfoot><tr><th>Seç</th><th>Marka</th><th>Ad</th><th>Adet</th><th>Alış Fiyatı</th><th>Kdv</th><th>Satış Fiyatı</th><th>Eklenme Tarihi</th><th>Güncelle</th></tr></tfoot>';
    $('#tablo').append(tfoot);
};

//Satılan Ürün Bilgilerini Getir
function Satilanlar() {
    $('#satilmis').html("");
    var thead = '<thead><tr><th>Marka</th><th>Ad</th><th>Adet</th><th>Alış Fiyatı</th><th>Kdv</th><th>Satış Fiyatı</th><th>Eklenme Tarihi</th><th>Tutar</th></tr></thead>';
    $('#satilmis').append(thead);
    $.getJSON('/Urun/Satilanlar', function (data) {
        for (var item in data.Result) {
            var user = '<tr><td>' + data.Result[item].Marka + '</td><td>' + data.Result[item].Ad + '</td><td>' + data.Result[item].Adet + '</td><td>' + data.Result[item].AlisFiyat + ' TL</td><td>% ' + data.Result[item].Kdv + '</td><td>' + data.Result[item].SatisFiyat + ' TL</td><td>' + data.Result[item].EklenmeTarih + '</td><td>' + data.Result[item].Tutar + ' TL</td></tr>';
            $('table#satilmis').append(user);
        }
    });
};

//Ürün ekle
$("#veri").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: '/Urun/Ekle',
        data: $(this).serialize(),
        dataType: "json",
        success: function (gelenDeg) {
            if (gelenDeg == "1") {
                swal("Eklendi", "Müşteri Başarıyla Eklendi!", "success");
                setTimeout('yonlendir()', 3000)
            }
            if (gelenDeg == "2") {
                swal("Hata", "Kdv, alış fiyatı ve satış fiyatı nokta ile değil virgül ile ayrılmalıdır!", "error");
            }
        },
        error: function () {
            swal("Hata", "Müşteri Eklenirken Hata Oluştu!", "error");
        }
    });
});
//Ürün sayfasına yönlendir
function yonlendir() {
    location.href = '/Urun';
}

//Ürün sil
$("#sil").click(function () {
    var data = [];
    var sayac = 0;
    $("input[name='secili']:checked").each(function () {
        data[sayac] = $(this).val();
        sayac++;
    });
    swal({
        title: "Siliniyor..",
        text: "Ürün(leri)ü gerçekten silmek istiyor musunuz?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Sil",
        closeOnConfirm: false,
        showLoaderOnConfirm: true
    }).then(function () {
        setTimeout(function () {
            $.ajax({
                type: "POST",
                url: '/Urun/Sil',
                data: { data },
                dataType: "json",
                success: function (gelenDeg) {
                    if (gelenDeg == "1") {
                        swal("Silindi", "Silme işlemi başarıyla gerçekleşti!", "success");
                        Urunler();
                    }
                    else if (gelenDeg == "2") {
                        swal("Hata!", "Silinecek birşey bulunamadı!", "error");
                    }
                },
                error: function () {
                    swal("Hata!", "Ürün Silinirken hata oluştu!", "error");
                }
            });
        });
    })
});

//Ürün Güncelleme Sayfasına yönlendir
$(document).on("click", "#yonlendir", function () {
    window.location.href = "/Urun/Guncelle/" + $(this).val();
});

//Ürün Güncelle
$("#veriGuncelle").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: '/Urun/Guncelle',
        data: $(this).serialize(),
        dataType: "json",
        success: function (gelenDeg) {
            if (gelenDeg == "1") {
                swal("Güncellendi", "Ürün Başarıyla Güncellendi!", "success");
                setTimeout('yonlendir()', 3000)
            }
            else
                swal("Hata", "Ürün Güncellenirken Hata Oluştu!", "error");
        },
        error: function () {
            swal("Hata", "Ürün Güncellenirken Hata Oluştu!", "error");
        }
    });
});