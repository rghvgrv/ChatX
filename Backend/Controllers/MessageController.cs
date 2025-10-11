using ChatX.DTO;
using ChatX.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatX.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{conversationId}/messages")]
        public async Task<IActionResult> SendMessage(Guid conversationId, [FromBody] MessageDto messageDto)
        {
            if (string.IsNullOrWhiteSpace(messageDto.Body))
                return BadRequest("Message body or attachment is required");

            var loggedInUserEmail = HttpContext.Items["UserEmail"]?.ToString();
            if (string.IsNullOrEmpty(loggedInUserEmail))
                return Unauthorized("No logged-in user found");

            var sender = await _context.Users.FirstOrDefaultAsync(u => u.Email == loggedInUserEmail);
            if (sender == null)
                return Unauthorized("User not found");

            // Create message
            var message = new Message
            {
                Id = Guid.NewGuid(),
                ConversationId = conversationId,
                SenderId = sender.Id,
                Body = messageDto.Body,
                CreatedAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Return message in standard DTO format
            var response = new MessageDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                Sender = new UserConversationDtoResponse
                {
                    Id = sender.Id,
                    Username = sender.Username,
                    DisplayName = sender.DisplayName ?? ""
                },
                Body = message.Body,
                CreatedAt = message.CreatedAt ?? DateTime.UtcNow
            };

            return Ok(response);
        }

    }
}
