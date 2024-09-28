namespace backend.Model.User
{
    public class SettingsChangePasswordDto
    {    
        public string Password { get; set; }
        public string NewPassword { get; set; }
        public string NewRePassword { get; set; }
    }
}
