//Müşteri Bilgilerini Getir
function Urunler() {
    var url = '/Urun/UrunleriGetir';
    $('#tablo').html("");
    var thead = '<thead><tr><th>Ekle</th><th>Marka</th><th>Ürün Adı</th><th>Adet</th><th>Satış Fiyatı</th></tr></thead>';
    $('#tablo').append(thead);
    $.getJSON(url, function (data) {
        for (var item in data.Result) {
            var ekleButon = '<button type="button" value="' + data.Result[item].ID +'" class="btn btn-success btn-circle sepeteEkle"><i class="fa fa-check"></i> </button>';
            var user = '<tbody><tr><td style="width:40px;">' + ekleButon + '</td><td>' + data.Result[item].Marka + '</td><td>' + data.Result[item].Ad + '</td><td>' + data.Result[item].Adet + '</td><td>' + data.Result[item].SatisFiyat + ' TL</td></tr></tbody>';
            $('#tablo').append(user);
        }
    });
};

//Sepete Ekle
$(document).on("click", ".sepeteEkle", function () {
    var row = $(this).closest("tr"); 
    var sutunlar = {
        Kaldir: '<button type="button" value="' + $(this).val() + '" class="btn btn-danger btn-circle sepetSil"><i class="fa fa-times"></i> </button>',
        UrunAdi: row.find("td:eq(2)").text(),
        Fiyat: row.find("td:eq(4)").text().substring(0, row.find("td:eq(4)").text().length - 3),
        Miktar: '<input type="text" class="miktar" value="1" />',
        MaxTutar: parseFloat(row.find("td:eq(4)").text().substring(0, row.find("td:eq(4)").text().length - 3)) * parseFloat(1)
    };
    $("#siparis tbody").append("<tr><td>" + sutunlar.Kaldir + "</td><td>" + sutunlar.UrunAdi + "</td><td>" + sutunlar.Fiyat + " TL</td><td>" + sutunlar.Miktar + "</td><td>" + sutunlar.MaxTutar + " TL</td></tr>");
    MaxTutar();
});

//Max Tutarı Bulma
$("#siparis").on("change", ".miktar", function () {
    var row = $(this).closest('tr');
    var maxTutar = row.find("td:eq(2)").text();
    row.find("td:eq(4)").text(parseFloat(maxTutar.substring(0, maxTutar.length - 3)) * parseFloat($($(this)).val()) + " TL");
    MaxTutar();
});

//Tüm Siparişlerin Toplam Tutarı
function MaxTutar() {
    var maxTL = 0;
    $("#siparis tbody tr").each(function () {
        var tl = $(this).find("td:eq(4)").text();
        maxTL += parseFloat(tl.substring(0, tl.length - 3));
    });
    $("#maxTutar").text("TOPLAM TUTAR : " + maxTL + " TL");
}


//Sepetten Sil
$("#siparis").on("click", ".sepetSil", function () {
    var row = $(this).closest('tr');
    row.fadeOut(500, function () {
        row.remove();
        MaxTutar();
    });
}); 

//Sepet İptal
$(document).on("click", "#iptal", function () {
    var icerik = $("#siparis tbody tr");
    icerik.remove();
    MaxTutar();
});

//İndirim Yap
$(document).on("click", "#indirimYap", function () {
    swal({
        title: 'Kaç tl indirim yapacaksınız?',
        confirmButtonText: 'Onayla',
        html: '<input id="in" placeholder="örn : 10.5" class="swal2-input color">',
        onOpen: function () {
            $('#in').focus()
        }
    }).then(function () {
        $("#indirimYap").val($('#in').val());
    });
});

//Nakit Satış Yap
$(document).on("click", "#nakitSatis", function () {
    var data = [];
    var indirim = $('#indirimYap').val();
    var musID = $('#musSec').val();
    var tr = 0;
    var tutar = parseFloat($("#maxTutar").text().substring(14, $("#maxTutar").text().length-3)) - parseFloat($("#indirimYap").val());
    $("#siparis tbody tr").each(function () {
        data[tr] = new Array(2);
        data[tr][0] = $(this).find("td:eq(0) .sepetSil").val();
        data[tr][1] = $(this).find("td:eq(3) .miktar").val();
        tr++;
    });
    $.ajax({
        type: "POST",
        url: '/Satis/SatisYap',
        data: { data: data, indirim: indirim, musID: musID },
        dataType: "json",
        success: function (gelenDeg) {
            if (gelenDeg == "1") {
                swal("Başarılı", "Ödenen Tutar : " + tutar + " TL", "success");
            }
        },
        error: function () {
            swal("Hata", "Satış yapılırken hata verdi!", "error");
        }
    });
});

//Veresiye Satış Yap
$(document).on("click", "#veresiyeSatis", function () {
    var data = [];
    var tr = 0;
    var indirim = $('#indirimYap').val();
    var musID = $('#musSec').val();
    var borc = parseFloat($("#maxTutar").text().substring(14, $("#maxTutar").text().length - 3)) - parseFloat($("#indirimYap").val());
    $("#siparis tbody tr").each(function () {
        data[tr] = new Array(2);
        data[tr][0] = $(this).find("td:eq(0) .sepetSil").val();
        data[tr][1] = $(this).find("td:eq(3) .miktar").val();
        tr++;
    });
    $.ajax({
        type: "POST",
        url: '/Satis/VeresiyeSatis',
        data: { data: data, indirim: indirim, musID: musID, borc: borc },
        dataType: "json",
        success: function (gelenDeg) {
            if (gelenDeg == "1") {
                swal("Başarılı", "Borcu : " + borc + " TL", "success");
            }
        },
        error: function () {
            swal("Hata", "Satış yapılırken hata verdi!", "error");
        }
    });
});