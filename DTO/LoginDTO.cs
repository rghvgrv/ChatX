using System.ComponentModel.DataAnnotations;

namespace ChatX.DTO
{
    public class LoginDTO
    {
        public required string LoginEmail { get; set; }
        public required string Password { get; set; }
    }

    public class RegisterUser
    {
        public required string UserName { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string DisplayName { get; set; }
    }
}
