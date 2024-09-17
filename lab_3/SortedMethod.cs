using System.Diagnostics;
using System.Formats.Asn1;
using System.Security.Cryptography.X509Certificates;

using CASD.lab_3;

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
        for (int i = 0; i < mass.Length - 1; i ++)
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
        static int next(int gap)
        {
            gap = (gap*10)/13;
            if (gap < 1)
                return 1;
            return gap;
        }

        int n = mass.Length;
        int gap = n;
        bool swap = false;
        while(gap != 1 || swap)
        {
            gap = next(gap);
            swap = false;
            for(int i = 0; i < n - gap; i++)
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
        for(int i = 0; i < mass.Length; i++)
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

            for (;j >= 0 && mass[j] > elem; j--) 
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
        static Node Insert(Node node, int elem)
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

        void SortMass(Node root, ref int j)
        {
            if(root != null)
            {
                SortMass(root.left, ref j);
                mass[j] = root.num;
                j++;
                SortMass(root.right, ref j);
            }
        }


        Node root = new Node(elem: mass[0]);
        for (int i = 1; i < mass.Length; i++)
        {
            Insert(root, mass[i]);
        }
        int j = 0;
        SortMass(root, ref j);

    }


    public void GnomeSort()
    {
        int i = 0;
        for (; i < mass.Length;)
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
            count_mass[mass[i]] --;
        }
        mass = output_mass;
    }

    public void RedixSort()
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
                count_mass[(elem / exp) % 10] ++;
            for (int i = 1; i < count_mass.Length; i++)
                count_mass[i] += count_mass[i - 1];
            for (int i = mass.Length - 1; i >= 0; i--)
            {
                output_mass[count_mass[(mass[i] / exp) % 10] - 1] = mass[i];
                count_mass[(mass[i] / exp) % 10] --;
            }
            for (int i = 0; i < mass.Length; i++)
                mass[i] = output_mass[i];
        }
    }

    public void BitonicSort()
    {
        static void CompSwap(int[] mass, int i, int j, int dir) 
        { 
            int k;
            if(mass[i] > mass[j])
                k = 1;
            else
                k = 0;
            if (dir == k)
            {
                int elem = mass[i];
                mass[i] = mass[j];
                mass[j] = elem;
            }
        } 

        static void Merge(int[] mass, int low, int cnt, int dir) 
        { 
            if (cnt > 1) 
            { 
                int k = cnt / 2; 
                for (int i = low; i < low + k; i++) 
                    CompSwap(mass, i, i + k, dir); 
                Merge(mass, low, k, dir); 
                Merge(mass, low + k, k, dir); 
            } 
        } 

        static void Sort(int[] mass, int low, int cnt, int dir) 
        { 
            if ( cnt > 1) 
            { 
                int k = cnt / 2; 
                Sort(mass, low, k, 1); 
                Sort(mass, low + k, k, 0);  
                Merge(mass,low, cnt, dir); 
            } 
        } 

        int up = 1;
        int len_mass = mass.Length;
        Sort(mass, 0, len_mass, up); 

    }
    

    public void HeaspSort()
    {

        static void Heap(int[] mass, int len, int i)
        {
            int largest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;

            if (left < len && mass[left] > mass[largest])
                largest = left;
            if (right < len && mass[right] > mass[largest])
                largest = right;
            if (largest != i)
            {
                int swap = mass[i];
                mass[i] = mass[largest];
                mass[largest] = swap;
                Heap(mass, len, largest);
            }
        }

        for (int i = mass.Length / 2 - 1; i >= 0; i--)
            Heap(mass, mass.Length, i);
        for (int i = mass.Length - 1; i > 0; i--)
        {
            int swap = mass[0];
            mass[0] = mass[i];
            mass[i] = swap;
            Heap(mass, i, 0);
        }

    }

    public void MergeSort()
    {
        static void Merge(int[] mass, int left, int mid, int right)
        {
            int leftLen = mid - left + 1;
            int rightLen = right - mid;
            int[] leftMass = new int[leftLen];
            int[] rightMass = new int[rightLen];
            int i, j;
            for (i = 0; i < leftLen; i++)
                leftMass[i] = mass[left + i];
            for (j = 0; j < rightLen; j++)
                rightMass[j] = mass[mid + 1 + j];
            
            i = 0;
            j = 0;
            int k = left;

            while(i < leftLen && j < rightLen)
            {
                if (leftMass[i] <= rightMass[j])
                    mass[k++] = leftMass[i++];
                else
                    mass[k++] = rightMass[j++];
            }
            while (i < leftLen)
                mass[k++] = leftMass[i++];
            
            while (j < rightLen)
                mass[k++] = rightMass[j++]; 
        }

        static int[] Sort(int[] mass, int left, int right)
        {
            if (left < right)
            {
                int mid = left + (right - left) / 2;
                Sort(mass, left, mid);
                Sort(mass, mid + 1, right);
                Merge(mass, left, mid, right);
            }
            return mass;

        }

        mass = Sort(mass, 0, mass.Length - 1);
    }

    public void QuickSort()
    {
        static int[] Sort(int[] mass, int leftIndex, int rightIndex)
        {
            int pivot = mass[leftIndex];
            int i = leftIndex;
            int j = rightIndex;
            while (i <= j)
            {
                while (mass[i] < pivot)
                    i++;
                while (mass[j] > pivot)
                    j--;
                if (i <= j)
                {
                    int elem = mass[i];
                    mass[i] = mass[j];
                    mass[j] = elem;
                    i++;
                    j--;
                }
            }
                if (leftIndex < j)
                    Sort(mass, leftIndex, j);
                if (i < rightIndex)
                    Sort(mass, i, rightIndex);
                return mass;
        }
        mass = Sort(mass, 0, mass.Length - 1);
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