using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_21
{
    abstract public class Comparer<T>
    {
        public abstract int CompareTo(T elem1, T elem2);
    }
}