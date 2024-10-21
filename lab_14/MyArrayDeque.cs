using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_14
{
    public class MyArrayDeque<T>
    {
        T[] elements;
        int head = 0;
        int tail = -1;
        int count = 0;

        public MyArrayDeque()
        {
            this.elements = new T[16];
        }
        
        public MyArrayDeque(T[] a)
        {
            this.elements = new T[a.Length];
            int i = 0;
            foreach (var elem in a)
            {
                this.elements[i] = elem;
                i++;
            }
            tail = i;
        }

        public MyArrayDeque(int numElements)
        {
            if (numElements > 0)
                this.elements = new T[numElements];
            else
                throw new SizeException("Ошибка размерности введите положительную отличное от 0 размерность");
        }

        private void Expand()
        {
            T[] elementsCopy = (T[])elements.Clone();
            elements = new T[count * 2];
            int i = 0;
            foreach (var elem in elementsCopy)
            {
                elements[i] = elem;
                i++;
            }
        }


        public void Add(T e)
        {
            if (tail == elements.Length - 1)
                Expand();
            elements[tail + 1] = e;
            tail ++;
            count ++;
        }

        public void AddAll(T[] a)
        {
            foreach (var elem in a)
            {
                Add(elem);
            }
        }

        public void Clear() {elements = new T[elements.Length]; tail = -1; head = 0; count = 0;}

        public bool Contains(T o) => elements.Contains(o);

        public bool[] ContainsAll(T[] a)
        {
            int i = 0;
            bool[] boolElems = new bool[a.Length];
            foreach (var elem in a)
            {
                if (Contains(elem))
                    boolElems[i] = true;
                else
                    boolElems[i] = false;
                i++;
            }
            return boolElems;
        }

        public bool isEmpty() => count == 0;

        private int SearchIndex(object o)
        {
            int i = 0;
            foreach (var elem in elements)
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

            index -= head;

            if (index == 0)
            {
                elements[head] = default(T);
                head++;
                if (head > tail)
                {
                    head = 0;
                    tail = -1;
                }
                count--;
                return;
            }

            for (int i = index + head; i < tail; i++)
            {
                elements[i] = elements[i + 1];
            }
            elements[tail] = default(T);
            tail--;
            count--;
        }

        public void RemoveAll(T[] a)
        {
            foreach (var elem in a)
            {
                if (elem != null)
                Remove(elem);
            }
        }

        public int Size() => count;

        public T[] toArray() => elements;


        public T[] toArray(T[] a)
        {
            if (a == null || a.Length < elements.Length)
                a = new T[elements.Length];

            for (int i = 0; i < elements.Length; i++)
                a[i] = elements[i];
            
            if (a.Length > elements.Length)
                a[tail] = default(T);
            return a;
        }


        public void RetaineAll(T[] a)
        {
            foreach (var elem in a)
            {
                foreach (var elem2 in elements)
                {
                    if (elem != null && elem2 != null && !elem.Equals(elem2))
                        Remove(elem2);
                }
            }
        }

        public T? Element() => elements[head];

        public bool Offer(T obj)
        {
            try {Add(obj); return true;}
            catch (Exception) {return false;}
        }

        public void AddFirst(T obj)
        {
            if (isEmpty())
            {
                elements[0] = obj;
                head = 0;
                tail = 0;
                count = 1;
                return;
            }

            if (head == 0)
            {
                if (tail == elements.Length - 1)
                    Expand();
                for (int i = tail; i >= head; i--)
                {
                    elements[i + 1] = elements[i];
                }
                tail++;
            }
            else
            {
                head--;
            }

            elements[head] = obj;
            count++;
        }



        public void  AddLast(T obj)
        {
            if (tail == elements.Length - 1)
            {
                Expand();
            }
            elements[tail + 1] = obj;
            tail ++;
            count ++;
        } 

        public bool OfferFirst(T obj)
        {
            try {AddFirst(obj); return true;}
            catch (Exception) {return false;}
        }

        public bool OfferLast(T obj)
        {
            try {AddLast(obj); return true;}
            catch (Exception) {return false;}
        }

        public T PollFirst()
        {   
            if (isEmpty())
                throw new InvalidOperationException("Очередь пуста");
            
            T elem = elements[head];
            elements[head] = default(T);
            head++;
            count--;

            if (head > tail)
            {
                head = 0;
                tail = -1;
            }

            return elem;
        }



        public T PollLast()
        {
            if (isEmpty())
                throw new PoolException("Очередь пуста");
            T elem = elements[tail];
            tail --;
            return elem;
        }

        public T GetFirst() => elements[head];

        public T GetLast() => elements[tail];


        public bool RemoveLastOccurrence(object o)
        {
            int index = -1;
            for (int i = 0; i < elements.Length; i++)
            {
                if (elements[i] != null && elements[i].Equals(o))
                    index = i;
            }
            if (isEmpty() || index == -1)
                return false;

            index -= head;

            if (index == 0)
            {
                elements[head] = default(T);
                head++;
                if (head > tail)
                {
                    head = 0;
                    tail = -1;
                }
                count--;
                return true;
            }

            for (int i = index + head; i < tail; i++)
            {
                elements[i] = elements[i + 1];
            }
            elements[tail] = default(T);
            tail--;
            count--;
            return true;
        }

        public bool RemoveFirstOccurrence(object obj)
        {
            int index = SearchIndex(obj);
            if (isEmpty() || index == -1)
                return false;

            index -= head;

            if (index == 0)
            {
                elements[head] = default(T);
                head++;
                if (head > tail)
                {
                    head = 0;
                    tail = -1;
                }
                count--;
                return true;
            }

            for (int i = index + head; i < tail; i++)
            {
                elements[i] = elements[i + 1];
            }
            elements[tail] = default(T);
            tail--;
            count--;
            return true;
        }
    }
}