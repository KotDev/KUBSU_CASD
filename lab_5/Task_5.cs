using System;
using System.Collections.Generic;
using System.Formats.Asn1;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using KUBSU_CASD.lab_4;
namespace KUBSU_CASD.lab_5
{
    public class Task5
    {

        public static void RunTask5(string[] args)
        {
            using (StreamReader reader = new StreamReader("lab_5/task-5.txt"))
            {

                string allText = reader.ReadToEnd();
                MyArraryList<string> arraryList = new MyArraryList<string>();
                string tag = "";
                foreach (char sim in allText)
                {
                    if (sim == '>' && tag.Length >= 2)
                    {
                        if (tag.Length > 2 && ((tag[1] >= '0' && tag[1] <= '9') || (tag[2] >= '0' && tag[2] <= '9' && tag[1] == '/')))
                        {
                            tag = "";
                            continue;
                        }
                        if (tag[1] == '/')
                            tag = tag.Substring(2, tag.Length - 2).ToLower();
                        else    
                            tag = tag.Substring(1, tag.Length - 1).ToLower();
                        if (!arraryList.Contains(tag))
                            arraryList.Add(tag.ToLower());
                        tag = "";
                    }

                    else if (sim == '<' && tag.Length == 0)
                        tag += '<';
                        

                    else if (sim >= '0' && sim <= '9' && tag.Length >= 1)
                    {
                        if (tag.Length == 2 && tag[1] == '/')
                        {
                            tag = "";
                            continue;
                        }
                        else if (tag.Length == 1)
                        {
                            tag = "";
                            continue;
                        }
                        tag += sim;
                    }
                    else if (tag.Length >= 1)
                    {
                        tag += sim;

                    }
                }
                Console.WriteLine(string.Join(", ", arraryList.toArray()));
            }
        }
    }
}