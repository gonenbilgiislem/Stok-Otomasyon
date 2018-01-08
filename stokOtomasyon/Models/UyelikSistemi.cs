using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace stokOtomasyon.Models
{
    public class UyelikSistemi : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var cookie = filterContext.HttpContext.Request.Cookies["prsnl"];
            if (cookie == null)
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "controller", "Login" }, { "action", "Index" } });
            else
            {
                string controllerName = filterContext.RouteData.Values["controller"].ToString();
                if (cookie["Yetki"] == "Personel" && controllerName == "UyeYonetim")
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "controller", "Satis" }, { "action", "Index" } });
            }
            base.OnActionExecuting(filterContext);
        }
    }
}
