using System;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using SuperPlatform.LK.Client.Controllers;
using SuperPlatform.LK.Client.Domain;
using SuperPlatform.LK.Client.Infrastructure.Authantication;
using SuperPlatform.LK.Client.Infrastructure.Authorization;
using SuperPlatform.LK.Client.Infrastructure.Filters;
using SuperPlatform.LK.Client.Integration;

namespace SuperPlatform.LK.Client
{
    public class Startup
    {
        public static string BasePath;

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment HostingEnvironment { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment hostingEnvironment)
        {
            Configuration = configuration;
            HostingEnvironment = hostingEnvironment;
            BasePath = string.IsNullOrWhiteSpace(Configuration["GlobalPrefix"]) ? "" : $"/{Configuration["GlobalPrefix"].Trim('/')}";
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            AddAuthenticate(services);

            services.AddAutoMapper(
                Assembly.GetAssembly(typeof(ChildrenController)));

            services.AddApiVersioning();

            services.AddControllersWithViews(options =>
            {
                options.Filters.Add<ExceptionFilter>();
            });

            services
                .AddRazorPages()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    options.SerializerSettings.Converters.Add(new StringEnumConverter { NamingStrategy = new CamelCaseNamingStrategy() });
                })
                .AddApplicationPart(Assembly.GetAssembly(typeof(ChildrenController)))
                .AddControllersAsServices();

            services.AddDomain();

            services.AddIntegration(Configuration);

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "LK Client API"
                });
                c.DescribeAllEnumsAsStrings();
                c.DescribeStringEnumsInCamelCase();
                // Отобразить xml комментарии в Swagger JSON и UI.
                var xmlFiles = Directory.GetFiles(AppContext.BaseDirectory, "*.xml", SearchOption.TopDirectoryOnly).ToList();
                xmlFiles.ForEach(xmlFile => c.IncludeXmlComments(xmlFile));
                c.CustomSchemaIds(x => x.FullName);
            });

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddCors(options =>
            {
                var allowedHosts = Configuration["AllowedHosts"].Split(",");
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins(allowedHosts)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UsePathBase(BasePath);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCustomAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "my.akbars.ru V1");
                c.DocumentTitle = "LK Swagger";
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (HostingEnvironment.IsDevelopment())
                {
                    spa.Options.StartupTimeout = TimeSpan.FromSeconds(120);
                    spa.UseReactDevelopmentServer("start");
                }
            });
        }

        private void AddAuthenticate(IServiceCollection services)
        {
            var authorizeSection = Configuration.GetSection("Authorize");

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = "Cookies";
                    options.DefaultScheme = "Cookies";
                    options.DefaultSignInScheme = "Cookies";
                    options.DefaultChallengeScheme = "oidc";
                })
                .AddAObrCardAuthentication("oidc", "oidc", options =>
                {
                    options.CallbackPath = "/oauth/callback";
                    options.RedirectUrl = authorizeSection["RedirectUrl"];
                    options.BaseUrl = authorizeSection["BaseUrl"];
                    options.ClientId = authorizeSection["ClientId"];
                    options.Secret = authorizeSection["Secret"];
                })
                .AddCookie("Cookies", config =>
                {
                    config.Cookie.HttpOnly = true;
                });
        }
    }
}