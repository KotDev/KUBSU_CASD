using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_11
{
    public class ComparatorString: PriorityQueueComparer<string>
    {
        public override int CompairTo(string? elem1, string? elem2)
        {
            if (elem1 == null || elem2 == null)
                throw new NotImplementedException();
            return elem1.CompareTo(elem2);
        }

        
    }
}