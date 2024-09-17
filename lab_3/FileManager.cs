using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CASD.lab_3
{
    public class FileManager
    {
        string path;

        public FileManager(string filePath)
        {
            this.path = filePath;
        }

        public bool InstanceFile() => File.Exists(path);

        public void DeleteFile()
        {
            if (InstanceFile())
                File.Delete(path);
        }

        public void ClearOrCreateFile()
        {
            if (InstanceFile())
                File.WriteAllText(path, string.Empty);  // Очищаем файл
            else
                File.Create(path).Close(); 
        }
    }
}