using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KUBSU_CASD.lab_22
{
    public class Task22
    {
        public static void RunTask22(string[] args)
        {
            Generate generator = new Generate();

            Console.WriteLine("Avarage time for hashMap:");
            var arrayTimeDictionary = generator.AvarageTime("hashMap");
            foreach (var entry in arrayTimeDictionary)
            {
                Console.WriteLine($"Size: {entry.Key}, Avarage Time: {entry.Value} ms");
            }

            Console.WriteLine("Avarage time for treeMap:");
            var listTimeDictionary = generator.AvarageTime("treeMap");
            foreach (var entry in listTimeDictionary)
            {
                Console.WriteLine($"Size: {entry.Key}, Avarage Time: {entry.Value} ms");
            }
        }
    }
}