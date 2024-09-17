using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Reflection;

namespace CASD.lab_3
{
    public class GroupSorted
    {
        FileManager fileManagerOut = new FileManager("lab_3/output.txt");
        FileManager fileManagerInput = new FileManager("lab_3/input.txt");
        public void Clear()
        {
            fileManagerOut.ClearOrCreateFile();
            fileManagerInput.ClearOrCreateFile();
        }
        public Dictionary<string, double[]> Group(string methodTestData, string[] sortMethodNames, string groupNum)
        {
            Clear();
            TestGenerate testGenerate = new TestGenerate();
            testGenerate.Generate(methodTestData, groupNum);
            Dictionary<string, double[]> timeSortDict = sortMethodNames.ToDictionary(name => name, name => new double[20]);
            using (StreamReader reader = new StreamReader("lab_3/input.txt"))
            {
                using (StreamWriter writer = new StreamWriter("lab_3/output.txt"))
                {
                    for (int i = 0; i < sortMethodNames.Length; i++)
                    {
                        for (int j = 0; j < 20; j++)
                        {
                            string? line = reader.ReadLine();
                            if ( line == null && string.IsNullOrWhiteSpace(line))
                                break;
                            string[] mass = line.Split(" ");
                            int[] intMass = Array.ConvertAll(mass, int.Parse);
                            foreach (var methodName in sortMethodNames)
                            {
                                SortedMethods sort = new SortedMethods(intMass);
                                MethodInfo? methodInfo = typeof(SortedMethods).GetMethod(methodName, BindingFlags.Instance | BindingFlags.Public);
                                if (methodInfo != null)
                                {
                                    double time = SortedMethods.LeadTime(() => methodInfo.Invoke(sort, null));
                                    timeSortDict[methodName][i] = time;
                                    Console.WriteLine(methodName);
                                    writer.WriteLine(methodName);
                                    writer.WriteLine(string.Join(" ", sort.mass));
                                    writer.WriteLine();
                                }
                            }
                        }
                        writer.WriteLine();
                        writer.WriteLine();
                        writer.WriteLine();
                    }
                }
            }
            foreach (string key in sortMethodNames)
            {
                double[] values = timeSortDict[key];
                Array.Sort(values);
                timeSortDict[key] = values;
            }
            return timeSortDict;
        }
    }
}