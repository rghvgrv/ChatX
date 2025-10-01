using ChatX.DTO;
using ChatX.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChatX.Controllers
{
    [ApiController]
    [Route("[controller")]
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

        }

    }
}
