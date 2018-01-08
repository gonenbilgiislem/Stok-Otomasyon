using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using stokOtomasyon.Models;

namespace stokOtomasyon.Controllers
{
    [UyelikSistemi]
    public class MusteriController : Controller
    {
        StokEntities DB = new StokEntities();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Veriler()
        {
            return this.Json(
            new
            {
                Result = (from obj in DB.Musteri
                          select new
                          {
                              ID = obj.ID,
                              Borc = obj.Borc,
                              Ad = obj.Ad,
                              Soyad = obj.Soyad,
                              Tel = obj.Tel,
                              Adres = obj.Adres,
                              KayitTarihi = obj.KayitTarihi

                          })
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Ekle()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Ekle(Musteri model)
        {
            try
            {
                model.KayitTarihi = DateTime.Now;
                DB.Musteri.Add(model);
                DB.SaveChanges();
                return Json("1");
            }
            catch { return Json("0"); }
        }

        [HttpPost]
        public JsonResult Guncelle(int id)
        {
            try
            {

                var Result = (from obj in DB.Musteri.Where(x => x.ID == id)
                              select new
                              {
                                  ID = obj.ID,
                                  Borc = obj.Borc,
                                  Ad = obj.Ad,
                                  Soyad = obj.Soyad,
                                  Tel = obj.Tel,
                                  Adres = obj.Adres,
                                  KayitTarihi = obj.KayitTarihi

                              }).FirstOrDefault();
           
                
                return Json(Result);
            }
            catch(Exception ex) { return Json("0"); }
        }

        [HttpPost]
        public JsonResult GuncelleJSON(int id, string ad, string soyad, string tel, string adres)
        {
            try
            {
                var musteri = DB.Musteri.Where(mus => mus.ID == id).FirstOrDefault();
                musteri.Ad = ad;
                musteri.Soyad = soyad;
                musteri.Tel = tel;
                musteri.Adres = adres;
                DB.SaveChanges();
                return Json("1");
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
                    var mus = DB.Musteri.Where(m => m.ID == veri).FirstOrDefault();
                    var musSatis = DB.Satis.Where(m => m.MusteriID == veri).ToList();
                    foreach (var musteri in musSatis)
                        DB.Satis.Remove(musteri);
                    DB.Musteri.Remove(mus);
                }
                DB.SaveChanges();
                return Json("1");
            }
            catch { return Json("0"); }
        }

        [HttpPost]
        public JsonResult BorcGuncelle(int id, int tutar)
        {
            try
            {
                if (tutar <= 0) return Json("0");
                var musteri = DB.Musteri.Where(mus => mus.ID == id).First();
                if (musteri.Borc>=tutar)
                {
                    var kalan = musteri.Borc - tutar;
                    musteri.Borc = kalan;
                    DB.SaveChanges();
                    return Json("1");
                }
                return Json("2");
            }
            catch { return Json("0"); }
        }
    }
}