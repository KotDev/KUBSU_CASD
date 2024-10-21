using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_11
{
    public class ComparatorDouble: PriorityQueueComparer<double>
    {
        public override int CompairTo(double elem1, double elem2) => elem1.CompareTo(elem2);
    }
}