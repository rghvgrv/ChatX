using ChatX.DTO;
using ChatX.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatX.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser(RegisterUser registerUser)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Users.AnyAsync(u => u.Username == registerUser.UserName))
                return BadRequest("Username already exists.");

            if (!string.IsNullOrEmpty(registerUser.Email) &&
                await _context.Users.AnyAsync(u => u.Email == registerUser.Email))
                return BadRequest("Email already exists.");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = registerUser.UserName,
                Email = registerUser.Email,
                PasswordHash = registerUser.Password,
                DisplayName = registerUser.DisplayName,
                CreatedAt = DateTime.UtcNow,
            };

            // Save the changes to DB 
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 5. Return success (omit sensitive info)
            return Ok(new
            {
                Message = $"User Registered :- {user.DisplayName} ",
                Id = user.Id,
            });
        }

        [HttpGet("GetUser/{email}")]
        public async Task<IActionResult> GetUser(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return BadRequest("Email can't be Empty");

            var userByEmail = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (userByEmail == null) return BadRequest("User not Found");

            return Ok(new
            {
                Id = userByEmail.Id,
                UserName = userByEmail.Username,
                Name = userByEmail.DisplayName,
            });
        }
    }
}
