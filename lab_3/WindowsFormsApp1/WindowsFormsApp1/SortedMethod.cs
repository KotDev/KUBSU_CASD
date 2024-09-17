using System;
using System.Diagnostics;

namespace WindowsFormsApp1
{
    class SortedMethods
    {
        public int[] mass;

        public SortedMethods(int[] mass)
        {
            this.mass = mass;
        }

        public void BubleSort()
        {
            bool flag;
            for (int i = 0; i < mass.Length - 1; i++)
            {
                flag = false;
                for (int j = 0; j < mass.Length - i - 1; j++)
                {
                    if (mass[j] > mass[j + 1])
                    {
                        int elem = mass[j];
                        mass[j] = mass[j + 1];
                        mass[j + 1] = elem;
                        flag = true;
                    }
                }
                if (!flag)
                    break;
            }
        }

        public void ShakeSort()
        {
            bool swap = true;
            int start = 0;
            int end = mass.Length;

            while (swap)
            {
                swap = false;
                for (int i = start; i < end - 1; i++)
                {
                    if (mass[i] > mass[i + 1])
                    {
                        int elem = mass[i];
                        mass[i] = mass[i + 1];
                        mass[i + 1] = elem;
                        swap = true;
                    }
                }
                if (!swap)
                    break;
                swap = false;
                end -= 1;
                for (int i = end - 1; i >= start; i--)
                {
                    if (mass[i] > mass[i + 1])
                    {
                        int elem = mass[i];
                        mass[i] = mass[i + 1];
                        mass[i + 1] = elem;
                        swap = true;
                    }
                }
                start += 1;
            }
        }

        public void CombSort()
        {
            int next(int g)
            {
                g = (g * 10) / 13;
                if (g < 1)
                    return 1;
                return g;
            }

            int n = mass.Length;
            int gap = n;
            bool swap = false;
            while (gap != 1 || swap)
            {
                gap = next(gap);
                swap = false;
                for (int i = 0; i < n - gap; i++)
                {
                    if (mass[i] > mass[i + gap])
                    {
                        int elem = mass[i];
                        mass[i] = mass[i + gap];
                        mass[i + gap] = elem;
                        swap = true;
                    }
                }
            }
        }

        public void SelectionSort()
        {
            int min_elem;
            int index_min_elem;
            for (int i = 0; i < mass.Length; i++)
            {
                min_elem = mass[i];
                index_min_elem = i;
                for (int j = i + 1; j < mass.Length; j++)
                {
                    if (min_elem > mass[j])
                    {
                        min_elem = mass[j];
                        index_min_elem = j;
                    }
                }
                if (i != index_min_elem)
                {
                    int elem = mass[i];
                    mass[i] = mass[index_min_elem];
                    mass[index_min_elem] = elem;
                }
            }
        }

        public void InsertionSort()
        {
            for (int i = 1; i < mass.Length; i++)
            {
                int elem = mass[i];
                int j = i - 1;

                for (; j >= 0 && mass[j] > elem; j--)
                    mass[j + 1] = mass[j];
                mass[j + 1] = elem;
            }
        }

        public void ShellSort()
        {
            int len = mass.Length;
            for (int i = len / 2; i > 0; i /= 2)
            {
                for (int j = i; j < len; j++)
                {
                    int elem = mass[j];
                    int y;
                    for (y = j; y >= i && mass[y - i] > elem; y -= i)
                        mass[y] = mass[y - i];
                    mass[y] = elem;
                }
            }
        }

        public void TreeSort()
        {
            Node root = new Node(mass[0]);
            for (int i = 1; i < mass.Length; i++)
            {
                Insert(root, mass[i]);
            }
            int j = 0;
            SortMass(root, ref j);
        }

        private static Node Insert(Node node, int elem)
        {
            if (node == null)
            {
                return new Node(elem);
            }

            if (elem < node.num)
            {
                node.left = Insert(node.left, elem);
            }
            else
            {
                node.right = Insert(node.right, elem);
            }
            return node;
        }

        private void SortMass(Node root, ref int j)
        {
            if (root != null)
            {
                SortMass(root.left, ref j);
                mass[j] = root.num;
                j++;
                SortMass(root.right, ref j);
            }
        }

        public void GnomeSort()
        {
            int i = 0;
            while (i < mass.Length)
            {
                if (i == 0)
                    i++;
                if (mass[i] >= mass[i - 1])
                    i++;
                else
                {
                    int elem = mass[i];
                    mass[i] = mass[i - 1];
                    mass[i - 1] = elem;
                    i--;
                }
            }
        }

        public void CountingSort()
        {
            int max_elem = mass[0];
            for (int i = 0; i < mass.Length; i++)
            {
                if (max_elem < mass[i])
                    max_elem = mass[i];
            }
            int[] count_mass = new int[max_elem + 1];
            int[] output_mass = new int[mass.Length];
            foreach (int elem in mass)
                count_mass[elem] += 1;
            for (int i = 1; i < count_mass.Length; i++)
                count_mass[i] = count_mass[i - 1] + count_mass[i];
            for (int i = mass.Length - 1; i >= 0; i--)
            {
                output_mass[count_mass[mass[i]] - 1] = mass[i];
                count_mass[mass[i]]--;
            }
            mass = output_mass;
        }

        public void RadixSort()
        {
            int max_elem = mass[0];
            for (int i = 0; i < mass.Length; i++)
            {
                if (max_elem < mass[i])
                    max_elem = mass[i];
            }
            for (int exp = 1; max_elem / exp > 0; exp *= 10)
            {
                int[] count_mass = new int[10];
                int[] output_mass = new int[mass.Length];
                foreach (int elem in mass)
                    count_mass[(elem / exp) % 10]++;
                for (int i = 1; i < count_mass.Length; i++)
                    count_mass[i] += count_mass[i - 1];
                for (int i = mass.Length - 1; i >= 0; i--)
                {
                    output_mass[count_mass[(mass[i] / exp) % 10] - 1] = mass[i];
                    count_mass[(mass[i] / exp) % 10]--;
                }
                for (int i = 0; i < mass.Length; i++)
                    mass[i] = output_mass[i];
            }
        }

     

        public void Print()
        {
            for (int i = 0; i < mass.Length; i++)
            {
                Console.Write($"{mass[i]}, ");
            }
        }

        public static double LeadTime(Action method)
        {
            Stopwatch stopwatch = new Stopwatch();

            stopwatch.Start();
            method();
            stopwatch.Stop();
            return stopwatch.Elapsed.TotalMilliseconds;
        }
    }
}