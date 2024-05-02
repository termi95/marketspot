using Marketspot.Model;

namespace Backend.Helper
{
    public static class Helper
    {
        public static EmailConfig GetEmailConfig()
        {
            var Config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var login = Config.GetValue<string>("Email:Login");
            var password = Config.GetValue<string>("Email:Password");
            var server = Config.GetValue<string>("Email:Server");
            var port = Config.GetValue<int>("Email:Port");
            var useSsl = Config.GetValue<bool>("Email:UseSsl");
            return new EmailConfig(login, password, server, port, useSsl);
        }
    }
}
