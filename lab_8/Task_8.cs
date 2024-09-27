using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_8
{
    public class Task8
    {
        public static void RunTask8(string[] args)
        {
            MyStack<int> stack = new MyStack<int>();
            stack.Push(10);
            stack.Push(20);
            stack.Push(30);


            Console.WriteLine($"Размер стека: {stack.Size()}");

            Console.WriteLine($"Верхний элемент стека: {stack.Peek()}");

            int poppedElement = stack.Pop();
            Console.WriteLine($"Извлеченный элемент: {poppedElement}");

            Console.WriteLine($"Размер стека после извлечения: {stack.Size()}");

            Console.WriteLine($"Стек пуст? {stack.Empty()}");

            stack.Push(40);

            Console.WriteLine($"Верхний элемент стека: {stack.Peek()}");

            int searchElement = 10;
            int position = stack.search(searchElement);
            Console.WriteLine($"Элемент {searchElement} находится на позиции: {position}");
        }
    }
}