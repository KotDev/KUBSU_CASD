using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Numerics;

using CASD.lab_3;

class Task3
{

    public static void RunTask3(string[] args)
    {
        GroupSorted groupSorted = new GroupSorted();
        string[] methodsSort = {"BubleSort", "InsertionSort", "ShakeSort", "GnomeSort", "SelectionSort"};
        groupSorted.Group("group-1", methodsSort, "1");
    }
    
}
