using System;
using System.IO;  // Подключаем библиотеку для работы с файлами

namespace WindowsFormsApp1
{
    public class FileManager
    {
        string path;

        // Конструктор принимает путь к файлу
        public FileManager(string filePath)
        {
            this.path = filePath;
        }

        // Проверяем, существует ли файл
        public bool InstanceFile() => File.Exists(path);

        // Удаление файла, если он существует
        public void DeleteFile()
        {
            if (InstanceFile())
                File.Delete(path);
        }

        // Очищаем или создаем файл
        public void ClearOrCreateFile()
        {
            if (InstanceFile())
            {
                // Если файл существует, очищаем его содержимое
                File.WriteAllText(path, string.Empty);
            }
            else
            {
                // Если файла нет, создаем его
                using (var file = File.Create(path))
                {
                    // Закрываем файл после создания
                    file.Close();
                }
            }
        }
    }
}
