$("#login").click(function () {
    var degerler = {
        kAd: $("#mail").val().trim(),
        sifre: $("#sifre").val().trim(),
        hatirla: false
    };
    if ($("input[name='secili']").is(':checked')) {
        degerler.hatirla = true;
    }
    $.ajax({
        type: 'POST',
        url: '/Login/GirisKontrol',
        data: JSON.stringify(degerler),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (gelenDeg) {
            if (gelenDeg == "1")
                window.location.href = '/Musteri/Index';
            else if (gelenDeg == "0") 
            swal("Başarısız!", "Giriş Başarısız oldu!", "error");
        },
        error: function () {
            swal("Başarısız!", "Giriş Başarısız oldu!", "error");
        }
    });
});