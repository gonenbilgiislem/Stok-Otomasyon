using blogum.Areas.Admin.Controllers;
using stokOtomasyon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace stokOtomasyon.Controllers
{
    public class LoginController : Controller
    {
        StokEntities DB = new StokEntities();
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GirisKontrol(string kAd, string sifre, bool hatirla)
        {
            try
            {
                if (kAd != null && sifre != null)
                {
                    var sifrelenmis = Sifreleme.Donustur(sifre);
                  

                    foreach (var hesap in DB.Kullanici)
                    {
                        if (kAd == hesap.KullaniciAd && sifrelenmis == hesap.Sifre)
                        {
                            HttpCookie kullanici = new HttpCookie("prsnl");
                            kullanici.Values.Add("Id", hesap.Personel.ID.ToString());
                            kullanici.Values.Add("Ad", hesap.Personel.Ad);
                            kullanici.Values.Add("Soyad", hesap.Personel.Soyad);
                            kullanici.Values.Add("Resim", hesap.Personel.Resim);
                            kullanici.Values.Add("KayitTrh", hesap.Personel.GirisTarihi.ToString());
                            kullanici.Values.Add("Yetki", hesap.Yetki.Yetki1);
                            if (hatirla)
                                kullanici.Expires = DateTime.Now.AddDays(365);
                            Response.Cookies.Add(kullanici);
                            return Json("1");
                        }
                    }
                }
                return Json("0");
            }
            catch { return Json("0"); }
        }

        public ActionResult CikisYap()
        {
            if (Request.Cookies["prsnl"] != null)
            {
                Response.Cookies["prsnl"].Expires = DateTime.Now.AddDays(-1);
            }
            return Redirect("Index");
        }
    }
}