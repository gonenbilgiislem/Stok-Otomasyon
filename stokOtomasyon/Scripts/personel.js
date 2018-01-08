//Personel Bilgilerini Getir
function Personeller() {
    var url = '/Personel/VerileriGetir';
    $('#tablo').html("");
    var thead = '<thead><tr><th>Seç</th><th>Resim</th><th>Ad Soyad</th><th>Tel</th><th>Adres</th><th>Maaş</th><th>Giriş Tarihi</th><th>Güncelle</th></tr></thead>';
    $('#tablo').append(thead);
    $.getJSON(url, function (data) {
        for (var item in data.Result) {
            var checkbox = '<input type="checkbox" name="secili" value=' + data.Result[item].ID + ' />';
            var button = '<button id="yonlendir" value="' + data.Result[item].ID + '" class="btn btn-block btn-info">Güncelle</button>';
            var user = '<tbody><tr><td>' + checkbox + '</td><td width="50" height="50""><img style="width:100%; height:auto;" src="' + data.Result[item].Resim + '" alt="" /></td><td>' + data.Result[item].Ad + ' ' + data.Result[item].Soyad + '</td><td>' + data.Result[item].Tel + '</td><td>' + data.Result[item].Adres + '</td><td>' + data.Result[item].Maas + ' TL</td><td>' + data.Result[item].GirisTarihi + '</td><td>' + button + '</td></tr></tbody>';
            $('#tablo').append(user);
        }
        var tfoot = '<tfoot><tr><th>Seç</th><th>Resim</th><th>Ad Soyad</th><th>Tel</th><th>Adres</th><th>Maaş</th><th>Giriş Tarihi</th><th>Güncelle</th></tr></tfoot>';
        $('#tablo').append(tfoot);
    });
};

//Personel Resmi Ekle
$("#input-file-now-custom-1").change(function () {
    var veri = new FormData();
    var resim = $(this).get(0).files;
    if (resim.length > 0) {
        veri.append("prsnlResim", resim[0]);
    }
    $.ajax({
        type: "POST",
        url: "/Personel/ResimYukle",
        data: veri,
        cashe: false,
        contentType: false,
        processData: false,
        success: function (gelenDeg) {
            if (gelenDeg == "2") {
                swal("Hata!", "Aynı ad'a sahip bir dosya zaten var!", "error");
            }
        },
        error: function (gelenDeg) {
            if (gelenDeg == "0") {
                swal("Hata!", "Resim eklenirken hata oluştu!", "error");
            }
        }
    });
});

//Personel Ekle
$("#veri").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: '/Personel/Ekle',
        data: $(this).serialize(),
        dataType: "json",
        success: function (gelenDeg) {
            if (gelenDeg == "1") {
                swal("Eklendi", "Personel Başarıyla Eklendi!", "success");
                setTimeout('yonlendir()', 3000)
            }
            else
                swal("Hata", "Personel Eklenirken Hata Oluştu!", "error");
        },
        error: function () {
            swal("Hata", "Personel Eklenirken Hata Oluştu!", "error");
        }
    });
});

//Personel sayfasına yönlendir
function yonlendir() {
    location.href = '/Personel';
}

//Personel sil
$("#sil").click(function () {
    var data = [];
    var sayac = 0;
    $("input[name='secili']:checked").each(function () {
        data[sayac] = $(this).val();
        sayac++;
    });
    swal({
        title: 'Personel(leri)i gerçekten silmek istiyor musunuz?',
        text: "Personel silindiğinde hesabıda silinecek..",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sil'
    }).then(function () {
        setTimeout(function () {
            $.ajax({
                type: "POST",
                url: '/Personel/Sil',
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
                    swal("Hata!", "Personel Silinirken hata oluştu!", "error");
                }
            });
        });
    })
});

//Personel Güncelleme Sayfasına yönlendir
$(document).on("click", "#yonlendir", function () {
    window.location.href = "/Personel/Guncelle/" + $(this).val();
});

//Personel Güncelle
$("#veriGuncelle").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: '/Personel/Guncelle',
        data: $(this).serialize(),
        dataType: "json",
        success: function (gelenDeg) {
            if (gelenDeg == "1") {
                swal("Güncellendi", "Personel Başarıyla Güncellendi!", "success");
                setTimeout('yonlendir()', 3000)
            }
            else
                swal("Hata", "Personel Güncellenirken Hata Oluştu!", "error");
        },
        error: function () {
            swal("Hata", "Personel Güncellenirken Hata Oluştu!", "error");
        }
    });
});