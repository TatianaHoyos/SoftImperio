using Microsoft.EntityFrameworkCore;
using venta.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure the context for the database using the ConfigureServices method
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // connect to mysql with connection string from app settings
    var connectionString = builder.Configuration.GetConnectionString("Conexion");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddCors(policyBuider=>
policyBuider.AddDefaultPolicy(policy=>
policy.WithOrigins("*").AllowAnyHeader().AllowAnyMethod()));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();


app.UseAuthorization();

app.MapControllers();

app.Run();
