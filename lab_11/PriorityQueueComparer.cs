using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_11
{
    public abstract class PriorityQueueComparer<T>
    {
        public abstract int CompairTo(T? elem1, T? elem2);
    }
}