namespace ChatX.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string Username { get; set; } = null!;

    public string? Email { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string? DisplayName { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Conversationmember> Conversationmembers { get; set; } = new List<Conversationmember>();

    public virtual ICollection<Messagedelivery> Messagedeliveries { get; set; } = new List<Messagedelivery>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
