using ChatX.DTO;
using ChatX.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatX.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConversationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConversationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("StartConversation")]
        public async Task<IActionResult> Conversation([FromBody] CreateConversationRequest request)
        {
            // To check conversation should start with yourself
            if (request.UserId1 == request.UserId2)
                return BadRequest("Cannot start conversation with yourself.");

            //To check if a 1:1 conversation already exists
            var existing = await _context.Conversations
                                .Include(c => c.Conversationmembers) //load user entity
                                .Where(c => c.Conversationmembers.Count == 2 &&
                                        c.Conversationmembers.Any(m => m.UserId == request.UserId1) &&
                                         c.Conversationmembers.Any(m => m.UserId == request.UserId2))
                                .FirstOrDefaultAsync();

            // Return the previous conversation
            if (existing != null)
            {
                var participantIds = existing.Conversationmembers.Select(cm => cm.UserId).ToList();

                var exParticipants = await _context.Users
                    .Where(u => participantIds.Contains(u.Id))
                    .Select(u => new UserConversationDtoResponse
                    {
                        Id = u.Id,
                        Username = u.Username,
                        DisplayName = u.DisplayName ?? ""
                    })
                    .ToListAsync();

                return Ok(new ConversationDTO
                {
                    Id = existing.Id,
                    CreatedAt = existing.CreatedAt ?? DateTime.UtcNow,
                    Participants = exParticipants
                });
            }

            // Create new conversation
            var conversation = new Conversation
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Conversations.Add(conversation);

            // Add members
            _context.Conversationmembers.AddRange(
                new Conversationmember { ConversationId = conversation.Id, UserId = request.UserId1, JoinedAt = DateTime.UtcNow },
                new Conversationmember { ConversationId = conversation.Id, UserId = request.UserId2, JoinedAt = DateTime.UtcNow }
            );

            await _context.SaveChangesAsync();

            // Prepare response
            var participants = await _context.Users
                .Where(u => u.Id == request.UserId1 || u.Id == request.UserId2)
                .Select(u => new UserConversationDtoResponse
                {
                    Id = u.Id,
                    Username = u.Username,
                    DisplayName = u.DisplayName ?? ""
                }).ToListAsync();

            return Ok(new ConversationDTO
            {
                Id = conversation.Id,
                CreatedAt = conversation.CreatedAt,
                Participants = participants
            });
        }

        [HttpGet("ConversationForUser/{email}")]
        public async Task<IActionResult> ConversationByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("User is Invalid");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return NotFound("User not found");

            // Eager load conversations and members
            var conversations = await _context.Conversationmembers
                .Where(cm => cm.UserId == user.Id)
                .Include(cm => cm.Conversation)
                    .ThenInclude(c => c.Conversationmembers)
                        .ThenInclude(m => m.User)
                .Select(cm => new
                {
                    cm.Conversation.Id,
                    cm.Conversation.CreatedAt,
                    Members = cm.Conversation.Conversationmembers
                                .Select(m => new
                                {
                                    m.User.Id,
                                    m.User.Username,
                                    m.User.DisplayName
                                }),
                    LastMessage = _context.Messages
                                    .Where(msg => msg.ConversationId == cm.Conversation.Id)
                                    .OrderByDescending(msg => msg.CreatedAt)
                                    .Select(msg => new
                                    {
                                        msg.Id,
                                        msg.Body,
                                        msg.SenderId,
                                        msg.CreatedAt
                                    })
                                    .FirstOrDefault()
                })
                .ToListAsync();

            if (conversations.Count == 0)
                return NotFound("No conversations found");

            return Ok(conversations);
        }

        [HttpGet("ConversationById/{id}")]
        public async Task<IActionResult> ConversationById(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return NotFound("Not Conversation Found");

            var conversation = await _context.Conversations
                               .Where(c => c.Id == Guid.Parse(id))
                               .Include(c => c.Conversationmembers)
                                   .ThenInclude(cm => cm.User)
                               .Select(c => new
                               {
                                   c.Id,
                                   c.CreatedAt,
                                   Participants = c.Conversationmembers
                                                   .Select(cm => new
                                                   {
                                                       cm.User.Id,
                                                       cm.User.Username,
                                                       cm.User.DisplayName
                                                   }),
                                   LatestMessage = c.Messages
                                                   .OrderByDescending(m => m.CreatedAt)
                                                   .Select(m => new
                                                   {
                                                       m.Id,
                                                       m.Body,
                                                       m.SenderId,
                                                       m.CreatedAt
                                                   })
                                                   .FirstOrDefault()
                               })
                               .FirstOrDefaultAsync();

            if (conversation == null)
                return NotFound("Conversation not found");

            return Ok(conversation);

        }

    }
}
