using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using KUBSU_CASD.lab_19;
using KUBSU_CASD.lab_18;
using Microsoft.VisualBasic.FileIO;
using System.Data;

namespace KUBSU_CASD.lab_20
{
    public class Task20
    {
        enum TypeData
            {
                Int,
                Double,
                Float
            }

        private static TypeData? GetTypeData(string type)
        {
            return type.ToLower() switch
            {
                "int" => TypeData.Int,
                "double" => TypeData.Double,
                "float" => TypeData.Float,
                _ => null
            };
        }

        public static void RunTask20(string[] args)
        {

            MyHashMap<string, (TypeData, string)> map = new MyHashMap<string, (TypeData, string)>(); 
            Regex regex = new Regex(@"\b(?:int|float|double)\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*\d+(\.\d+)?\b");
            StreamReader reader = new StreamReader("lab_20/task-20.txt");
            StreamWriter writer = new StreamWriter("lab_20/output.txt");
            while (!reader.EndOfStream)
            {
                string? line = reader.ReadLine();
                if (line is null)
                    continue;
                bool matches = regex.IsMatch(line);
                string[] splitLine = line.Split(' ');
                string name = splitLine[1];
                string typeStr = splitLine[0];
                string value = splitLine[3];
                TypeData? type = GetTypeData(type: typeStr);
                if (!matches)
                {
                    Console.WriteLine($"Некорректный тип переменной: {typeStr} в строке {line}");
                    continue;
                }
                if (matches)
                {
                    if (map.ContainsKey(name))
                    {
                        Console.WriteLine($"Переопределение переменной {name} в строке {line}");
                        continue;
                    }
                    map.Put(name, (type.Value, value));
                    writer.WriteLine($"{type.Value} => {name}({value})");
                }
            }
            reader.Close();
            writer.Close();
            map.EntrySet();
        }
    }
}
