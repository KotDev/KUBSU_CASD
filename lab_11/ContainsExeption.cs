using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_11
{
    public class ContainsExeption: Exception
    {
        public string message;

        public ContainsExeption() : base() {}
        public ContainsExeption(string message) : base(message) {this.message = message;}

    }
}