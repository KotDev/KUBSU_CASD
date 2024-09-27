using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KUBSU_CASD.lab_6;

namespace KUBSU_CASD.lab_7
{
    public class Task7
    {

        private static bool Intersection(string? elem1, string? elem2)
        {
            if (elem1 == null && elem2 == null)
                return true;
            else if (elem1 == null || elem2 == null)
                return false;
            foreach (var item in elem1)
            {
                if (elem2.Contains(item))
                    return true;
            }
            return false;
        }


        public static void RunTask7(string[] args)
        {
            Dictionary<int, MyVector<string>> vectorsDict = new Dictionary<int, MyVector<string>>();
            int lineIndex = 0;
            using (StreamReader reader = new StreamReader("lab_7/task-7.txt"))
            {
                while (!reader.EndOfStream)
                {
                    string? line = reader.ReadLine();
                    if (line == null)
                        break;
                    MyVector<string> vector = new MyVector<string>();
                    if (line.Split().Length < 8)
                    {
                      continue;
                    }
                    lineIndex ++;
                    foreach(var sim in line.Split())
                    {
                        try {
                            ushort elementUShort = Convert.ToUInt16(sim, 16);
                            int value = elementUShort;
                            if (value >= 0 && value <= 65535)
                                vector.Add(e: sim);
                            }
                        catch {continue;}
                    }
                    vectorsDict[lineIndex] = vector;


                }
            }
            for (int i = 1; i <= lineIndex; i ++)
            {
                MyVector<string> vector1 = vectorsDict[i];
                for (int j = i + 1; j <= lineIndex; j++)
                {
                    MyVector<string> vector2 = vectorsDict[j];

                    for (int elem1 = 0; elem1 < vector1.Size(); elem1++)
                    {
                        for (int elem2 = 0; elem2 < vector2.Size(); elem2++)
                        {
                            string? val1 = vector1.Get(elem1);
                            string? val2 = vector2.Get(elem2);
                            if (Intersection(val1, val2))
                            {
                                vector1.Remove(elem1);
                                vector2.Remove(elem2);
                            }
                        }
                    }
                }
            }
            foreach (var key in vectorsDict.Keys)
            {
                if (vectorsDict[key].Size() < 8)
                {
                    vectorsDict.Remove(key);
                }
            }

            if (!vectorsDict.Any())
            {
                Console.WriteLine("Нет подходящего вектора с элементами IP адресов или самих адресов");
                return;
            }

            using (StreamWriter writer = new StreamWriter("lab_7/output.txt"))
            {
                foreach (var vector in vectorsDict.Values)
                {
                    var output = vector.Size() == 8
                        ? $"IP адрес: {string.Join(":", vector.SubList(0, vector.Size()))}"
                        : $"Вектор из элементов, из которого можно собрать IP адрес: {string.Join(", ", vector.SubList(0, vector.Size()))}";

                    writer.WriteLine(output);
                }
            }

        }
        
    }
}