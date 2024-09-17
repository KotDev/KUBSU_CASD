namespace WindowsFormsApp1
{
    partial class Form1
    {
        /// <summary>
        /// Обязательная переменная конструктора.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Освободить все используемые ресурсы.
        /// </summary>
        /// <param name="disposing">истинно, если управляемый ресурс должен быть удален; иначе ложно.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Код, автоматически созданный конструктором форм Windows

        /// <summary>
        /// Требуемый метод для поддержки конструктора — не изменяйте 
        /// содержимое этого метода с помощью редактора кода.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.zedGraphControl1 = new ZedGraph.ZedGraphControl();
            this.ButtonSorted = new System.Windows.Forms.Button();
            this.ComboTestData = new System.Windows.Forms.ComboBox();
            this.ComboBoxSorted = new System.Windows.Forms.ComboBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.TextBoxSorted = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // zedGraphControl1
            // 
            this.zedGraphControl1.Location = new System.Drawing.Point(12, 12);
            this.zedGraphControl1.Name = "zedGraphControl1";
            this.zedGraphControl1.ScrollGrace = 0D;
            this.zedGraphControl1.ScrollMaxX = 0D;
            this.zedGraphControl1.ScrollMaxY = 0D;
            this.zedGraphControl1.ScrollMaxY2 = 0D;
            this.zedGraphControl1.ScrollMinX = 0D;
            this.zedGraphControl1.ScrollMinY = 0D;
            this.zedGraphControl1.ScrollMinY2 = 0D;
            this.zedGraphControl1.Size = new System.Drawing.Size(445, 413);
            this.zedGraphControl1.TabIndex = 0;
            this.zedGraphControl1.UseExtendedPrintDialog = true;
            // 
            // ButtonSorted
            // 
            this.ButtonSorted.Location = new System.Drawing.Point(486, 332);
            this.ButtonSorted.Name = "ButtonSorted";
            this.ButtonSorted.Size = new System.Drawing.Size(200, 93);
            this.ButtonSorted.TabIndex = 1;
            this.ButtonSorted.Text = "Отсортировать и сохранить";
            this.ButtonSorted.UseVisualStyleBackColor = true;
            this.ButtonSorted.Click += new System.EventHandler(this.button1_Click);
            // 
            // ComboTestData
            // 
            this.ComboTestData.FormattingEnabled = true;
            this.ComboTestData.Items.AddRange(new object[] {
            "Массив случайных чисел",
            "Массивы разбите на отсортированные подмассивы",
            "Изначально отсортированные массивы с перестановками",
            "Полностью отсортированные массивы с повторяющимеся элементами"});
            this.ComboTestData.Location = new System.Drawing.Point(486, 219);
            this.ComboTestData.Name = "ComboTestData";
            this.ComboTestData.Size = new System.Drawing.Size(200, 21);
            this.ComboTestData.TabIndex = 2;
            this.ComboTestData.SelectedIndexChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
            // 
            // ComboBoxSorted
            // 
            this.ComboBoxSorted.FormattingEnabled = true;
            this.ComboBoxSorted.Items.AddRange(new object[] {
            "Группа 1",
            "Группа 2",
            "Группа 3"});
            this.ComboBoxSorted.Location = new System.Drawing.Point(486, 280);
            this.ComboBoxSorted.Name = "ComboBoxSorted";
            this.ComboBoxSorted.Size = new System.Drawing.Size(200, 21);
            this.ComboBoxSorted.TabIndex = 3;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(580, 264);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(106, 13);
            this.label1.TabIndex = 4;
            this.label1.Text = "Группы сортировок";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(588, 203);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(98, 13);
            this.label2.TabIndex = 5;
            this.label2.Text = "Тестовые данные";
            // 
            // TextBoxSorted
            // 
            this.TextBoxSorted.Location = new System.Drawing.Point(486, 38);
            this.TextBoxSorted.Multiline = true;
            this.TextBoxSorted.Name = "TextBoxSorted";
            this.TextBoxSorted.Size = new System.Drawing.Size(200, 151);
            this.TextBoxSorted.TabIndex = 6;
            this.TextBoxSorted.TextChanged += new System.EventHandler(this.TextBoxSorted_TextChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(524, 22);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(162, 13);
            this.label3.TabIndex = 7;
            this.label3.Text = "Среднее значение сортировки";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.TextBoxSorted);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.ComboBoxSorted);
            this.Controls.Add(this.ComboTestData);
            this.Controls.Add(this.ButtonSorted);
            this.Controls.Add(this.zedGraphControl1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private ZedGraph.ZedGraphControl zedGraphControl1;
        private System.Windows.Forms.Button ButtonSorted;
        private System.Windows.Forms.ComboBox ComboTestData;
        private System.Windows.Forms.ComboBox ComboBoxSorted;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox TextBoxSorted;
        private System.Windows.Forms.Label label3;
    }
}

