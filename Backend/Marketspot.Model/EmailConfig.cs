namespace Marketspot.Model
{
    public class EmailConfig(string login, string password, string server, int port, bool useSsl)
    {
        public string Login { get; init; } = login;
        public string Password { get; init; } = password;
        public string Server { get; init; } = server;
        public int Port { get; init; } = port;
        public bool UseSsl { get; init; } = useSsl;
    }
}
