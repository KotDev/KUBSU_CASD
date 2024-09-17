using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using ZedGraph;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            TextBoxSorted.Clear();
            GraphPane pane = zedGraphControl1.GraphPane;
            pane.CurveList.Clear();
            pane.GraphObjList.Clear();

            string value_sorted = ComboBoxSorted.SelectedIndex.ToString();
            string value_test = ComboTestData.SelectedIndex.ToString();

            Dictionary<string, string[]> sorteds = new Dictionary<string, string[]>()
            {
                {"0", new string[] {"BubleSort", "InsertionSort", "ShakeSort", "GnomeSort", "SelectionSort"}},
                {"1", new string[] {"BitonicSort", "ShellSort", "TreeSort"}},
                {"2", new string[] {"CombSort", "HeapSort", "QuickSort", "MergeSort", "CountingSort", "RadixSort"}}
            };

            Dictionary<string, string> tests = new Dictionary<string, string>()
            {
                {"0", "group-1"},
                {"1", "group-2"},
                {"2", "group-3"},
                {"3", "group-4"},
                {"4", "group-5"}
            };

            Random random = new Random();
            GroupSorted groupSorted = new GroupSorted();
            Dictionary<string, double[]> result = groupSorted.Group(tests[value_test], sorteds[value_sorted], value_sorted);

            foreach (string method in sorteds[value_sorted])
            {
                PointPairList list = new PointPairList();
                double[] times = result[method];
                double sum = 0.0;
                double count = 0.0;
                for (int i = 0; i < times.Length; i++)
                {
                    list.Add(i, times[i]);
                    sum += times[i];
                    count += 1.0;
                }
                TextBoxSorted.AppendText($"{method} - {sum / count} ");
                Color randomColor = Color.FromArgb(random.Next(256), random.Next(256), random.Next(256));
                LineItem curve = pane.AddCurve(method, list, randomColor, SymbolType.None);
            }

            pane.XAxis.Title.Text = "Test Number";
            pane.YAxis.Title.Text = "Time (ms)";

            zedGraphControl1.AxisChange();
            zedGraphControl1.Invalidate();
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void TextBoxSorted_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
