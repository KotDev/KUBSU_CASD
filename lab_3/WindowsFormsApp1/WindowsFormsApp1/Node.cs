using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WindowsFormsApp1
{
    class Node
    {
        public int num;
        public Node left, right;

        public Node(int num)
        {
            this.num = num;
            left = right = null;
        }
    }
}