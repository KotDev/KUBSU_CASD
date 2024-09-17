using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CASD.lab_3
{
    public class TestGenerate
    {
        private int[] GenerateTestMass1(long len)
        {
                        Random random = new Random(Convert.ToInt32(DateTime.Now.Ticks % int.MaxValue));
            int[] testMass = new int[len];
            for (int i = 0; i < len; i++)
            {
                testMass[i] = random.Next(0, 1000);

            }
            return testMass;
        }
        

        private int[] GenerateTestMass2(long len)
        {
            Random random = new Random(Convert.ToInt32(DateTime.Now.Ticks % int.MaxValue));
            int[] testMass = new int[len];
            for (int i = 0; i < len; i++)
            {
                testMass[i] = random.Next(0, 50);

            }
            return testMass;
        }

        private int[] GenerateTestMass3(long len)
        {
            Random random = new Random(Convert.ToInt32(DateTime.Now.Ticks % int.MaxValue));
            long newLen = random.NextInt64(10, len);
            int[] testMass = new int[newLen];
            for (int i = 0; i < newLen; i++)
            {
                testMass[i] = random.Next(0, 50);
            }
            Array.Sort(testMass);
            return testMass;
        }

        private int[] GenerateTestMass4(long len)
        {
            Random random = new Random(Convert.ToInt32(DateTime.Now.Ticks % int.MaxValue));
            int[] testMass = new int[len];
            long i, j;
            for (i = 0; i < len; i++)
            {
                testMass[i] = random.Next(0, 50);
            }
            Array.Sort(testMass);
            while (true)
            {
                i = random.NextInt64(0, len);
                j = random.NextInt64(0, len);
                if (i != j)
                    break;
            }
            int swap = testMass[i];
            testMass[i] = testMass[j];
            testMass[j] = swap;
            return testMass;
        }

        private int[] GenerateTestMass5(long len)
        {
            int[] percentMass = {10, 25, 50, 75, 90};
            Random random = new Random(Convert.ToInt32(DateTime.Now.Ticks % int.MaxValue));
            float precent = percentMass [random.Next(0, percentMass.Length)] / 100;
            long newLen =  Convert.ToInt64(len - (len * precent));
            int[] testMass = new int[len];
            int randomElem = random.Next(1, 50);
            for (int i = 0; i < len; i++)
            {
                testMass[i] = random.Next(1, 50);
            }
            Array.Sort(testMass);
            for (int i = 0; i < newLen; i++)
            {
                testMass[i] = randomElem;
            }
            return testMass;

        }

        public void Generate(string method, string group)
        {   
            long[] lenMass;
            switch (group)
            {
                case "2":
                lenMass = new long[] {10, 100, 1000, 100000, 1000000};
                break;

                case "3":
                lenMass = new long[] {10, 100, 1000, 100000, 1000000, 10000000};
                break;

                default:
                lenMass = new long[] {10, 100, 1000, 100000};
                break;
                            

            }
            using (StreamWriter writer = new StreamWriter("lab_3/input.txt"))
            {
                int j = 0;
                for (int i = 0; i < 20; i++)
                {
                    switch (method)
                    {
                        case "group-1":
                        {
                            writer.WriteLine(string.Join(" ", GenerateTestMass1(lenMass[j])));
                            j++;
                            if (j == lenMass.Length)
                                j = 0;
                            break;
                        }
                        case "group-2":
                            writer.WriteLine(string.Join(" ", GenerateTestMass2(lenMass[j])));
                            j++;
                            if (j == lenMass.Length)
                                j = 0;
                            break;
                        
                        case "group-3":
                            writer.WriteLine(string.Join(" ", GenerateTestMass3(lenMass[j])));
                            j++;
                            if (j == lenMass.Length)
                                j = 0;
                            break;

                        case "group-4":
                            writer.WriteLine(string.Join(" ", GenerateTestMass4(lenMass[j])));
                            j++;
                            if (j == lenMass.Length)
                                j = 0;
                            break;

                        case "group-5":
                            writer.WriteLine(string.Join(" ", GenerateTestMass5(lenMass[j])));
                            j++;
                            if (j == lenMass.Length)
                                j = 0;
                            break;
                    }
                }
            }
        }
    }
}