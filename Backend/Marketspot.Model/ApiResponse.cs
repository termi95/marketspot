using System.Net;

namespace Marketspot.Model
{
    public class ApiResponse
    {
        public bool IsSuccess { get; set; } = false;
        public Object Result { get; set; } = null;
        public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.BadRequest;
        public List<string> ErrorsMessages { get; set; } = [];
    }
}
