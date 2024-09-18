using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_4
{
    public class MyArraryList<T>
    {
        T[] elementData;
        int size;

        public MyArraryList()
        {
            this.elementData = new T[0];
            this.size = 0;
        }

        public MyArraryList(T[] newElementData)
        {
            int i = 0;
            this.elementData = new T[newElementData.Length];
            foreach (var item in newElementData)
            {
                this.elementData[i] = item;
                i++;
            }
            this.size = elementData.Length;
        }

        public MyArraryList(int capacity)
        {
            this.elementData = new T[capacity];
            this.size = 0;
        }

        private void Expand()
        {
            T[] newElementData = new T[Convert.ToInt32(elementData.Length * 1.5) + 1];
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
            if (size == elementData.Length)
            {
                Expand();
            }
            elementData[size] = e;
            size += 1;
        }

        public void AddAll(T[] a)
        {
             foreach(var elem in a)
                Add(elem);
        }

        public void Clear()
        {
            size = 0;
            elementData = new T[0];
        }

        public bool isEmpty() => size == 0;


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
            size -= 1;
        }

        public void RemoveAll(T[] a)
        {
            foreach (var elem in a)
            {
                if (elem != null)
                Remove(elem);
            }
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

        public int Size() => size;

        public T[] toArray() => elementData;


        public T[] toArray(T[] a)
        {
            if (a == null || a.Length < size)
                a = new T[size];

            for (int i = 0; i < elementData.Length; i++)
                a[i] = elementData[i];
            
            if (a.Length > size)
                a[size] = default(T);
            return a;
        }

        public void Add(int index, T e)
        {
            if (index > elementData.Length || index < 0)
                throw new IndexOutOfRangeException("Недопустимый индекс");

            if (size == elementData.Length)
                Expand();

            for (int i = size; i > index; i--)
            {
                elementData[i] = elementData[i - 1];
            }
            elementData[index] = e;
            size += 1;
        }

        public void AddAll(int index, T[] a)
        {
            foreach (var elem in a)
            {
                Add(index, elem);
            }
        }

        public T? Get(int index)
        {
            if (index > elementData.Length)
                throw new IndexOutOfRangeException($"Вы вышли за границы масиива. Длинна массива {elementData.Length} последний индекс {elementData.Length - 1}");
            return elementData[index];
        }

        public int LastIndexOf(object o) => SearchIndex(o);
        
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
            if (index > size)
                throw new IndexOutOfRangeException("По указанному индексу не нашлось заменяемого элемента");
            elementData[index] = e;
        }

        public T[] SubList(int fromIndex, int toIndex)
        {
            if (fromIndex < 0) fromIndex = size + fromIndex;
            if (toIndex < 0) toIndex = size + toIndex;

            if (fromIndex < 0 || toIndex < 0 || fromIndex >= size || toIndex > size)
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
    }
}