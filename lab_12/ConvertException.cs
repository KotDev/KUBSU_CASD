using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_12
{
    public class ConvertException: Exception
    {
        string message;
        public ConvertException(string message) : base(message) {this.message = message;}
        public ConvertException() : base() {}
    }
}