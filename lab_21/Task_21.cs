using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_21
{
    public class Task21
    {
        public static void RunTask21(string[] args)
        {
            Comparer<int> cmp = new IntComparer();
            var treeMap = new MyTreeMap<int, string>(cmp);

            
            treeMap.Put(10, "A");
            treeMap.Put(20, "B");
            treeMap.Put(5, "C");

            Console.WriteLine("Тест Put и Get:");
            Console.WriteLine(treeMap.Get(10) == "A" ? "Пройден" : "Не пройден");
            Console.WriteLine(treeMap.Get(20) == "B" ? "Пройден" : "Не пройден");
            Console.WriteLine(treeMap.Get(5) == "C" ? "Пройден" : "Не пройден");
            Console.WriteLine(treeMap.Get(15) == null ? "Пройден" : "Не пройден");

            
            Console.WriteLine("\nТест ContainsKey и ContainsValue:");
            Console.WriteLine(treeMap.ContainsKey(10) ? "Пройден" : "Не пройден");
            Console.WriteLine(treeMap.ContainsValue("A") ? "Пройден" : "Не пройден");
            Console.WriteLine(!treeMap.ContainsKey(30) ? "Пройден" : "Не пройден");
            Console.WriteLine(!treeMap.ContainsValue("Z") ? "Пройден" : "Не пройден");

            
            treeMap.Remove(10);
            Console.WriteLine("\nТест Remove:");
            Console.WriteLine(!treeMap.ContainsKey(10) ? "Пройден" : "Не пройден");
            Console.WriteLine(treeMap.Size() == 2 ? "Пройден" : $"Не пройден");

            Console.WriteLine("\nТест специальных методов LowerKey, FloorKey, HigherKey, CeilingKey:");
            Console.WriteLine(treeMap.LowerKey(10) == 5 ? "Пройден" : $"Не пройден {treeMap.LowerKey(10)}");
            Console.WriteLine(treeMap.FloorKey(10) == 5 ? "Пройден" : "Не пройден");
            Console.WriteLine(treeMap.HigherKey(10) == 20 ? "Пройден" : "Не пройден");
            Console.WriteLine(treeMap.CeilingKey(20) == 20 ? "Пройден" : $"Не пройден {treeMap.LowerKey(10)}");

            
            Console.WriteLine("\nТест методов PollFirstEntry, PollLastEntry, FirstEntry, LastEntry:");
            Console.WriteLine(treeMap.FirstEntry()?.key == 0 ? "Пройден" : $"Не пройден {treeMap.FirstEntry()?.key}");
            Console.WriteLine(treeMap.LastEntry()?.key == 20 ? "Пройден" : $"Не пройден {treeMap.LastEntry()?.key}");

            var firstPolled = treeMap.PollFirstEntry();
            Console.WriteLine(firstPolled?.key == 0 ? "Пройден" : "Не пройден");
            Console.WriteLine(treeMap.FirstEntry()?.key == 5 ? "Пройден" : $"Не пройден {treeMap.FirstEntry()?.key}");

            var lastPolled = treeMap.PollLastEntry();
            Console.WriteLine(lastPolled?.key == 20 ? "Пройден" : "Не пройден");
            Console.WriteLine(treeMap.LastEntry()?.key == 5 ? "Пройден" : "Не пройден");

            Console.WriteLine(treeMap.Size() == 0 ? "Пройден" : $"Не пройден {treeMap.Size()}");

            Console.WriteLine("\nВсе тесты завершены.");
        }
    }
}