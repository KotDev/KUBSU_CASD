using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_10
{
    public class Task10
    {
        public static void RunTask10(string[] args)
        {

            int[] initialArray = { 5, 3, 8, 1, 9, 2, 6, 4, 7 };
            Heap heap = new Heap(initialArray);

            Console.WriteLine("Куча после создания:");
            Console.WriteLine(string.Join(", ", heap.toHeap().toArray()));

            Console.WriteLine("\nДобавление элемента 10:");
            heap.Add(10);
                Console.WriteLine(string.Join(", ", heap.toHeap().toArray()));

  
            Console.WriteLine("\nЗамена элемента 8 на 11:");
            heap.Replace(8, 11);
            Console.WriteLine(string.Join(", ", heap.toHeap().toArray()));

            Console.WriteLine("\nМаксимальный элемент:");
            Console.WriteLine(heap.GetMax());

            Console.WriteLine("\nУдаление максимального элемента:");
            heap.RemoveMaxMin();

            Heap heap2 = new Heap(new int[] { 10, 12, 1, 15 });
            Console.WriteLine("\nСлияние с кучей:");
            heap.MergeHeap(heap2);
            Console.WriteLine(string.Join(", ", heap.toHeap().toArray()));

        }
    }
}