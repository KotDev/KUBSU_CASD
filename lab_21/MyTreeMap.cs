using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Xml;


namespace KUBSU_CASD.lab_21
{
    public class MyTreeMap<TKey, TValue>
    {
        Comparer<TKey> comparator;
        RootStruct<TKey, TValue> root;
        int size;

        public MyTreeMap(Comparer<TKey> cmp)
        {
            this.root = new RootStruct<TKey, TValue>();
            this.size = 0;
            this.comparator = cmp;
        }

        public void Clear()
        {
            root = new RootStruct<TKey, TValue>();
            size = 0;
        }

        private bool ContainsKey(RootStruct<TKey, TValue>? node, object key)
        {
            if (node == null)
            {
                return false;
            }

            if (node.key != null && node.key.Equals(key))
            {
                return true;
            }

            return ContainsKey(node.left, key) || ContainsKey(node.right, key);
        }

        public bool ContainsKey(object key)
        {
            return ContainsKey(root, key);
        }

        public bool ContainsValue(object value)
        {
            return ContainsValue(root, value);
        }

        private bool ContainsValue(RootStruct<TKey, TValue>? node, object value)
        {
            if (node == null)
            {
                return false;
            }

            if (node.val != null && node.val.Equals(value))
            {
                return true;
            }

            
            return ContainsValue(node.left, value) || ContainsValue(node.right, value);
        }

        public void EntrySet()
        {
            if (root != null)
            {
                Console.WriteLine($"{root.key}: {root.val}");
                ContainsKey(root.left);
                ContainsKey(root.right);
            }
        }

        public TValue? Get(TKey key)
        {
            return Get(root, key);
        }

        private TValue? Get(RootStruct<TKey, TValue>? node, TKey key)
        {
            if (node != null)
            {
                if (node.key.Equals(key))
                    return node.val;
                int comparison = comparator.CompareTo(node.key, (TKey)key);
                if (comparison > 0)
                {
                    return Get(node.left, key);
                }
                else
                {
                    return Get(node.right, key);
                }
            }
            return default;
        }

        public bool isEmpty() => size == 0;

        public void KeySet()
        {
            if (root != null)
            {
                Console.WriteLine($"{root.key}");
                ContainsKey(root.left);
                ContainsKey(root.right);
            }
        }
        
        public void Put(TKey key, TValue val)
        {
            if (root == null)
            {
                root = new RootStruct<TKey, TValue>(key, val);
                size++;
            }
            else
            {
                root = Put(key, val, root);
            }
        }


        private RootStruct<TKey, TValue> Put(TKey key, TValue val, RootStruct<TKey, TValue>? node)
        {
            if (node == null)
            {
                size++;
                return new RootStruct<TKey, TValue>(key, val);
            }

            int cmp = comparator.CompareTo(key, node.key);

            if (cmp < 0)
            {
                node.left = Put(key, val, node.left);
            }
            else if (cmp > 0)
            {
                node.right = Put(key, val, node.right);
            }
            else
            {
                node.val = val; // Обновляем значение, если ключ совпадает
            }

            return node;
        }



        public void Remove(TKey key)
        {
            root = Remove(key, root);
            size --;
        }

        private RootStruct<TKey, TValue>? Remove(TKey key, RootStruct<TKey, TValue>? node)
        {
            if (node == null) return null;

            int cmp = comparator.CompareTo(key, node.key);

            if (cmp < 0)
            {
                node.left = Remove(key, node.left);
            }
            else if (cmp > 0)
            {
                node.right = Remove(key, node.right);
            }
            else
            {
                // Узел найден
                if (node.left == null) return node.right;
                if (node.right == null) return node.left;

                // Найти минимальный узел в правом поддереве
                RootStruct<TKey, TValue> minNode = GetMinNode(node.right);
                node.key = minNode.key;
                node.val = minNode.val;

                // Удаляем минимальный узел из правого поддерева
                node.right = Remove(minNode.key, node.right);
            }

            return node;
        }

        private RootStruct<TKey, TValue> GetMinNode(RootStruct<TKey, TValue> node)
        {
            while (node.left != null)
            {
                node = node.left;
            }
            return node;
        }


        public int Size() => size;

        public RootStruct<TKey, TValue> FirstKey() => root;

        public List<RootStruct<TKey, TValue>> HeadMap(TKey key, RootStruct<TKey, TValue>? node)
        {
           
            List<RootStruct<TKey, TValue>> result = new List<RootStruct<TKey, TValue>>();
        
            void Traverse(RootStruct<TKey, TValue>? current)
            {
                if (current == null) return;

                
                int cmp = comparator.CompareTo(current.key, key);

                if (cmp < 0)
                {
                    
                    result.Add(current);
                    
                    
                    Traverse(current.left);
                    Traverse(current.right);
                }
                else
                {
                    
                    Traverse(current.left);
                }
            }

            
            Traverse(node);

            
            result.Sort((a, b) => comparator.CompareTo(a.key, b.key));
            return result;
        }

        public List<RootStruct<TKey, TValue>> SubMap(TKey start, TKey stop, RootStruct<TKey, TValue>? node)
        {
           
            List<RootStruct<TKey, TValue>> result = new List<RootStruct<TKey, TValue>>();
        
            void Traverse(RootStruct<TKey, TValue>? current)
            {
                if (current == null) return;

                
                int cmpStart = comparator.CompareTo(current.key, start);
                int cmpStop = comparator.CompareTo(current.key, stop);

                if (cmpStart < 0 && cmpStop > 0)
                {
                    result.Add(current);
                }
                Traverse(current.left);
                Traverse(current.right);
            }

            
            Traverse(node);

            
            result.Sort((a, b) => comparator.CompareTo(a.key, b.key));
            return result;
        }

        public List<RootStruct<TKey, TValue>> TailMap(TKey key, RootStruct<TKey, TValue>? node)
        {
           
            List<RootStruct<TKey, TValue>> result = new List<RootStruct<TKey, TValue>>();
        
            void Traverse(RootStruct<TKey, TValue>? current)
            {
                if (current == null) return;

                
                int cmp = comparator.CompareTo(current.key, key);

                if (cmp > 0)
                {
                    
                    result.Add(current);
                    
                    
                    Traverse(current.left);
                    Traverse(current.right);
                }
                else
                {
                    
                    Traverse(current.right);
                }
            }

            
            Traverse(node);

            
            result.Sort((a, b) => comparator.CompareTo(a.key, b.key));
            return result;
        }

        public RootStruct<TKey, TValue>? LowerEntry(TKey key, RootStruct<TKey, TValue>? node)
        {
            RootStruct<TKey, TValue>? result = null;

            while (node != null)
            {
                int cmp = comparator.CompareTo(node.key, key);
                if (cmp < 0)
                {
                    result = node;
                    node = node.right;
                }
                else
                {
                    node = node.left;
                }
            }

            return result;
        }


        public RootStruct<TKey, TValue>? FloorEntry(TKey key, RootStruct<TKey, TValue>? node)
        {
            RootStruct<TKey, TValue>? result = null;

            while (node != null)
            {
                int cmp = comparator.CompareTo(node.key, key);
                if (cmp <= 0)
                {
                    
                    result = node;
                   
                    node = node.right;
                }
                else
                {
                    
                    node = node.left;
                }
            }
            return result;
        }

        public RootStruct<TKey, TValue>? HigherEntry(TKey key, RootStruct<TKey, TValue>? node)
        {
            RootStruct<TKey, TValue>? result = null;

            while (node != null)
            {
                int cmp = comparator.CompareTo(node.key, key);
                if (cmp > 0)
                {
                    
                    result = node;
                   
                    node = node.left;
                }
                else
                {
                    
                    node = node.right;
                }
            }
            return result;
        }
        
        public RootStruct<TKey, TValue>? CeilingEntry(TKey key, RootStruct<TKey, TValue>? node)
        {
            RootStruct<TKey, TValue>? result = null;

            while (node != null)
            {
                int cmp = comparator.CompareTo(node.key, key);
                if (cmp >= 0)
                {
                    
                    result = node;
                   
                    node = node.left;
                }
                else
                {
                    
                    node = node.right;
                }
            }
            return result;
        }

        public TKey? LowerKey(TKey key)
        {
            var entry = LowerEntry(key, root);
            return entry.key;
        }

        public TKey? FloorKey(TKey key)
        {
            var entry = FloorEntry(key, root);
            if (entry is not null)
                return entry.key;
            return default;
        }

        public TKey? HigherKey(TKey key)
        {
            var entry = HigherEntry(key, root);
            return entry.key;
        }

        public TKey? CeilingKey(TKey key)
        {
            var entry = CeilingEntry(key, root);
            return entry.key;
        }

        public RootStruct<TKey, TValue>? PollFirstEntry()
        {
            if (root == null) return null;

            RootStruct<TKey, TValue>? parent = null;
            RootStruct<TKey, TValue>? current = root;

            while (current.left != null)
            {
                parent = current;
                current = current.left;
            }

            if (parent != null)
            {
                parent.left = current.right;
            }
            else
            {
                root = current.right;
            }
            size --;
            return current;
        }

        public RootStruct<TKey, TValue>? PollLastEntry()
        {
            if (root == null) return null;

            RootStruct<TKey, TValue>? parent = null;
            RootStruct<TKey, TValue>? current = root;

            while (current.right != null)
            {
                parent = current;
                current = current.right;
            }

            if (parent != null)
            {
                parent.right = current.left;
            }
            else
            {
                root = current.left;
            }
            size --;
            return current;
        }

        public RootStruct<TKey, TValue>? FirstEntry()
        {
            if (root == null) return null;

            RootStruct<TKey, TValue>? current = root;
            while (current.left != null)
            {
                current = current.left;
            }
            return current;
        }

        public RootStruct<TKey, TValue>? LastEntry()
        {
            if (root == null) return null;

            RootStruct<TKey, TValue>? current = root;
            while (current.right != null)
            {
                current = current.right;
   
            }
            return current;
        }


    }
}