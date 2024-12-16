using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_18
{
    public class Task18
    {
        public static void RunTask18(string[] args)
        {
            var map = new MyHashMap<string, int>();
            map.Put("apple", 10);      
            map.Put("banana", 20);     
            map.Put("apple", 15);    

            int value = map.Get("apple");  
            bool removed = map.Remove("banana");
            bool contains = map.ContainsKey("banana");
            Console.WriteLine(value);
            Console.WriteLine(removed);
            Console.WriteLine(contains);
            map.EntrySet();
            foreach (var elem in map.KeySet())
            {
                Console.Write($"{elem} ");
            }
        }
    }
}