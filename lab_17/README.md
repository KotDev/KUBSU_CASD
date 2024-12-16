# Лабораторная работа №17

### Задача
Сравнить эффективность динамического массива (MyArrayList) и двунаправленного списка
(MyLinkedList) для различных операций на разных размерах данных структур данных.
Описание:
1) Сравнить эффективность динамического массива и двунаправленного списка для
операций взятия элемента (get), присваивания элемента (set), добавления
элемента (add), вставки элемента (add(i, value)), удаления элемента (remove).
2) Для операции добавления элемента (add) создать пустые динамический массив и
двунаправленный список и выполнить 105, 106, 107, 108 операций добавления.
3) Для остальных операций (get, set, add(i, value), remove) создать динамический
массив и двунаправленный список размером 105, 106, 107, 108 элементов.
4) Для каждого размера динамического массива и двунаправленного списка и каждой
операции провести 20 запусков и вычислить среднее время выполнения.
5) Представить результаты сравнения в виде графиков, показывающих, какая из
данных структур (динамический массив или двунаправленный список) работает
эффективнее для каждой операции на разных размерах списков.
6) Проанализировать полученные результаты и сделать выводы об эффективности
использования динамического массива и двунаправленного списка для различных
операций на разных размерах данных структур. Объяснить, почему одна структура
данных может быть более эффективной для определённых операций, чем другая, и
как это связано с реализацией каждой структуры данных.


### Запуск

Для запуска необходимо в файле StartTasks.cs инициализировать класс запускаемой задачи.


Класс в котором запускается задача находится в файле:

```bash
  cd lab_17/Task_17.cs
```

```bash
  using KUBSU_CASD.lab_17; // или же namespace KUBSU_CASD.lab_17;
  class Program
{
    public static void Main(string[] args)
    {
            Task17.RunTask17(args);
    }
}