using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;
using KUBSU_CASD.lab_14;
using KUBSU_CASD.lab_15;

namespace KUBSU_CASD.lab_16
{
    public class ListElem<T>
    {
        public ListElem<T>? previous = null;
        public ListElem<T>? next = null;
        public T? value;
    }

    public class MyLinkedList<T>
    {
        ListElem<T> first;
        ListElem<T> last;
        int size = 0;
        public MyLinkedList()
        {
            this.first = new ListElem<T>();
            this.last = this.first;
            size++;
        }

    public MyLinkedList(T[] a)
    {
        if (a == null || a.Length == 0)
        {
            throw new ArgumentException("Массив не может быть пустым");
        }

        this.first = new ListElem<T>();
        this.last = first;
        first.value = a[0];
        size++; 

        for (int i = 1; i < a.Length; i++)
        {
            ListElem<T> second = new ListElem<T>();
            second.value = a[i];
            last.next = second;
            second.previous = last;
            last = second;
            size++;  
        }
    }
        

        public void Add(T e)
        {
            ListElem<T> second = new ListElem<T>();
            second.value = e;
            last.next = second;
            second.previous = last;
            last = second;
            size++;
        }

        public void AddAll(T[] a)
        {
            foreach (var elem in a)
            {
                Add(elem);
            }
        }

        public void Clear() {first = new ListElem<T>(); last = first; size = 0;}

        public bool Contains(object o)
        {
            ListElem<T> elem = first;
            while(elem != null)
            {
                if (elem.value != null && elem.value.Equals(o))
                    return true;
                elem = elem.next;
            }
            return false;
        }

        public bool[] ContainsAll(T[] a)
        {
            bool[] boolContains = new bool[a.Length];
            int i = 0;
            foreach (var elem in a)
            {
                boolContains[i] = Contains(elem);
                i++;
            }
            return boolContains;
        }

        bool isEmpty() => size == 0;

        public int GetIndex(T e)
        {
            ListElem<T> elem = first;
            int i = 0;
            while(elem != null)
            {
                if (elem.value != null && elem.value.Equals(e))
                    return i;
                i++;
                elem = elem.next;
            }
            return -1;
        }

    public void Remove(T e)
    {
        if (isEmpty())
            return;

        ListElem<T>? current = first;

        while (current != null)
        {
            if (current.value != null && current.value.Equals(e))
            {
                if (current.previous == null)
                {
                    first = current.next;
                    if (first != null)
                    {
                        first.previous = null;
                    }
                    else
                    {
                        last = null;
                    }
                }
                else
                {
                    current.previous.next = current.next;
                }

                if (current.next == null)
                {
                    last = current.previous;
                    if (last != null)
                    {
                        last.next = null;
                    }
                }
                else
                {
                    current.next.previous = current.previous;
                }

                size--;
                return;
            }

            current = current.next;
        }
    }


        public void RemoveAll(T[] a)
        {
            foreach (var elem in a)
            {
                Remove(elem);
            }
        }

        public void RetainAll(T[] a)
        {
            ListElem<T> current = first;

            while (current != null)
            {
                ListElem<T> nextElem = current.next;
                
                bool found = false;
                foreach (var elem in a)
                {
                    if (current.value != null && current.value.Equals(elem))
                    {
                        found = true;
                        break;
                    }
                }

                if (!found)
                {
                    Remove(current.value);
                }

                current = nextElem;
            }
        }
        public int Size() => size;

        public T[] toArray()
        {
            T[] array = new T[size];
            ListElem<T> current = first;
            int i = 0;
            while (current != null)
            {
                array[i] = current.value;
                current = current.next;
                i++;
            }
            return array;
        }

        public void AddFirst(T e)
        {
            ListElem<T> newElem = new ListElem<T>();
            newElem.value = e;
            if (isEmpty())
            {
                first = newElem;
                last = newElem;
            }
            else
            {
                newElem.next = first;
                first.previous = newElem;
                first = newElem;
            }
            size++;
        }

        public void AddLast(T e)
        {
            ListElem<T> newElem = new ListElem<T>();
            newElem.value = e;
            if (isEmpty())
            {
                first = newElem;
                last = newElem;
            }
            else
            {
                newElem.next = null;
                last.next = newElem;
                newElem.previous = last;
                last = newElem;
            }
            size++;
        }

        public void Add(int index, T e)
        {
            if (index < 0 || index > size)
                throw new IndexOutOfRangeException("Не допустимый индекс");
            int i = 0;
            ListElem<T> current = first;
            if (index == 0)
            {
                AddFirst(e);
                return;
            }
            else if (index == size)
            {
                AddLast(e);
            }
            while(current != null)
            {
                if (i == index)
                    {
                        ListElem<T> newElem = new ListElem<T>();
                        newElem.value = e;
                        newElem.next = current;
                        newElem.previous = current.previous;
                        current.previous.next = newElem;
                        current.previous = newElem;
                        size ++;
                        return;
                    }
                i++;
                current = current.next;
            }
            size++;
        }

        public void AddAll(int index, T[] a)
        {
            foreach(var elem in a)
            {   
                Add(index, elem);
            }
        }

        public T Get(int index) => toArray()[index];

        public int LastIndexOF(T e)
        {
            ListElem<T> elem = first;
            int i = 0;
            int lastIndex = -1;
            while(elem != null)
            {
                if (elem.value != null && elem.value.Equals(e))
                    lastIndex = i;
                i++;
                elem = elem.next;
            }
            if (lastIndex != -1)
                return lastIndex;
            return -1;
        }

    public void Remove(int index)
    {
        if (isEmpty())
            return;

        ListElem<T>? current = first;
        int i = 0;

        while (current != null)
        {
            if (index == i)
            {
                if (current.previous == null)
                {
                    first = current.next;
                    if (first != null)
                        first.previous = null;
                    else
                        last = null;
                }
                else
                {
                    current.previous.next = current.next;
                }

                if (current.next == null)
                {
                    last = current.previous;
                    if (last != null)
                        last.next = null;
                }
                else
                {
                    current.next.previous = current.previous;
                }

                size--;
                return;
            }
            current = current.next;
            i++;
        }
    }


        public void Set(int index, T e)
        {
            ListElem<T> elem = first;
            int i = 0;
            if (index < 0 || index > size)
            {
                throw new IndexOutOfRangeException("Не допустимый индекс");
            }
            while(elem != null)
            {
                if (index == i)
                {
                    elem.value = e;
                    return;
                }
                i++;
                elem = elem.next;
            }
        }

        public T? GetFirst => first.value;
        
        public T? GetLast => last.value;

        public T PoolLast()
        {
            if (isEmpty())
            {
                throw new PoolException("Список пуст");
            }
            ListElem<T> oldLast = last;
            ListElem<T> newLast = last.previous;
            if (first == last) 
            {
                first = null;
                last = null;
                return oldLast.value;
            }
            newLast.next = null;
            last = newLast;
            size--;
            return oldLast.value;
        }

        public T PoolFirst()
        {
            if (isEmpty())
            {
                throw new PoolException("Список пуст");
            }
            ListElem<T> oldFirst = first;
            ListElem<T> newFirst = first.next;
            if (first == last) 
            {
                first = null;
                last = null;
                return oldFirst.value;
            }
            newFirst.previous = null;
            first = newFirst;
            size--;
            return oldFirst.value;
        }
        
        public bool OfferLast(T obj)
        {
            try {AddLast(obj); return true;}
            catch (Exception) {return false;}
        }

        public bool OfferFirst(T obj)
        {
            try {AddFirst(obj); return true;}
            catch (Exception) {return false;}
        }

        public bool RemoveLastOccurrence(T obj)
        {
            int index = LastIndexOF(obj);
            if (index == -1)
                return false;
            Remove(index);
            return true;
        }

        public bool RemoveFirstOccurrence(T obj)
        {
            int index = GetIndex(obj);
            if (index == -1)
                return false;
            Remove(index);
            return true;
        }

        public bool Offer(T obj)
        {
            try {Add(obj); return true;}
            catch (Exception) {return false;}
        }

        public T[] SubList(int fromIndex, int toIndex)
        {
            if (Math.Abs(fromIndex - toIndex) > size || (fromIndex < 0 || toIndex < 0) || toIndex > size || isEmpty())
                throw new IndexOutOfRangeException("Не допустимый индекс");
            T[] array = new T[Math.Abs(fromIndex - toIndex)];
            T[] toArrayList = toArray();
            int j = 0;
            for (int i = fromIndex; i < toIndex; i++)
            {
                array[j] = toArrayList[i];
                j++;
            }
            return array;
        }

        }

    }