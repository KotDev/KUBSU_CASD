using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KUBSU_CASD.lab_21;
using KUBSU_CASD.lab_19;
using KUBSU_CASD.lab_18;

namespace KUBSU_CASD.lab_22
{
    public class Generate
    {

        double[] size = {Math.Pow(10, 1), Math.Pow(10, 2), Math.Pow(10, 3), Math.Pow(10, 4)};


        public double MassureTime(Action method)
        {
            var watch = System.Diagnostics.Stopwatch.StartNew();
            method();
            watch.Stop();
            return watch.Elapsed.TotalMilliseconds;
        }

        public double MeasureTime<T>(Func<T> method)
        {
            var watch = System.Diagnostics.Stopwatch.StartNew();
            method();
            watch.Stop();
            return watch.Elapsed.TotalMilliseconds;
        }

        public MyHashMap<int, int> GenerateHashMapMethodAdd(double size)
        {
            int newSize = Convert.ToInt32(size);
            Random rand = new Random();
            MyHashMap<int, int> hashMap = new MyHashMap<int, int>(newSize);
            for (int i = 0; i < newSize; i++)
            {
                hashMap.Put(i, rand.Next(10, 50));
            }
            return hashMap;
        }

        public MyTreeMap<int, int> GenerateTreeMaptMethodAdd(double size)
        {
            IntComparer cmp = new IntComparer();
            MyTreeMap<int, int> treeMap = new MyTreeMap<int, int>(cmp);
            Random rand = new Random();
            for (int i = 0; i < size; i++)
                treeMap.Put(i, rand.Next(10, 50));
            return treeMap;
        }

        public void GenerateHasMapMethodGet(MyHashMap<int, int> hashMap)
        {
            for (int i = 0; i < hashMap.Size(); i++)
                hashMap.Get(i);
        }

        public void GenerateTreeMapMethodGet(MyTreeMap<int, int> treeMap)
        {
            for (int i = 0; i < treeMap.Size(); i++)
                treeMap.Get(i);
        }


        public void GenerateHashMapMethodRemove(MyHashMap<int, int> hashMap)
        {
            for (int i = 0; i < hashMap.Size(); i++)
                hashMap.Remove(i);
        }

        public void GenerateTreeMapMethodRemove(MyTreeMap<int, int> treeMap)
        {
            for (int i = 0; i < treeMap.Size(); i++)
                treeMap.Remove(i);
        }

        public List<Action> GetHashMapyActions(int size)
        {
            MyHashMap<int, int> hashMap = GenerateHashMapMethodAdd(size);
            List<Action> actions = new List<Action>
            {
                () => GenerateHasMapMethodGet(hashMap),
                () => GenerateHashMapMethodRemove(hashMap)
            };
            return actions;
        }

        public List<Action> GetTreeMapActions(int size)
        {
            MyTreeMap<int, int> treeMap = GenerateTreeMaptMethodAdd(size);
            List<Action> actions = new List<Action>
            {
                () => GenerateTreeMapMethodGet(treeMap),
                () => GenerateTreeMapMethodRemove(treeMap),
            };
            return actions;
        }


        public Dictionary<double, double> AvarageTime(string methodGenerate)
        {
            Dictionary<double, double> XYtime = new Dictionary<double, double>();
            foreach (var elem in size)
            {
                List<Action> actions;
                int intSize = Convert.ToInt32(elem);
                switch (methodGenerate)
                {
                    case "treeMap":
                        actions = GetTreeMapActions(intSize);
                        break;
                    case "hashMap":
                        actions = GetHashMapyActions(intSize);
                        break;
                    default:
                        throw new ArgumentException("Не корректный метод");
                }
                double summTime = 0;
                for (int j = 0; j <= 20; j++)
                {
                    foreach (var action in actions)
                    {
                        double time = MassureTime(action);
                        summTime += time;
                    }
                    if (methodGenerate == "treeMap")
                        summTime += MeasureTime(() => GenerateTreeMaptMethodAdd(intSize));
                    else
                        summTime += MeasureTime(() => GenerateHashMapMethodAdd(intSize));
                }
                double avarageTime = summTime / 20;
                XYtime[elem] = avarageTime;
            }
            return XYtime;
        }
    }
}
