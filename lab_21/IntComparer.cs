using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_21
{
    public class IntComparer: Comparer<int>
    {
        public override int CompareTo(int elem1, int elem2)
        {
            if (elem1 > elem2)
                return 1;
            else if (elem1 < elem2)
                return -1;
            else
                return 0;
        } 
    }
}