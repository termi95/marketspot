using System.ComponentModel.DataAnnotations;

namespace backend.Model.User
{
    public class LoginUserDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required, MinLength(8)]
        public string Password { get; set; } = string.Empty;
    }
}
