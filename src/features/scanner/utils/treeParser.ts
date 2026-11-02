import { TreeNode } from "@/features/analysis/schema";

export const parseFileTree = (rawText: string): TreeNode[] => {
  const lines = rawText.split('\n').filter(line => line.trim() !== '');
  const root: TreeNode[] = [];
  
  // Logic sederhana: Flat map dulu untuk MVP
  // Nanti di Tahap 4 kita bikin logic nesting parent-child yang kompleks
  lines.forEach((line, index) => {
    // Bersihkan karakter tree (│, ├, └, ─)
    const cleanName = line.replace(/^[│\s]*[├└]──\s?/, '').trim();
    if (!cleanName) return;

    const isFile = cleanName.includes('.') || 
                   ['Dockerfile', 'LICENSE'].includes(cleanName);

    root.push({
      id: `node-${index}`,
      name: cleanName,
      type: isFile ? 'file' : 'folder',
      children: isFile ? undefined : [], // Folder siap nampung anak
    });
  });

  return root;
};