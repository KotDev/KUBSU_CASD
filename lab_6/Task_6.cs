using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_6
{
    public class Task6
    {
        public static void RunTask6(string[] args)
        {

            MyVector<int> vector = new MyVector<int>();
            
            Console.WriteLine("Добавление элементов в вектор:");
            vector.Add(1);
            vector.Add(2);
            vector.Add(3);
            PrintVector(vector);

            Console.WriteLine($"\nРазмер вектора: {vector.Size()}");

 
            Console.WriteLine($"\nСодержит ли вектор элемент 2? {vector.Contains(2)}");
            Console.WriteLine($"Содержит ли вектор элемент 5? {vector.Contains(5)}");


            Console.WriteLine($"\nЭлемент с индексом 1: {vector.Get(1)}");

 
            Console.WriteLine("\nДобавление элемента 5 на позицию 1:");
            vector.Add(1, 5);
            PrintVector(vector);


            Console.WriteLine("\nУдаление элемента на позиции 2:");
            vector.Remove(2);
            PrintVector(vector);


            Console.WriteLine("\nУдаление элемента 1:");
            vector.Remove(o: 1);
            PrintVector(vector);


            Console.WriteLine("\nПолучение подмассива с индексами 0-2:");
            var subList = vector.SubList(0, 2);
            PrintArray(subList);

            Console.WriteLine("\nОчищаем вектор:");
            vector.Clear();
            PrintVector(vector);

            Console.WriteLine($"\nВектор пуст? {vector.isEmpty()}");

            Console.ReadKey();
        }

        static void PrintVector(MyVector<int> vector)
        {
            Console.WriteLine("Текущий вектор:");
            for (int i = 0; i < vector.Size(); i++)
            {
                Console.Write(vector.Get(i) + " ");
            }
            Console.WriteLine();
        }

        static void PrintArray(int[] array)
        {
            Console.WriteLine("Подмассив:");
            foreach (var item in array)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();
        }
    }
}