# Лабораторная работа №7

### Задача
В вектор считать из файла input.txt строки (с пробелами). Из каждой строки вектора
выделить подстроки, которые являются корректными IP-адресами (IPv4) и записать в
новый вектор. Помимо корректности на IP-адрес в строке накладывается ограничение:
IP-адреса не должны пересекаться друг с другом и числами (т.е. 121.121.121.121.2 и
111.111.111.1111 не должны учитываться). Реализовать без использования регулярных
выражений. Второй вектор записать в файл output.txt.

#### Примечание !!!!!

Для работы программы необходимо создать файл task-7.txt c IP адрессами (я делал для IPV6). Каждый IP адрес описан в отдельной строке в виде вектора.
Программа находит пересечения жлементов IP адреса и удаляет их. Т.е в строке может быть сколь угодно элементов вектора, если после отсеивания элементов из строки кол-во элементов в строке будет < 8 то IP адрес из этих элементов собрать не получится, если > 8 то можно из данных элементов создать IP адрес, в противном случае будет создан IP адрес из 8 элементов строки.

```bash
    task-7.txt
    1212 1212 1212 1212 1212 1212 1212 1212
    1111 1111 1111 1111 1111 1111 1111 1111
    3333 3333 3333 3333 3333 3333 3333 3333 3333
```

```bash
    output.txt
    Вектор из элементов, из которого можно собрать IP адрес: 3333, 3333, 3333, 3333, 3333, 3333, 3333, 3333, 3333
```

или

```bash
    task-7.txt
    1212 1212 1212 1212 1212 1212 1212 1212
    1111 1111 1111 1111 1111 1111 1111 1111
    3333 3333 3333 3333 3333 3333 3333 3333
```

```bash
    output.txt
    IP адрес: 3333:3333:3333:3333:3333:3333:3333:3333
```

Если ни один из адресов не подходят по условию то в консоль будет вывод "Нет подходящего вектора с элементами IP адресов или самих адресов"

### Запуск

Для запуска необходимо в файле StartTasks.cs инициализировать класс запускаемой задачи.


Класс в котором запускается задача находится в файле:

```bash
  cd lab_7/Task_7.cs
```

Инициализируем нашь класс вызвав аргумент RunTask1

```bash
  using KUBSU_CASD.lab_7; // или же namespace KUBSU_CASD.lab_7;
  class Program
{
    public static void Main(string[] args)
    {
            Task7.RunTask7(args);
    }
}
```

Запускается консольное приложение с обработкой элементов IP адресов.