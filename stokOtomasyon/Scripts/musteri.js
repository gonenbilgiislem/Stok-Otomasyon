//Müşteri Bilgilerini Getir
function Musteriler() {
    $('#tablo').html("");
    var thead = '<thead><tr><th>Seç</th><th>Ad Soyad</th><th>Tel</th><th>Adres</th><th>Borç</th><th>Kayit Tarihi</th><th>Güncelle</th></tr></thead>';
    $('#tablo').append(thead);
    $.getJSON('/Musteri/Veriler', function (data) {
        for (var item in data.Result) {
            var checkbox = '<input type="checkbox" name="secili" value=' + data.Result[item].ID + ' />';
            var borc = '<button id="btn_borc" value="' + data.Result[item].ID + '" class="btn btn-block btn-danger">' + data.Result[item].Borc + ' TL</button>';
            var button = '<button id="btn_Guncelle" value="' + data.Result[item].ID + '" class="btn btn-block btn-info">Güncelle</button>';
            var user = '<tbody><tr><td>' + checkbox + '</td><td>' + data.Result[item].Ad + ' ' + data.Result[item].Soyad + '</td><td>' + data.Result[item].Tel + '</td><td>' + data.Result[item].Adres + '</td><td>' + borc + '</td><td>' + data.Result[item].KayitTarihi + '</td><td>' + button + '</td></tr></tbody>';
            $('#tablo').append(user);
        }
    });
    var tfoot = '<tfoot><tr><th>Seç</th><th>Ad Soyad</th><th>Tel</th><th>Adres</th><th>Borç</th><th>Kayit Tarihi</th><th>Güncelle</th></tr></tfoot>';
    $('#tablo').append(tfoot);
}

//Müşteri ekle
$("#veri").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: '/Musteri/Ekle',
        data: $(this).serialize(),
        dataType: "json",
        success: function (gelenDeg) {
            if (gelenDeg == "1") {
                swal("Eklendi", "Müşteri Başarıyla Eklendi!", "success");
                setTimeout('yonlendir()', 3000)
            }
            if (gelenDeg == "0")
                swal("Hata", "Müşteri Eklenirken Hata Oluştu!", "error");
        },
        error: function () {
            swal("Hata", "Müşteri Eklenirken Hata Oluştu!", "error");
        }
    });
});

//Müşteri sayfasına yönlendir
function yonlendir() {
    location.href = '/Musteri';
}

//Müşteri sil
$("#sil").click(function () {
    var data = [];
    var sayac = 0;
    $("input[name='secili']:checked").each(function () {
        data[sayac] = $(this).val();
        sayac++;
    });
    swal({
        title: 'Silinsin mi?',
        text: "Müşteri(leri)yi gerçekten silmek istiyor musunuz?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sil'
    }).then(function () {
        $.ajax({
            type: "POST",
            url: '/Musteri/Sil',
            data: { data },
            dataType: "json",
            success: function (gelenDeg) {
                if (gelenDeg == "1") {
                    swal("Silindi", "Silme işlemi başarıyla gerçekleşti!", "success");
                    Musteriler();
                }
                else if (gelenDeg == "2") {
                    swal("Hata!", "Silinecek birşey bulunamadı!", "error");
                }
            },
            error: function () {
                swal("Hata!", "Müşteri Silinirken hata oluştu!", "error");
            }
        });
    })
});

//Müşteri Güncelle
$(document).on("click", "#btn_Guncelle", function () {
    var deger = {
        id: $(this).val()
    };

    //$.getJSON('/Musteri/Guncelle', function (data) {
    //    for (var item in data.Result) {
    //        var checkbox = '<input type="checkbox" name="secili" value=' + data.Result[item].ID + ' />';
    //        var borc = '<button id="btn_borc" value="' + data.Result[item].ID + '" class="btn btn-block btn-danger">' + data.Result[item].Borc + ' TL</button>';
    //        var button = '<button id="btn_Guncelle" value="' + data.Result[item].ID + '" class="btn btn-block btn-info">Güncelle</button>';
    //        var user = '<tbody><tr><td>' + checkbox + '</td><td>' + data.Result[item].Ad + ' ' + data.Result[item].Soyad + '</td><td>' + data.Result[item].Tel + '</td><td>' + data.Result[item].Adres + '</td><td>' + borc + '</td><td>' + data.Result[item].KayitTarihi + '</td><td>' + button + '</td></tr></tbody>';
    //        $('#tablo').append(user);
    //    }
    //});

    $.ajax({
        type : 'POST',
        url: '/Musteri/Guncelle',
        data: deger,
        dataType: "json",
        success: function (gelenDeg) {
            swal({
                title: 'Müşteri Güncelle',
                html:
                '<input id="ad" value="' + gelenDeg.Ad + '" placeholder="Müşterinin Adını Giriniz" class="swal2-input color">' +
                '<input id="soyad" value="' + gelenDeg.Soyad + '" placeholder="Müşterinin Soyadını Giriniz" class="swal2-input color">' +
                '<input id="tel" value="' + gelenDeg.Tel + '" placeholder="Müşterinin Telefonunu Giriniz" class="swal2-input color">' +
                '<input id="adres" value="' + gelenDeg.Adres + '" placeholder="Müşterinin Adresini Giriniz" class="swal2-input color">',
                preConfirm: function () {
                    var degerler = {
                        id: deger.id,
                        ad: $('#ad').val(),
                        soyad: $('#soyad').val(),
                        tel: $('#tel').val(),
                        adres: $('#adres').val()
                    };
                    $.ajax({
                        type: 'POST',
                        url: '/Musteri/GuncelleJSON',
                        data: degerler,
                        dataType: "json",
                        success: function (gelenDeg) {
                            if (gelenDeg != "0") {
                                swal("Başarılı!", "Müşteri Başarıyla Güncellendi!", "success");
                                Musteriler();
                            }
                        },
                        error: function () {
                            swal("Hata!", "Müşteri Güncellenirken hata oluştu!", "error");
                        }
                    });
                },
                onOpen: function () {
                    $('#ad').focus()
                }
            })
        },
        error: function (r,rr,rrr) {
            swal("Hata!", ""+rrr+"!", "error");
        }
    });
});

//Müşteri Borçu Öde
$(document).on("click", "#btn_borc", function () {
    var deger = $(this).val();
    swal({
        title: 'Borcunun ne kadarını verdi?',
        html:
        '<input type="number" id="tutar" placeholder="Tutar giriniz" class="swal2-input color">',
        preConfirm: function () {
            var degerler = {
                id: deger,
                tutar: $('#tutar').val()
            };
            $.ajax({
                type: 'POST',
                url: '/Musteri/BorcGuncelle',
                data: degerler,
                dataType: "json",
                success: function (gelenDeg) {
                    if (gelenDeg == "1") {
                        swal("Başarılı!", "Borç Başarıyla Güncellendi!", "success");
                        Musteriler();
                    }
                    else if (gelenDeg == "2")
                        swal("Hata!", "Borcunuzdan büyük değer giremezsiniz!", "error");
                    else
                        swal("Hata!", "Borç Güncellenirken hata oluştu!", "error");
                },
                error: function () {
                    swal("Hata!", "Borç Güncellenirken hata oluştu!", "error");
                }
            });
        },
        onOpen: function () {
            $('#tutar').focus()
        }
    });
});