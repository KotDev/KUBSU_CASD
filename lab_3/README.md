# ������������ ������ �3

### ������
����������� ���������� � ����������� ����������� ��� ��������� �������������
��������� ���������� ���������� �� ������ �������� �������� ����� �����.
����������, ����� ��������� ���������� �������� ����������� ����� �� ���������
�������� �������� ����� �����.
����������� ��������� ��������� ����������:
1) ���������� ��������� (Bubble sort);
2) ��������� ���������� (Shaker sort);
3) ���������� ��������� (Comb sort);
4) ���������� ��������� (Insertion sort);
5) ���������� ����� (Shellsort);
6) ���������� ������� (Tree sort);
7) ������ ���������� (Gnome sort);
8) ���������� ������� (Selection sort);
9) ������������� ���������� (Heapsort);
10) ������� ���������� (Quicksort);
11) ���������� �������� (Merge sort);
12) ���������� ��������� (Counting sort);
13) ����������� ���������� (Radix sort);
14) �������� ���������� (Bitonic sort).
����������� ������ ������ �������� ������:
1) ������ ��������� ����� �� ������ 1000.
2) �������, �������� �� ��������� ��������������� ����������� ������� �������.
������� ����������� ������������ ��������� ������ �� ������ ���������
��������� (10, 100, 1000 � �.�. ������ �� ������� �������).
3) ���������� ��������������� ������� ��������� ����� � ��������� ������
������������ ���� ��������� ���������.
4) ��������� ��������������� ������� (� ������ � �������� �������), ������� �
����������� ����������� ����������, ������� � ������� �����������
���������� ������ �������� (10%, 25%, 50%, 75% � 90%).
��������� ��������� ���������� �� ��� ������:
1) ���������, ���������, �������, ���������, ������;
2) ��������, �����, �������;
3) ���������, �������������, �������, ��������, ���������, �����������.
�������� ������������:
1) ���������� ������ ������ ����������� �� �������� �������� 10, 100, �, 105
���������;
2) ���������� ������ ������ ����������� �� �������� �������� 10, 100, �, 106
���������;
3) ���������� ������� ������ ����������� �� �������� �������� 10, 100, �, 107
���������.
3
��� ������� ����� �������� 20 �������� � ��������� ������� ����� ������ ���������.
����������� ���������� ��������� � ���� ��������, ������������, ����� ���������
���������� �������� ����������� ����� �� ������ ���� �������� ������.
���������������� ���������� ���������� � ������� ������ �� �������������
��������� ���������� ���������� �� ������ �������� �������� ����� �����.
���������� � ����������:
1) ������� ���� ���������� ������ ��������� ��������� �������� ����������:
a. ���������� ������ ��� ������ ������ �������� ������ (��������� �����,
�������� �� ����������, ��������������� ������� � �.�.).
b. ���������� ������ ��� ������ ������ ���������� ���������� (������
������, ������ ������, ������ ������).
c. ������ �������������� �������� ��� �������� �������� �������� �
������������ � ��������� �������.
d. ������ ���������� ������ ��� ������� ���������� ����������
����������� � ����������� �����������.
e. ������ ���������� ����������� ��� �������� ��������������� �
��������������� �������� � ����.
f. ������� ��� ����������� ��������, ������������ �������������
���������� ���������� �� ������ �������� ��������.
2) ����� ������� ������ �������������� �������� ������ ���� ������� ��������
������� � ������������ � ��������� ������� � ��������. ������� ������ ����
��������� � ������ ����������.
3) ����� ������� ������ ���������� ������ ������ ���� ��������� ���������
��������:
a. ��� ������� ��������� ���������� �� ��������� ������ ������ ����
��������� 20 �������� �� ������ ������� �������.
b. ��� ������� ����� ������ ���� ��������� ������� ����� ������
���������.
c. ���������� ������������ ������ ���� ���������� � ���� �������� �
�������������� ���������� ZedGraph.
4) ����� ������� ������ ���������� ����������� ������ ���� ��������� � ����
��������� ������:
a. ��������������� �������� �������.
b. ��������������� ������� ��� ������� ��������� ����������.
5) ��� ���������� �������� ������� ������������ ���������� ZedGraph.
6) ���������� ������ ���� ����������� � �������������� Windows Forms

### ������

��� ������� ��������� ���������� � Visual Studio Code ������� �� ����

```bash
  cd lab_3/WindowsFormApp1/WindowsFormApp1
```

����� ���������� ����������� ���� IDE ���� Program.cs

#### ����������

2 ������ ���������� �� �������� �� ������� ����������� ������� ��������, 
���� ���� ��������� ������ ��� ������ �� ���������� ������ � �� ������ ���������� ������

```bash
  cd lab_3/WindowsFormApp1/WindowsFormApp1/Form1.cs
```


```bash
    Dictionary<string, string[]> sorteds = new Dictionary<string, string[]>()
    {
        {"0", new string[] {"BubleSort", "InsertionSort", "ShakeSort", "GnomeSort", "SelectionSort"}},
        {"1", new string[] {"BitonicSort", "ShellSort", "TreeSort"}},
        {"2", new string[] {"CombSort", "HeapSort", "QuickSort", "MergeSort", "CountingSort", "RadixSort"}}
    };
```

���� ���������� �������� �������� �������� ������� ��� ������ �� � ����� TestGenerate.cs
���������� ������� ����� �������� � ������ lenMass

```bash
    public void Generate(string method, string group)
    {
        long[] lenMass;
        switch (group)
        {
            case "2":
                lenMass = new long[] { 10, 100, 1000, 100000, 100000 };
                break;

            case "3":
                lenMass = new long[] { 10, 100, 1000, 100000, 1000000, 1000000 };
                break;

            default:
                lenMass = new long[] { 10, 100, 1000, 10000 };
                break;
        }
```

����������� desktop ���������� ������������� �� windowsform.