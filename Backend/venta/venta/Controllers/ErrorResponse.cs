using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace venta.Controllers
{
    internal class ErrorResponse : ModelStateDictionary
    {
        public string ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
    }
}