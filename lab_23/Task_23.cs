using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_23
{
    public class Task23
    {
        public static void RunTask23(string[] args)
        {
            MyHashSet<int> hashSet = new MyHashSet<int>();

            Console.WriteLine("Test 1: Проверка на пустой набор");
            Console.WriteLine(hashSet.IsEmpty() ? "Пройден" : "Не пройден");

            Console.WriteLine("Test 2: Добавление элемента");
            hashSet.Add(10);
            Console.WriteLine(hashSet.Size() == 1 ? "Пройден" : $"Не пройден {hashSet.Size()}");

             hashSet.Print();

            Console.WriteLine("Test 3: Проверка наличия элемента");
            Console.WriteLine(hashSet.Contains(10) ? "Пройден" : $"Не пройден {hashSet.Contains(10)}");
            Console.WriteLine(!hashSet.Contains(20) ? "Пройден" : "Не пройден");
    
            Console.WriteLine("Test 4: Добавление массива элементов");
            hashSet.AddAll(new int[] { 20, 30, 40 });
            Console.WriteLine(hashSet.Size() == 4 ? "Пройден" : $"Не пройден {hashSet.Size()}");

             hashSet.Print();

            Console.WriteLine("Test 5: Проверка ContainsAll");
            bool[] containsAllTest = hashSet.ContainsAll(new int[] { 10, 20, 50 });
            Console.WriteLine((containsAllTest[0] && containsAllTest[1] && !containsAllTest[2]) ? "Пройден" : $"Не пройден {containsAllTest[0]}");

            Console.WriteLine("Test 6: Удаление элементов");
            hashSet.RemoveAll(new int[] { 10, 20 });
            Console.WriteLine(hashSet.Size() == 2 ? "Пройден" : $"Не пройден {hashSet.Size()}");
            
             hashSet.Print();

            Console.WriteLine("Test 7: RetainAll");
            hashSet.RetainAll(new int[] { 30 });
            Console.WriteLine(hashSet.Size() == 1 && hashSet.Contains(30) ? "Пройден" : "Не пройден");

             hashSet.Print();

            Console.WriteLine("Test 8: Clear");
            hashSet.Clear();
            Console.WriteLine(hashSet.IsEmpty() ? "Пройден" : "Не пройден");

            hashSet.Print();

            Console.WriteLine("Test 9: Проверка First и Last");
            hashSet.AddAll(new int[] { 50, 10, 30, 40 });
            Console.WriteLine(hashSet.First() == 10 ? "Пройден" : $"Не пройден {hashSet.First()}");
            Console.WriteLine(hashSet.Last() == 50 ? "Пройден" : $"Не пройден {hashSet.Last()}");
            
            hashSet.Print();

            Console.WriteLine("Test 10: SubSet");
            int[] subset = hashSet.SubSet(10, 40);
            Console.WriteLine(subset.Length == 1 && subset[0] == 30 ? "Пройден" : "Не пройден");

            Console.WriteLine("Test 11: HeadSet");
            int[] headset = hashSet.HeadSet(30);
            Console.WriteLine(headset.Length == 1 && headset[0] == 10 ? "Пройден" : "Не пройден");

            Console.WriteLine("Test 12: TailSet");
            int[] tailset = hashSet.TailSet(30);
            Console.WriteLine(tailset.Length == 2 && tailset[0] == 50 && tailset[1] == 40 ? "Пройден" : "Не пройден");

            Console.WriteLine("\nВсе тесты завершены.");
        }
    }
}