using System.Numerics;

class Task1
{
    private static bool CheckSymmetry(int[,] matrix)
    {
        for (int i = 0; i < matrix.GetLength(0); i++)
        {
            for (int j = 0; j < matrix.GetLength(1); j++)
            {
                if (matrix[i, j] != matrix[j, i])
                    return false;
            }
        }
        return true;
    }

    private static int[] MultiplyVectorMatrix(int[,] matrix, int[] vector)
    {
        int[] newVector = new int[vector.Length];
        for (int i = 0; i < matrix.GetLength(0); i++)
        {
            int sum_elem = 0;
            for (int j = 0; j < matrix.GetLength(1); j++)
            {
                sum_elem += vector[j] * matrix[i, j];
                
            }
            newVector[i] = sum_elem;
        }
        return newVector;
    }

    private static int MultiplyVectorTvector(int[] vector, int[] tVector)
    {
        int sumElem = 0;
        for (int i = 0; i < vector.Length; i++)
        {
            sumElem += tVector[i] * vector[i];
        }
        return sumElem;
    }

    public static void RunTask1(string[] args)
    {
        using (StreamReader reader = new StreamReader("lab_1/task-1.txt"))
        {
            
            string N = reader.ReadLine();
            Console.WriteLine(N);
            string[] vectorLine = reader.ReadLine().Split(", ");
            int[] vector = new int[vectorLine.Length];
            for (int i = 0; i < vector.Length; i ++)
            {
                int elem = Convert.ToInt32(vectorLine[i]);
                vector[i] = elem;
            }
            string[] dimensions = N.Split(", ");
            int rows = Convert.ToInt32(dimensions[0]);
            int columns = Convert.ToInt32(dimensions[1]);
            int[,] matrix = new int[rows, columns];
            for (int i = 0; i < rows; i++)
            {
                string[] line = reader.ReadLine().Split(" ");
                for (int j = 0; j < columns; j++)
                {
                    matrix[i, j] = Convert.ToInt32(line[j]);

                }
            }
            for (int i = 0; i < rows; i++)
                {
                    for (int j = 0; j < columns; j++)
                    {
                        Console.Write(matrix[i, j] + " ");
                    }
                    Console.WriteLine();
                }
            bool symmetry = CheckSymmetry(matrix);
            if (!symmetry)
                Console.WriteLine("Матрица не симметрична введите новую матрицу в файле");
            else if (matrix.GetLength(0) != vector.Length)
                Console.WriteLine("Матрица не совместима вектору");
            else
            {
                int[] newVector = MultiplyVectorMatrix(matrix, vector);
                int numVector = MultiplyVectorTvector(newVector, vector);
                double result = Math.Sqrt(Convert.ToDouble(numVector));
                Console.WriteLine($"Результат вычислений: {result}");
            }

        }
    }
}