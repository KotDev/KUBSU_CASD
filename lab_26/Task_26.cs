using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KUBSU_CASD.lab_23;

namespace KUBSU_CASD.lab_26
{
    public class Task26
    {
        public static void RunTask26(string[] args)
        {
            MyHashSet<string> hashSet = new MyHashSet<string>();
            using (StreamReader reader = new StreamReader("lab_26/task-26.txt"))
            {
                while (!reader.EndOfStream)
                {
                    string[]? line = reader.ReadLine().Split();
                    foreach (var sim in line)
                    {
                        hashSet.Add(sim.ToLower());
                    }

                }
                
            }
            hashSet.Print();
        }
        
    }
}