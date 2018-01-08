using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using stokOtomasyon.Models;

namespace stokOtomasyon.Controllers
{
    [UyelikSistemi]
    public class SatisController : Controller
    {
        StokEntities DB = new StokEntities();
        public ActionResult Index()
        {
            ViewBag.Marka = DB.Marka.ToList();
            ViewBag.Musteri = DB.Musteri.ToList();
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
                              SatisFiyat = obj.SatisFiyat
                          })
            }, JsonRequestBehavior.AllowGet
            );
        }

        [HttpPost]
        public JsonResult SatisYap(Array[] data,string indirim, string musID)
        {
            try
            {
                Satis sts = new Satis();
                int sayac = 0;
                sts.Tarih = DateTime.Now;
                sts.Indirim = Convert.ToDecimal(indirim) / Convert.ToDecimal(data.Length);
                sts.PersonelID = Convert.ToInt32(Request.Cookies["prsnl"]["Id"]);
                if (musID != "-1") sts.MusteriID = Convert.ToInt32(musID);
                for (int i = 0; i < data.Length; i++)
                {
                    foreach (var urun in data[i])
                    {
                        if (sayac == 0)
                            sts.UrunID = Convert.ToInt32(urun);
                        else if (sayac == 1)
                            sts.Adet = Convert.ToInt32(urun);
                        sayac++;
                    }
                    sayac = 0;
                    DB.Satis.Add(sts);
                    DB.SaveChanges();
                }
                return Json("1");
            }
            catch { return Json("0"); }
        }

        [HttpPost]
        public JsonResult VeresiyeSatis(Array[] data, string indirim, string musID,string borc)
        {
            try
            {
                Satis sts = new Satis();
                int sayac = 0;
                sts.Tarih = DateTime.Now;
                sts.Indirim = Convert.ToDecimal(indirim) / Convert.ToDecimal(data.Length);
                sts.PersonelID = Convert.ToInt32(Request.Cookies["prsnl"]["Id"]);
                if (musID != "-1")
                {
                    sts.MusteriID = Convert.ToInt32(musID);
                    var mus = DB.Musteri.Where(m => m.ID == sts.MusteriID).FirstOrDefault();
                    mus.Borc = mus.Borc + Convert.ToDecimal(borc);
                }
                for (int i = 0; i < data.Length; i++)
                {
                    foreach (var urun in data[i])
                    {
                        if (sayac == 0)
                            sts.UrunID = Convert.ToInt32(urun);
                        else if (sayac == 1)
                            sts.Adet = Convert.ToInt32(urun);
                        sayac++;
                    }
                    sayac = 0;
                    DB.Satis.Add(sts);
                    DB.SaveChanges();
                }
                return Json("1");
            }
            catch { return Json("0"); }
        }
    }
}