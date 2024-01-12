using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace venta.DTO
{
    internal class ErrorResponse : ModelStateDictionary
    {
        public string ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
    }
}