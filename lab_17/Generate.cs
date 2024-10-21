using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.Marshalling;
using System.Threading.Tasks;
using KUBSU_CASD.lab_16;
using KUBSU_CASD.lab_4;

namespace KUBSU_CASD.lab_17
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

        public MyArraryList<int> GenerateArrayMethodAdd(double size)
        {
            int newSize = Convert.ToInt32(size);
            Random rand = new Random();
            MyArraryList<int> array = new MyArraryList<int>(newSize);
            for (int i = 0; i < newSize; i++)
            {
                array.Add(rand.Next(10, 50));
            }
            return array;
        }

        public MyLinkedList<int> GenerateListMethodAdd(double size)
        {
            MyLinkedList<int> list = new MyLinkedList<int>();
            Random rand = new Random();
            for (int i = 0; i < size; i++)
                list.Add(rand.Next(10, 50));
            return list;
        }

        public void GenerateArrayMethodSet(MyArraryList<int> array)
        {
            Random rand = new Random();
            for (int i = 0; i < array.Size(); i++)
                array.Set(i, rand.Next(-50, -10));
        }

        public void GenerateListMethodSet(MyLinkedList<int> list)
        {
            Random rand = new Random();
            for (int i = 0; i < list.Size(); i++)
                list.Set(i, rand.Next(-50, -10));
        }

        public void GenerateArrayMethodGet(MyArraryList<int> array)
        {
            for (int i = 0; i < array.Size(); i++)
                array.Get(i);
        }

        public void GenerateListMethodGet(MyLinkedList<int> list)
        {
            for (int i = 0; i < list.Size(); i++)
                list.Get(i);
        }


        public void GenerateArrayMethodRemove(MyArraryList<int> array)
        {
            for (int i = 0; i < array.Size(); i++)
                array.Remove(index: i);
        }

        public void GenerateListMethodRemove(MyLinkedList<int> list)
        {
            for (int i = 0; i < list.Size(); i++)
                list.Remove(index: i);
        }

        public void GenerateArrayMethodAddIndex()
        {
            int newSize = Convert.ToInt32(size);
            Random rand = new Random();
            MyArraryList<int> array = new MyArraryList<int>(newSize);
            for (int i = 0; i < newSize; i++)
            {
                array.Add(rand.Next(0, newSize - 1), rand.Next(10, 50));
            }
        }

        public void GenerateListMethodAddIndex(double size)
        {
            MyLinkedList<int> list = new MyLinkedList<int>();
            Random rand = new Random();
            for (int i = 0; i < size; i++)
                list.Add(i, rand.Next(10, 50));
        }


        public List<Action> GetArrayActions(int size)
        {
            MyArraryList<int> array = GenerateArrayMethodAdd(size);
            List<Action> actions = new List<Action>
            {
                () => GenerateArrayMethodSet(array),
                () => GenerateArrayMethodGet(array),
                () => GenerateArrayMethodRemove(array),
                () => GenerateArrayMethodAdd(size)
            };
            return actions;
        }

        public List<Action> GetListActions(int size)
        {
            MyLinkedList<int> list = GenerateListMethodAdd(size);
            List<Action> actions = new List<Action>
            {
                () => GenerateListMethodSet(list),
                () => GenerateListMethodGet(list),
                () => GenerateListMethodRemove(list),
                () => GenerateListMethodAddIndex(size)
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
                    case "list":
                        actions = GetListActions(intSize);
                        break;
                    case "array":
                        actions = GetArrayActions(intSize);
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
                    if (methodGenerate == "list")
                        summTime += MeasureTime(() => GenerateListMethodAdd(intSize));
                    else
                        summTime += MeasureTime(() => GenerateArrayMethodAdd(intSize));
                }
                double avarageTime = summTime / 20;
                XYtime[elem] = avarageTime;
            }
            return XYtime;
        }
    }
}