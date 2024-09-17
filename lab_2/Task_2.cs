public struct Complex(double x1, double y1)
{
    public double x = x1;
    public double y = y1;

    public static Complex operator +(Complex num1, Complex num2)
    {
        Complex newNum = new Complex(x1: num1.x + num2.x, y1: num1.y + num2.y);
        return newNum;
    }

    public static Complex operator -(Complex num1, Complex num2)
    {
        Complex newNum = new Complex(x1: num1.x - num2.x, y1: num1.y - num2.y);
        return newNum;
    }

    public static Complex operator /(Complex num1, Complex num2)
    {
        Complex newNum = new Complex(x1: ((num1.x * num2.x) + (num1.y * num2.y)) 
                                          / (Math.Pow(num2.x, 2) + Math.Pow(num2.y, 2)), 
                                      y1:  ((num1.y * num2.x) - (num2.x * num2.y))
                                          / (Math.Pow(num2.x, 2) + Math.Pow(num2.y, 2)));
        return newNum;
    }

     public static Complex operator *(Complex num1, Complex num2)
    {
        Complex new_num = new Complex(x1: (num1.x * num2.x) - (num1.y * num2.y), y1: (num1.y * num2.x) + (num1.x * num2.y));
        return new_num;
    }

    public static double Modul(Complex num) => Math.Sqrt((Math.Pow(num.x, 2) + Math.Pow(num.y, 2)));

    public static double Arg(Complex num)
    {
        if (num.x > 0) 
            return Math.Atan(num.y / num.x);
        else if (num.x < 0 & num.y >= 0) 
            return Math.PI + Math.Atan(num.y / num.x);
        else if (num.x > 0 & num.y < 0)
            return -1 * Math.PI + Math.Atan(num.y / num.x);
        else if (num.x == 0 & num.y > 0)
            return Math.PI / 2;
        else
            return -1 * Math.PI / 2;
    }
}

class Task2
{
    public static void RunTask2(string[] args)
    {
        Console.WriteLine("Информация о командах:\n'+' - сложение\n'-' - вычетание\n'*' - умножение\n'/' - деление\n'arg' - аргумент\n'modul' - модуль\n'input' - ввод нового числа\n'q' - выход\n");
        Complex complexNum1 = new Complex(x1: 0, y1: 0);
        bool flag = true;
        while (flag)
        {
            Console.Write("Введите команду: ");
            string? operation = Console.ReadLine();
            switch (operation)
            {
                case "+":
                    try
                    {
                        Console.Write("Введите число x: ");
                        string? num1 = Console.ReadLine();
                        double x = Convert.ToDouble(num1);

                        Console.Write("Введите мнимое число y: ");
                        string? num2 = Console.ReadLine();
                        double y = Convert.ToDouble(num2);

                        Complex complexNum2 = new Complex(x1: x, y1: y);
                        Complex sum = complexNum1 + complexNum2;
                        Console.WriteLine($"Сумма: {sum.x} + {sum.y}i");
                    }
                    catch (FormatException)
                    {
                        Console.WriteLine("Ошибка: Введено некорректное число. Попробуйте снова.");
                    }
                    break;

                case "-":
                    try
                    {
                        Console.Write("Введите число x: ");
                        string? num1 = Console.ReadLine();
                        double x = Convert.ToDouble(num1);

                        Console.Write("Введите мнимое число y: ");
                        string? num2 = Console.ReadLine();
                        double y = Convert.ToDouble(num2);

                        Complex complexNum2 = new Complex(x1: x, y1: y);
                        Complex difference = complexNum1 - complexNum2;
                        Console.WriteLine($"Разность: {difference.x} + {difference.y}i");
                    }
                    catch (FormatException)
                    {
                        Console.WriteLine("Ошибка: Введено некорректное число. Попробуйте снова.");
                    }
                    break;

                case "*":
                    try
                    {
                        Console.Write("Введите число x: ");
                        string? num1 = Console.ReadLine();
                        double x = Convert.ToDouble(num1);

                        Console.Write("Введите мнимое число y: ");
                        string? num2 = Console.ReadLine();
                        double y = Convert.ToDouble(num2);

                        Complex complex_num_2 = new Complex(x1: x, y1: y);
                        Complex multiplication = complexNum1 * complex_num_2;
                        Console.WriteLine($"Умножение: {multiplication.x} + {multiplication.y}i");
                    }
                    catch (FormatException)
                    {
                        Console.WriteLine("Ошибка: Введено некорректное число. Попробуйте снова.");
                    }
                    break;

                case "/":
                    try
                    {
                        Console.Write("Введите число x: ");
                        string? num1 = Console.ReadLine();
                        double x = Convert.ToDouble(num1);

                        Console.Write("Введите мнимое число y: ");
                        string? num2 = Console.ReadLine();
                        double y = Convert.ToDouble(num2);

                        Complex complex_num_2 = new Complex(x1: x, y1: y);
                        Complex division = complexNum1 / complex_num_2;
                        Console.WriteLine($"Деление: {division.x} + {division.y}i");
                    }
                    catch (FormatException)
                    {
                        Console.WriteLine("Ошибка: Введено некорректное число. Попробуйте снова.");
                    }
                    break;

                case "arg":
                {
                    double argument = Complex.Arg(complexNum1);
                    Console.WriteLine($"Аргумент: {argument}");
                    break;
                }
                
                case "modul":
                {
                    double argument = Complex.Modul(complexNum1);
                    Console.WriteLine($"Модуль: {argument}");
                    break;
                }

                case "input":
                {
                    {
                        try
                        {
                            Console.Write("Введите число x: ");
                            string? num1 = Console.ReadLine();
                            double x = Convert.ToDouble(num1);

                            Console.Write("Введите мнимое число y: ");
                            string? num2 = Console.ReadLine();
                            double y = Convert.ToDouble(num2);

                            complexNum1.x = x;
                            complexNum1.y = y;
                            Console.WriteLine($"Новое комплексное число: {complexNum1.x} + {complexNum1.y}i");
                        }
                        catch (FormatException ex)
                        {
                            Console.WriteLine($"Ошибка: {ex.Message}");
                        }
                        break;
                    }
                }

                case "q":
                {
                    flag = false;
                    break;
                }
                

                default:
                {
                    Console.WriteLine("Неизвестная команда. Попробуйте снова.");
                    break;
                }
            

            }


        }
    }
}