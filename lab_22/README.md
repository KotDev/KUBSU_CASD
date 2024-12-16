# Лабораторная работа №22

### Задача
Сравнить эффективность отображения на основе хеш-таблицы (MyHashMap) и
отображения, которое использует дерево поиска (MyTreeMap) для различных операций на
разных размерах данных структур.
Описание:
1) Сравнить эффективность отображения на основе хеш-таблицы и отображения на
основе дерева поиска для операций получения значения по ключу (get),
присваивания значения по ключу (put), удаления элемента по ключу (remove).
2) Для операции присваивания значения по ключу (put) создать пустые отображения
на основе хеш-таблицы и дерева поиска и выполнить 105, 106, 107, 108 операций
добавления элементов с уникальными ключами.
3) Для операций получения значения по ключу (get) и удаления элемента по ключу
(remove) создать отображения на основе хеш-таблицы и дерева поиска размером
105, 106, 107, 108 элементов.
4) Для каждого размера отображений на основе хеш-таблицы и дерева поиска и
каждой операции провести 20 запусков и вычислить среднее время выполнения.
5) Представить результаты сравнения в виде графиков, показывающих, какая из
данных структур (отображение на основе хеш-таблицы или отображение на основе
дерева поиска) работает эффективнее для каждой операции на разных размерах
отображений.
6) Проанализировать полученные результаты и сделать выводы об эффективности
использования отображения на основе хеш-таблицы и отображения на основе
дерева поиска для различных операций на разных размерах данных структур.
Объяснить, почему одна структура данных может быть более эффективной для
определённых операций, чем другая, и как это связано с реализацией каждой
структуры данных.

### Запуск

Для запуска необходимо в файле StartTasks.cs инициализировать класс запускаемой задачи.


Класс в котором запускается задача находится в файле:

```bash
  cd lab_22/Task_22.cs
```

```bash
  using KUBSU_CASD.lab_22; // или же namespace KUBSU_CASD.lab_22;
  class Program
{
    public static void Main(string[] args)
    {
            Task22.RunTask22(args);
    }
}