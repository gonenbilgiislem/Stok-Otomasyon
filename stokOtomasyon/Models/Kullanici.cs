//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace stokOtomasyon.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Kullanici
    {
        public int ID { get; set; }
        public string KullaniciAd { get; set; }
        public string Sifre { get; set; }
        public int YetkiID { get; set; }
        public int PersonelID { get; set; }
    
        public virtual Personel Personel { get; set; }
        public virtual Yetki Yetki { get; set; }
    }
}
