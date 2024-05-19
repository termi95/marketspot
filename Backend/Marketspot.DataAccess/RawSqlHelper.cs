using System.Reflection;

namespace Marketspot.DataAccess
{
    public static class RawSqlHelper
    {
        static readonly Assembly dataAccessAssembly = Assembly.Load("Marketspot.DataAccess");

        private static string GetSqlByName(string sqlName)
        {
            string result = string.Empty;
            string resourceName = dataAccessAssembly.GetManifestResourceNames().FirstOrDefault(x => x.Contains($"{sqlName}.sql"));
            if (resourceName != null)
            {
                using (Stream sql = dataAccessAssembly.GetManifestResourceStream(resourceName))
                {
                    if (sql != null)
                    {
                        using (StreamReader reader = new(sql))
                        {
                            result = reader.ReadToEnd();
                        }
                    }
                }
            }
            return result;
        }

        public static string GetParentCategoriesWithAllChildrenById()
        {
            string funcName = MethodBase.GetCurrentMethod().Name;
            return GetSqlByName(funcName);
        }
    }
}
