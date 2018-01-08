using stokOtomasyon.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace stokOtomasyon.Controllers
{
    [UyelikSistemi]
    public class PersonelController : Controller
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
                Result = (from obj in DB.Personel
                          select new
                          {
                              ID = obj.ID,
                              Resim = obj.Resim,
                              Ad = obj.Ad,
                              Soyad = obj.Soyad,
                              Tel = obj.Tel,
                              Adres = obj.Adres,
                              Maas = obj.Maas,
                              GirisTarihi = obj.GirisTarihi

                          })
            }, JsonRequestBehavior.AllowGet
            );
        }

        public ActionResult Ekle()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ResimYukle()
        {
            var resim = System.Web.HttpContext.Current.Request.Files["prsnlResim"];
            if (resim == null)
                return Json("0");
            else if (System.IO.File.Exists(Server.MapPath("~/Content/Images/") + resim.FileName))
                return Json("2");
            Session["resim"] = resim;
            return Json("1");
        }

        [HttpPost]
        public JsonResult Ekle(Personel model)
        {
            try
            {
                model.GirisTarihi = DateTime.Now;
                HttpPostedFile resim = (HttpPostedFile)Session["resim"];
                if (resim == null) {
                    model.Resim = "/Content/Images/default.png";
                    DB.Personel.Add(model);
                }
                else
                {
                    var yol = Path.Combine(Server.MapPath("~/Content/Images/") + resim.FileName);
                    resim.SaveAs(yol);
                    model.Resim = "/Content/Images/" + resim.FileName;
                    DB.Personel.Add(model);
                 }
                DB.SaveChanges();
                Session.Remove("resim");
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
                    var prsnl = DB.Personel.Where(p=>p.ID == veri).FirstOrDefault();
                    if (System.IO.File.Exists(Server.MapPath(prsnl.Resim)))
                    {
                        if(prsnl.Resim!="/Content/Images/default.png")
                            System.IO.File.Delete(Server.MapPath(prsnl.Resim));
                    }
                    var prsnlHesap = DB.Kullanici.Where(k => k.PersonelID == veri).FirstOrDefault();
                    if(prsnlHesap !=null) DB.Kullanici.Remove(prsnlHesap);
                    DB.Personel.Remove(prsnl);
                }
                DB.SaveChanges();
                return Json("1");
            }
            catch { return Json("0"); }
        }

        public ActionResult Guncelle(int id)
        {
            var prsnl = DB.Personel.Where(p => p.ID == id).FirstOrDefault();
            return View(prsnl);
        }

        [HttpPost]
        public JsonResult Guncelle(Personel model)
        {
            try
            {
                var personel = DB.Personel.Where(p => p.ID == model.ID).FirstOrDefault();
                HttpPostedFile resim = (HttpPostedFile)Session["resim"];
                if (resim == null && personel.Resim != "/Content/Images/default.png")
                    personel.Resim = personel.Resim;
                else if (resim == null)
                    personel.Resim = "/Content/Images/default.png";
                else
                {
                    var yol = Path.Combine(Server.MapPath("~/Content/Images/") + resim.FileName);
                    resim.SaveAs(yol);
                    personel.Resim = "/Content/Images/" + resim.FileName;
                }
                personel.Ad = model.Ad;
                personel.Soyad = model.Soyad;
                personel.Tel = model.Tel;
                personel.Adres = model.Adres;
                personel.Maas = model.Maas;
                DB.SaveChanges();
                Session.Remove("resim");
                return Json("1");
            }
            catch { return Json("0"); }
        }
    }
}