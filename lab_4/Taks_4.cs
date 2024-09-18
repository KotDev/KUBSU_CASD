using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_4;

    class Task4
    {

        public static void RunTask4(string[] args)
        {
            MyArraryList<int> myList = new MyArraryList<int>();
            myList.Add(1);
            myList.Add(2);
            myList.Add(3);
            myList.Add(4);
            myList.Add(5);
            myList.Add(6);
            myList.Add(7);
            myList.Add(8);
            myList.Add(9);

            int[] subList = myList.SubList(2, 5);
            Console.WriteLine("Прямой диапазон (2 to 5): " + string.Join(", ", subList));

            int[] reverseSubList = myList.SubList(-2, -5);
            Console.WriteLine("Обратный диапазон как в Python (-2 to -5): " + string.Join(", ", reverseSubList));

            int[] subListNegative = myList.SubList(-7, -3);
            Console.WriteLine("Обратный диапазон как в Python (-7 to -3): " + string.Join(", ", subListNegative));

            {
            myList = new MyArraryList<int>();
            myList.Add(1);
            myList.Add(2);
            myList.Add(3);
            Console.WriteLine("Текущий лист: " + string.Join(", ", myList.toArray()));

            int[] elementsToAdd = { 4, 5, 6 };
            myList.AddAll(elementsToAdd);
            Console.WriteLine("Добавили {4, 5, 6} в конец: " + string.Join(", ", myList.toArray()));

            myList.Remove(o: 2);
            Console.WriteLine("Удалили объект '2': " + string.Join(", ", myList.toArray()));

            bool containsFive = myList.Contains(5);
            Console.WriteLine("Проверили существования объекта '5': " + containsFive);

            int[] elementsToRemove = { 1, 4 };
            myList.RemoveAll(elementsToRemove);
            Console.WriteLine("Удалили элементы из массива (1, 4): " + string.Join(", ", myList.toArray()));

            myList.Clear();
            Console.WriteLine("Очистили лист: " + (myList.isEmpty() ? "Empty" : string.Join(", ", myList.toArray())));
        }

        }
    }
