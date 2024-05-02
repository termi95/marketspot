using System.ComponentModel.DataAnnotations;

namespace backend.Model.User
{
    public class ChangePasswordRequestDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;
    }
}
