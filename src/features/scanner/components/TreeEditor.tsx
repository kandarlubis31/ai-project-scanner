import { FolderTree } from 'lucide-react';

interface TreeEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function TreeEditor({ value, onChange }: TreeEditorProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <FolderTree className="w-4 h-4" />
        <h3>Project Structure</h3>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`src/
├── components/
├── features/
└── App.tsx`}
        className="flex-1 w-full p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-gray-600 border border-gray-700"
        spellCheck={false}
      />
      <p className="text-xs text-gray-500">
        Tip: Jalankan "tree" di terminal atau copy struktur folder manual.
      </p>
    </div>
  );
}