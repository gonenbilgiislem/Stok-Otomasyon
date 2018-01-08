using blogum.Areas.Admin.Controllers;
using stokOtomasyon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace stokOtomasyon.Controllers
{
    [UyelikSistemi]
    public class UyeYonetimController : Controller
    {
        StokEntities DB = new StokEntities();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult VerileriGetir()
        {
            return this.Json(
            new
            {
                Result = (from per in DB.Personel
                          join kul in DB.Kullanici
                          on per.ID equals kul.PersonelID
                          join yetki in DB.Yetki
                          on kul.YetkiID equals yetki.ID
                          select new
                          {
                              ID = per.ID,
                              Resim = per.Resim,
                              Ad = per.Ad,
                              Soyad = per.Soyad,
                              Kad = kul.KullaniciAd,
                              Yetki1 = yetki.Yetki1
                          })
            }, JsonRequestBehavior.AllowGet
            );
        }

        public ActionResult Ekle()
        {
            var prsl = DB.Personel.ToList();
            return View(prsl);
        }

        [HttpPost]
        public JsonResult Ekle(Kullanici model,string sifreTekrar)
        {
            try
            {
                var kullanici = DB.Kullanici.ToList();
                if (model.Sifre != sifreTekrar) return Json("sifreFarklı");
                foreach (var k in kullanici)
                {
                    if (k.PersonelID == model.PersonelID)
                    {
                        return Json("hesabıZatenVar");
                    }
                }
                model.Sifre = Sifreleme.Donustur(model.Sifre);
                model.YetkiID = 2;
                DB.Kullanici.Add(model);
                DB.SaveChanges();
                return Json("1");
            }
            catch { return Json("0"); }
        }

        [HttpPost]
        public JsonResult SilJSON(int[] data)
        {
            try
            {
                if (data == null) return Json("2");
                foreach (var veri in data)
                {
                    var persnl = DB.Kullanici.Where(p => p.PersonelID == veri).FirstOrDefault();
                    if (persnl.Yetki.Yetki1!="Admin")
                    {
                        DB.Kullanici.Remove(persnl);
                    }
                }
                DB.SaveChanges();
                return Json("1");
            }
            catch { return Json("0"); }
        }

        [HttpPost]
        public JsonResult YetkiGuncelle(int prsnlID,string yetkiAd)
        {
            try
            {
                var prsnl = DB.Kullanici.Where(p => p.PersonelID == prsnlID).FirstOrDefault();
                if (yetkiAd=="Admin")
                {
                    prsnl.YetkiID = 1;
                    DB.SaveChanges();
                    return Json("1");
                }
                else if (yetkiAd=="Personel")
                {
                    prsnl.YetkiID = 2;
                    DB.SaveChanges();
                    return Json("1");
                }
                return Json("0");
            }
            catch { return Json("0"); }
        }
    }
}