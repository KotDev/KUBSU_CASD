# Лабораторные работы по предмету "Алгоритмы и структуры данных"

![algos](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXZlanU2c2JkOWhmamlnb2IwMDlrYmJ1cjV6NnB1NzQ1azhlbG1kNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Nn97Knvcol0rENwFk5/giphy.gif)


## Лабораторные

 - [Лабораторная работа №1](https://github.com/KotDev/KUBSU_CASD/tree/main/lab_1) .NET 8
 - [Лабораторная работа №2](https://github.com/KotDev/KUBSU_CASD/tree/main/lab_2) .NET 8
 - [Лабораторная работа №3](https://github.com/KotDev/KUBSU_CASD/tree/main/lab_3) .NET 4
 - [Лабораторная работа №4](https://github.com/KotDev/KUBSU_CASD/tree/main/lab_4) .NET 8
 - [Лабораторная работа №5](https://github.com/KotDev/KUBSU_CASD/tree/main/lab_5) .NET 8
 - [Лабораторная работа №6](https://github.com/KotDev/KUBSU_CASD/tree/main/lab_6) .NET 8
 - [Лабораторная работа №7](https://github.com/KotDev/KUBSU_CASD/tree/main/lab_7) .NET 8
 - [Лабораторная работа №8](https://github.com/KotDev/KUBSU_CASD/tree/main/lab_8) .NET 8
   

PS "В конце каждой лабораторной работы указана инструкция запуска, а так же напротив каждой гипперсылки
    описана версия .NET на котором писалась лабораторная работа. Т.к VSCode не поддерживает .NET 8 для создания WindowsForm"

## Очень важное замечание !!!!!!!!!!!!!

Так как почти все лабораторные работы написаны на Linux кроме лабораторных работ № (3, ) требует исключения сборки данных лабораторных работ т.к они написаны на WindowsForms. Код написанный на .NET 8 написан на Codium (VSCode) ОС Linux поэтому существуют конфликты сборки!!!!!

#### Запуск для тех кто провераяет с .NET 8 и дружит с Linux

Исключаем лабораторные работы написанные на .NET 4 в файле CASD.csproj

```bash
  nano CASD.csproj
```

Далее вносим изменения (при появления таких лабораторных работу буду обнавлять новигационный README поэтому можно смело копировтаь то что описано ниже и заменять CASD.csproj)

```bash
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <Compile Remove="lab_3\WindowsFormsApp1\**\*.cs" />
  </ItemGroup>

</Project>
```

```bash
  dotnet run StartTasks
```


#### Запуск для тех кто провераяет с .NET 4 и не дружит с Linux (Windows Ребята)

Если код работать не будет то необходимо поставить .NET 8 иначе код будет полностью не совместим (Пока точно не проверял), но для тех кто проверяет с IDE Visual Studio Code как я помню можно запускать отдельные конкретные файлы с методом Main в самой IDE. Если всё же у вас есть .Net 6 - 8 в IDE Visual Studio Code то ничего менять не нужно достаточно следываь инструкциям запуска в README каждой лабы и запускать стандартно через кнопку запуска в IDE где указано "Запуск StartTasks"
