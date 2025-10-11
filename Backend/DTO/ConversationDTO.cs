using System.ComponentModel.DataAnnotations;

namespace ChatX.DTO
{
    /// <summary>
    /// Represents what the client should see when a conversation is created or listed.
    /// </summary>
    public class ConversationDTO
    {
        public Guid Id { get; set; }
        public List<UserConversationDtoResponse> Participants { get; set; } = [];
        public DateTime? CreatedAt { get; set; }
    }

    /// <summary>
    /// Provides safe, minimal user information to the client.
    /// </summary>

    public class UserConversationDtoResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
    }
    /// <summary>
    /// Represents the input data the client sends to start a new conversation.
    /// </summary>
    public class CreateConversationRequest
    {
        [Required]
        public Guid UserId1 { get; set; } // Current logged-in user

        [Required]
        public Guid UserId2 { get; set; } // The user to chat with
    }

    /// <summary>
    /// Represents a chat message in a format the client expects.
    /// </summary>
    public class MessageDto
    {
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public UserConversationDtoResponse Sender { get; set; } = null!;
        public string Body { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
    /// <summary>
    /// Send Message DTO
    /// </summary>
    public class SendMessageDto
    {
        public string Body { get; set; } = null!;
        public string? AttachmentUrl { get; set; }
    }
}
