using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_14
{
    public class Task14
    {
        public static void RunTask14(string[] args)
        {
            Console.WriteLine("Тестирование MyArrayDeque<T>\n");


            MyArrayDeque<int> deque = new MyArrayDeque<int>();


            Console.WriteLine("Добавление элементов с помощью Add:");
            deque.Add(10);
            deque.Add(20);
            deque.Add(30);
            PrintQueue(deque);

            Console.WriteLine("\nДобавление элементов с помощью AddAll:");
            int[] additionalElements = { 40, 50, 60 };
            deque.AddAll(additionalElements);
            PrintQueue(deque);


            Console.WriteLine("\nДобавление элемента в начало с помощью AddFirst:");
            deque.AddFirst(5);
            PrintQueue(deque);

            Console.WriteLine("\nДобавление элемента в конец с помощью AddLast:");
            deque.AddLast(70);
            PrintQueue(deque);

            Console.WriteLine("\nДобавление элемента с помощью Offer:");
            bool offerResult = deque.Offer(80);
            Console.WriteLine($"Offer(80) успешно: {offerResult}");
            PrintQueue(deque);

            Console.WriteLine("\nДобавление элемента в начало с помощью OfferFirst:");
            bool offerFirstResult = deque.OfferFirst(2);
            Console.WriteLine($"OfferFirst(2) успешно: {offerFirstResult}");
            PrintQueue(deque);

    
            Console.WriteLine("\nДобавление элемента в конец с помощью OfferLast:");
            bool offerLastResult = deque.OfferLast(90);
            Console.WriteLine($"OfferLast(90) успешно: {offerLastResult}");
            PrintQueue(deque);

  
            Console.WriteLine("\nПроверка наличия элемента 20 с помощью Contains:");
            bool contains20 = deque.Contains(20);
            Console.WriteLine($"Contains(20): {contains20}");

            Console.WriteLine("Проверка наличия элемента 100 с помощью Contains:");
            bool contains100 = deque.Contains(100);
            Console.WriteLine($"Contains(100): {contains100}");

  
            Console.WriteLine("\nПроверка наличия всех элементов массива {20, 40, 100} с помощью ContainsAll:");
            int[] checkElements = { 20, 40, 100 };
            bool[] containsAll = deque.ContainsAll(checkElements);
            for (int i = 0; i < checkElements.Length; i++)
            {
                Console.WriteLine($"Contains({checkElements[i]}): {containsAll[i]}");
            }

            Console.WriteLine("\nУдаление элемента 30 с помощью Remove:");
            deque.Remove(30);
            PrintQueue(deque);

            Console.WriteLine("\nУдаление первого вхождения элемента 20 с помощью RemoveFirstOccurrence:");
            bool removedFirst20 = deque.RemoveFirstOccurrence(20);
            Console.WriteLine($"RemoveFirstOccurrence(20): {removedFirst20}");
            PrintQueue(deque);
        }

        static void PrintQueue(MyArrayDeque<int> queue)
        {
            Console.WriteLine("Содержимое очереди: ");
            foreach (var item in queue.toArray())
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();
        }
    }
}