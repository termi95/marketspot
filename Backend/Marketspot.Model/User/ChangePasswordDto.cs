namespace backend.Model.User
{
    public class ChangePasswordDto
    {
        public string PasswordChangeToken { get; set; }        
        public string Password { get; set; }
    }
}
