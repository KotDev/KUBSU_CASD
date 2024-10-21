using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_14
{
    public class SizeException: Exception
    {
        string message;
        public SizeException(string message): base(message) {this.message = message;}
    }
}