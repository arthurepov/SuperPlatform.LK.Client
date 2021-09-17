using System;

namespace SuperPlatform.LK.Client.Integration.Settings
{
    public class StrapiClientSettings
    {
        public string ClientName { get; set; } = "strapiClient";

        /// <summary> Базовый адрес к страпи. </summary>
        public string BaseUrl { get; set; }

        /// <summary> Логин АББМ. </summary>
        public string Login { get; set; }

        /// <summary> Пароль АББМ. </summary>
        public string Password { get; set; }

        /// <summary> Jwt токен. </summary>
        public string Token { get; set; }

        /// <summary> Дата экспирации токена. </summary>
        public DateTime Expires { get; set; }
    }
}
