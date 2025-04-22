using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_6
{
    public class MyVector<T>
    {
        T[] elementData;
        int elementCount;
        int capacityIncrement;

        public MyVector()
        {
            this.elementData = new T[10];
            this.elementCount = 0;
            this.capacityIncrement = 2;
        }

        public MyVector(int initalCapacity, int capacityIncrement)
        {
            this.elementData = new T[initalCapacity];
            this.elementCount = 0;
            this.capacityIncrement = capacityIncrement;
        }

        public MyVector(int initalCapacity)
        {
            this.elementData = new T[initalCapacity];
            this.elementCount = 0;
            this.capacityIncrement = 0;
        }

        public MyVector(T[] a)
        {
            this.elementData = new T[a.Length];
            int i = 0;
            foreach (var elem in a)
            {
                elementData[i] = elem;
                this.elementCount += 1;
                i++;
            }
            this.elementCount = 0;
        }

        private void Expand()
        {
            T[] newElementData = new T[elementData.Length * capacityIncrement];
            int i = 0;
            foreach (var item in elementData)
            {
                newElementData[i] = item;
                i++;
            }
            elementData = newElementData;
        }

        public void Add(T e)
        {
            if (elementCount == elementData.Length)
            {
                Expand();
            }
            elementData[elementCount] = e;
            elementCount += 1;
        }

        public void AddAll(T[] a)
        {
             foreach(var elem in a)
                Add(elem);
        }

        public void Clear()
        {
            elementCount = 0;
            elementData = new T[10];
        }

        public bool isEmpty() => elementCount == 0;


        public bool Contains(object o)
        {
            foreach (var elem in elementData)
            {
                if (elem != null && elem.Equals(o))
                    return true;
            }
            return false;
        }

        public bool[] ContainsAll(T[] a)
        {
            bool[] booleanElems = new bool[a.Length];
            for (int i = 0; i < a.Length; i++)
                booleanElems[i] = false;
            for (int i = 0; i < a.Length; i++)
            {
                for (int j = 0; j < elementData.Length - 1; j++)
                {
                    if (a[i] != null && elementData[j] != null && a[i].Equals(elementData[j]))
                        booleanElems[i] = true;
                }
            }
            return booleanElems;
        }

        private int SearchIndex(object o)
        {
            int i = 0;
            foreach (var elem in elementData)
            {
                if (elem != null && elem.Equals(o))
                    return i;
                i++;
            }
            return -1;
        }

        public void Remove(object o)
        {
            int index = SearchIndex(o);
            if (isEmpty() || index == -1)
                return;
            for (int i = index; i < elementData.Length - 1; i++)
            {
                elementData[i] = elementData[i + 1];
            }
            elementCount -= 1;
        }

        public void RemoveAll(T[] a)
        {
            foreach (var elem in a)
            {
                if (elem != null)
                Remove(elem);
            }
        }

         public T? Get(int index)
        {
            if (index > elementData.Length)
                throw new IndexOutOfRangeException($"Вы вышли за границы масиива. Длинна массива {elementData.Length} последний индекс {elementData.Length - 1}");
            return elementData[index];
        }

        public int IndexOf(object o) => SearchIndex(o);
        
        public T Remove(int index)
        {
            if (index > elementData.Length)
                throw new IndexOutOfRangeException($"Вы вышли за границы масиива. Длинна массива {elementData.Length} последний индекс {elementData.Length - 1}");
            T? elem = elementData[index];
            if (elem == null)
                throw new DeletedRowInaccessibleException("По указанному индексу не нашлось удаляемого элемента");
            Remove(elem);
            return elem;
        }

        public void Set(int index, T e)
        {
            if (index > elementCount)
                throw new IndexOutOfRangeException("По указанному индексу не нашлось заменяемого элемента");
            elementData[index] = e;
        }

        public void AddAll(int index, T[] a)
        {
            foreach (var elem in a)
            {
                Add(index, elem);
            }
        }

        public void Add(int index, T e)
        {
            if (index > elementData.Length || index < 0)
                throw new IndexOutOfRangeException("Недопустимый индекс");

            if (elementCount == elementData.Length)
                Expand();

            for (int i = elementCount; i > index; i--)
            {
                elementData[i] = elementData[i - 1];
            }
            elementData[index] = e;
            elementCount += 1;
        }

        public int Size() => elementCount;

        public T[] toArray() => elementData;


        public T[] toArray(T[] a)
        {
            if (a == null || a.Length < elementCount)
                a = new T[elementCount];

            for (int i = 0; i < elementData.Length; i++)
                a[i] = elementData[i];
            
            if (a.Length > elementCount)
                a[elementCount] = default(T);
            return a;
        }


        public void RetaineAll(T[] a)
        {
            foreach (var elem in a)
            {
                foreach (var elem2 in elementData)
                {
                    if (elem != null && elem2 != null && !elem.Equals(elem2))
                        Remove(elem2);
                }
            }
        }

        public T[] SubList(int fromIndex, int toIndex)
        {
            if (fromIndex < 0) fromIndex = elementCount + fromIndex;
            if (toIndex < 0) toIndex = elementCount + toIndex;

            if (fromIndex < 0 || toIndex < 0 || fromIndex >= elementCount || toIndex > elementCount)
                throw new IndexOutOfRangeException("Недопустимый диапазон индексов");

            int length = Math.Abs(toIndex - fromIndex);
            T[] subArray = new T[length];

            if (fromIndex < toIndex)
            {
                for (int i = fromIndex, j = 0; i < toIndex; i++, j++)
                {
                    if (elementData[i] != null)
                    subArray[j] = elementData[i];
                }
            }
            else
            {
                for (int i = fromIndex, j = 0; i > toIndex; i--, j++)
                {
                    if (elementData[i] != null)
                    subArray[j] = elementData[i];
                }
            }
            return subArray;
        }

        public T FirstElement() => elementData[0];

        public T LastElement() => elementData[elementCount];

        public void RemoveElementAlt(int pos) => Remove(pos - 1);

        public int LastIndexOf(object o)
        {
            int i = 0;
            int indexOf = -1;
            foreach (var elem in elementData)
            {
                if (elem != null && elem.Equals(o))
                    indexOf = i;
                i++;
            }
            return indexOf;
        }

        public void RemoveRange(int start, int end)
        {
            if (Math.Abs(start - end) > elementData.Length)
                throw new IndexOutOfRangeException("Диапазон индексов превышает длинну массива");
            if (start < 0 || end < 0)
                throw new InvalidExpressionException("Индексы не могут быть отрицательными");
            if (start > end)
            {
                int swap = start;
                start = end;
                end = start;
            }
            for (; start < end; start++);
                Remove(start);
        }
    }
}