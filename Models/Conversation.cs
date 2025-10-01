namespace ChatX.Models;

public partial class Conversation
{
    public Guid Id { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Conversationmember> Conversationmembers { get; set; } = new List<Conversationmember>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
