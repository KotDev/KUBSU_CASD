using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_16
{
    public class Task16
    {
        public static void RunTask16(string[] args)
        {
            MyLinkedList<int> list = new MyLinkedList<int>();

            Console.WriteLine("Проверка конструктора по умолчанию:");
            Console.WriteLine("Размер списка: " + list.Size());
            PrintList(list);

            Console.WriteLine("\nДобавление элементов:");
            list.Add(10);
            list.Add(20);
            list.Add(30);
            Console.WriteLine("Размер после добавления элементов: " + list.Size());
            Console.WriteLine("Первый элемент: " + list.GetFirst);
            Console.WriteLine("Последний элемент: " + list.GetLast);
            PrintList(list);

            Console.WriteLine("\nПроверка конструктора с массивом:");
            int[] array = { 1, 2, 3, 4, 5 };
            MyLinkedList<int> listFromArray = new MyLinkedList<int>(array);
            Console.WriteLine("Размер списка: " + listFromArray.Size());
            Console.WriteLine("Первый элемент: " + listFromArray.GetFirst);
            Console.WriteLine("Последний элемент: " + listFromArray.GetLast);

            Console.WriteLine("\nДобавление элемента по индексу 2:");
            listFromArray.Add(2, 100);
            Console.WriteLine("Размер после вставки: " + listFromArray.Size());
            Console.WriteLine("Элемент на индексе 2: " + listFromArray.Get(2));
            PrintList(listFromArray);

            Console.WriteLine("\nУдаление элемента 100:");
            listFromArray.Remove(100);
            Console.WriteLine("Размер после удаления: " + listFromArray.Size());
            PrintList(listFromArray);

            Console.WriteLine("\nПроверка метода Contains:");
            Console.WriteLine("Список содержит элемент 3? " + listFromArray.Contains(3));
            Console.WriteLine("Список содержит элемент 100? " + listFromArray.Contains(100));
            PrintList(listFromArray);

            Console.WriteLine("\nПроверка метода GetIndex:");
            Console.WriteLine("Индекс элемента 4: " + listFromArray.GetIndex(4));
            Console.WriteLine("Индекс элемента 100: " + listFromArray.GetIndex(100));
            PrintList(listFromArray);

            Console.WriteLine("\nУдаление элемента по индексу 0:");
            listFromArray.Remove(0);
            Console.WriteLine("Размер после удаления: " + listFromArray.Size());
            Console.WriteLine("Первый элемент после удаления: " + listFromArray.GetFirst);
            PrintList(listFromArray);

            Console.WriteLine("\nДобавление элемента в начало:");
            listFromArray.AddFirst(999);
            Console.WriteLine("Первый элемент после добавления: " + listFromArray.GetFirst);
            PrintList(listFromArray);

            Console.WriteLine("\nИзвлечение первого элемента (PoolFirst):");
            Console.WriteLine("Извлеченный элемент: " + listFromArray.PoolFirst());
            Console.WriteLine("Первый элемент после извлечения: " + listFromArray.GetFirst);
            PrintList(listFromArray);

            Console.WriteLine("\nИзвлечение последнего элемента (PoolLast):");
            Console.WriteLine("Извлеченный элемент: " + listFromArray.PoolLast());
            Console.WriteLine("Последний элемент после извлечения: " + listFromArray.GetLast);
            PrintList(listFromArray);

            Console.WriteLine("\nУдаление всех элементов массива [2, 3]:");
            listFromArray.RemoveAll(new int[] { 2, 3 });
            Console.WriteLine("Размер после удаления: " + listFromArray.Size());
            PrintList(listFromArray);

            Console.WriteLine("\nДобавление всех элементов массива [7, 8, 9]:");
            listFromArray.AddAll(new int[] { 7, 8, 9 });
            Console.WriteLine("Размер после добавления: " + listFromArray.Size());
            PrintList(listFromArray);

            Console.WriteLine("\nПоследний индекс элемента 8: " + listFromArray.LastIndexOF(8));
            PrintList(listFromArray);

            Console.WriteLine("\nСохранение только элементов массива [8, 9]:");
            listFromArray.RetainAll(new int[] { 8, 9 });
            Console.WriteLine("Размер после сохранения: " + listFromArray.Size());
            PrintList(listFromArray);

            Console.WriteLine("\nПолучение подсписка (индексы 0 до 2):");
            int[] subList = listFromArray.SubList(0, 2);
            foreach (var item in subList)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();
            PrintList(listFromArray);
        }

        static void PrintList(MyLinkedList<int> list)
        {
            Console.WriteLine("Содержимое списка: ");
            foreach (var item in list.toArray())
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();
        }
    }
}