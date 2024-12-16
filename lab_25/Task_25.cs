using System;
using System.Collections.Generic;
using System.Diagnostics.Tracing;
using System.Linq;
using System.Threading.Tasks;
using KUBSU_CASD.lab_23;

namespace KUBSU_CASD.lab_25
{
    public class Task25
    {
        static string SearchMinWordLine(MyHashSet<string> hashSet)
        {
            string[] words = hashSet.ToArray();
            int minLen = words[0].Length;
            int minIndex = 0;
            for (int i = 0; i < words.Length; i++)
            {
                if (minLen > words[i].Length)
                {
                    minIndex = i;
                    minLen = words[i].Length;
                }
            }
            return words[minIndex];
        }

        static int CompareWords(string x, string y)
        {
            int lengthComparison = x.Length.CompareTo(y.Length);
            return lengthComparison;
        }

        static int CompareWordsWithLineLength(Tuple<string, string> x, Tuple<string, string> y)
        {
            int wordComparison = CompareWords(x.Item2, y.Item2);
            if (wordComparison != 0)
                return wordComparison;
            return x.Item1.Length.CompareTo(y.Item1.Length);
        }


        public static void RunTask25(string[] args)
        {
            MyHashSet<string> hashSet = new MyHashSet<string>();
            List<Tuple<string, string>> linesWithMinWords = new List<Tuple<string, string>>();
            using (StreamReader reader = new StreamReader("lab_25/task-25.txt"))
            {
                while (!reader.EndOfStream)
                {
                    string line = reader.ReadLine().ToLower();
                    string[] words = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    foreach (var word in words)
                    {
                        hashSet.Add(word);
                    }
                    string minWord = SearchMinWordLine(hashSet);
                    hashSet.Clear();
                    linesWithMinWords.Add(Tuple.Create(line, minWord));
                }
            }
            linesWithMinWords.Sort(CompareWordsWithLineLength);
            using (StreamWriter writer = new StreamWriter("lab_25/output.txt"))
            {
                foreach (var item in linesWithMinWords)
                {
                    writer.WriteLine(item.Item1);
                }
            }
            foreach (var item in linesWithMinWords)
            {
                Console.WriteLine(item.Item1);
            }
        }
    }
}