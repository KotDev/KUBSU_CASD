using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_18
{
    public class Entry<TKey, TValue> 
    {
        public TKey key;
        public TValue value;
        public Entry<TKey, TValue>? next;

        public Entry(TKey key, TValue value)
        {
            this.value = value;
            this.key = key;
            this.next = null;
        }
    }


    public class MyHashMap<TKey, TValue> 
    {
        Entry<TKey, TValue> [] table;
        int size;
        double loadfactor;

        public MyHashMap()
        {
            this.table = new Entry<TKey, TValue>[16];
            size = 0;
            loadfactor = 0.75;
        }

        public MyHashMap(int initialCapacity)
        {
            this.table = new Entry<TKey, TValue>[initialCapacity];
            size = 0;
            loadfactor = 0.75;
        }

        public MyHashMap(int initialCapacity, float loadFactor)
        {
            this.table = new Entry<TKey, TValue>[initialCapacity];
            size = 0;
            loadfactor = loadFactor;
        }

        int hash(TKey key)
        {
            int h = key.GetHashCode();
            h ^= (h >>> 20) ^ (h >>> 12);
            return h ^ (h >>> 7) ^ (h >>> 4);
        }

        public int indexFor(int h, int len)
        {
            return h & (len - 1);
        }

        void resize()
        {
            int newCapacity = table.Length * 2;
            Entry<TKey, TValue>[] newTable = new Entry<TKey, TValue>[newCapacity];

            foreach (var elem in table)
            {
                Entry<TKey, TValue> current = elem;
                while (current != null)
                {
                    Entry<TKey, TValue> next = current.next;
                    int newIndex = indexFor(hash(current.key), newCapacity);

                    current.next = newTable[newIndex];
                    newTable[newIndex] = current;

                    current = next;
                }
            }

            table = newTable;
        }



        public void Clear() {size = 0; table = new Entry<TKey, TValue>[16];}

        public void Put(TKey key, TValue value)
        {
            int hashValue = hash(key);
            int index = indexFor(hashValue, table.Length);
            Entry<TKey, TValue> elem = table[index];
            while (elem != null)
            {
                if (elem.key.Equals(key))
                {
                    elem.value = value;
                    return;
                }
                elem = elem.next;
            }

            Entry<TKey, TValue> newEntry = new Entry<TKey, TValue>(key, value);
            newEntry.next = table[index];
            table[index] = newEntry;
            size++;

            if (size == table.Length)
                resize();
        }

        public bool Remove(TKey key)
        {
            int hashValue = hash(key);
            int index = indexFor(hashValue, table.Length);
            Entry<TKey, TValue> current = table[index];
            Entry<TKey, TValue> previous = null;

            while (current != null)
            {
                if (current.key.Equals(key))
                {
                    if (previous == null)
                    {
                        table[index] = current.next;
                    }
                    else
                    {
                        previous.next = current.next;
                    }
                    size--;
                    return true;
                }
                previous = current;
                current = current.next;
            }
            return false;
        }

        public TValue? Get(TKey key)
        {
            int hashValue = hash(key);
            int index = indexFor(hashValue, table.Length);
            Entry<TKey, TValue> current = table[index];

            while (current != null)
            {
                if (current.key.Equals(key))
                {
                    return current.value;
                }
                current = current.next;
            }

            return default;
        }

        public bool ContainsKey(TKey key)
        {
            var value = Get(key); 
            return !EqualityComparer<TValue>.Default.Equals(value, default);
        }

        public bool IsEmpty() => size == 0;

        public int Size() => size;

        public TKey[] KeySet()
        {
            TKey[] keyset = new TKey[size];
            int i = 0;
            foreach (var key in table)
            {
                Entry<TKey, TValue> current = key;
                while (current != null)
                {
                    keyset[i] = current.key;
                    i++;
                    current = current.next;
                }
            }
            return keyset;
        }

        public void KeySetPrint()
        {
           foreach (var key in table)
            {
                Entry<TKey, TValue> current = key;
                while (current != null)
                {
                    Console.Write($"{key.key} ");
                    current = current.next;
                }
            }  
        }

        public bool ContainsValue(object value)
        {
            foreach (var key in table)
            {
                Entry<TKey, TValue> current = key;
                while (current != null)
                {
                    if (key.value.Equals(value))
                        return true;
                    current = current.next;
                }
            }
            return false;
        }

        public void EntrySet()
        {
            foreach (var key in table)
            {
                Entry<TKey, TValue> current = key;
                while (current != null)
                {
                    Console.WriteLine($"{current.key}:{current.value}");
                    current = current.next;
                }
            }
        }
    }
}