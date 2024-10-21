using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KUBSU_CASD.lab_6;


namespace KUBSU_CASD.lab_10
{
    public class Heap
    {
        
        MyVector<int> heapVector = new MyVector<int>();


        public Heap(int[] array)
        {
            foreach (var elem in array)
                heapVector.Add(elem);
            for (int pos = heapVector.Size() / 2 - 1; pos >= 0; pos--)
                Heapify(pos);
        }


        public void Add(int val)
        {
            heapVector.Add(val);
            int pos = heapVector.Size() - 1;
            int parent = (pos - 1) / 2;

            while (pos > 0 && heapVector.Get(parent) < heapVector.Get(pos))
            {
                int tmp = heapVector.Get(pos);
                int tmpParent = heapVector.Get(parent);
                heapVector.Set(index: pos, e: tmpParent);
                heapVector.Set(index: parent, e: tmp);

                pos = parent;
                parent = (pos - 1) / 2;
            }
        }

        public void Heapify(int pos)
        {
            for (; ;)
            {
                int leftChild = 2 * pos + 1;
                int rightChild = 2 * pos + 2;
                int largestChild = pos;
                
                if (leftChild < heapVector.Size() && heapVector.Get(leftChild) > heapVector.Get(largestChild))
                {
                    largestChild = leftChild;
                }

                if (rightChild < heapVector.Size() && heapVector.Get(rightChild) > heapVector.Get(largestChild))
                {
                    largestChild = rightChild;
                }

                if (largestChild == pos)
                    break;
                
                int tmp = heapVector.Get(pos);
                int largest = heapVector.Get(largestChild);
                heapVector.Set(index: pos, e: largest);
                heapVector.Set(index: largestChild, e: tmp);
                pos = largestChild;
            }
        }

        public void Replace(int oldElem, int newElem)
        {
            int index = heapVector.IndexOf(oldElem);
            if (index == -1)
                throw new IndexOutOfRangeException("Данного индекса не существует");
            heapVector.Set(index, newElem);
            Heapify(0);
            
        }


        public int GetMax() => heapVector.Get(0);

        public void RemoveMaxMin() => heapVector.RemoveElementAlt(1);

        public MyVector<int> toHeap() => heapVector;

        public void MergeHeap(Heap heap)
        {
            for (int i = 0; i < heap.toHeap().Size(); i++)
                Add(heap.toHeap().Get(i));
            
            for (int pos = heapVector.Size() / 2; pos >= 0; pos--)
                Heapify(pos);

        }
        
    }
}