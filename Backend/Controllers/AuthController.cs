using ChatX.DTO;
using ChatX.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatX.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO user)
        {
            if (user == null) return BadRequest("User is empty");

            if (string.IsNullOrWhiteSpace(user.LoginEmail)) return BadRequest("Email is empty");

            if (string.IsNullOrWhiteSpace(user.Password)) return BadRequest("Password is empty");

            var existingUser = await _context.Users
                                    .FirstOrDefaultAsync(u => u.Email == user.LoginEmail);

            if (existingUser == null)
            {
                return Unauthorized("User Not Found");
            }

            bool isValidPassword = existingUser.PasswordHash == user.Password;

            if (!isValidPassword)
            {
                return Unauthorized("Password is Wrong");
            }

            return Ok(new
            {
                Status = true,
                Message = "Login Successful"
            });
        }

        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            return Ok("Logout Successfully");
        }
    }
}
