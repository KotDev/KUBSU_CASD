# Лабораторная работа №26

### Задача
В файле находятся строки, содержащие слова (и возможно что-нибудь другое). Словом
считать последовательности латинских букв. С помощью хеш-множества найти все
уникальные слова (с точностью до регистра, т.е. “abc” и “AbC” – одинаковые слова).
Для хранения и обработки данных использовать собственную реализацию множества
MyHashSet. Использование встроенного множества приведёт к незачёту задачи.

#### Примечание:
В файл task-26.txt необходимо ввести переменные с их типом данных и значением

Пример содержимого файла
```bash
    123  aas a vass
    aas a eee rrds 678 123 A
```
Результат раоботы программы записывается в файл output.txt


### Запуск

Для запуска необходимо в файле StartTasks.cs инициализировать класс запускаемой задачи.


Класс в котором запускается задача находится в файле:

```bash
  cd lab_26/Task_26.cs
```

```bash
  using KUBSU_CASD.lab_26; // или же namespace KUBSU_CASD.lab_26;
  class Program
{
    public static void Main(string[] args)
    {
            Task26.RunTask26(args);
    }
}