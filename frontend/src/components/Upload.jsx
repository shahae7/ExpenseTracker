import { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../api/axios';

export default function Upload({ onUploadSuccess }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setMessage(null);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/transactions/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: `Successfully processed ${res.data.count} records.` });
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Parse failed. Verify file format.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-serif font-semibold mb-6 flex items-center gap-2 text-white">
                <span className="w-1 h-6 bg-accent rounded-full"></span>
                Import Statement
            </h3>

            <div
                className={`relative border border-dashed rounded-xl p-10 text-center transition-all duration-300 ${dragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/30 hover:bg-surfaceHighlight'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".csv, .png, .jpg, .jpeg"
                    onChange={handleChange}
                />

                {!file ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-surface rounded-full border border-white/5 shadow-xl">
                            <UploadIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">
                                <button onClick={() => inputRef.current.click()} className="text-primary hover:text-white font-semibold transition-colors">Select File</button> or drag & drop
                            </p>
                            <p className="text-xs text-text-muted/50 uppercase tracking-widest">CSV or Reciept Image</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center gap-3 text-sm text-white bg-surfaceHighlight px-4 py-3 rounded-lg border border-white/10 w-full justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium truncate max-w-[150px]">{file.name}</span>
                            <button onClick={() => setFile(null)} className="ml-2 text-text-muted hover:text-danger transition-colors p-1 hover:bg-white/5 rounded">×</button>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full btn-primary py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            {uploading ? 'Processing...' : 'Process Data'}
                        </button>
                    </div>
                )}
            </div>

            {message && (
                <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 text-sm border ${message.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                    {message.type === 'success' ? <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" /> : <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}
        </div>
    );
}
