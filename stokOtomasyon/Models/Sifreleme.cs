using System.Security.Cryptography;
using System.Text;

namespace blogum.Areas.Admin.Controllers
{
    public static class Sifreleme
    {
        public static string Donustur(string sifre)
        {
            byte[] ByteData = Encoding.ASCII.GetBytes(sifre);
            MD5 sifrele = MD5.Create();
            byte[] HashData = sifrele.ComputeHash(ByteData);
            StringBuilder sb = new StringBuilder();
            for (int x = 0; x < HashData.Length; x++)
            {
                sb.Append(HashData[x].ToString("x2"));
            }
            return sb.ToString();
        }
    }
}