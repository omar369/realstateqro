import React from 'react';
import { useDropzone, type Accept } from 'react-dropzone'

type Props = {
  onFilesAdded: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  className: string;
}

export default function ImageDropzone({
  onFilesAdded,
  accept = { 'image/*': [] },
  maxFiles = 20,
  maxSize = 10 * 1024 * 1024,
  disabled = false,
  className = '',
}: Props) {
  const onDrop = React.useCallback((accepted: File[]) => {
    if (!accepted?.length) return;
    onFilesAdded(accepted);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple: true,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      className={`flex h-32 w-full items-center justify-center rounded-md border border-dashed transition
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-muted-foreground/30'}      
        ${isDragReject ? 'border-red-500 bg-red-50' : ''}      
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}      
        ${className}
      `}
    >
      <input {...getInputProps()} />
      <span className='text-sm muted-foreground'>
        {isDragReject ? 'Archivo no permitido'
          : isDragActive ? '¡Suelta las imágenes aquí!'
          : 'Arrastra las imágenes o haz click aqui para seleccionar.'}
      </span>

    </div>
  )
}
