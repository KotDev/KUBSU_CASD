using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_11
{
    public class Task11
    {
        static void PrintQueue(MyPriorityQueue<int> queue)
        {
            Console.WriteLine("Содержимое очереди: ");
            foreach (var item in queue.ToArray())
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();
        }
        public static void RunTask11(string[] args)
        {
            PriorityQueueComparer<int> comparator = new ComparatorInt();
            MyPriorityQueue<int> priorityQueue = new MyPriorityQueue<int>(10, comparator);

            Console.WriteLine("Тестирование метода Add:");
            priorityQueue.Add(5);
            priorityQueue.Add(10);
            priorityQueue.Add(1);
            PrintQueue(priorityQueue);

            Console.WriteLine("Тестирование метода Peek:");
            Console.WriteLine("Первый элемент в очереди: " + priorityQueue.Peek());

            Console.WriteLine("Тестирование метода Pull:");
            Console.WriteLine("Извлечение первого элемента: " + priorityQueue.Pull());
            PrintQueue(priorityQueue);

            Console.WriteLine("Тестирование метода Remove:");
            try
            {
                priorityQueue.Remove(10);
                PrintQueue(priorityQueue);
            }
            catch (ContainsExeption ex)
            {
                Console.WriteLine(ex.Message);
            }

            Console.WriteLine("Тестирование метода Contains:");
            Console.WriteLine("Очередь содержит элемент 1: " + priorityQueue.Contains(1));

            Console.WriteLine("Тестирование метода Clear:");
            priorityQueue.Clear();
            PrintQueue(priorityQueue);

            Console.WriteLine("Тестирование метода AddAll:");
            priorityQueue.AddAll(new int[] { 3, 7, 2, 8 });
            PrintQueue(priorityQueue);

            Console.WriteLine("Тестирование метода ContainsAll:");
            bool[] containsAllResult = priorityQueue.ContainsAll(new int[] { 3, 7 });
            Console.WriteLine("Результаты ContainsAll для {3, 7}: ");
            foreach (var result in containsAllResult)
            {
                Console.Write(result + " ");
            }
            Console.WriteLine();

            Console.WriteLine("Тестирование метода RemoveAll:");
            try
            {
                priorityQueue.RemoveAll(new int[] { 3, 7 });
                PrintQueue(priorityQueue);
            }
            catch (ContainsExeption ex)
            {
                Console.WriteLine(ex.Message);
            }

            Console.WriteLine("Тестирование метода RetaineAll:");
            priorityQueue.AddAll(new int[] { 1, 9, 4 });
            priorityQueue.RetainAll(new int[] { 1, 4 });
            PrintQueue(priorityQueue);

            Console.WriteLine("Тестирование метода ToArray:");
            int[] array = priorityQueue.ToArray(new int[priorityQueue.Size()]);
            Console.WriteLine("Очередь в виде массива: ");
            foreach (var item in array)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();

            Console.WriteLine("Тестирование метода Offer:");
            Console.WriteLine("Добавление элемента через Offer: " + priorityQueue.Offer(6));
            PrintQueue(priorityQueue);
        }
    }
}