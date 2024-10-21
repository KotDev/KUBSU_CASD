using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_9
{
    public class Task9
    {
        public static void RunTask9(string[] args)
        {
            StreamReader reader = new StreamReader("lab_9/task-9.txt");
            string? line = reader.ReadLine();
            if (line == null)
            {
                Console.WriteLine("Выражение пусто");
                return;
            }
            try 
            {
                ReversePolishNotation notations = new ReversePolishNotation();
                string joinedArgs = string.Join(",", line);
                string g = notations.ToPostfix(joinedArgs);
                Console.WriteLine(g);
                double res = notations.Calc(g);
                Console.WriteLine(res);
            }
            
            catch (Exception e)
            {
                Console.WriteLine($"Ошибка: {e}"); 
            }
        }
        
    }
}