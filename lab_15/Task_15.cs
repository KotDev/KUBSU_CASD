using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KUBSU_CASD.lab_14;

namespace KUBSU_CASD.lab_15
{
    public class Task15
    {
        private static int CheckNumsToString(string elem1, string elem2)
        {
            int numElem1 = 0;
            int numElem2 = 0;
            string numStringElem1 = "";
            string numStringElem2 = "";
            foreach (var elem in elem1)
            {
                if (elem <= '9' && elem >= '0')
                {
                    numElem1++;
                    numStringElem1 += elem;
                }
            }
            foreach (var elem in elem2)
            {
                if (elem <= '9' && elem >= '0')
                {
                    numElem2++;
                    numStringElem2 += elem;
                }
            }
            if (numElem1 < numElem2)
                return -1;
            else if (numElem1 > numElem2)
                return 1;
            else
                {
                    if (Convert.ToInt32(numStringElem1) < Convert.ToInt32(numStringElem2))
                        return - 1;
                    else if (Convert.ToInt32(numStringElem1) > Convert.ToInt32(numStringElem2))
                        return 1;
                    else
                        return 0;
                }
        }

        public static void RunTask15(string[] args)
        {
            StreamReader reader = new StreamReader("lab_15/task-15.txt");
            MyArrayDeque<string> deque = new MyArrayDeque<string>();
            while (!reader.EndOfStream)
            {
                string? line = reader.ReadLine();
                if (line is null)
                    continue;
                if (deque.isEmpty())
                {
                    deque.Add(line);
                    continue;
                }
                string elem2 = deque.GetFirst();
                string elem1 = line;
                if (CheckNumsToString(elem1, elem2) == 1)
                    deque.AddFirst(elem1);
                else
                    deque.AddLast(elem1);
            }
            reader.Close();
            StreamWriter writer = new StreamWriter("lab_15/sorted.txt");
            for (int i = 0; i <= deque.Size(); i++)
            {
                writer.WriteLine(deque.toArray()[i]);
            }
            writer.Close();
            Console.WriteLine("Введите целое N (кол-во пробелов в строке): ");
            int n = 0;
            string? N = Console.ReadLine();
            try
            {
                n = Convert.ToInt32(N);
            }
            catch (Exception)
            {
                throw new TypeUnloadedException("Введите целое число, ошибка преобразований типов");
            }
            
            for (int i = 0; i < deque.Size(); i++)
            {
                string elemDeque = deque.toArray()[i];        
                if (elemDeque.Split(' ').Length - 1 > n)
                    deque.Remove(elemDeque);
            }
            if (deque.isEmpty())
                Console.WriteLine("Очередь пуста все элементы удалены");
            for (int i = 0; i < deque.Size(); i++)
            {
                Console.WriteLine(deque.toArray()[i]);
            }
        }
    }
}