using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_21
{
    public class RootStruct<TKey, TValue>
    {
        public TKey? key;
        public TValue? val;
        public RootStruct<TKey, TValue>? right;
        public RootStruct<TKey, TValue>? left;

        public RootStruct(TKey key, TValue val)
        {
            this.key = key;
            this.val = val;
            this.right = null;
            this.left = null;
        }
        public RootStruct()
        {
            this.key = default;
            this.val = default;
            this.right = null;
            this.left = null;
        }
    }
}