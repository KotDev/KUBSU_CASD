using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using KUBSU_CASD.lab_18;
using System.Formats.Asn1;

namespace KUBSU_CASD.lab_19
{
    public class Task19
    {
        public static void RunTask19(string[] args)
        {
            StreamReader reader = new StreamReader("lab_19/task-19.txt");
            string text = reader.ReadToEnd();
            MyHashMap<string, int> table = new MyHashMap<string, int>();
            Regex regex = new Regex(@"</?[a-zA-Z]([a-zA-Z]*\d*)*\s*>");
            MatchCollection matches = regex.Matches(text);
            if (matches.Count > 0)
            {
                foreach (Match match in matches)
                    {
                        table.Put(match.Value.ToString(), 0);
                    }
                Console.WriteLine();
                foreach (Match match in matches)
                {
                    int val = table.Get(match.Value.ToString());
                    val ++;
                    table.Put(match.Value.ToString(), val);
                }
            }
            table.EntrySet();
        }
    }
}