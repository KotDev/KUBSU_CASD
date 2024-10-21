using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KUBSU_CASD.lab_11;

namespace KUBSU_CASD.lab_12
{
    public class ComparatorStruct: PriorityQueueComparer<Bid>
    {
        public override int CompairTo(Bid elem1, Bid elem2)
        {
            if (elem1.priority < elem2.priority)
                return 1;
            else if (elem1.priority > elem2.priority)
                return -1;
            return 0;
        }
    }
}