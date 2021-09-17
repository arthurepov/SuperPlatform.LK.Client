namespace SuperPlatform.LK.Client.Integration.Models
{
    public class ObrCardResponse<T> where T : class
    {
        public bool Success { get; set; }
        
        public string Message { get; set; }
     
        public T Data { get; set; }
    }
}