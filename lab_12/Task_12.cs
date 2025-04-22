using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;
using KUBSU_CASD.lab_11;

namespace KUBSU_CASD.lab_12
{
    public struct Bid 
    {
        public int numberBid;
        public int priority;
        public int numberStep;
    }

    public class Task12
    {
        public static void RunTask12(string[] args)
        {
            
            Console.Write("Введите N: ");
            string? N = Console.ReadLine();
            Dictionary<Bid, double> dictBind = new Dictionary<Bid, double>();
            try
            {
                Random rand = new Random();
                int n = Convert.ToInt32(N);
                PriorityQueueComparer<Bid> cmp = new ComparatorStruct();
                MyPriorityQueue<Bid> priorityQueue = new MyPriorityQueue<Bid>(initialCapacity: n, cmp: cmp); 
                for (int i = 0; i < n; i++)
                {
                    Bid bid = new Bid();
                    bid.numberBid = rand.Next(1, 100);
                    bid.priority = rand.Next(1, 5);
                    bid.numberStep = i + 1;
                    priorityQueue.Add(bid);
                }
                Stopwatch stopwatch = new Stopwatch();
                stopwatch.Start();
                for (int i = 0; i < n; i++)
                {
                    Bid currentBid = priorityQueue.Pull();
                    dictBind[currentBid] = stopwatch.Elapsed.TotalMilliseconds;
                }
                stopwatch.Stop();
                StreamWriter writer = new StreamWriter("lab_12/log.txt");
                foreach (KeyValuePair<Bid, double> kvp in dictBind)
                {
                    writer.WriteLine($"(Номер заявки: {kvp.Key.numberBid}, Приоритет: {kvp.Key.priority}, Номер шага: {kvp.Key.numberStep}) - Время: {kvp.Value} мс");
                }
                writer.Close();
            }
            catch (Exception)
            {
                throw new ConvertException("N не целое число");
            }
        }
    }
}