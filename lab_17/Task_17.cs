using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_17
{
    public class Task17
    {
        public static void RunTask17(string[] args)
        {
            Generate generator = new Generate();

            Console.WriteLine("Avarage time for array:");
            var arrayTimeDictionary = generator.AvarageTime("array");
            foreach (var entry in arrayTimeDictionary)
            {
                Console.WriteLine($"Size: {entry.Key}, Avarage Time: {entry.Value} ms");
            }

            Console.WriteLine("Avarage time for list:");
            var listTimeDictionary = generator.AvarageTime("list");
            foreach (var entry in listTimeDictionary)
            {
                Console.WriteLine($"Size: {entry.Key}, Avarage Time: {entry.Value} ms");
            }
        }
    }
}