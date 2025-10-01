namespace ChatX.Models;

public partial class Message
{
    public Guid Id { get; set; }

    public Guid ConversationId { get; set; }

    public Guid SenderId { get; set; }

    public string? Body { get; set; }

    public string? AttachmentUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? EditedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual Conversation Conversation { get; set; } = null!;

    public virtual ICollection<Messagedelivery> Messagedeliveries { get; set; } = new List<Messagedelivery>();

    public virtual User Sender { get; set; } = null!;
}
