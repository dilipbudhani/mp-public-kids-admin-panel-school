"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";

interface CloudinaryUploadProps {
    value: string;
    onChange: (url: string, publicId: string) => void;
    onRemove: () => void;
    folder?: string;
}

export default function CloudinaryUpload({
    value,
    onChange,
    onRemove,
    folder = "gallery"
}: CloudinaryUploadProps) {
    const onUpload = (result: any) => {
        onChange(result.info.secure_url, result.info.public_id);
    };

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        return (
            <div className="w-full h-[150px] rounded-xl border-2 border-dashed border-amber-200 bg-amber-50 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-amber-800">Cloudinary Not Configured</p>
                    <p className="text-xs text-amber-600 mt-1">Please set <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> in <code>.env</code></p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-wrap gap-4">
                {value ? (
                    <div className="relative w-[200px] h-[150px] rounded-xl overflow-hidden group border border-gray-100">
                        <div className="absolute top-2 right-2 z-10">
                            <button
                                type="button"
                                onClick={onRemove}
                                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <Image
                            fill
                            src={value}
                            alt="Upload"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                ) : (
                    <CldUploadWidget
                        onSuccess={onUpload}
                        signatureEndpoint="/api/cloudinary/sign"
                        options={{
                            maxFiles: 1,
                            folder: folder,
                            resourceType: "auto",
                        }}
                    >
                        {({ open }) => {
                            const onClick = () => {
                                open();
                            };

                            return (
                                <button
                                    type="button"
                                    onClick={onClick}
                                    className="w-full h-[150px] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 group-hover:text-primary">
                                        Upload Media
                                    </span>
                                </button>
                            );
                        }}
                    </CldUploadWidget>
                )}
            </div>
        </div>
    );
}
