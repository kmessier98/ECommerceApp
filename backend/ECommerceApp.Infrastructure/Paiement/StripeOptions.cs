namespace ECommerceApp.Infrastructure.Paiement
{
    public class StripeOptions
    {
        public string SecretKey { get; set; } = string.Empty;
        public string WebhookSecret { get; set; } = string.Empty;
        public string UrlFrontend { get; set; } = string.Empty;
    }
}
