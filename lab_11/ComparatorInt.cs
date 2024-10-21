using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_11
{
    public class ComparatorInt: PriorityQueueComparer<int>
    {
        public override int CompairTo(int elem1, int elem2) => elem1.CompareTo(elem2);
    }
}