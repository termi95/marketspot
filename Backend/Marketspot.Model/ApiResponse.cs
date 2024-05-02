using System.Net;

namespace Marketspot.Model
{
    public class ApiResponse
    {
        private bool _IsSuccess = false;
        private HttpStatusCode _StatusCode = HttpStatusCode.BadRequest;
        public bool IsSuccess { get { return _IsSuccess; } set { _IsSuccess = value; } }
        public Object Result { get; set; } = null;
        public List<string> ErrorsMessages { get; set; } = [];

        public void SetStatusCode(HttpStatusCode code)
        {
            _StatusCode = code;
            _IsSuccess = Enumerable.Range(200, 299).Contains((int)code);
        }
        public int GetStatusCode()
        {
            return (int)_StatusCode;
        }

    }
}
