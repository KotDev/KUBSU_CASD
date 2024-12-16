using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using KUBSU_CASD.lab_18;

namespace KUBSU_CASD.lab_23
{

    public class MyHashSet<T> where T: IComparable
    {
        MyHashMap<T, T> map = new MyHashMap<T, T>();
        int size;
        double loadfactor;

        public MyHashSet()
        {
            map = new MyHashMap<T, T>(16);
            size = 0;
            loadfactor = 0.75;
        }

        public MyHashSet(int initialCapacity)
        {
            map = new MyHashMap<T, T>(initialCapacity);
            size = 0;
            loadfactor = 0.75;
        }

        public MyHashSet(int initialCapacity, float loadFactor)
        {
            map = new MyHashMap<T, T>(initialCapacity, loadFactor);
            size = 0;
            loadfactor = loadFactor;
        }

        public void Print() => map.KeySetPrint();


        public void Clear() {size = 0; map = new MyHashMap<T, T>(16);}

        public void Add(T elem)
        {
            if (Contains(elem))
                return;
            map.Put(elem, elem);
            size = map.Size();
        }

        public void AddAll(T[] elems)
        {
            foreach (var elem in elems)
                Add(elem);
        }

        
        public bool Contains(T elem)
        {
            var value = map.Get(elem); 
            return !EqualityComparer<T>.Default.Equals(value, default);
        }

        public bool[] ContainsAll(T[] elems)
        {
            bool[] boolElems = new bool[elems.Length];
            int i = 0;
            foreach(var elem in elems)
            {
                if (Contains(elem))
                    boolElems[i] = true;
                else
                    boolElems[i] = false;
                i++;
            }
            return boolElems;
        }

        public void RemoveAll(T[] elems)
        {
            foreach (var elem in elems)
            {
                if (Contains(elem))
                {
                    map.Remove(elem);
                    size = map.Size();
                }
            }
        }

        public void RetainAll(T[] elems)
        {
            T[] keys = map.KeySet();
            foreach (var key in keys)
            {
                foreach (var elem in elems)
                {
                    if (!key.Equals(elem))
                        {
                            map.Remove(key);
                            size = map.Size();
                        }
                }

            }
        }

        public T[] ToArray() => map.KeySet();

        public T? First()
        {
            if (IsEmpty())
                return default;
            T[] keys = map.KeySet();
            T min = keys[0];
            foreach(var elem in keys)
            {
                if (elem.CompareTo(min) < 0)
                    min = elem;
            }
            return min;
        }

        public T? Last()
        {
            if (IsEmpty())
                return default;
            T[] keys = map.KeySet();
            T max = keys[0];
            foreach(var elem in keys)
            {
                if (elem.CompareTo(max) > 0)
                    max = elem;
            }
            return max;
        }

        public bool IsEmpty() => size == 0;

        public int Size() => size;

        public T[] SubSet(T start, T stop)
        {
            bool flag = false;
            T[] keys = map.KeySet();
            int starts = 0, stops = 0; 
            for (int i = 0; i < keys.Length; i++)
            {
                if (keys[i].CompareTo(start) == 0)
                    starts = i;
                else if (keys[i].CompareTo(stop) == 0)
                    stops = i;
            }
            if (starts == 0 && stops == 0)
                throw new IndexOutOfRangeException("SubSet Error index Start and Stop is not found in set");
            T[] result = new T[Math.Abs(starts - stops)];
            int j = 0;
            foreach(var elem in keys)
            {
                if (flag)
                    result[j] = elem;
                if (elem.CompareTo(start) == 0)
                    flag = true;
                if (elem.CompareTo(stop) == 0)
                    flag = false;
            }
            return result;
        }

        public T[] HeadSet(T toElement)
        {
            T[] keys = map.KeySet();
            int i = 0;
            foreach (var elem in keys)
            {
                if (elem.CompareTo(toElement) < 0)
                    i++;
            }
            T[] result = new T[i];
            i = 0;
            foreach (var elem in keys)
            {
                if (elem.CompareTo(toElement) < 0)
                {
                    result[i] = elem;
                    i++;
                }
            }
            return result;
        }

        public T[] TailSet(T toElement)
        {
            T[] keys = map.KeySet();
            int i = 0;
            foreach (var elem in keys)
            {
                if (elem.CompareTo(toElement) > 0)
                    i++;
            }
            T[] result = new T[i];
            i = 0;
            foreach (var elem in keys)
            {
                if (elem.CompareTo(toElement) > 0)
                {
                    result[i] = elem;
                    i++;
                }
            }
            return result;
        }
    }
}