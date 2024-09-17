using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CASD.lab_3
{
    public class Node
{
    public int num;
    public Node left, right;

    public Node(int elem)
    {
        this.num = elem;
        this.left = this.right = null;
    }
}
}