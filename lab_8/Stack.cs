using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KUBSU_CASD.lab_6;


namespace KUBSU_CASD.lab_8
{
    public class MyStack<T>: MyVector<T>
    {
        public MyStack() : base() {}

        public MyStack(int initalCapacity, int capacityIncrement) : base(initalCapacity, capacityIncrement) {}

        public MyStack(int initalCapacity) : base(initalCapacity) {}

        public MyStack(T[] a) : base(a) {}

        public void Push(T item) => Add(item);
        
        public T Pop() => Remove(index: Size() - 1);

        public T? Peek() => Get(Size() - 1);

        public bool Empty() => isEmpty();

        public int search(T elem)
        {
            int j = 1;
            for (int i = Size() - 1; i >= 0; i--)
            {
                T? getElem = Get(i);;
                if (getElem != null && getElem.Equals(elem))
                {
                    if (j > 1)
                        return -1 * j;
                    return j;
                }
                j++;
            }
            return -1;
        }
    }
}