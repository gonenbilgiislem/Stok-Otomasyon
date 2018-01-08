using stokOtomasyon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace stokOtomasyon.Controllers
{
    [UyelikSistemi]
    public class UrunController : Controller
    {
        StokEntities DB = new StokEntities();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult UrunleriGetir()
        {
            return this.Json(
            new
            {
                Result = (from obj in DB.Urun
                          select new
                          {
                              ID = obj.ID,
                              Marka = obj.Marka.Ad,
                              Ad = obj.Ad,
                              Adet = obj.Adet,
                              AlisFiyat = obj.AlisFiyat,
                              Kdv = obj.Kdv,
                              SatisFiyat = obj.SatisFiyat,
                              EklenmeTarih = obj.EklenmeTarihi
                          })
            }, JsonRequestBehavior.AllowGet
            );
        }

        public ActionResult SatilanUrun()
        {
            return View();
        }

        public JsonResult Satilanlar()
        {
            return this.Json(
            new
            {
                Result = (from obj in DB.Satis
                          select new
                          {
                              Marka = obj.Urun.Marka.Ad,
                              Ad = obj.Urun.Ad,
                              Adet = obj.Adet,
                              AlisFiyat = obj.Urun.AlisFiyat,
                              Kdv = obj.Urun.Kdv,
                              SatisFiyat = obj.Urun.SatisFiyat,
                              EklenmeTarih = obj.Urun.EklenmeTarihi,
                              Tutar = (obj.Adet * obj.Urun.SatisFiyat)-obj.Indirim
                          })
            }, JsonRequestBehavior.AllowGet
            );
        }

        public ActionResult Ekle()
        {
            var marka = DB.Marka.ToList();
            return View(marka);
        }

        [HttpPost]
        public JsonResult Ekle(Urun model)
        {
            try
            {
                if (model.AlisFiyat != 0 && model.SatisFiyat != 0 && model.Kdv != 0)
                {
                    model.EklenmeTarihi = DateTime.Now;
                    DB.Urun.Add(model);
                    DB.SaveChanges();
                    return Json("1");
                }
                return Json("2");
            }
            catch { return Json("0"); }
        }

        [HttpPost]
        public JsonResult Sil(int[] data)
        {
            try
            {
                if (data == null) return Json("2");
                foreach (var veri in data)
                {
                    var urun = DB.Urun.Where(u => u.ID == veri).FirstOrDefault();
                    DB.Urun.Remove(urun);
                }
                DB.SaveChanges();
                return Json("1");
            }
            catch { return Json("0"); }
        }

        public ActionResult Guncelle(int id)
        {
            var urun = DB.Urun.Where(u => u.ID == id).FirstOrDefault();
            ViewBag.Marka = DB.Marka.ToList();
            return View(urun);
        }

        [HttpPost]
        public JsonResult Guncelle(Urun model)
        {
            try
            {
                var urun = DB.Urun.Where(u => u.ID == model.ID).FirstOrDefault();
                urun.MarkaID = model.MarkaID;
                urun.Ad = model.Ad;
                urun.Adet = model.Adet;
                urun.AlisFiyat = model.AlisFiyat;
                urun.Kdv = model.Kdv;
                urun.SatisFiyat = model.SatisFiyat;
                DB.SaveChanges();
                return Json("1");
            }
            catch { return Json("0"); }
        }
    }
}