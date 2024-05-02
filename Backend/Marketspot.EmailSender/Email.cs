using MailKit.Net.Smtp;
using Marketspot.Model;
using MimeKit;

namespace Marketspot.EmailSender
{
    public static class Email
    {
        public static async Task SendMail(EmailConfig config, string reciver, string body)
        {
            try
            {
                var email = new MimeMessage();

                email.From.Add(new MailboxAddress(config.Login, config.Login));
                email.To.Add(new MailboxAddress(reciver, reciver));
                email.Subject = "Password reset";
                email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = body
                };

                using (var smtp = new SmtpClient())
                {
                    smtp.Connect(config.Server, config.Port, config.UseSsl);

                    smtp.Authenticate(config.Login, config.Password);

                    await smtp.SendAsync(email);
                    smtp.Disconnect(true);
                }
            }
            catch
            {
            }
        }
    }
}
