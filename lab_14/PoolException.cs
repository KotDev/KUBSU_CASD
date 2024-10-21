using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_14
{
    public class PoolException: Exception
    {
        string message;
        public PoolException(string message): base(message) {this.message = message;}
    }
}